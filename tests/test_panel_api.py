"""The sidebar panel's websocket API, its Appearance store, and lock codes.

The payload is `PanelMessage` in frontend/src/types.ts. Detection itself, appliance_spec, has
its own tests, so these check only the family of each spec.
"""

import asyncio
import json
from datetime import timedelta
from pathlib import Path
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.config_entries import ConfigEntryDisabler, ConfigEntryState
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from homeassistant.util.unit_system import US_CUSTOMARY_SYSTEM
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

from custom_components.subzero import panel_api
from custom_components.subzero.api import ApiError, Appliance, RateLimited, token_state
from custom_components.subzero.appliance_spec import FORMS, appliance_spec
from custom_components.subzero.const import CONF_SHOW_SIDEBAR_PANEL, DOMAIN
from custom_components.subzero.controls import control_lock, control_lock_reason
from custom_components.subzero.diagnostics import (
    async_get_config_entry_diagnostics,
    async_get_device_diagnostics,
)
from custom_components.subzero.panel_api import (
    appearance_defaults,
    appearance_options,
    appliance_drawing,
    apply_form,
    detected_spec,
    effective_appearance,
    lock_code,
)

from .conftest import APPLIANCE_STATES

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")
FIXTURES = Path(__file__).parent / "fixtures" / "appliances"
FRIDGE = APPLIANCE_STATES["CL4850SID"]
RANGE = APPLIANCE_STATES["DF48850SP"]
DISHWASHER = APPLIANCE_STATES["DW2450"]
DEFAULTS = {
    "finish": "stainless",
    "panel_color": None,
    "knobs": "red",
    "handle": "tubular",
    "style": None,
    "form": None,
}
PANEL_COLORS = [
    "#f4f2ec",
    "#ece4d2",
    "#9aa0a6",
    "#2f3b52",
    "#9caf88",
    "#1f2022",
    "#5b3a29",
    "#b08955",
]
OPTIONS = {
    "refrigeration": {
        "finish": ["stainless", "panel", "black"],
        "knobs": None,
        "handle": ["tubular", "pro", "none"],
        "style": None,
    },
    "range": {
        "finish": ["stainless"],
        "knobs": ["red", "black", "stainless"],
        "handle": None,
        "style": None,
    },
    "dishwasher": {
        "finish": ["stainless", "panel"],
        "knobs": None,
        "handle": ["tubular", "pro", "none"],
        "style": None,
    },
}
# The owner's appliances: brand and family.
OWNER_APPLIANCES = {
    "CL4850SID": ("Sub-Zero", "refrigeration"),
    "DF48850SP": ("Wolf", "range"),
    "DW2450": ("Cove", "dishwasher"),
    "DEU2450BG": ("Sub-Zero", "refrigeration"),
    "DEU2450WDZ": ("Sub-Zero", "refrigeration"),
}


@pytest.fixture(autouse=True)
def fahrenheit(hass):
    hass.config.units = US_CUSTOMARY_SYSTEM


async def subscribe(client) -> dict:
    """Subscribe, and return the PanelMessage sent at once."""
    await client.send_json_auto_id({"type": "subzero/panel/subscribe"})
    result = await client.receive_json()
    assert result["success"], result
    event = await client.receive_json()
    assert (event["id"], event["type"]) == (result["id"], "event")
    return event["event"]


async def next_message(hass, client) -> dict:
    """The next PanelMessage, sent once a burst of changes is over."""
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=5))
    event = await client.receive_json()
    assert event["type"] == "event", event
    return event["event"]


async def assert_nothing_sent(hass, client) -> None:
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=5))
    await client.send_json_auto_id({"type": "ping"})
    assert (await client.receive_json())["type"] == "pong"


async def set_appearance(client, appearance, appliance_id="appliance") -> dict:
    await client.send_json_auto_id(
        {
            "type": "subzero/panel/set_appearance",
            "appliance_id": appliance_id,
            "appearance": appearance,
        }
    )
    return await client.receive_json()


def saved_appearance(hass_storage) -> dict:
    return hass_storage.get(panel_api.STORAGE_KEY, {}).get("data", {}).get("appearance", {})


def registered_entities(hass, entry) -> dict[str, dict[str, str]]:
    entities = {}
    for entity in er.async_entries_for_config_entry(er.async_get(hass), entry.entry_id):
        if not entity.disabled:
            key = entity.unique_id.removeprefix("appliance_")
            entities.setdefault(key, {})[entity.domain] = entity.entity_id
    return entities


