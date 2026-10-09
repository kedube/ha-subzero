"""Download appliance capabilities without account or network identifiers."""

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceEntry

from . import SubZeroConfigEntry
from .api import fault_record
from .const import DOMAIN, PRIVATE_KEYS
from .coordinator import (
    SubZeroCoordinator,
    SubZeroFaultsCoordinator,
    firebase_alerts_enabled,
    status_poll_interval,
)


def appliance_diagnostics(
    coordinator: SubZeroCoordinator, faults: SubZeroFaultsCoordinator
) -> dict:
    records = []
    for fault in faults.data or []:
        item = fault_record(fault)
        item["active"] = fault.active
        records.append(item)
    return {
        "available": coordinator.last_update_success,
        "temperature_unit": coordinator.device.get("temperature_unit"),
        # The zone the appliance's times without an offset are read in; None means
        # Home Assistant's, until a push reports the appliance clock.
        "clock_zone": str(coordinator.clock_zone) if coordinator.clock_zone else None,
        "push": {
            **coordinator.push_stats,
            "unpushed_changes": dict(sorted(coordinator.unpushed_changes.items())),
            "recent_silent_channels": list(coordinator.silent_channel_times),
            "recent_connection_renewals": list(coordinator.connection_renewal_times),
            "last_channel_message": coordinator.client.last_messages.get(coordinator.device_id),
        },
        "unrecognized_state_keys": sorted(coordinator.unrecognized_keys),
        "state": async_redact_data(coordinator.data, PRIVATE_KEYS),
        "faults": records,
    }


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: SubZeroConfigEntry
) -> dict:
    account = entry.runtime_data
    alerts = getattr(account, "alerts", None)
    return {
        "connection": "cloud_push",
        "push_connected": account.client.push_connected,
        "status_poll_interval": status_poll_interval(entry),
        "polling_disabled": entry.pref_disable_polling,
        "notifications": dict(account.client.notification_stats),
        "firebase": {
            "enabled": firebase_alerts_enabled(entry),
            "connected": bool(alerts and alerts.push and alerts.push.is_started()),
            "subscriptions_healthy": bool(alerts and alerts.subscription_healthy),
            "last_subscription_sync": alerts.last_sync if alerts else None,
            "received": alerts.received if alerts else 0,
            "last_received": alerts.last_received if alerts else None,
            "last_error": alerts.last_error if alerts else None,
        },
        "appliances": [
            appliance_diagnostics(coordinator, account.fault_coordinators[coordinator.device_id])
            for coordinator in account.coordinators.values()
        ],
    }


async def async_get_device_diagnostics(
    hass: HomeAssistant, entry: SubZeroConfigEntry, device: DeviceEntry
) -> dict:
    account = entry.runtime_data
    return next(
        (
            appliance_diagnostics(coordinator, account.fault_coordinators[device_id])
            for device_id, coordinator in account.coordinators.items()
            if (DOMAIN, device_id) in device.identifiers
        ),
        {},
    )
