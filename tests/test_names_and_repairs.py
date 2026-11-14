"""Translated entity names, repairs, and what the entities tell Home Assistant about themselves."""

import asyncio
import importlib
import json
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.config_entries import ConfigEntryState
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers import issue_registry as ir

from custom_components.subzero import PLATFORMS
from custom_components.subzero.api import ApiError, Appliance, token_state
from custom_components.subzero.const import DOMAIN
from custom_components.subzero.coordinator import firebase_alerts_issue, removed_appliance_issue
from custom_components.subzero.entity import zone_variants
from custom_components.subzero.fcm import FAILURES_BEFORE_REPAIR
from custom_components.subzero.sensor import SubZeroActiveFaultsSensor
from tests.common import MockConfigEntry

from .conftest import APPLIANCE_STATES

pytestmark = pytest.mark.usefixtures("enable_custom_integrations")
INTEGRATION = Path(__file__).parents[1] / "custom_components" / "subzero"
FRIDGE = APPLIANCE_STATES["CL4850SID"]
RANGE = APPLIANCE_STATES["DF48850SP"]
WINE = APPLIANCE_STATES["DEU2450WDZ"]


def entity_names() -> dict[str, dict[str, str]]:
    """Every name an entity can take, by platform and translation key.

    Each platform hands its descriptions to `async_setup_entities`, so setting one up with
    that replaced, and no appliances, lists them all. A cavity or zone entity also has the
    names its appliance's layout can give it, each under its own key.
    """
    names: dict[str, dict[str, str]] = {}
    for platform in PLATFORMS:
        module = importlib.import_module(f"custom_components.subzero.{platform.value}")
        found = names.setdefault(platform.value, {})

        def capture(entry, add, descriptions, entity_class, supported, found=found):
            own = {description.key: description.name for description in descriptions}
            for description in descriptions:
                key = description.translation_key or description.key
                found[key] = description.name
                for variant, name in zone_variants(description.key, own).items():
                    found[f"{key}_{variant}"] = name

        entry = SimpleNamespace(
            runtime_data=SimpleNamespace(coordinators={}, fault_coordinators={})
        )
        with patch.object(module, "async_setup_entities", capture):
            asyncio.run(module.async_setup_entry(None, entry, lambda entities: list(entities)))
    description = SubZeroActiveFaultsSensor.entity_description
    names["sensor"][description.translation_key] = description.name
    return names


def translated(language: str) -> dict:
    name = "strings.json" if language is None else f"translations/{language}.json"
    return json.loads((INTEGRATION / name).read_text(encoding="utf-8"))


def test_every_entity_name_has_its_string():
    """strings.json names each entity as its description does, and nothing else."""
    names = entity_names()
    assert sum(len(platform) for platform in names.values()) > 200
    entity = translated(None)["entity"]
    assert {
        platform: {key: value["name"] for key, value in keys.items()}
        for platform, keys in entity.items()
    } == names
    # The layouts' names are there with the rest.
    assert entity["sensor"]["cav_temp_right"]["name"] == "Right oven temperature"
    assert entity["climate"]["cav2_set_temp_left"]["name"] == "Left oven"
    assert entity["binary_sensor"]["wine2_door_ajar_lower"]["name"] == "Lower wine storage door"
    assert entity["number"]["kitchen_timer_duration_first"]["name"] == "Kitchen timer 1 duration"
    assert entity["button"]["dismiss_kitchen_timer_first"]["name"] == "Dismiss kitchen timer 1"


def entity_state(hass, entry, domain: str, key: str):
    entity_id = er.async_get(hass).async_get_entity_id(domain, DOMAIN, f"appliance_{key}")
    assert entity_id is not None, key
    return hass.states.get(entity_id)


@pytest.fixture
def german(hass):
    hass.config.language = "de"


@pytest.mark.parametrize("cloud_appliance", [RANGE], indirect=True)
async def test_names_follow_home_assistants_language(hass, german, cloud_appliance):
    names = translated("de")["entity"]
    entry = cloud_appliance.entry
    for domain, key, translation_key in (
        ("sensor", "ap_rssi", "ap_rssi"),
        ("sensor", "active_faults", "active_faults"),
        ("event", "appliance_event", "appliance_event"),
        # A range's two ovens are its right and left ones.
        ("sensor", "cav_temp", "cav_temp_right"),
        ("climate", "cav2_set_temp", "cav2_set_temp_left"),
        ("button", "remote_start_cav_unit_on", "remote_start_cav_unit_on_right"),
        # And its second kitchen timer makes the other the first.
        ("number", "kitchen_timer_duration", "kitchen_timer_duration_first"),
        ("number", "kitchen_timer2_duration", "kitchen_timer2_duration"),
    ):
        state = entity_state(hass, entry, domain, key)
        expected = names[domain][translation_key]["name"]
        assert state.attributes["friendly_name"] == f"Kitchen {expected}", key