@pytest.mark.parametrize(
    "cloud_appliance",
    list(APPLIANCE_STATES.values()),
    ids=list(APPLIANCE_STATES),
    indirect=True,
)
async def test_the_snapshot_describes_each_appliance(hass, cloud_appliance, hass_ws_client):
    message = await subscribe(await hass_ws_client(hass))

    [appliance] = message["appliances"]
    model = cloud_appliance.state["appliance_model"]
    brand, family = OWNER_APPLIANCES[model]
    assert appliance["device_id"] == cloud_appliance.device_id
    assert appliance["appliance_id"] == "appliance"
    assert appliance["entry_id"] == cloud_appliance.entry.entry_id
    assert appliance["name"] == "Kitchen"
    assert appliance["brand"] == brand
    assert appliance["model"] == model
    assert appliance["appliance_type"] == cloud_appliance.state["appliance_type"]
    assert appliance["available"] is True
    assert appliance["spec"]["family"] == family
    assert appliance["detected_form"] == appliance["spec"]["form"]
    # Every appliance starts stainless, the Cove too: its model doesn't say which front it has.
    assert appliance["appearance"] == DEFAULTS
    assert appliance["appearance_options"] == {
        **OPTIONS[family],
        "panel_colors": PANEL_COLORS,
        "forms": list(FORMS[family]),
    }
    assert appliance["entities"] == registered_entities(hass, cloud_appliance.entry)
    assert appliance["entities"]["appliance_event"] == {"event": "event.kitchen_appliance_event"}
    assert appliance["entities"]["active_faults"] == {"sensor": "sensor.kitchen_active_faults"}
    # Disabled by default, so left out.
    assert "uptime" not in appliance["entities"]
    assert appliance["locks"] == {}
    # What the panel receives is plain JSON.
    assert json.loads(json.dumps(message)) == message


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_a_key_lists_its_entity_on_each_platform(hass, cloud_appliance, hass_ws_client):
    message = await subscribe(await hass_ws_client(hass))
    entities = message["appliances"][0]["entities"]
    assert entities["ref_set_temp"] == {
        "number": "number.kitchen_refrigerator_setpoint",
        "climate": "climate.kitchen_refrigerator",
        "sensor": "sensor.kitchen_refrigerator_setpoint",
    }
    assert entities["frz_door_ajar"] == {"binary_sensor": "binary_sensor.kitchen_freezer_door"}


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_disabled_entities_are_left_out(hass, cloud_appliance, hass_ws_client):
    client = await hass_ws_client(hass)
    await subscribe(client)
    registry = er.async_get(hass)
    registry.async_update_entity(
        "number.kitchen_refrigerator_setpoint", disabled_by=er.RegistryEntryDisabler.USER
    )
    message = await next_message(hass, client)
    assert set(message["appliances"][0]["entities"]["ref_set_temp"]) == {"climate", "sensor"}

    registry.async_update_entity("number.kitchen_refrigerator_setpoint", disabled_by=None)
    message = await next_message(hass, client)
    assert set(message["appliances"][0]["entities"]["ref_set_temp"]) == {
        "climate",
        "number",
        "sensor",
    }


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_new_entities_are_sent(hass, cloud_appliance, hass_ws_client):
    client = await hass_ws_client(hass)
    assert "ref_display_temp" not in (await subscribe(client))["appliances"][0]["entities"]
    await cloud_appliance.update({"ref_display_temp": 37})
    message = await next_message(hass, client)
    assert message["appliances"][0]["entities"]["ref_display_temp"] == {
        "sensor": "sensor.kitchen_refrigerator_display_temperature"
    }


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_lock_changes_are_sent_once_a_burst_is_over(hass, cloud_appliance, hass_ws_client):
    client = await hass_ws_client(hass)
    await subscribe(client)
    # A change the panel doesn't receive sends nothing.
    await cloud_appliance.update({"ap_rssi": -70, "ref_set_temp": 37})
    await assert_nothing_sent(hass, client)

    for sabbath in (True, False, True):
        await cloud_appliance.update({"sabbath_on": sabbath})
    message = await next_message(hass, client)
    locks = message["appliances"][0]["locks"]
    assert locks["ref_set_temp"] == "sabbath"
    assert locks["ice_maker_mode"] == "sabbath"
    # The mode select stays unlocked, so Sabbath mode can be turned off.
    assert "operating_mode" not in locks
    assert "sabbath_on" not in locks
    await assert_nothing_sent(hass, client)

    await cloud_appliance.update({"sabbath_on": False})
    assert (await next_message(hass, client))["appliances"][0]["locks"] == {}


