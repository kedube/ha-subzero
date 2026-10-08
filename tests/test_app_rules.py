"""Controls, readings, and names that follow the Sub-Zero app's own rules."""

import pytest
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import entity_registry as er
from homeassistant.util.unit_system import US_CUSTOMARY_SYSTEM

from custom_components.subzero.const import (
    DISHWASHER_OPTION_EXCLUDED_CYCLES,
    DISHWASHER_SWITCHES,
    DOMAIN,
    WASH_CYCLES,
)

RANGE = {
    "appliance_model": "DF48850SP",
    "appliance_type": "17.8.2.0",
    **{
        f"{prefix}_{key}": value
        for prefix in ("cav", "cav2")
        for key, value in {
            "temp": 75,
            "set_temp": 350,
            "unit_on": False,
            "cook_mode": 1,
            "light_on": False,
            "door_ajar": False,
            "remote_ready": True,
            "probe_on": False,
            "probe_temp": 0,
            "probe_set_temp": 0,
            "mode_change_enabled": True,
        }.items()
    },
    "sabbath_on": False,
}
DUAL_ZONE_WINE = {
    "appliance_model": "DEU2450WDZ",
    "appliance_type": "17.14.2.0",
    "wine_set_temp": 40,
    "wine2_set_temp": 55,
    "wine_door_ajar": False,
    "wine_temp_alert_on": False,
    "accent_light_level": 130,
    "sabbath_on": False,
}
FRIDGE = {
    "appliance_model": "CL4850SID",
    "appliance_type": "17.11.3.3",
    "ref_set_temp": 38,
    "frz_set_temp": -1,
    "air_filter_on": True,
    "air_filter_pct_remaining": 60,
    "sabbath_on": False,
    "high_use_on": False,
}
DISHWASHER = {
    "appliance_model": "DW2450",
    "appliance_type": "17.6.1.0",
    "wash_cycle": 1,
    "wash_status": 1,
    "wash_cycle_on": False,
    "door_ajar": False,
    "remote_ready": False,
    "mode": 0,
    "delay_start_timer_duration": 0,
    "delay_start_timer_active": False,
    **dict.fromkeys(DISHWASHER_SWITCHES, False),
}
OPTION_ENTITIES = {
    "heated_dry_on": "switch.kitchen_extra_dry",
    "extended_dry_on": "switch.kitchen_extended_dry",
    "high_temp_wash_on": "switch.kitchen_high_temp_wash",
    "sani_rinse_on": "switch.kitchen_sani_rinse",
    "top_rack_only_on": "switch.kitchen_top_rack_only",
}


@pytest.fixture(autouse=True)
def fahrenheit(hass):
    hass.config.units = US_CUSTOMARY_SYSTEM


def state(hass, entity_id):
    return hass.states.get(entity_id).state


@pytest.mark.parametrize("cloud_appliance", [RANGE], indirect=True)
async def test_a_range_names_its_cavities_right_and_left(hass, cloud_appliance):
    for entity_id, name in (
        ("climate.kitchen_right_oven", "Right oven"),
        ("climate.kitchen_left_oven", "Left oven"),
        ("sensor.kitchen_right_oven_temperature", "Right oven temperature"),
        ("sensor.kitchen_left_oven_temperature", "Left oven temperature"),
        ("select.kitchen_right_oven_cooking_mode", "Right oven cooking mode"),
        ("switch.kitchen_left_oven_light", "Left oven light"),
        ("button.kitchen_start_right_oven", "Start right oven"),
        ("binary_sensor.kitchen_right_oven_door", "Right oven door"),
        ("sensor.kitchen_left_oven_broil_level", "Left oven broil level"),
    ):
        assert hass.states.get(entity_id).attributes["friendly_name"] == f"Kitchen {name}"


