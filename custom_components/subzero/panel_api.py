"""The sidebar panel's websocket API and its Appearance store.

The panel reads live values from hass.states and controls appliances through their
entities. This API sends what it can't work out from those: which entity holds which
property, the drawing spec, the Appearance setting and why controls are locked. The payload
is `PanelMessage` in frontend/src/types.ts, which is the contract between the two.
"""

import asyncio
import logging
import re
from dataclasses import dataclass, field, replace
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import CALLBACK_TYPE, Event, HassJob, HomeAssistant, callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.event import async_call_later
from homeassistant.helpers.storage import Store
from homeassistant.util.hass_dict import HassKey

from .appliance_spec import FORMS, appliance_spec, model_hints, refrigeration_with_form
from .const import DOMAIN, FRIDGE_MODE_KEYS, ICE_KEYS
from .controls import appliance_brand, control_lock_reason
from .coordinator import SubZeroCoordinator, selected_devices
from .frontend import SIGNAL_ENTRY_STATE, panel_entries

_LOGGER = logging.getLogger(__name__)

STORAGE_KEY = f"{DOMAIN}.panel"
STORAGE_VERSION = 1
# Seconds to wait before sending an update: changes come in bursts, such as several
# properties pushed at once or a platform adding its entities one at a time.
DEBOUNCE = 0.3

FIELDS = ("finish", "panel_color", "knobs", "handle", "style", "form")
DEFAULTS = {
    "finish": "stainless",
    "panel_color": None,
    "knobs": "red",
    "handle": "tubular",
    "style": None,
    "form": None,
}
PANEL_COLORS = (
    "#f4f2ec",
    "#ece4d2",
    "#9aa0a6",
    "#2f3b52",
    "#9caf88",
    "#1f2022",
    "#5b3a29",
    "#b08955",
)
KNOBS = ("red", "black", "stainless")
STYLES = ("professional", "transitional", "contemporary")
# What the Appearance editor offers each family; None hides a field.
FAMILY_OPTIONS = {
    "refrigeration": {
        "finish": ("stainless", "panel", "black"),
        "knobs": None,
        "handle": ("tubular", "pro", "none"),
        "style": None,
    },
    "range": {"finish": ("stainless",), "knobs": KNOBS, "handle": None, "style": None},
    "wall_oven": {
        "finish": ("stainless", "black", "carbon"),
        "knobs": KNOBS,
        "handle": None,
        "style": STYLES,
    },
    "hood": {"finish": ("stainless",), "knobs": None, "handle": None, "style": None},
    "dishwasher": {
        "finish": ("stainless", "panel"),
        "knobs": None,
        "handle": ("tubular", "pro", "none"),
        "style": None,
    },
    "generic": {"finish": ("stainless",), "knobs": None, "handle": None, "style": None},
}
GENERIC_SPEC = {"family": "generic", "form": "appliance", "width": None, "generic": True}
COLOR = re.compile(r"#[0-9a-fA-F]{6}")
BRANDS = ("Sub-Zero", "Wolf", "Cove")
# Models whose spec failed, so a broken one is logged once rather than on every push.
_failed_specs: set[str | None] = set()


@dataclass(frozen=True)
class ApplianceState:
    """What the panel shows an appliance from: its coordinator's state, or the state it had
    when its entry unloaded."""

    appliance_id: str
    name: str
    data: dict
    available: bool


@dataclass
class PanelData:
    """The Appearance store, the open subscriptions, and appliances kept through a reload."""

    store: Store
    # Saved Appearance fields by appliance id; None until loaded.
    appearance: dict[str, dict[str, str]] | None = None
    subscriptions: set[PanelSubscription] = field(default_factory=set)
    # The appliances of entries that unloaded, as they were then, by entry id. The panel shows
    # them unavailable until the entry is set up again, rather than dropping them while it
    # reloads or waits to retry its setup.
    unloaded: dict[str, list[ApplianceState]] = field(default_factory=dict)
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)

    async def async_appearance(self) -> dict[str, dict[str, str]]:
        """The saved Appearance by appliance id, loaded the first time it's needed."""
        async with self.lock:
            if self.appearance is None:
                self.appearance = _read_appearance(await self.store.async_load())
        return self.appearance

    async def async_save(self) -> None:
        await self.store.async_save({"appearance": self.appearance or {}})