@pytest.mark.parametrize("cloud_appliance", [RANGE], indirect=True)
async def test_an_unavailable_appliance_is_sent(hass, cloud_appliance, hass_ws_client):
    client = await hass_ws_client(hass)
    await subscribe(client)
    cloud_appliance.coordinator.async_set_update_error(RuntimeError("Offline"))
    assert (await next_message(hass, client))["appliances"][0]["available"] is False


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_the_option_leaves_the_entrys_appliances_out(hass, cloud_appliance, hass_ws_client):
    client = await hass_ws_client(hass)
    await subscribe(client)
    entry = cloud_appliance.entry

    async def configure(show: bool) -> None:
        result = await hass.config_entries.options.async_init(entry.entry_id)
        await hass.config_entries.options.async_configure(
            result["flow_id"], {"device_ids": ["appliance"], CONF_SHOW_SIDEBAR_PANEL: show}
        )
        await hass.async_block_till_done()

    await configure(False)
    assert await next_message(hass, client) == {"appliances": []}

    await configure(True)
    message = await next_message(hass, client)
    assert [appliance["appliance_id"] for appliance in message["appliances"]] == ["appliance"]
    # The subscription follows the appliance's new coordinator after the reload.
    await cloud_appliance.update({"sabbath_on": True})
    message = await next_message(hass, client)
    assert message["appliances"][0]["locks"]["ref_set_temp"] == "sabbath"


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_a_reload_keeps_the_appliances_in_place(
    hass, cloud_appliance, hass_ws_client, freezer
):
    """An options change, a reauth or Reload unloads the entry and sets it up again, which
    can take a while; open panels keep its appliances meanwhile, unavailable."""
    client = await hass_ws_client(hass)
    [before] = (await subscribe(client))["appliances"]
    cloud = cloud_appliance.client
    appliances = cloud.appliances.return_value

    async def slowly():
        # Long enough for open panels to be sent an update mid-reload.
        freezer.tick(timedelta(minutes=10))
        async_fire_time_changed(hass)
        return appliances

    cloud.appliances.side_effect = slowly
    assert await hass.config_entries.async_reload(cloud_appliance.entry.entry_id)
    await hass.async_block_till_done()
    during = await client.receive_json()
    assert during["event"] == {"appliances": [{**before, "available": False}]}
    assert await next_message(hass, client) == {"appliances": [before]}

    # The subscription follows the new coordinator.
    await cloud_appliance.update({"sabbath_on": True})
    [appliance] = (await next_message(hass, client))["appliances"]
    assert appliance["locks"]["ref_set_temp"] == "sabbath"


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_an_entry_retrying_setup_keeps_its_appliances(hass, cloud_appliance, hass_ws_client):
    client = await hass_ws_client(hass)
    [before] = (await subscribe(client))["appliances"]
    entry = cloud_appliance.entry
    cloud_appliance.client.appliances.side_effect = RateLimited(300)
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.SETUP_RETRY
    assert await next_message(hass, client) == {"appliances": [{**before, "available": False}]}

    # Saving options reloads it, but it isn't set up, so nothing unloads.
    options = {**entry.options, CONF_SHOW_SIDEBAR_PANEL: False}
    hass.config_entries.async_update_entry(entry, options=options)
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.SETUP_RETRY
    assert await next_message(hass, client) == {"appliances": []}


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_a_disabled_or_removed_entry_leaves_the_panel(
    hass, cloud_appliance, hass_ws_client, hass_storage
):
    client = await hass_ws_client(hass)
    await subscribe(client)
    entry = cloud_appliance.entry
    assert (await set_appearance(client, {"finish": "black"}))["success"]

    await hass.config_entries.async_set_disabled_by(entry.entry_id, ConfigEntryDisabler.USER)
    await hass.async_block_till_done()
    assert await next_message(hass, client) == {"appliances": []}
    response = await set_appearance(client, {"finish": "panel"})
    assert response["error"]["code"] == "not_found"

    await hass.config_entries.async_set_disabled_by(entry.entry_id, None)
    await hass.async_block_till_done()
    [appliance] = (await next_message(hass, client))["appliances"]
    assert (appliance["available"], appliance["appearance"]["finish"]) == (True, "black")

    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert await next_message(hass, client) == {"appliances": []}
    assert saved_appearance(hass_storage) == {}