@pytest.mark.parametrize("cloud_appliance", [WINE], indirect=True)
async def test_english_names_and_entity_ids_stay_as_they_were(hass, cloud_appliance):
    registry = er.async_get(hass)
    for domain, key, entity_id, name in (
        ("climate", "wine_set_temp", "climate.kitchen_upper_wine", "Kitchen Upper wine"),
        ("climate", "wine2_set_temp", "climate.kitchen_lower_wine", "Kitchen Lower wine"),
        (
            "binary_sensor",
            "wine_door_ajar",
            "binary_sensor.kitchen_wine_storage_door",
            "Kitchen Wine storage door",
        ),
        ("sensor", "active_faults", "sensor.kitchen_active_faults", "Kitchen Active faults"),
    ):
        assert registry.async_get_entity_id(domain, DOMAIN, f"appliance_{key}") == entity_id
        assert hass.states.get(entity_id).attributes["friendly_name"] == name


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_appliance_missing_from_the_account_raises_a_repair(hass, cloud_appliance):
    entry, client = cloud_appliance.entry, cloud_appliance.client
    issues = ir.async_get(hass)
    issue_id = removed_appliance_issue(entry.entry_id, "appliance")

    async def reload():
        assert await hass.config_entries.async_reload(entry.entry_id)
        await hass.async_block_till_done()
        return issues.async_get_issue(DOMAIN, issue_id)

    assert issues.async_get_issue(DOMAIN, issue_id) is None
    client.appliances.return_value = []
    issue = await reload()
    assert issue.translation_key == "appliance_removed"
    assert issue.translation_placeholders == {"name": "Kitchen"}
    assert issue.severity is ir.IssueSeverity.WARNING
    assert not issue.is_fixable

    # A list that can't be read says nothing either way.
    client.appliances.side_effect = ApiError("Could not connect to Sub-Zero.")
    assert await reload() is not None

    # Back on the account.
    client.appliances.side_effect = None
    client.appliances.return_value = [Appliance("appliance", "Kitchen", "F")]
    assert await reload() is None

    # Removing the entry takes its repairs with it.
    client.appliances.return_value = []
    assert await reload() is not None
    await hass.config_entries.async_remove(entry.entry_id)
    await hass.async_block_till_done()
    assert issues.async_get_issue(DOMAIN, issue_id) is None


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_firebase_that_cannot_be_set_up_raises_a_repair(hass, cloud_appliance, monkeypatch):
    entry = cloud_appliance.entry
    manager = entry.runtime_data.alerts
    issues = ir.async_get(hass)
    issue_id = firebase_alerts_issue(entry.entry_id)
    attempts = 0
    working = False

    class FakePush:
        def __init__(self, callback, config, credentials, save, **kwargs):
            self.do_listen = False
            self.tasks = []
            self.credentials = {"fcm": {"registration": {"token": "test-token"}}}

        async def checkin_or_register(self):
            nonlocal attempts
            attempts += 1
            if not working:
                raise OSError("No route to host")
            return "test-token"

        async def start(self):
            self.do_listen = True

        async def stop(self):
            self.do_listen = False

    async def sync(psid, token):
        return True

    async def until(condition):
        async with asyncio.timeout(1):
            while not condition():
                await asyncio.sleep(0.005)

    monkeypatch.setattr("custom_components.subzero.fcm.PushClient", FakePush)
    monkeypatch.setattr("custom_components.subzero.fcm.RETRY_INTERVAL", 0.01)
    monkeypatch.setattr("custom_components.subzero.fcm.HEALTH_CHECK_INTERVAL", 0.01)
    monkeypatch.setattr(manager, "_sync", sync)
    manager._task = asyncio.create_task(manager._run())
    try:
        # One failure is a blip, so the repair waits for several in a row.
        await until(lambda: attempts == 1)
        assert issues.async_get_issue(DOMAIN, issue_id) is None
        await until(lambda: attempts > FAILURES_BEFORE_REPAIR)
        issue = issues.async_get_issue(DOMAIN, issue_id)
        assert issue.translation_key == "firebase_alerts_failing"
        assert issue.translation_placeholders == {"name": "Account"}
        assert manager.last_error == "OSError"

        working = True
        await until(lambda: issues.async_get_issue(DOMAIN, issue_id) is None)
        assert manager.last_error is None
    finally:
        await manager.stop()


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_turning_firebase_alerts_off_clears_their_repair(hass, cloud_appliance):
    entry = cloud_appliance.entry
    issues = ir.async_get(hass)
    issue_id = firebase_alerts_issue(entry.entry_id)
    for _ in range(FAILURES_BEFORE_REPAIR):
        entry.runtime_data.alerts._attempt_failed()
    assert issues.async_get_issue(DOMAIN, issue_id) is not None

    hass.config_entries.async_update_entry(entry, options={})
    assert await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert issues.async_get_issue(DOMAIN, issue_id) is None