@pytest.mark.parametrize("cloud_appliance", [RANGE], indirect=True)
async def test_oven_temperature_shows_only_while_cooking(hass, cloud_appliance):
    # Like the app, which shows Off, and Clean during self clean.
    await cloud_appliance.update({"cav_temp": 403})
    assert state(hass, "sensor.kitchen_right_oven_temperature") == "unknown"
    assert hass.states.get("climate.kitchen_right_oven").attributes["current_temperature"] is None
    await cloud_appliance.update({"cav_unit_on": True})
    assert state(hass, "sensor.kitchen_right_oven_temperature") == "403"
    assert hass.states.get("climate.kitchen_right_oven").attributes["current_temperature"] == 403
    await cloud_appliance.update({"cav_cook_mode": 11})
    assert state(hass, "sensor.kitchen_right_oven_temperature") == "unknown"


@pytest.mark.parametrize("cloud_appliance", [RANGE], indirect=True)
async def test_a_probe_temperature_of_one_is_no_reading(hass, cloud_appliance):
    entity_id = "sensor.kitchen_right_oven_probe_temperature"
    await cloud_appliance.update({"cav_probe_on": True, "cav_probe_temp": 1})
    assert state(hass, entity_id) == "unknown"
    await cloud_appliance.update({"cav_probe_temp": 120})
    assert state(hass, entity_id) == "120"


@pytest.mark.parametrize("cloud_appliance", [RANGE], indirect=True)
async def test_broil_level_follows_the_broil_setpoint(hass, cloud_appliance):
    entity_id = "sensor.kitchen_right_oven_broil_level"
    assert state(hass, entity_id) == "unknown"
    await cloud_appliance.update({"cav_unit_on": True, "cav_cook_mode": 3})
    for temperature, level in ((350, "Low"), (400, "Medium"), (499, "Medium"), (500, "High")):
        await cloud_appliance.update({"cav_set_temp": temperature})
        assert state(hass, entity_id) == level
    await cloud_appliance.update({"cav_cook_mode": 1})
    assert state(hass, entity_id) == "unknown"
    assert hass.states.get(entity_id).attributes["options"] == ["Low", "Medium", "High"]


@pytest.mark.parametrize("cloud_appliance", [RANGE], indirect=True)
async def test_self_clean_allows_only_turning_the_oven_off(hass, cloud_appliance):
    await cloud_appliance.update(
        {"cav2_unit_on": True, "cav2_cook_mode": 11, "cav2_remote_ready": False}
    )
    for entity_id in (
        "select.kitchen_right_oven_cooking_mode",
        "select.kitchen_left_oven_cooking_mode",
        "switch.kitchen_right_oven_light",
        "button.kitchen_start_right_oven",
    ):
        assert state(hass, entity_id) == "unavailable"
    assert state(hass, "climate.kitchen_left_oven") == "heat"
    coordinator = cloud_appliance.coordinator
    with pytest.raises(ServiceValidationError, match="self-cleaning"):
        await coordinator.async_set_properties({"cav_light_on": True})
    with pytest.raises(ServiceValidationError, match="self-cleaning"):
        await coordinator.async_start("cav_unit_on")
    cloud_appliance.client.set_property.assert_not_awaited()
    await hass.services.async_call(
        "climate", "turn_off", {"entity_id": "climate.kitchen_left_oven"}, blocking=True
    )
    cloud_appliance.client.set_property.assert_awaited_once_with("appliance", "cav2_unit_on", False)


@pytest.mark.parametrize("cloud_appliance", [RANGE], indirect=True)
async def test_the_oven_light_stays_off_during_proof(hass, cloud_appliance):
    entity_id = "switch.kitchen_right_oven_light"
    await cloud_appliance.update({"cav_unit_on": True, "cav_cook_mode": 9})
    assert state(hass, entity_id) == "unavailable"
    with pytest.raises(ServiceValidationError, match="Proof"):
        await cloud_appliance.coordinator.async_set_properties({"cav_light_on": True})
    assert state(hass, "switch.kitchen_left_oven_light") == "off"
    await cloud_appliance.update({"cav_cook_mode": 1})
    assert state(hass, entity_id) == "off"