async def setup_entry(hass, tokens, title: str, appliances: dict[str, dict | None]):
    """Set up an entry for these appliances, each with the state it reports.

    None stands for an appliance whose first read fails, while the others' succeed.
    """
    entry = MockConfigEntry(
        domain=DOMAIN,
        version=2,
        minor_version=5,
        title=title,
        data={
            "tokens": token_state(tokens),
            "devices": {
                appliance_id: {"name": appliance_id.title(), "temperature_unit": "F"}
                for appliance_id in appliances
            },
        },
    )
    entry.add_to_hass(hass)

    async def state(device_id):
        if (reported := appliances[device_id]) is None:
            raise ApiError("No answer")
        return dict(reported)

    async def watch(device_ids):
        # Nothing is pushed, so setup reads each appliance's state.
        await asyncio.Event().wait()
        yield

    with patch("custom_components.subzero.SubZeroClient") as factory:
        client = factory.return_value
        client.tokens = token_state(tokens)
        client.push_connected = True
        client.appliances = AsyncMock(
            return_value=[
                Appliance(appliance_id, appliance_id.title(), "F") for appliance_id in appliances
            ]
        )
        client.state = AsyncMock(side_effect=state)
        client.open_channel = AsyncMock()
        client.appliance_faults = AsyncMock(return_value=[])
        client.watch = watch
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    return entry