@pytest.mark.parametrize("cloud_appliance", [RANGE], indirect=True)
async def test_an_oven_says_what_it_is_doing(hass, cloud_appliance):
    entry = cloud_appliance.entry

    def action():
        return entity_state(hass, entry, "climate", "cav_set_temp").attributes.get("hvac_action")

    assert action() == "off"
    await cloud_appliance.update({"cav_unit_on": True, "cav_cook_mode": 1, "cav_set_temp": 350})
    assert action() == "preheating"
    await cloud_appliance.update({"cav_at_set_temp": True})
    assert action() == "heating"
    await cloud_appliance.update({"cav_unit_on": False, "cav_at_set_temp": False})
    assert action() == "off"


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_refrigeration_has_no_action_and_keeps_statistics(hass, cloud_appliance):
    entry = cloud_appliance.entry
    # Nothing says whether the compressor is running.
    assert "hvac_action" not in entity_state(hass, entry, "climate", "ref_set_temp").attributes
    await cloud_appliance.update({"ref_display_temp": 38, "frz_display_temp": 0})
    for key in (
        "ref_display_temp",
        "frz_display_temp",
        "air_filter_pct_remaining",
        "water_filter_pct_remaining",
    ):
        state = entity_state(hass, entry, "sensor", key)
        assert state.attributes["state_class"] == "measurement", key
    # A setting is not a measurement.
    assert "state_class" not in entity_state(hass, entry, "sensor", "ref_set_temp").attributes


def test_fault_details_stay_out_of_the_recorder():
    assert SubZeroActiveFaultsSensor._unrecorded_attributes == frozenset({"faults"})


async def test_appliances_without_a_snapshot_are_read_together(hass, tokens):
    """Setup takes as long as the slowest appliance to answer, not all of them in turn."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        version=2,
        minor_version=5,
        title="Account",
        data={
            "tokens": token_state(tokens),
            "devices": {
                device_id: {"name": name, "temperature_unit": "F"}
                for device_id, name in (("one", "Kitchen"), ("two", "Pantry"))
            },
        },
    )
    entry.add_to_hass(hass)
    reading: set[str] = set()
    together = asyncio.Event()

    async def state(device_id):
        reading.add(device_id)
        if len(reading) == 2:
            together.set()
        # Read one at a time, the first would wait here for a second that never starts.
        async with asyncio.timeout(1):
            await together.wait()
        return {"appliance_model": "CL4850SID", "ref_set_temp": 38}

    async def watch(device_ids):
        await asyncio.Event().wait()
        yield

    with patch("custom_components.subzero.SubZeroClient") as factory:
        client = factory.return_value
        client.tokens = token_state(tokens)
        client.push_connected = True
        client.appliances = AsyncMock(
            return_value=[Appliance("one", "Kitchen", "F"), Appliance("two", "Pantry", "F")]
        )
        client.state = AsyncMock(side_effect=state)
        client.appliance_faults = AsyncMock(return_value=[])
        client.watch = watch
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        assert together.is_set()
        assert entry.state is ConfigEntryState.LOADED
        assert all(
            coordinator.last_update_success
            for coordinator in entry.runtime_data.coordinators.values()
        )
        await hass.config_entries.async_unload(entry.entry_id)
        await hass.async_block_till_done()