@pytest.mark.parametrize("cloud_appliance", [RANGE], indirect=True)
async def test_sabbath_mode_disables_oven_controls(hass, cloud_appliance):
    await cloud_appliance.update({"sabbath_on": True})
    for entity_id in (
        "climate.kitchen_right_oven",
        "select.kitchen_left_oven_cooking_mode",
        "switch.kitchen_right_oven_light",
        "button.kitchen_start_left_oven",
    ):
        assert state(hass, entity_id) == "unavailable"
    assert state(hass, "binary_sensor.kitchen_sabbath_mode") == "on"
    with pytest.raises(ServiceValidationError, match="Sabbath mode is on"):
        await cloud_appliance.coordinator.async_set_properties({"cav_light_on": True})
    cloud_appliance.client.set_property.assert_not_awaited()


@pytest.mark.parametrize("cloud_appliance", [DUAL_ZONE_WINE], indirect=True)
async def test_two_wine_zones_are_upper_and_lower(hass, cloud_appliance):
    for entity_id, name in (
        ("climate.kitchen_upper_wine", "Upper wine"),
        ("climate.kitchen_lower_wine", "Lower wine"),
        ("sensor.kitchen_upper_wine_setpoint", "Upper wine setpoint"),
        ("number.kitchen_lower_wine_setpoint", "Lower wine setpoint"),
        # One door serves both zones.
        ("binary_sensor.kitchen_wine_storage_door", "Wine storage door"),
        ("binary_sensor.kitchen_wine_temperature_alert", "Wine temperature alert"),
    ):
        assert hass.states.get(entity_id).attributes["friendly_name"] == f"Kitchen {name}"
    assert hass.states.get("select.kitchen_accent_light").attributes["options"] == [
        "Off",
        "Low",
        "Medium",
        "High",
    ]
    assert state(hass, "select.kitchen_accent_light") == "High"


@pytest.mark.parametrize(
    "cloud_appliance",
    [{"appliance_model": "DEU2450W", "appliance_type": "17.14.1.0", "wine_set_temp": 55}],
    indirect=True,
)
async def test_a_single_wine_zone_keeps_its_name(hass, cloud_appliance):
    assert hass.states.get("climate.kitchen_wine").attributes["friendly_name"] == "Kitchen Wine"


@pytest.mark.parametrize("cloud_appliance", [DUAL_ZONE_WINE], indirect=True)
async def test_sabbath_mode_disables_wine_controls(hass, cloud_appliance):
    await cloud_appliance.update({"sabbath_on": True})
    for entity_id in (
        "climate.kitchen_upper_wine",
        "number.kitchen_lower_wine_setpoint",
        "select.kitchen_accent_light",
        "select.kitchen_mode",
    ):
        assert state(hass, entity_id) == "unavailable"
    assert state(hass, "sensor.kitchen_upper_wine_setpoint") == "40"


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_only_series_22_offers_an_air_filter_reset(hass, cloud_appliance):
    registry = er.async_get(hass)
    entry = cloud_appliance.entry
    unique_id = "appliance_reset_air_filter"
    assert registry.async_get_entity_id("button", DOMAIN, unique_id) is None
    assert state(hass, "switch.kitchen_air_purification") == "on"
    with pytest.raises(ServiceValidationError, match="at the appliance"):
        await cloud_appliance.coordinator.async_reset_air_filter()
    # A button that earlier versions created is removed.
    await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    stale = registry.async_get_or_create("button", DOMAIN, unique_id, config_entry=entry)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert registry.async_get(stale.entity_id) is None