async def test_an_appliance_without_state_is_drawn_from_its_model(
    hass, tokens, hass_ws_client, hass_storage
):
    """If one appliance's first read fails at setup, the panel still draws it as itself,
    from the model and maker the device registry kept from its last status."""
    hass_storage[panel_api.STORAGE_KEY] = {
        "version": panel_api.STORAGE_VERSION,
        "minor_version": 1,
        "key": panel_api.STORAGE_KEY,
        "data": {"appearance": {"range": {"knobs": "stainless"}}},
    }
    entry = await setup_entry(hass, tokens, "Account", {"fridge": FRIDGE, "range": None})
    registry = dr.async_get(hass)
    device = registry.async_get_device_by_identifier((DOMAIN, "range"), entry.entry_id)
    # What the registry kept from the range's last status: the coordinator leaves it alone
    # until the range reports.
    registry.async_update_device(device.id, manufacturer="Wolf", model="DF48850SP")

    client = await hass_ws_client(hass)
    fridge, stateless = (await subscribe(client))["appliances"]
    assert fridge["available"] is True
    assert (stateless["appliance_id"], stateless["available"]) == ("range", False)
    assert (stateless["brand"], stateless["model"]) == ("Wolf", "DF48850SP")
    assert stateless["appliance_type"] is None
    assert stateless["spec"] == json.loads(json.dumps(appliance_spec("DF48850SP", {})))
    # Its saved Appearance applies, and it takes what a range offers.
    assert stateless["appearance"]["knobs"] == "stainless"
    response = await set_appearance(client, {"knobs": "black"}, "range")
    assert response["success"], response
    stateless = (await next_message(hass, client))["appliances"][1]
    assert stateless["appearance"]["knobs"] == "black"

    diagnostics = await async_get_device_diagnostics(hass, entry, device)
    assert diagnostics["panel"]["spec"]["family"] == "range"
    assert diagnostics["panel"]["appearance"]["knobs"] == "black"
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_two_entries_share_one_message(
    hass, cloud_appliance, tokens, hass_ws_client, hass_storage
):
    beverage = APPLIANCE_STATES["DEU2450BG"]
    second = await setup_entry(hass, tokens, "Second account", {"bar": beverage})
    client = await hass_ws_client(hass)
    appliance, bar = (await subscribe(client))["appliances"]
    assert (appliance["appliance_id"], bar["appliance_id"]) == ("appliance", "bar")
    assert (appliance["entry_id"], bar["entry_id"]) == (
        cloud_appliance.entry.entry_id,
        second.entry_id,
    )
    assert bar["entities"]["ref_set_temp"]["climate"] == "climate.bar_refrigerator"

    assert (await set_appearance(client, {"finish": "black"}, "bar"))["success"]
    appliance, bar = (await next_message(hass, client))["appliances"]
    assert appliance["appearance"]["finish"] == "stainless"
    assert bar["appearance"]["finish"] == "black"
    assert saved_appearance(hass_storage) == {"bar": {"finish": "black"}}
    await hass.config_entries.async_unload(second.entry_id)
    await hass.async_block_till_done()


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_renamed_and_removed_entities_are_sent(hass, cloud_appliance, hass_ws_client):
    client = await hass_ws_client(hass)
    await subscribe(client)
    registry = er.async_get(hass)
    registry.async_update_entity(
        "binary_sensor.kitchen_freezer_door", new_entity_id="binary_sensor.freezer_door"
    )
    entities = (await next_message(hass, client))["appliances"][0]["entities"]
    assert entities["frz_door_ajar"] == {"binary_sensor": "binary_sensor.freezer_door"}

    registry.async_remove("binary_sensor.freezer_door")
    entities = (await next_message(hass, client))["appliances"][0]["entities"]
    assert "frz_door_ajar" not in entities
    # Removing an entity the panel wasn't sent sends nothing.
    registry.async_get_or_create("sensor", "other", "elsewhere")
    registry.async_remove("sensor.other_elsewhere")
    await assert_nothing_sent(hass, client)


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_closing_the_connection_unsubscribes(hass, cloud_appliance, hass_ws_client):
    coordinator = cloud_appliance.coordinator
    listeners = len(coordinator._listeners)
    client = await hass_ws_client(hass)
    await subscribe(client)
    assert len(coordinator._listeners) == listeners + 1
    assert len(hass.data[panel_api.DATA].subscriptions) == 1

    await client.close()
    await hass.async_block_till_done()
    assert not hass.data[panel_api.DATA].subscriptions
    assert len(coordinator._listeners) == listeners


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_unsubscribing_stops_the_subscription(hass, cloud_appliance, hass_ws_client):
    coordinator = cloud_appliance.coordinator
    listeners = len(coordinator._listeners)
    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "subzero/panel/subscribe"})
    subscription = (await client.receive_json())["id"]
    await client.receive_json()
    await client.send_json_auto_id({"type": "unsubscribe_events", "subscription": subscription})
    assert (await client.receive_json())["success"]
    assert not hass.data[panel_api.DATA].subscriptions
    assert len(coordinator._listeners) == listeners
    await cloud_appliance.update({"sabbath_on": True})
    await assert_nothing_sent(hass, client)


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_only_admins_change_the_appearance(
    hass, cloud_appliance, hass_ws_client, hass_read_only_access_token, hass_storage
):
    client = await hass_ws_client(hass, hass_read_only_access_token)
    # Everyone sees and controls the appliances.
    assert len((await subscribe(client))["appliances"]) == 1

    response = await set_appearance(client, {"finish": "black"})
    assert not response["success"]
    assert response["error"]["code"] == "unauthorized"
    assert saved_appearance(hass_storage) == {}


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
@pytest.mark.parametrize(
    ("appliance_id", "appearance", "code"),
    [
        ("elsewhere", {"finish": "black"}, "not_found"),
        ("appliance", {"color": "black"}, "invalid_format"),
        ("appliance", {"finish": "carbon"}, "invalid_format"),
        ("appliance", {"finish": 3}, "invalid_format"),
        ("appliance", {"knobs": "black"}, "invalid_format"),
        ("appliance", {"style": "transitional"}, "invalid_format"),
        ("appliance", {"form": "single"}, "invalid_format"),
        ("appliance", {"panel_color": "white"}, "invalid_format"),
        ("appliance", {"panel_color": "#12345"}, "invalid_format"),
        ("appliance", {"finish": "black", "handle": "round"}, "invalid_format"),
        ("appliance", "black", "invalid_format"),
    ],
)
async def test_invalid_appearance_is_refused(
    hass, cloud_appliance, hass_ws_client, hass_storage, appliance_id, appearance, code
):
    client = await hass_ws_client(hass)
    response = await set_appearance(client, appearance, appliance_id)
    assert not response["success"]
    assert response["error"]["code"] == code
    assert saved_appearance(hass_storage) == {}


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_appearance_is_saved_pushed_and_reset(
    hass, cloud_appliance, hass_ws_client, hass_storage
):
    client = await hass_ws_client(hass)
    await subscribe(client)

    response = await set_appearance(
        client, {"finish": "panel", "panel_color": "#9CAF88", "handle": "pro", "knobs": "red"}
    )
    assert response["success"], response
    expected = {**DEFAULTS, "finish": "panel", "panel_color": "#9caf88", "handle": "pro"}
    assert response["result"] == {"appearance": expected}
    # Only what differs from the defaults is saved.
    assert saved_appearance(hass_storage) == {
        "appliance": {"finish": "panel", "panel_color": "#9caf88", "handle": "pro"}
    }
    assert (await next_message(hass, client))["appliances"][0]["appearance"] == expected

    # A field set to null returns to its default.
    response = await set_appearance(client, {"handle": None, "finish": "stainless"})
    assert response["result"] == {"appearance": DEFAULTS}
    # The color waits for a panel finish to be chosen again.
    assert saved_appearance(hass_storage) == {"appliance": {"panel_color": "#9caf88"}}
    response = await set_appearance(client, {"finish": "panel"})
    assert response["result"]["appearance"]["panel_color"] == "#9caf88"

    # Null resets the whole Appearance.
    response = await set_appearance(client, None)
    assert response["result"] == {"appearance": DEFAULTS}
    assert saved_appearance(hass_storage) == {}
    assert (await next_message(hass, client))["appliances"][0]["appearance"] == DEFAULTS


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_a_form_override_changes_the_spec(hass, cloud_appliance, hass_ws_client):
    client = await hass_ws_client(hass)
    [appliance] = (await subscribe(client))["appliances"]
    detected = appliance["detected_form"]
    form = next(form for form in appliance["appearance_options"]["forms"] if form != detected)

    response = await set_appearance(client, {"form": form})
    assert response["result"]["appearance"]["form"] == form
    [appliance] = (await next_message(hass, client))["appliances"]
    assert appliance["spec"]["form"] == form
    assert appliance["spec"]["family"] == "refrigeration"
    assert appliance["detected_form"] == detected
    assert appliance["appearance"]["form"] == form

    await set_appearance(client, {"form": None})
    [appliance] = (await next_message(hass, client))["appliances"]
    assert appliance["spec"]["form"] == detected