DATA: HassKey[PanelData] = HassKey(f"{DOMAIN}_panel")


def _read_appearance(stored: Any) -> dict[str, dict[str, str]]:
    """The saved Appearance from storage, skipping anything malformed."""
    saved = stored.get("appearance") if isinstance(stored, dict) else None
    if not isinstance(saved, dict):
        return {}
    return {
        appliance_id: {
            name: value
            for name, value in fields.items()
            if name in FIELDS and isinstance(value, str)
        }
        for appliance_id, fields in saved.items()
        if isinstance(fields, dict)
    }


def _panel_data(hass: HomeAssistant) -> PanelData:
    if (data := hass.data.get(DATA)) is None:
        data = hass.data[DATA] = PanelData(Store(hass, STORAGE_VERSION, STORAGE_KEY))
    return data


def _plain(value: Any) -> Any:
    """A copy with lists for tuples, as the panel receives it."""
    if isinstance(value, dict):
        return {key: _plain(item) for key, item in value.items()}
    if isinstance(value, list | tuple):
        return [_plain(item) for item in value]
    return value


def _model_number(data: dict, device: dr.DeviceEntry | None = None) -> str | None:
    """The model number the appliance reports, else the one the device registry kept.

    The registry keeps the details of the appliance's last status until it reports again,
    so one that hasn't reported since setup is still drawn as itself.
    """
    for model in (data.get("appliance_model"), device.model if device is not None else None):
        if isinstance(model, str) and model:
            return model
    return None


def detected_spec(data: dict, model: str | None = None) -> dict:
    """The spec appliance_spec works out from the model and properties, as a copy.

    `model` defaults to the model number the appliance reports.
    """
    model = model or _model_number(data)
    try:
        # In JSON's shapes, so the message compares, and diagnostics read, as the panel
        # receives them; and a copy, so nothing here changes the spec module's own objects.
        return _plain(appliance_spec(model, data))
    except Exception:
        if model not in _failed_specs:
            _failed_specs.add(model)
            _LOGGER.exception("Could not work out how to draw the %s", model or "appliance")
        return dict(GENERIC_SPEC)


def appearance_options(spec: dict) -> dict:
    """The values the Appearance editor offers for an appliance (AppearanceOptions)."""
    family = spec.get("family")
    offered = FAMILY_OPTIONS.get(family, FAMILY_OPTIONS["generic"])
    knobs = offered["knobs"]
    if family == "wall_oven" and not spec.get("knob"):
        # Only knob ovens have knobs to color.
        knobs = None
    return {
        "finish": list(offered["finish"]),
        "panel_colors": list(PANEL_COLORS),
        "knobs": list(knobs) if knobs else None,
        "handle": list(offered["handle"]) if offered["handle"] else None,
        "style": list(offered["style"]) if offered["style"] else None,
        "forms": list(FORMS.get(family, ())),
    }


def appearance_defaults(spec: dict, model: str | None = None) -> dict:
    """The Appearance an appliance has until an admin changes it.

    Stainless with red knobs and tubular handles, except where the model number tells:
    refrigeration's /O is a panel-ready front and /P or /T pro or tubular handles, and PRO
    refrigeration has pro handles. Every Cove takes either a custom panel or the stainless
    door kit, and the model doesn't say which, so dishwashers start stainless too.
    """
    defaults = dict(DEFAULTS)
    if spec.get("family") == "refrigeration":
        if spec.get("line") == "pro":
            defaults["handle"] = "pro"
        defaults.update(model_hints(model))
    return defaults


def effective_appearance(saved: dict, defaults: dict, options: dict) -> dict:
    """The Appearance in effect: the saved values the appliance offers, else the defaults."""
    appearance = dict(defaults)
    for name in ("finish", "knobs", "handle", "style"):
        if saved.get(name) in (options[name] or ()):
            appearance[name] = saved[name]
    if saved.get("form") in options["forms"]:
        appearance["form"] = saved["form"]
    # A saved color is kept while another finish is chosen, for when panel is chosen again.
    color = saved.get("panel_color")
    if appearance["finish"] == "panel" and isinstance(color, str) and COLOR.fullmatch(color):
        appearance["panel_color"] = color
    return appearance


