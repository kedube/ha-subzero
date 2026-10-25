"""Synthetic fixtures; tests never use the owner's saved account data."""

import asyncio
import time
from functools import partial
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import jwt
import pytest
from homeassistant.helpers import device_registry as dr
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.subzero.api import Appliance, StateUpdate, SubZeroClient, token_state
from custom_components.subzero.const import DOMAIN

pytest_plugins = ["pytest_homeassistant_custom_component"]


def make_tokens(user_id="test-owner", *, expires_in=3600, refresh_token="test-refresh"):
    return {
        **{
            name: jwt.encode(
                {"mergedId": user_id, "exp": int(time.time()) + expires_in, "token_use": name},
                "synthetic-key-for-tests-only-32-bytes",
                algorithm="HS256",
            )
            for name in ("access_token", "id_token")
        },
        "refresh_token": refresh_token,
    }


@pytest.fixture
def tokens():
    return make_tokens()


@pytest.fixture(autouse=True)
def fast_timeouts(monkeypatch):
    monkeypatch.setattr("custom_components.subzero.coordinator.INITIAL_STATE_TIMEOUT", 0)
    monkeypatch.setattr("custom_components.subzero.coordinator.SNAPSHOT_TIMEOUT", 0)
    monkeypatch.setattr("custom_components.subzero.coordinator.CONTROL_CONFIRM_TIMEOUT", 0.05)
    monkeypatch.setattr("custom_components.subzero.coordinator.CONTROL_PUSH_TIMEOUT", 0.01)


@pytest.fixture(autouse=True)
def prevent_firebase_network(monkeypatch):
    """Most tests exercise appliance state without opening a real FCM connection."""
    monkeypatch.setattr("custom_components.subzero.fcm.FcmAlerts.start", lambda self: None)


@pytest.fixture
async def cloud_appliance(hass, tokens, request, enable_custom_integrations):
    state = dict(request.param)
    entry = MockConfigEntry(
        domain=DOMAIN,
        version=2,
        minor_version=5,
        title="Account",
        data={
            "tokens": token_state(tokens),
            "devices": {"appliance": {"name": "Kitchen", "temperature_unit": "F"}},
        },
        options={"firebase_alerts": True},
    )
    entry.add_to_hass(hass)
    updates = asyncio.Queue()

    async def watch(device_ids):
        while True:
            yield await updates.get()

    async def update(properties, *, full=False):
        if full:
            state.clear()
        state.update(properties)
        await updates.put(("appliance", StateUpdate(dict(properties), full=full)))
        await hass.async_block_till_done()

    async def write(device_id, key, value):
        state[key] = value
        await updates.put((device_id, StateUpdate({key: value}, full=False)))

    async def delay(device_id, duration, start_offset, recurring):
        state["delay_duration"] = duration
        if duration:
            state.update(delay_start_offset=start_offset, delay_recurring=recurring)

    async def exit_delay(device_id):
        state["delay_active"] = False
        return dict(state)

    with patch("custom_components.subzero.SubZeroClient") as factory:
        client = factory.return_value
        client.tokens = token_state(tokens)
        client.push_connected = True
        client.appliances = AsyncMock(return_value=[Appliance("appliance", "Kitchen", "F")])
        client.state = AsyncMock(side_effect=lambda device_id: dict(state))
        client.open_channel = AsyncMock()
        client.set_property = AsyncMock(side_effect=write)
        client.set_ice_delay = AsyncMock(side_effect=delay)
        client.exit_ice_delay = AsyncMock(side_effect=exit_delay)
        client.appliance_faults = AsyncMock(return_value=[])
        # Built on the mocked alert requests that each test sets up.
        client.unsubscribe_all_alerts = partial(SubZeroClient.unsubscribe_all_alerts, client)
        client.watch = watch
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        device = next(
            device
            for device in dr.async_entries_for_config_entry(dr.async_get(hass), entry.entry_id)
            if (DOMAIN, "appliance") in device.identifiers
        )
        yield SimpleNamespace(
            entry=entry,
            client=client,
            state=state,
            update=update,
            coordinator=entry.runtime_data.coordinators["appliance"],
            device_id=device.id,
        )
        # Unless the test removed the entry.
        if hass.config_entries.async_get_entry(entry.entry_id) is not None:
            await hass.config_entries.async_unload(entry.entry_id)
            await hass.async_block_till_done()