@pytest.fixture
def stored_appearance(hass_storage):
    """Appearance saved earlier, for the test appliance and one no entry has any more."""
    hass_storage[panel_api.STORAGE_KEY] = {
        "version": panel_api.STORAGE_VERSION,
        "minor_version": 1,
        "key": panel_api.STORAGE_KEY,
        "data": {
            "appearance": {
                "appliance": {"finish": "black", "handle": "none"},
                "replaced": {"finish": "panel"},
            }
        },
    }


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_saved_appearance_is_loaded_and_unused_settings_dropped(
    hass, stored_appearance, cloud_appliance, hass_ws_client, hass_storage
):
    [appliance] = (await subscribe(await hass_ws_client(hass)))["appliances"]
    assert appliance["appearance"] == {**DEFAULTS, "finish": "black", "handle": "none"}
    assert saved_appearance(hass_storage) == {"appliance": {"finish": "black", "handle": "none"}}

    device = dr.async_get(hass).async_get(cloud_appliance.device_id)
    entry = cloud_appliance.entry
    diagnostics = await async_get_device_diagnostics(hass, entry, device)
    assert diagnostics["panel"] == {
        "spec": appliance["spec"],
        "appearance": appliance["appearance"],
    }
    diagnostics = await async_get_config_entry_diagnostics(hass, entry)
    assert diagnostics["appliances"][0]["panel"]["appearance"]["finish"] == "black"


async def test_removing_an_entry_drops_its_appliances_appearance(hass, hass_storage, tokens):
    hass_storage[panel_api.STORAGE_KEY] = {
        "version": panel_api.STORAGE_VERSION,
        "minor_version": 1,
        "key": panel_api.STORAGE_KEY,
        "data": {"appearance": {"kept": {"finish": "black"}, "removed": {"finish": "panel"}}},
    }
    entries = [
        MockConfigEntry(
            domain=DOMAIN,
            version=2,
            minor_version=5,
            data={"tokens": {}, "devices": {device_id: {"name": device_id}}},
        )
        for device_id in ("kept", "removed")
    ]
    for entry in entries:
        entry.add_to_hass(hass)
    await hass.config_entries.async_remove(entries[1].entry_id)
    assert saved_appearance(hass_storage) == {"kept": {"finish": "black"}}


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_diagnostics_never_fail_over_the_panel(hass, cloud_appliance, caplog):
    with patch(
        "custom_components.subzero.diagnostics.async_appliance_panel", side_effect=RuntimeError
    ):
        diagnostics = await async_get_config_entry_diagnostics(hass, cloud_appliance.entry)
    assert diagnostics["appliances"][0]["panel"] is None
    assert diagnostics["appliances"][0]["state"]["appliance_model"] == "CL4850SID"
    assert "sidebar panel's details" in caplog.text


# ---- the parts, without Home Assistant -------------------------------------------------