def apply_form(spec: dict, form: str | None, data: dict) -> dict:
    """The spec with the Appearance form in place of the detected one.

    Refrigeration works out again what comes with a form, such as wine storage's glass
    doors, and wall ovens switch their ovens along with it, single or double.
    """
    if form is None or form == spec.get("form"):
        return spec
    if spec.get("family") == "refrigeration":
        return refrigeration_with_form(spec, form, data)
    spec = {**spec, "form": form}
    if spec.get("family") == "wall_oven":
        width = next(
            (oven["width"] for oven in spec.get("ovens") or () if oven.get("width")),
            spec.get("width"),
        )
        spec["ovens"] = (
            [{"prefix": "cav", "position": "single", "width": width}]
            if form == "single"
            else [
                {"prefix": "cav", "position": "upper", "width": width},
                {"prefix": "cav2", "position": "lower", "width": width},
            ]
        )
    return spec


def appliance_drawing(data: dict, saved: dict | None, model: str | None = None) -> dict:
    """How the panel draws an appliance: its spec, form, Appearance and the editor's options.

    `model` defaults to the model number the appliance reports.
    """
    model = model or _model_number(data)
    detected = detected_spec(data, model)
    options = appearance_options(detected)
    appearance = effective_appearance(saved or {}, appearance_defaults(detected, model), options)
    return {
        "spec": apply_form(detected, appearance["form"], data),
        "detected_form": detected.get("form"),
        "appearance": appearance,
        "appearance_options": options,
    }


def lock_code(data: dict, key: str) -> str | None:
    """Why the controls of a property key are locked, as a LockCode, or None.

    Each key is checked as its entities check it: a button by the setting it changes, and
    the mode selects by each mode they switch, so the Mode select stays unlocked for
    turning Sabbath mode off.
    """
    if key.startswith("remote_start_"):
        settings = [(key.removeprefix("remote_start_"), True)]
    elif key == "cancel_wash_cycle":
        settings = [("wash_cycle_on", False)]
    elif key.startswith("dismiss_"):
        settings = [(f"{key.removeprefix('dismiss_')}_duration", None)]
    elif key == "operating_mode":
        settings = [(mode, None) for mode in FRIDGE_MODE_KEYS if mode in data]
    elif key == "ice_maker_mode":
        settings = [(ice, None) for ice in ICE_KEYS if ice in data]
    else:
        settings = [(key, None)]
    for setting, value in settings:
        if (reason := control_lock_reason(data, setting, value)) is not None:
            return reason[0]
    return None


def _entity_maps(
    registry: er.EntityRegistry, entry_id: str, appliance_ids: list[str]
) -> dict[str, dict[str, dict[str, str]]]:
    """Entity ids by appliance, property key and domain, leaving out disabled entities."""
    # Longest first, so an appliance id that begins with another's isn't taken for it.
    prefixes = sorted(
        ((f"{appliance_id}_", appliance_id) for appliance_id in appliance_ids),
        key=lambda prefix: len(prefix[0]),
        reverse=True,
    )
    maps: dict[str, dict[str, dict[str, str]]] = {}
    for entity in er.async_entries_for_config_entry(registry, entry_id):
        if entity.disabled:
            continue
        for prefix, appliance_id in prefixes:
            if entity.unique_id.startswith(prefix):
                key = entity.unique_id.removeprefix(prefix)
                maps.setdefault(appliance_id, {}).setdefault(key, {})[entity.domain] = (
                    entity.entity_id
                )
                break
    return maps


def _coordinators(hass: HomeAssistant, entry: ConfigEntry) -> dict[str, SubZeroCoordinator]:
    """The coordinators of an entry that's set up; none while its appliances are kept."""
    data = hass.data.get(DATA)
    if data is not None and entry.entry_id in data.unloaded:
        return {}
    account = getattr(entry, "runtime_data", None)
    return account.coordinators if account is not None else {}


def _appliance_state(coordinator: SubZeroCoordinator) -> ApplianceState:
    return ApplianceState(
        coordinator.device_id,
        coordinator.device["name"],
        coordinator.data or {},
        coordinator.last_update_success,
    )