# Synthetic states with the properties the owner's five appliance models report; the values
# are made up. Status reads report the clock in UTC.
_STATUS = {
    "ap_rssi": -60,
    "service_required": False,
    "time": "2026-10-24T14:00:00+00:00",
    "uptime": "120:00:00",
    "version": {"fw": "1.0"},
}
APPLIANCE_STATES = {
    "CL4850SID": {
        **_STATUS,
        "appliance_model": "CL4850SID",
        "appliance_type": "17.11.3.3",
        "air_filter_on": True,
        "air_filter_pct_remaining": 60,
        "crisp_set_temp": 36,
        "crisp_temp_mode": 1,
        "door_ajar_timeout": 2,
        "frz_door_ajar": False,
        "frz_set_temp": 0,
        "high_use_end_time": None,
        "high_use_on": False,
        "high_use_start_time": None,
        "humidity_control": 1,
        "ice_maker_on": True,
        "long_vacation_on": False,
        "max_ice_end_time": None,
        "max_ice_on": False,
        "max_ice_start_time": None,
        "night_ice_on": False,
        "night_mode": 0,
        "ref_door_ajar": False,
        "ref_set_temp": 38,
        "sabbath_on": False,
        "short_vacation_on": False,
        "unit_on": True,
        "water_filter_pct_remaining": 80,
    },
    "DF48850SP": {
        **_STATUS,
        "appliance_model": "DF48850SP",
        "appliance_type": "17.8.2.0",
        **{
            f"{prefix}_{key}": value
            for prefix, set_temp in (("cav", 350), ("cav2", 0))
            for key, value in {
                "at_set_temp": False,
                "cook_mode": 0,
                "cook_timer_complete": False,
                "door_ajar": False,
                "gourmet_mode_on": False,
                "gourmet_recipe": 0,
                "light_on": False,
                "mode_change_enabled": True,
                "probe_at_set_temp": False,
                "probe_on": False,
                "probe_set_temp": 0,
                "probe_temp": 0,
                "remote_ready": False,
                "set_temp": set_temp,
                "temp": 75,
                "unit_on": False,
            }.items()
        },
        "door_ajar_timeout": 2,
        **{
            f"{prefix}_{key}": value
            for prefix in ("kitchen_timer", "kitchen_timer2")
            for key, value in {
                "active": False,
                "complete": False,
                "end_time": None,
                "start_time": None,
            }.items()
        },
        "sabbath_on": False,
    },
    "DW2450": {
        **_STATUS,
        "appliance_model": "DW2450",
        "appliance_type": "17.6.1.0",
        "delay_start_timer_active": False,
        "delay_start_timer_duration": 0,
        "delay_start_timer_end_time": None,
        "delay_start_timer_start_time": None,
        "door_ajar": False,
        "door_ajar_timeout": 2,
        "extended_dry_on": False,
        "heated_dry_on": False,
        "high_temp_wash_on": False,
        "light_on": False,
        "mode": 0,
        "remote_ready": False,
        "rinse_aid_low": False,
        "sani_rinse_on": False,
        "top_rack_only_on": False,
        "wash_cycle": 2,
        "wash_cycle_end_time": None,
        "wash_cycle_on": False,
        "wash_status": 0,
    },
    "DEU2450BG": {
        **_STATUS,
        "appliance_model": "DEU2450BG",
        "appliance_type": "17.13.3.1",
        "accent_light_level": 130,
        "door_ajar_timeout": 2,
        "high_use_end_time": None,
        "high_use_on": False,
        "high_use_start_time": None,
        "long_vacation_on": False,
        "ref_door_ajar": False,
        "ref_set_temp": 38,
        "sabbath_on": False,
        "short_vacation_on": False,
        "unit_on": True,
    },
    "DEU2450WDZ": {
        **_STATUS,
        "appliance_model": "DEU2450WDZ",
        "appliance_type": "17.14.2.0",
        "accent_light_level": 130,
        "door_ajar_timeout": 2,
        "sabbath_on": False,
        "unit_on": True,
        "wine2_set_temp": 55,
        "wine_door_ajar": False,
        "wine_set_temp": 45,
        "wine_temp_alert_on": False,
    },
}