def test_a_spec_is_copied_as_the_panel_receives_it():
    spec = {
        "family": "range",
        "form": "range",
        "surfaces": ("griddle",),
        "ovens": ({"prefix": "cav", "position": "single", "width": 30},),
    }
    with patch.object(panel_api, "appliance_spec", return_value=spec) as detect:
        copied = detected_spec({"appliance_model": "DF304", "cav_unit_on": False})
    detect.assert_called_once_with("DF304", {"appliance_model": "DF304", "cav_unit_on": False})
    assert copied == {
        "family": "range",
        "form": "range",
        "surfaces": ["griddle"],
        "ovens": [{"prefix": "cav", "position": "single", "width": 30}],
    }
    copied["ovens"][0]["width"] = 36
    assert spec["ovens"][0]["width"] == 30


def test_a_failing_spec_is_drawn_generic_and_logged_once(caplog):
    with patch.object(panel_api, "appliance_spec", side_effect=ValueError):
        for _ in range(2):
            assert detected_spec({"appliance_model": "TEST-BROKEN"}) == {
                "family": "generic",
                "form": "appliance",
                "width": None,
                "generic": True,
            }
    assert caplog.text.count("Could not work out how to draw the TEST-BROKEN") == 1


def test_each_family_offers_its_appearance():
    assert appearance_options({"family": "wall_oven", "knob": True}) == {
        "finish": ["stainless", "black", "carbon"],
        "panel_colors": PANEL_COLORS,
        "knobs": ["red", "black", "stainless"],
        "handle": None,
        "style": ["professional", "transitional", "contemporary"],
        "forms": list(FORMS["wall_oven"]),
    }
    # Only knob ovens have knobs to color.
    assert appearance_options({"family": "wall_oven", "knob": False})["knobs"] is None
    for family in ("hood", "generic"):
        assert appearance_options({"family": family}) == {
            "finish": ["stainless"],
            "panel_colors": PANEL_COLORS,
            "knobs": None,
            "handle": None,
            "style": None,
            "forms": list(FORMS[family]),
        }


@pytest.mark.parametrize(
    ("model", "changed"),
    [
        # A Cove's model doesn't say which front it has, so it starts stainless like the rest.
        ("DW2450WS", {}),
        ("PRO3650", {"handle": "pro"}),
        ("CL4850SID", {}),
        ("DF48850SP", {}),
        # Sub-Zero's model number key: /O an overlay (panel-ready) front, /S stainless, /P or
        # /PH a pro handle, /T or /TH a tubular one.
        ("CL3650UG/S/P", {"handle": "pro"}),
        ("CL3650UG/S/T", {}),
        ("BW-30/S/PH", {"handle": "pro"}),
        ("CL3650UFD/O", {"finish": "panel"}),
        ("BI-36U/O-LH", {"finish": "panel"}),
        ("PRO3650/S/T", {}),
        # Only refrigeration's letters say this: on a range P is the style.
        ("DF48850/S/P", {}),
    ],
)
def test_defaults_follow_what_the_model_tells(model, changed):
    spec = detected_spec({}, model)
    assert appearance_defaults(spec, model) == {**DEFAULTS, **changed}


def test_saved_values_apply_only_where_offered():
    spec = {"family": "range", "form": "range"}
    options = appearance_options(spec)
    saved = {"finish": "black", "knobs": "stainless", "handle": "pro", "form": "single"}
    defaults = appearance_defaults(spec)
    assert effective_appearance(saved, defaults, options) == {**DEFAULTS, "knobs": "stainless"}


def test_a_panel_ready_model_starts_panel_ready():
    data = {"appliance_model": "CL3650UFD/O", "ref_set_temp": 37, "frz_set_temp": 0}
    drawing = appliance_drawing(data, None)
    assert drawing["appearance"] == {**DEFAULTS, "finish": "panel"}
    # Stainless is then the change that's saved, and choosing panel again saves nothing.
    assert appliance_drawing(data, {"finish": "stainless"})["appearance"] == DEFAULTS
    colored = appliance_drawing(data, {"panel_color": "#9caf88"})["appearance"]
    assert colored == {**DEFAULTS, "finish": "panel", "panel_color": "#9caf88"}


def test_a_wall_oven_form_switches_its_ovens():
    double = {
        "family": "wall_oven",
        "form": "double",
        "width": 30,
        "ovens": [
            {"prefix": "cav", "position": "upper", "width": 30},
            {"prefix": "cav2", "position": "lower", "width": 30},
        ],
    }
    single = apply_form(double, "single", {})
    assert single["form"] == "single"
    assert single["ovens"] == [{"prefix": "cav", "position": "single", "width": 30}]
    assert apply_form(single, "double", {})["ovens"] == double["ovens"]
    # The detected spec is left as it was.
    assert double["form"] == "double" and len(double["ovens"]) == 2
    assert apply_form(double, None, {}) is double
    assert apply_form(double, "double", {}) is double


