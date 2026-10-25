"""Serve the sidebar panel and keep it in the sidebar while an entry shows it.

One panel serves the whole integration. It's registered while an entry set up since Home
Assistant started is enabled and has "Show Sub-Zero in the sidebar" on, and it lists those
entries' appliances. An entry keeps its place while it reloads or waits to retry its setup,
so nobody looking at the panel is sent elsewhere; it leaves once it's removed or disabled,
or the option is turned off. All of this is best effort: every entity works without the
panel, so a failure here is logged and never fails setup or unload.
"""

import asyncio
import hashlib
import logging
from dataclasses import dataclass, field
from functools import partial
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.loader import IntegrationNotLoaded, async_get_loaded_integration
from homeassistant.util.hass_dict import HassKey

from .const import DOMAIN
from .coordinator import sidebar_panel_enabled

_LOGGER = logging.getLogger(__name__)

# frontend/build.mjs writes the bundle here, and the folder is served at STATIC_URL.
FRONTEND_DIR = Path(__file__).parent / "frontend"
BUNDLE = "subzero-panel.js"
STATIC_URL = f"/{DOMAIN}"
# The panel's path must differ from the static path: with the panel at /subzero, reloading
# the page would reach the static file handler instead of Home Assistant's frontend.
PANEL_URL_PATH = "sub-zero"
PANEL_ELEMENT = "subzero-panel"
# A brand name, so it isn't translated.
PANEL_TITLE = "Sub-Zero"
PANEL_ICON = "mdi:fridge-outline"
# Sent when an entry the panel shows changes state, so open panels follow it too.
SIGNAL_ENTRY_STATE = f"{DOMAIN}_panel_entry_state"


@dataclass
class PanelState:
    """The sidebar panel's state for this Home Assistant process."""

    # Entries set up since Home Assistant started, by entry id, each with the remover of its
    # state listener. One that unloads stays until it's removed.
    entries: dict[str, CALLBACK_TYPE] = field(default_factory=dict)
    served: bool = False
    bundle_read: bool = False
    # The first 8 hex digits of the bundle's SHA-256; None when it couldn't be read.
    bundle_hash: str | None = None
    # The registered panel's module URL; None while the panel isn't in the sidebar.
    module_url: str | None = None
    # Entries can be set up and unloaded at once; each sync sees the last one finished.
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)


DATA: HassKey[PanelState] = HassKey(f"{DOMAIN}_frontend")


def integration_version(hass: HomeAssistant) -> str:
    """The manifest version, as Home Assistant parsed it when it loaded the integration."""
    try:
        version = async_get_loaded_integration(hass, DOMAIN).version
    except IntegrationNotLoaded:
        return "unknown"
    return str(version) if version else "unknown"


def bundle_hash(path: Path) -> str | None:
    """The first 8 hex digits of the bundle's SHA-256, or None when it can't be read."""
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()[:8]
    except OSError:
        return None


def panel_entries(hass: HomeAssistant) -> list[ConfigEntry]:
    """The entries whose appliances the panel shows, in config entry order.

    Those set up since Home Assistant started that are still there, enabled and showing the
    panel, whether they're set up now or reloading or waiting to retry their setup.
    """
    state = hass.data.get(DATA)
    if state is None:
        return []
    return [
        entry
        for entry in hass.config_entries.async_entries(DOMAIN, include_disabled=False)
        if entry.entry_id in state.entries and sidebar_panel_enabled(entry)
    ]


def panel_module_url(hass: HomeAssistant) -> str | None:
    """The module URL of the registered panel, or None while it isn't in the sidebar."""
    state = hass.data.get(DATA)
    return state.module_url if state is not None else None


async def async_add_entry_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Note an entry that was set up, and bring the sidebar up to date."""
    state = hass.data.setdefault(DATA, PanelState())
    if entry.entry_id not in state.entries:
        # Disabling an entry that failed to set up again, or turning its option off, unloads
        # nothing; only its state changes tell the panel.
        state.entries[entry.entry_id] = entry.async_on_state_change(
            partial(_entry_state_changed, hass)
        )
    await _async_sync_safely(hass)


async def async_remove_entry_panel(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Bring the sidebar up to date after an entry unloaded.

    The entry keeps its place, as an entry usually unloads to reload. Home Assistant
    disables an entry, or saves options that turn the panel off, before unloading it, so
    such an entry leaves now; a removed one leaves once it's gone (async_forget_entry_panel).
    """
    if DATA in hass.data:
        await _async_sync_safely(hass)


async def async_forget_entry_panel(hass: HomeAssistant, entry_id: str) -> None:
    """Forget an entry that was removed, and bring the sidebar up to date."""
    state = hass.data.get(DATA)
    if state is not None and (unsub := state.entries.pop(entry_id, None)) is not None:
        unsub()
        await _async_sync_safely(hass)


@callback
def _entry_state_changed(hass: HomeAssistant) -> None:
    hass.async_create_task(_async_sync_safely(hass), "Sub-Zero sidebar panel")
    async_dispatcher_send(hass, SIGNAL_ENTRY_STATE)


async def _async_sync_safely(hass: HomeAssistant) -> None:
    try:
        async with hass.data[DATA].lock:
            await _async_sync(hass)
    except Exception:
        _LOGGER.exception("Could not update the Sub-Zero sidebar panel")


async def _async_sync(hass: HomeAssistant) -> None:
    """Register the panel while an entry shows it, and remove it once none does."""
    state = hass.data[DATA]
    if not panel_entries(hass):
        if state.module_url is not None:
            state.module_url = None
            frontend.async_remove_panel(hass, PANEL_URL_PATH, warn_if_unknown=False)
        return
    if state.module_url is not None or not await _async_serve(hass, state):
        return
    # A new URL for every build, not just every release, so a browser never keeps an old
    # copy, even of a test build that still carries the last release's version.
    module_url = f"{STATIC_URL}/{BUNDLE}?v={integration_version(hass)}-{state.bundle_hash}"
    try:
        await panel_custom.async_register_panel(
            hass,
            frontend_url_path=PANEL_URL_PATH,
            webcomponent_name=PANEL_ELEMENT,
            sidebar_title=PANEL_TITLE,
            sidebar_icon=PANEL_ICON,
            module_url=module_url,
            require_admin=False,
        )
    except Exception:
        # Nothing is recorded, so the next entry set up tries again.
        _LOGGER.exception("Could not add the Sub-Zero panel to the sidebar")
        return
    state.module_url = module_url


async def _async_serve(hass: HomeAssistant, state: PanelState) -> bool:
    """Read the bundle's hash and serve its folder, once per process; whether that worked."""
    if not state.bundle_read:
        state.bundle_read = True
        path = FRONTEND_DIR / BUNDLE
        state.bundle_hash = await hass.async_add_executor_job(bundle_hash, path)
        if state.bundle_hash is None:
            _LOGGER.warning("Not showing the Sub-Zero sidebar panel: %s is missing", path)
    if state.bundle_hash is None:
        return False
    if state.served:
        return True
    http = getattr(hass, "http", None)
    if http is None:
        # Without the HTTP integration, as in tests, there's no frontend to load it either.
        return True
    try:
        # Cached for good: each build has its own URL.
        await http.async_register_static_paths(
            [StaticPathConfig(STATIC_URL, str(FRONTEND_DIR), cache_headers=True)]
        )
    except Exception:
        # The panel would only fail to load, so it waits for the next try.
        _LOGGER.exception("Could not serve the Sub-Zero sidebar panel's files")
        return False
    state.served = True
    return True