def _appliance_states(hass: HomeAssistant, entry: ConfigEntry) -> list[ApplianceState]:
    """An entry's appliances: live while it's set up, else as they were when it unloaded."""
    data = hass.data.get(DATA)
    if data is not None and (kept := data.unloaded.get(entry.entry_id)) is not None:
        return kept
    return [_appliance_state(coordinator) for coordinator in _coordinators(hass, entry).values()]


def _find_appliance(
    hass: HomeAssistant, appliance_id: str
) -> tuple[ConfigEntry, ApplianceState] | None:
    """A shown appliance and its entry, by Sub-Zero's id for it."""
    for entry in panel_entries(hass):
        for appliance in _appliance_states(hass, entry):
            if appliance.appliance_id == appliance_id:
                return entry, appliance
    return None


def _brand(data: dict, device: dr.DeviceEntry | None) -> str:
    """The brand the appliance's properties show, else the one the device registry kept."""
    if not data.get("appliance_model") and device is not None and device.manufacturer in BRANDS:
        return device.manufacturer
    return appliance_brand(data)


def _appliance(
    entry_id: str,
    appliance: ApplianceState,
    device: dr.DeviceEntry,
    entities: dict[str, dict[str, str]],
    saved: dict | None,
) -> dict:
    """An appliance as the panel receives it (PanelAppliance)."""
    data = appliance.data
    model = _model_number(data, device)
    appliance_type = data.get("appliance_type")
    return {
        "device_id": device.id,
        "appliance_id": appliance.appliance_id,
        "entry_id": entry_id,
        "name": appliance.name,
        "brand": _brand(data, device),
        "model": model,
        "appliance_type": appliance_type if isinstance(appliance_type, str) else None,
        "available": appliance.available,
        **appliance_drawing(data, saved, model),
        "entities": entities,
        "locks": {key: code for key in entities if (code := lock_code(data, key)) is not None},
    }


@callback
def panel_message(hass: HomeAssistant, appearance: dict[str, dict[str, str]]) -> dict:
    """What the panel shows (PanelMessage): the appliances of the entries that show it."""
    devices = dr.async_get(hass)
    entities = er.async_get(hass)
    appliances = []
    for entry in panel_entries(hass):
        states = _appliance_states(hass, entry)
        registered = {
            identifier: device
            for device in dr.async_entries_for_config_entry(devices, entry.entry_id)
            for domain, identifier in device.identifiers
            if domain == DOMAIN
        }
        entity_maps = _entity_maps(
            entities, entry.entry_id, [appliance.appliance_id for appliance in states]
        )
        for appliance in states:
            # The panel routes by device, so an appliance without one can't be shown.
            if (device := registered.get(appliance.appliance_id)) is not None:
                appliances.append(
                    _appliance(
                        entry.entry_id,
                        appliance,
                        device,
                        entity_maps.get(appliance.appliance_id, {}),
                        appearance.get(appliance.appliance_id),
                    )
                )
    return {"appliances": appliances}


