"""The sidebar panel's registration (frontend.async_add_entry_panel, async_remove_entry_panel).

While an entry set up since Home Assistant started is enabled and has "Show Sub-Zero in the
sidebar" on, one Sub-Zero panel is in the sidebar for every user. Reloading an entry, or its
waiting to retry setup, keeps it; removing or disabling the entries, or turning the option
off, takes it away. These run against Home Assistant's real panel registry, so what is
asserted is what the sidebar would list.
"""

import hashlib
import json
from datetime import timedelta
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.components import frontend as ha_frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntryDisabler, ConfigEntryState
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.loader import async_get_integration
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_capture_events,
    async_fire_time_changed,
)

from custom_components.subzero import frontend
from custom_components.subzero.api import RateLimited
from custom_components.subzero.const import CONF_SHOW_SIDEBAR_PANEL, DOMAIN
from custom_components.subzero.diagnostics import async_get_config_entry_diagnostics
from custom_components.subzero.frontend import (
    BUNDLE,
    PANEL_ELEMENT,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL_PATH,
    STATIC_URL,
    async_add_entry_panel,
    async_forget_entry_panel,
    async_remove_entry_panel,
)

from .conftest import APPLIANCE_STATES

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")
COMPONENT = Path(__file__).parent.parent / "custom_components" / "subzero"
VERSION = json.loads((COMPONENT / "manifest.json").read_text(encoding="utf-8"))["version"]
BUNDLE_TEXT = b"export {};\n"
BUNDLE_HASH = hashlib.sha256(BUNDLE_TEXT).hexdigest()[:8]
MODULE_URL = f"/subzero/subzero-panel.js?v={VERSION}-{BUNDLE_HASH}"
FRIDGE = APPLIANCE_STATES["CL4850SID"]


@pytest.fixture(autouse=True)
def bundle(tmp_path, monkeypatch) -> Path:
    """A stand-in bundle, since the real one changes with every build."""
    folder = tmp_path / "frontend"
    folder.mkdir()
    (folder / BUNDLE).write_bytes(BUNDLE_TEXT)
    monkeypatch.setattr(frontend, "FRONTEND_DIR", folder)
    return folder


@pytest.fixture(autouse=True)
async def loaded_integration(hass, enable_custom_integrations) -> None:
    """Load the integration, as setup does, so the module URL carries its version."""
    await async_get_integration(hass, DOMAIN)


def _entry(hass, entry_id: str, **options) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN,
        version=2,
        minor_version=5,
        entry_id=entry_id,
        data={"tokens": {}, "devices": {}},
        options=options,
    )
    entry.add_to_hass(hass)
    return entry


def _sidebar(hass) -> dict[str, ha_frontend.Panel]:
    """The panels Home Assistant would list, by url path."""
    return dict(hass.data.get(ha_frontend.DATA_PANELS, {}))


async def test_the_panel_is_in_the_sidebar_by_default(hass):
    await async_add_entry_panel(hass, _entry(hass, "a"))

    sidebar = _sidebar(hass)
    assert list(sidebar) == [PANEL_URL_PATH] == ["sub-zero"]
    panel = sidebar[PANEL_URL_PATH]
    assert panel.sidebar_title == PANEL_TITLE == "Sub-Zero"
    assert panel.sidebar_icon == PANEL_ICON == "mdi:snowflake"
    assert panel.component_name == "custom"
    # Every user sees it; only Appearance changes need an admin.
    assert panel.require_admin is False
    custom = panel.config["_panel_custom"]
    assert custom["name"] == PANEL_ELEMENT == "subzero-panel"
    # The version and the bundle's hash, so neither a release nor a test build is cached.
    assert custom["module_url"] == MODULE_URL


async def test_the_option_turns_the_panel_off_and_on(hass):
    entry = _entry(hass, "a", **{CONF_SHOW_SIDEBAR_PANEL: False})
    await async_add_entry_panel(hass, entry)
    assert _sidebar(hass) == {}

    # Saving options reloads the entry with them: unload, then set up again.
    hass.config_entries.async_update_entry(entry, options={})
    await async_remove_entry_panel(hass, entry)
    await async_add_entry_panel(hass, entry)
    assert list(_sidebar(hass)) == [PANEL_URL_PATH]

    hass.config_entries.async_update_entry(entry, options={CONF_SHOW_SIDEBAR_PANEL: False})
    await async_remove_entry_panel(hass, entry)
    # Gone as the entry unloads, not once it's set up again.
    assert _sidebar(hass) == {}
    await async_add_entry_panel(hass, entry)
    assert _sidebar(hass) == {}


