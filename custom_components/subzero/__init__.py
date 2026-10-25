"""Sub-Zero, Wolf, and Cove appliance cloud integration."""

import asyncio
import logging
from functools import partial

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.device_registry import DeviceInfo

from .api import ApiError, SubZeroClient
from .app_config import SUBSCRIPTION_KEY
from .auth import InvalidAuth
from .const import CONF_FIREBASE_ALERTS, DISHWASHER_SWITCHES, DOMAIN
from .controls import excluded_entity_keys
from .coordinator import (
    SubZeroAccount,
    SubZeroCoordinator,
    firebase_alerts_enabled,
    selected_devices,
)
from .fcm import FcmAlerts, async_remove_alert_subscriptions
from .frontend import async_add_entry_panel, async_forget_entry_panel, async_remove_entry_panel
from .panel_api import (
    async_panel_entry_removed,
    async_panel_entry_set_up,
    async_panel_entry_unloaded,
    async_remove_unused_appearance,
    async_setup_panel_api,
)
from .services import async_setup_services

PLATFORMS = [
    Platform.SENSOR,
    Platform.BINARY_SENSOR,
    Platform.NUMBER,
    Platform.SELECT,
    Platform.SWITCH,
    Platform.CLIMATE,
    Platform.BUTTON,
    Platform.FAN,
    Platform.LIGHT,
    Platform.EVENT,
]
type SubZeroConfigEntry = ConfigEntry[SubZeroAccount]
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
_LOGGER = logging.getLogger(__name__)
# How long removing the integration waits for Sub-Zero to drop its alert subscriptions.
REMOVE_ALERTS_TIMEOUT = 30


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    async_setup_services(hass)
    async_setup_panel_api(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: SubZeroConfigEntry) -> bool:
    async def save_tokens(tokens: dict) -> None:
        hass.config_entries.async_update_entry(entry, data={**entry.data, "tokens": tokens})

    try:
        client = SubZeroClient(
            async_get_clientsession(hass), SUBSCRIPTION_KEY, entry.data["tokens"], save_tokens
        )
    except InvalidAuth as err:
        raise ConfigEntryAuthFailed(str(err)) from err
    account = SubZeroAccount(hass, entry, client)
    await account.async_setup()
    entry.runtime_data = account
    registry = dr.async_get(hass)
    registered: dict[str, DeviceInfo] = {}

    @callback
    def update_device(coordinator: SubZeroCoordinator) -> None:
        # Coordinators update on every push; the registry needs only changes.
        info = coordinator.device_info
        if registered.get(coordinator.device_id) != info:
            registered[coordinator.device_id] = info
            registry.async_get_or_create(config_entry_id=entry.entry_id, **info)

    for coordinator in account.coordinators.values():
        update_device(coordinator)
        entry.async_on_unload(coordinator.async_add_listener(partial(update_device, coordinator)))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    identifiers = {(DOMAIN, device_id) for device_id in account.coordinators}
    for device in dr.async_entries_for_config_entry(registry, entry.entry_id):
        if not device.identifiers.intersection(identifiers):
            registry.async_remove_device(device.id)
    # Entities left from earlier versions for properties the app discards.
    excluded = {
        f"{coordinator.device_id}_{key}"
        for coordinator in account.coordinators.values()
        for key in excluded_entity_keys(coordinator.data)
    }
    entities = er.async_get(hass)
    for entity in er.async_entries_for_config_entry(entities, entry.entry_id):
        if entity.unique_id in excluded:
            entities.async_remove(entity.entity_id)
    enabled = firebase_alerts_enabled(entry)
    if (enabled and account.coordinators) or entry.data.get("fcm_registration_ids"):
        account.alerts = FcmAlerts(hass, entry, client, account.coordinators)
        if enabled and account.coordinators:
            account.alerts.start()
        elif entry.data.get("fcm_registration_ids"):
            account.alerts.start_cleanup()
    # The sidebar panel, best effort: every entity works without it.
    await async_add_entry_panel(hass, entry)
    await async_remove_unused_appearance(hass)
    async_panel_entry_set_up(hass, entry)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: SubZeroConfigEntry) -> bool:
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded and (alerts := getattr(entry.runtime_data, "alerts", None)) is not None:
        await alerts.stop()
    if unloaded:
        # Usually to reload: the panel keeps the appliances, unavailable, until they're back.
        async_panel_entry_unloaded(hass, entry)
        await async_remove_entry_panel(hass, entry)
    return unloaded


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Clean up after an integration entry that was removed.

    The panel lets the removed appliances go, with their Appearance settings, and Sub-Zero
    stops sending Firebase alerts to the entry.
    """
    async_panel_entry_removed(hass, entry.entry_id)
    await async_forget_entry_panel(hass, entry.entry_id)
    await async_remove_unused_appearance(hass)
    psid = entry.data.get("fcm_psid")
    device_ids = entry.data.get("fcm_registration_ids") or {}
    if not isinstance(psid, str) or not psid or not device_ids:
        return

    def failed(device_id: str, error: ApiError) -> None:
        _LOGGER.warning(
            "Could not remove Sub-Zero alert subscriptions for %s: %s", device_id, error
        )

    try:
        client = SubZeroClient(
            async_get_clientsession(hass), SUBSCRIPTION_KEY, entry.data["tokens"]
        )
        async with asyncio.timeout(REMOVE_ALERTS_TIMEOUT):
            await async_remove_alert_subscriptions(client, psid, device_ids, failed=failed)
    except (InvalidAuth, TimeoutError) as error:
        _LOGGER.warning("Could not remove Sub-Zero alert subscriptions: %s", type(error).__name__)


async def async_migrate_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    if entry.version > 2:
        return False
    if entry.version == 1:
        devices = selected_devices(entry)
        previously_disabled = {
            f"{device_id}_{key}"
            for device_id in devices
            for key in (
                "night_ice_on",
                "sabbath_on",
                "high_use_on",
                "short_vacation_on",
                "long_vacation_on",
                "ap_rssi",
            )
        }
        registry = er.async_get(hass)
        for entity in er.async_entries_for_config_entry(registry, entry.entry_id):
            if (
                entity.unique_id in previously_disabled
                and entity.disabled_by is er.RegistryEntryDisabler.INTEGRATION
            ):
                registry.async_update_entity(entity.entity_id, disabled_by=None)
        hass.config_entries.async_update_entry(
            entry,
            data={"tokens": entry.data["tokens"], "devices": devices},
            version=2,
        )
    if entry.minor_version < 2:
        removed_binary_ids = {
            f"{device_id}_{key}"
            for device_id in selected_devices(entry)
            for key in {"air_filter_on", "cav_light_on", "cav2_light_on", *DISHWASHER_SWITCHES}
        }
        removed_sensor_ids = {
            f"{device_id}_connection_mode" for device_id in selected_devices(entry)
        }
        registry = er.async_get(hass)
        for entity in er.async_entries_for_config_entry(registry, entry.entry_id):
            if (
                entity.domain == "binary_sensor"
                and entity.unique_id in removed_binary_ids
                or entity.domain == "sensor"
                and entity.unique_id in removed_sensor_ids
            ):
                registry.async_remove(entity.entity_id)
        hass.config_entries.async_update_entry(entry, minor_version=2)
    if entry.minor_version < 3:
        removed_number_ids = {
            f"{device_id}_accent_light_level" for device_id in selected_devices(entry)
        }
        registry = er.async_get(hass)
        for entity in er.async_entries_for_config_entry(registry, entry.entry_id):
            if entity.domain == "number" and entity.unique_id in removed_number_ids:
                registry.async_remove(entity.entity_id)
        hass.config_entries.async_update_entry(entry, minor_version=3)
    if entry.minor_version < 4:
        options = dict(entry.options)
        if CONF_FIREBASE_ALERTS not in options and entry.data.get("fcm_registration_ids"):
            # Firebase alerts became opt-in. Entries already receiving them, which had
            # them on by default, keep them on.
            options[CONF_FIREBASE_ALERTS] = True
        hass.config_entries.async_update_entry(entry, options=options, minor_version=4)
    if entry.minor_version < 5:
        # Periodic channel checks gave way to push only, with checks after events.
        options = {
            key: value for key, value in entry.options.items() if key != "status_poll_interval"
        }
        hass.config_entries.async_update_entry(entry, options=options, minor_version=5)
    return True