class PanelSubscription:
    """One panel's subscription, which is sent the PanelMessage whenever it changes."""

    def __init__(
        self,
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg_id: int,
        data: PanelData,
    ) -> None:
        self.hass = hass
        self.connection = connection
        self.msg_id = msg_id
        self._data = data
        self._last: dict | None = None
        # The entity ids in the last message, to tell which removed entities mattered.
        self._entity_ids: set[str] = set()
        self._coordinators: dict[SubZeroCoordinator, CALLBACK_TYPE] = {}
        self._unsub_registry: CALLBACK_TYPE | None = None
        self._unsub_send: CALLBACK_TYPE | None = None
        self._send_job = HassJob(
            self._async_send_if_changed, "Sub-Zero panel update", cancel_on_shutdown=True
        )

    @callback
    def async_start(self, message: dict) -> None:
        self._data.subscriptions.add(self)
        self._unsub_registry = self.hass.bus.async_listen(
            er.EVENT_ENTITY_REGISTRY_UPDATED, self.async_changed, event_filter=self._ours
        )
        self._follow_coordinators()
        self._send(message)

    @callback
    def async_stop(self) -> None:
        self._data.subscriptions.discard(self)
        if self._unsub_send is not None:
            self._unsub_send()
            self._unsub_send = None
        if self._unsub_registry is not None:
            self._unsub_registry()
            self._unsub_registry = None
        for unsub in self._coordinators.values():
            unsub()
        self._coordinators.clear()

    @callback
    def async_entries_changed(self) -> None:
        """Follow the coordinators of the entries set up now, and send any change."""
        self._follow_coordinators()
        self.async_changed()

    @callback
    def async_changed(self, _event: Event | None = None) -> None:
        """Send the message once a burst of changes is over, if it changed."""
        if self._unsub_send is None:
            self._unsub_send = async_call_later(self.hass, DEBOUNCE, self._send_job)

    @callback
    def _ours(self, event_data: er.EventEntityRegistryUpdatedData) -> bool:
        """Whether an entity registry update is about this integration's entities."""
        if event_data["action"] == "remove":
            # The entity is gone from the registry, so look in what was sent.
            return event_data["entity_id"] in self._entity_ids
        entity = er.async_get(self.hass).async_get(event_data["entity_id"])
        return entity is not None and entity.platform == DOMAIN

    @callback
    def _follow_coordinators(self) -> None:
        current = {
            coordinator
            for entry in panel_entries(self.hass)
            for coordinator in _coordinators(self.hass, entry).values()
        }
        for coordinator in self._coordinators.keys() - current:
            self._coordinators.pop(coordinator)()
        for coordinator in current - self._coordinators.keys():
            self._coordinators[coordinator] = coordinator.async_add_listener(self.async_changed)

    @callback
    def _async_send_if_changed(self, _now: Any) -> None:
        self._unsub_send = None
        message = panel_message(self.hass, self._data.appearance or {})
        if message != self._last:
            self._send(message)

    @callback
    def _send(self, message: dict) -> None:
        self._last = message
        self._entity_ids = {
            entity_id
            for appliance in message["appliances"]
            for domains in appliance["entities"].values()
            for entity_id in domains.values()
        }
        self.connection.send_message(websocket_api.event_message(self.msg_id, message))