async def test_a_reload_keeps_the_panel_in_the_sidebar(hass, freezer):
    entry = _entry(hass, "a")
    await async_add_entry_panel(hass, entry)
    url = frontend.panel_module_url(hass)
    panels_updated = async_capture_events(hass, ha_frontend.EVENT_PANELS_UPDATED)
    await async_remove_entry_panel(hass, entry)
    # However long setup takes, or waits to retry.
    freezer.tick(timedelta(hours=1))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert list(_sidebar(hass)) == [PANEL_URL_PATH]

    await async_add_entry_panel(hass, entry)
    assert list(_sidebar(hass)) == [PANEL_URL_PATH]
    # Never removed and registered again: the same registration stays.
    assert panels_updated == []
    assert frontend.panel_module_url(hass) == url


async def test_entries_share_one_panel(hass):
    first, second = _entry(hass, "a"), _entry(hass, "b")
    hidden = _entry(hass, "c", **{CONF_SHOW_SIDEBAR_PANEL: False})
    for entry in (second, hidden, first):
        await async_add_entry_panel(hass, entry)
    assert list(_sidebar(hass)) == [PANEL_URL_PATH]
    assert frontend.panel_entries(hass) == [first, second]

    # Home Assistant unloads an entry it removes, then calls async_remove_entry.
    await hass.config_entries.async_remove(first.entry_id)
    assert list(_sidebar(hass)) == [PANEL_URL_PATH]
    assert frontend.panel_entries(hass) == [second]
    # An entry with the option off doesn't keep the panel.
    await hass.config_entries.async_remove(second.entry_id)
    assert _sidebar(hass) == {}
    assert frontend.panel_entries(hass) == []
    # Forgetting an entry again, or one never set up, is harmless.
    await async_forget_entry_panel(hass, second.entry_id)
    await async_forget_entry_panel(hass, "never-set-up")
    assert _sidebar(hass) == {}


def test_the_panel_does_not_sit_under_the_static_path():
    """A panel at /subzero would send a page reload to the static file handler that serves
    the bundle, instead of Home Assistant's frontend."""
    assert STATIC_URL == "/subzero"
    assert f"/{PANEL_URL_PATH}" != STATIC_URL
    assert not f"/{PANEL_URL_PATH}/".startswith(f"{STATIC_URL}/")


async def test_the_files_are_served_once_and_the_bundle_read_once(hass, bundle):
    hass.http = MagicMock(async_register_static_paths=AsyncMock())
    first, second = _entry(hass, "a"), _entry(hass, "b")
    with patch.object(frontend, "bundle_hash", wraps=frontend.bundle_hash) as read:
        await async_add_entry_panel(hass, first)
        await async_add_entry_panel(hass, second)
        for entry in (first, second):
            await async_forget_entry_panel(hass, entry.entry_id)
        assert _sidebar(hass) == {}
        await async_add_entry_panel(hass, first)
    hass.http.async_register_static_paths.assert_awaited_once_with(
        [StaticPathConfig("/subzero", str(bundle), cache_headers=True)]
    )
    read.assert_called_once_with(bundle / BUNDLE)
    assert _sidebar(hass)[PANEL_URL_PATH].config["_panel_custom"]["module_url"] == MODULE_URL


async def test_the_module_url_serves_the_bundle(hass, hass_client):
    assert await async_setup_component(hass, "http", {})
    await async_add_entry_panel(hass, _entry(hass, "a"))
    client = await hass_client()
    response = await client.get(MODULE_URL)
    assert response.status == 200
    assert await response.read() == BUNDLE_TEXT
    # Cached for good, since each build has its own URL.
    assert "max-age" in response.headers["Cache-Control"]


async def test_a_missing_bundle_leaves_the_panel_out(hass, bundle, caplog):
    (bundle / BUNDLE).unlink()
    hass.http = MagicMock(async_register_static_paths=AsyncMock())
    await async_add_entry_panel(hass, _entry(hass, "a"))
    assert _sidebar(hass) == {}
    hass.http.async_register_static_paths.assert_not_awaited()
    assert "Not showing the Sub-Zero sidebar panel" in caplog.text
    assert frontend.panel_module_url(hass) is None


async def test_a_registration_failure_is_retried_by_the_next_entry(hass, caplog):
    entry = _entry(hass, "a")
    with patch.object(
        frontend.panel_custom,
        "async_register_panel",
        side_effect=ValueError("Overwriting panel sub-zero"),
    ):
        await async_add_entry_panel(hass, entry)
    assert _sidebar(hass) == {}
    assert "Could not add the Sub-Zero panel to the sidebar" in caplog.text
    assert frontend.panel_module_url(hass) is None

    await async_add_entry_panel(hass, entry)
    assert list(_sidebar(hass)) == [PANEL_URL_PATH]