def fixture_state(name: str) -> dict:
    return json.loads((FIXTURES / f"{name}.json").read_text())["state"]


@pytest.mark.parametrize(
    ("name", "form", "expected"),
    [
        # Wine storage's glass door comes with its form, and goes with it.
        ("deu2450wdz", "undercounter_refrigerator", {"glass": False, "ice": False}),
        ("deu2450r", "undercounter_wine", {"glass": True}),
        # A beverage center's glass door is the model's own, so it stays.
        ("deu2450bg", "undercounter_refrigerator", {"glass": True}),
        # Drawer forms say what their drawers hold, from the setpoints reported.
        ("cl4850sid", "undercounter_drawers", {"drawers": "combination", "ice": True}),
        ("deu3050dci", "undercounter_refrigerator", {"drawers": None, "ice": True}),
        # The ice maker reports ice_maker_on, so it has ice in any form.
        ("deu1550i", "undercounter_refrigerator", {"ice": True}),
    ],
)
def test_a_form_override_works_out_what_comes_with_the_form(name, form, expected):
    data = fixture_state(name)
    detected = detected_spec(data)
    spec = apply_form(detected, form, data)
    assert spec["form"] == form
    assert spec.items() >= expected.items()
    # The rest is as detected.
    unchanged = {"family", "line", "width", "dispenser", "zones", "outdoor", "generic"}
    assert {key: spec[key] for key in unchanged} == {key: detected[key] for key in unchanged}


@pytest.mark.parametrize(
    ("data", "key", "value", "code"),
    [
        ({"sabbath_on": True, "ref_set_temp": 38}, "ref_set_temp", None, "sabbath"),
        ({"mode": 2, "wash_cycle": 2}, "wash_cycle", None, "sabbath"),
        ({"cav_cook_mode": 11, "cav_set_temp": 880}, "cav_set_temp", None, "self_clean"),
        ({"cav_cook_mode": 11, "cav_unit_on": False}, "cav_unit_on", True, "self_clean"),
        ({"cav_unit_on": True, "cav_cook_mode": 9}, "cav_light_on", None, "proof_light"),
        ({"wash_status": 2, "wash_cycle": 2}, "heated_dry_on", None, "wash_not_idle"),
        ({"wash_status": 0, "wash_cycle": 9}, "heated_dry_on", None, "cycle_no_option"),
        ({"wash_status": 2, "wash_cycle": 2}, "delay_start_timer_duration", None, "delay_not_idle"),
        ({"wash_status": 0, "wash_cycle": 4}, "delay_start_timer_duration", None, "cycle_no_delay"),
    ],
)
def test_each_lock_has_a_code_and_keeps_its_message(data, key, value, code):
    reason = control_lock_reason(data, key, value)
    assert reason is not None and reason[0] == code
    assert control_lock(data, key, value) == reason[1]


@pytest.mark.parametrize(
    ("data", "key", "value"),
    [
        ({"sabbath_on": True}, "sabbath_on", None),
        ({"sabbath_on": True}, "high_use_on", False),
        ({"cav_cook_mode": 11, "cav_unit_on": True}, "cav_unit_on", False),
        ({"wash_status": 1, "wash_cycle": 2}, "heated_dry_on", None),
    ],
)
def test_unlocked_controls_have_no_code(data, key, value):
    assert control_lock_reason(data, key, value) is None
    assert control_lock(data, key, value) is None


@pytest.mark.parametrize(
    ("data", "key", "code"),
    [
        # Buttons are locked as the setting they change.
        ({"cav_cook_mode": 11, "cav_unit_on": False}, "remote_start_cav_unit_on", "self_clean"),
        ({"cav_cook_mode": 11, "cav_unit_on": True}, "cav_unit_on", None),
        ({"mode": 2, "wash_cycle_on": True}, "cancel_wash_cycle", "sabbath"),
        ({"sabbath_on": True, "kitchen_timer_active": True}, "dismiss_kitchen_timer", "sabbath"),
        # The mode select only switches modes, which Sabbath mode allows turning off.
        ({"sabbath_on": True, "high_use_on": False}, "operating_mode", None),
        ({"sabbath_on": True, "ice_maker_on": True}, "ice_maker_mode", "sabbath"),
        ({"sabbath_on": False, "ice_maker_on": True}, "ice_maker_mode", None),
    ],
)
def test_lock_codes_follow_how_entities_check_their_keys(data, key, code):
    assert lock_code(data, key) == code