@websocket_api.websocket_command({vol.Required("type"): "subzero/panel/subscribe"})
@websocket_api.async_response
async def ws_subscribe(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Send the PanelMessage now, and again whenever it changes."""
    data = _panel_data(hass)
    # Entry setup has loaded it already, so this rarely waits.
    appearance = data.appearance if data.appearance is not None else await data.async_appearance()
    message = panel_message(hass, appearance)
    subscription = PanelSubscription(hass, connection, msg["id"], data)
    connection.subscriptions[msg["id"]] = subscription.async_stop
    connection.send_result(msg["id"])
    subscription.async_start(message)


def _invalid(name: str, value: Any, options: dict, defaults: dict) -> str | None:
    """Why a value can't be saved in an Appearance field, or None when it can."""
    if name not in FIELDS:
        return f"Appearance has no {name} field."
    # Back to the default, which is accepted even where the field isn't offered, so an
    # editor can send a whole Appearance back.
    if value is None or value == defaults[name]:
        return None
    if name == "panel_color":
        if "panel" not in options["finish"]:
            return "This appliance has no panel-ready finish."
        if not isinstance(value, str) or not COLOR.fullmatch(value):
            return "Give the panel color as #rrggbb."
        return None
    offered = options["forms"] if name == "form" else options[name]
    if offered and isinstance(value, str) and value in offered:
        return None
    return f"{value!r} isn't offered for this appliance's {name}."


@websocket_api.websocket_command(
    {
        vol.Required("type"): "subzero/panel/set_appearance",
        vol.Required("appliance_id"): str,
        vol.Required("appearance"): vol.Any(None, dict),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_set_appearance(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Change how an appliance is drawn, for every user."""
    data = _panel_data(hass)
    appearance = await data.async_appearance()
    appliance_id = msg["appliance_id"]
    if (found := _find_appliance(hass, appliance_id)) is None:
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Unknown appliance.")
        return
    entry, appliance = found
    device = dr.async_get(hass).async_get_device_by_identifier(
        (DOMAIN, appliance_id), entry.entry_id
    )
    model = _model_number(appliance.data, device)
    spec = detected_spec(appliance.data, model)
    options = appearance_options(spec)
    defaults = appearance_defaults(spec, model)
    changes = msg["appearance"]
    saved = {} if changes is None else dict(appearance.get(appliance_id, {}))
    for name, value in (changes or {}).items():
        if (error := _invalid(name, value, options, defaults)) is not None:
            connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, error)
            return
        # Only what differs from the defaults is saved.
        if value is None or value == defaults[name]:
            saved.pop(name, None)
        else:
            saved[name] = value.lower() if name == "panel_color" else value
    if saved:
        appearance[appliance_id] = saved
    else:
        appearance.pop(appliance_id, None)
    await data.async_save()
    connection.send_result(
        msg["id"], {"appearance": effective_appearance(saved, defaults, options)}
    )
    for subscription in list(data.subscriptions):
        subscription.async_changed()


@callback
def async_setup_panel_api(hass: HomeAssistant) -> None:
    """Register the panel's websocket commands, and follow the entries' state."""
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_set_appearance)

    @callback
    def entry_state_changed() -> None:
        # Setup and unload update subscribers themselves; this catches an entry turned
        # off or disabled while it waits to retry its setup, which unloads nothing.
        if (data := hass.data.get(DATA)) is not None:
            _entries_changed(data)

    async_dispatcher_connect(hass, SIGNAL_ENTRY_STATE, entry_state_changed)


@callback
def async_panel_entry_set_up(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Show a set-up entry's appliances live, and update subscribers."""
    if (data := hass.data.get(DATA)) is not None:
        data.unloaded.pop(entry.entry_id, None)
        _entries_changed(data)


@callback
def async_panel_entry_unloaded(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Keep an unloaded entry's appliances as they were, and update subscribers.

    An entry unloads to reload, after an options change or a reauth, and setup can take a
    while; meanwhile, and while it waits to retry its setup, the panel shows the appliances
    unavailable instead of losing them. The panel leaves them out once the entry is removed
    or disabled, or the option is off.
    """
    data = _panel_data(hass)
    account = getattr(entry, "runtime_data", None)
    data.unloaded[entry.entry_id] = [
        replace(_appliance_state(coordinator), data=dict(coordinator.data or {}), available=False)
        for coordinator in (account.coordinators.values() if account is not None else ())
    ]
    _entries_changed(data)


@callback
def async_panel_entry_removed(hass: HomeAssistant, entry_id: str) -> None:
    """Let a removed entry's appliances go, and update subscribers."""
    if (data := hass.data.get(DATA)) is not None:
        data.unloaded.pop(entry_id, None)
        _entries_changed(data)


def _entries_changed(data: PanelData) -> None:
    for subscription in list(data.subscriptions):
        subscription.async_entries_changed()


async def async_remove_unused_appearance(hass: HomeAssistant) -> None:
    """Drop the Appearance of appliances that no entry has any more.

    Best effort: a failure is logged, since it must never fail setup or removal.
    """
    try:
        data = _panel_data(hass)
        appearance = await data.async_appearance()
        current = {
            appliance_id
            for entry in hass.config_entries.async_entries(DOMAIN, include_ignore=False)
            for appliance_id in selected_devices(entry)
        }
        if unused := appearance.keys() - current:
            for appliance_id in unused:
                del appearance[appliance_id]
            await data.async_save()
    except Exception:
        _LOGGER.exception("Could not clean up the Sub-Zero panel's Appearance settings")


async def async_appliance_panel(hass: HomeAssistant, coordinator: SubZeroCoordinator) -> dict:
    """The spec and Appearance the panel draws an appliance with, for diagnostics."""
    appearance = await _panel_data(hass).async_appearance()
    data = coordinator.data or {}
    device = dr.async_get(hass).async_get_device_by_identifier(
        (DOMAIN, coordinator.device_id), coordinator.entry.entry_id
    )
    drawing = appliance_drawing(
        data, appearance.get(coordinator.device_id), _model_number(data, device)
    )
    return {"spec": drawing["spec"], "appearance": drawing["appearance"]}