async def test_the_panel_waits_until_its_files_are_served(hass, caplog):
    hass.http = MagicMock(async_register_static_paths=AsyncMock(side_effect=[RuntimeError, None]))
    entry = _entry(hass, "a")
    await async_add_entry_panel(hass, entry)
    assert "Could not serve the Sub-Zero sidebar panel's files" in caplog.text
    # It would only fail to load.
    assert _sidebar(hass) == {}

    await async_add_entry_panel(hass, entry)
    assert hass.http.async_register_static_paths.await_count == 2
    assert list(_sidebar(hass)) == [PANEL_URL_PATH]


# ---- through the integration's own setup ----------------------------------------------


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_setting_up_an_entry_adds_the_panel(hass, cloud_appliance):
    assert list(_sidebar(hass)) == [PANEL_URL_PATH]
    diagnostics = await async_get_config_entry_diagnostics(hass, cloud_appliance.entry)
    assert diagnostics["panel"] == {"enabled": True, "registered": True, "module_url": MODULE_URL}

    await hass.config_entries.async_remove(cloud_appliance.entry.entry_id)
    await hass.async_block_till_done()
    assert _sidebar(hass) == {}


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_a_slow_reload_keeps_the_panel(hass, cloud_appliance, freezer):
    """Setup can take a while: it waits up to INITIAL_STATE_TIMEOUT for each appliance's
    first snapshot, then reads the silent ones, and a request can take 40 s."""
    client = cloud_appliance.client
    appliances = client.appliances.return_value

    async def slowly():
        freezer.tick(timedelta(minutes=10))
        async_fire_time_changed(hass)
        return appliances

    client.appliances.side_effect = slowly
    panels_updated = async_capture_events(hass, ha_frontend.EVENT_PANELS_UPDATED)
    assert await hass.config_entries.async_reload(cloud_appliance.entry.entry_id)
    await hass.async_block_till_done()
    assert cloud_appliance.entry.state is ConfigEntryState.LOADED
    # Never taken away and added again, which would send anyone looking at it elsewhere.
    assert panels_updated == []
    assert list(_sidebar(hass)) == [PANEL_URL_PATH]


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_disabling_the_entry_takes_the_panel_away(hass, cloud_appliance):
    entry = cloud_appliance.entry
    await hass.config_entries.async_set_disabled_by(entry.entry_id, ConfigEntryDisabler.USER)
    await hass.async_block_till_done()
    assert _sidebar(hass) == {}

    await hass.config_entries.async_set_disabled_by(entry.entry_id, None)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED
    assert list(_sidebar(hass)) == [PANEL_URL_PATH]


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_an_entry_retrying_setup_keeps_the_panel_until_disabled(hass, cloud_appliance):
    entry = cloud_appliance.entry
    cloud_appliance.client.appliances.side_effect = RateLimited(300)
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.SETUP_RETRY
    assert list(_sidebar(hass)) == [PANEL_URL_PATH]

    # Disabling it now unloads nothing, but it takes the panel away all the same.
    await hass.config_entries.async_set_disabled_by(entry.entry_id, ConfigEntryDisabler.USER)
    await hass.async_block_till_done()
    assert _sidebar(hass) == {}


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_configure_turns_the_sidebar_panel_off_and_on(hass, cloud_appliance):
    entry = cloud_appliance.entry

    async def configure(show: bool | None) -> None:
        result = await hass.config_entries.options.async_init(entry.entry_id)
        user_input = {"device_ids": ["appliance"], "firebase_alerts": True}
        if show is not None:
            user_input[CONF_SHOW_SIDEBAR_PANEL] = show
        result = await hass.config_entries.options.async_configure(result["flow_id"], user_input)
        assert result["type"] is FlowResultType.CREATE_ENTRY
        await hass.async_block_till_done()

    await configure(False)
    assert entry.state is ConfigEntryState.LOADED
    assert entry.options[CONF_SHOW_SIDEBAR_PANEL] is False
    assert _sidebar(hass) == {}
    diagnostics = await async_get_config_entry_diagnostics(hass, entry)
    assert diagnostics["panel"] == {"enabled": False, "registered": False, "module_url": None}

    # Left as it was, the option stays off.
    await configure(None)
    assert _sidebar(hass) == {}

    await configure(True)
    assert CONF_SHOW_SIDEBAR_PANEL not in entry.options
    assert list(_sidebar(hass)) == [PANEL_URL_PATH]


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_a_sidebar_failure_never_fails_entry_setup(hass, cloud_appliance, caplog):
    entry = cloud_appliance.entry
    await hass.config_entries.async_set_disabled_by(entry.entry_id, ConfigEntryDisabler.USER)
    await hass.async_block_till_done()
    with patch.object(frontend.panel_custom, "async_register_panel", side_effect=ValueError):
        await hass.config_entries.async_set_disabled_by(entry.entry_id, None)
        await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED
    assert _sidebar(hass) == {}
    assert "Could not add the Sub-Zero panel to the sidebar" in caplog.text