@pytest.mark.parametrize("cloud_appliance", [FRIDGE], indirect=True)
async def test_sabbath_mode_disables_fridge_controls_and_commands(hass, cloud_appliance):
    await cloud_appliance.update({"sabbath_on": True})
    for entity_id in (
        "climate.kitchen_refrigerator",
        "climate.kitchen_freezer",
        "number.kitchen_refrigerator_setpoint",
        "switch.kitchen_air_purification",
        "select.kitchen_mode",
    ):
        assert state(hass, entity_id) == "unavailable"
    with pytest.raises(ServiceValidationError, match="Sabbath mode is on"):
        await cloud_appliance.coordinator.async_set_properties({"sabbath_on": False})
    cloud_appliance.client.set_property.assert_not_awaited()
    await cloud_appliance.update({"sabbath_on": False})
    assert state(hass, "climate.kitchen_refrigerator") == "cool"


@pytest.mark.parametrize("cloud_appliance", [DISHWASHER], indirect=True)
@pytest.mark.parametrize("cycle", [cycle for cycle in WASH_CYCLES if cycle])
async def test_dishwasher_options_follow_the_selected_cycle(hass, cloud_appliance, cycle):
    await cloud_appliance.update({"wash_cycle": cycle})
    for key, entity_id in OPTION_ENTITIES.items():
        offered = cycle != 9 and cycle not in DISHWASHER_OPTION_EXCLUDED_CYCLES[key]
        assert state(hass, entity_id) == ("off" if offered else "unavailable"), key
        if not offered:
            with pytest.raises(ServiceValidationError, match="does not offer this option"):
                await cloud_appliance.coordinator.async_set_properties({key: True})
    delay_offered = cycle not in {4, 9}
    assert state(hass, "select.kitchen_delay_start") == ("Off" if delay_offered else "unavailable")
    cloud_appliance.client.set_property.assert_not_awaited()


@pytest.mark.parametrize("cloud_appliance", [DISHWASHER], indirect=True)
async def test_dishwasher_options_and_delay_follow_the_wash_status(hass, cloud_appliance):
    await cloud_appliance.update({"wash_status": 7, "wash_cycle_on": False})
    assert state(hass, "select.kitchen_delay_start") == "Off"
    assert state(hass, "switch.kitchen_extra_dry") == "unavailable"
    assert state(hass, "button.kitchen_cancel_wash_cycle") == "unknown"
    with pytest.raises(ServiceValidationError, match="only while the dishwasher is idle"):
        await cloud_appliance.coordinator.async_set_properties({"heated_dry_on": True})
    await cloud_appliance.update({"wash_status": 2, "wash_cycle_on": True})
    assert state(hass, "select.kitchen_delay_start") == "unavailable"
    with pytest.raises(ServiceValidationError, match="idle or delayed"):
        await cloud_appliance.coordinator.async_set_properties({"delay_start_timer_duration": 2})
    # Like the app, a paused cycle cannot be canceled even though the cycle reports on.
    await cloud_appliance.update({"wash_status": 3})
    assert state(hass, "button.kitchen_cancel_wash_cycle") == "unavailable"
    cloud_appliance.client.set_property.assert_not_awaited()


@pytest.mark.parametrize("cloud_appliance", [DISHWASHER], indirect=True)
async def test_dishwasher_sabbath_mode_blocks_cancel(hass, cloud_appliance):
    await cloud_appliance.update({"wash_status": 2, "wash_cycle_on": True, "mode": 2})
    assert state(hass, "button.kitchen_cancel_wash_cycle") == "unavailable"
    with pytest.raises(ServiceValidationError, match="Sabbath mode is on"):
        await cloud_appliance.coordinator.async_cancel_wash()
    cloud_appliance.client.set_property.assert_not_awaited()


@pytest.mark.parametrize("cloud_appliance", [DISHWASHER], indirect=True)
async def test_wash_status_uses_the_app_wording(hass, cloud_appliance):
    entity_id = "sensor.kitchen_wash_status"
    assert state(hass, entity_id) == "Idle"
    assert hass.states.get(entity_id).attributes["options"] == [
        "Idle",
        "Running",
        "Paused",
        "Canceling",
        "Drying",
        "Done",
        "Delayed",
        "Error",
    ]
