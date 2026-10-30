"""Push updates with bounded reconnect attempts."""

import asyncio
import logging
import random
import time
from collections import deque
from collections.abc import AsyncIterator, Callable, Collection
from contextlib import asynccontextmanager
from contextvars import ContextVar
from datetime import datetime, timedelta, tzinfo

from homeassistant.config_entries import ConfigEntry, ConfigEntryState
from homeassistant.core import CALLBACK_TYPE, HassJob, HomeAssistant, callback
from homeassistant.exceptions import (
    ConfigEntryAuthFailed,
    ConfigEntryNotReady,
    HomeAssistantError,
    ServiceValidationError,
)
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.event import async_call_later
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .api import (
    ApiError,
    ApplianceFault,
    ChannelOpened,
    RateLimited,
    StateUpdate,
    SubZeroClient,
    notification_records,
    validate_ice_delay,
)
from .auth import InvalidAuth
from .const import (
    CONF_FIREBASE_ALERTS,
    CONF_FOLLOW_UP_CHECK_INTERVAL,
    CONF_FOLLOW_UP_CHECKS,
    CONF_SHARED_CONNECTION_CHECK,
    CONF_SHARED_CONNECTION_CHECK_INTERVAL,
    CONF_SHOW_SIDEBAR_PANEL,
    CONTROL_CONFIRM_TIMEOUT,
    CONTROL_PUSH_TIMEOUT,
    DEFAULT_FOLLOW_UP_CHECK_MINUTES,
    DEFAULT_SHARED_CHECK_MINUTES,
    DEFAULT_SHOW_SIDEBAR_PANEL,
    DOMAIN,
    DOOR_KEYS,
    FAULT_METADATA_APPLIES_TO_BY_SERIES,
    FOLLOW_UP_CHECK_MINUTES,
    ICE_DELAY_KEYS,
    KITCHEN_TIMERS,
    MAX_EVENT_HISTORY,
    MAX_RECONNECT_DELAY,
    PRIVATE_KEYS,
    RECONNECT_DELAY,
    SHARED_CHECK_MINUTES,
    STATE_KEYS,
    UNCOMPARED_READ_KEYS,
)
from .controls import (
    SABBATH_LOCKED,
    appliance_brand,
    appliance_datetime,
    appliance_type,
    clock_zone,
    control_matches,
    excluded_properties,
    ice_mode,
    ice_mode_properties,
    is_ice_maker,
    sabbath_allows,
    sabbath_enabled,
    start_properties,
    supports_air_filter_reset,
    validate_control_properties,
    wash_cancel_enabled,
)

_LOGGER = logging.getLogger(__name__)
INITIAL_STATE_TIMEOUT = 16
# The app sends a fallback get when no properties arrive this many seconds
# after it opens a channel.
SNAPSHOT_TIMEOUT = 16
# A new alert starts a check this many seconds later. Alerts come in bursts, so they
# start at most one check per appliance per interval.
ALERT_CHECK_DELAY = 2
ALERT_CHECK_INTERVAL = timedelta(minutes=1)
# Push alone keeps state otherwise. After an alert, and while a door reports open,
# a follow-up check also runs its interval after the last pushed update, for this
# long after an alert and for a door that stays open.
ALERT_WATCH = timedelta(minutes=10)
DOOR_WATCH = timedelta(minutes=15)
# Sequence 0 does not tell events apart, so a live event with it copies an earlier
# Firebase alert only within this many seconds of it.
SEQUENCE_ZERO_COPY_WINDOW = timedelta(seconds=5)
# How many silent reopens and connection renewals diagnostics list, newest last.
RECENT_PUSH_EVENTS = 10
# How many recent channel checks diagnostics list, newest last.
RECENT_CHECKS = 20
# Set to "check" while a channel check that got no snapshot reads status. That read
# compares state with what push reported, and is skipped on a rate limit while state
# is healthy.
_read_reason: ContextVar[str | None] = ContextVar("subzero_read_reason", default=None)


def selected_devices(entry: ConfigEntry) -> dict[str, dict]:
    """Return the appliance selection, including entries awaiting migration."""
    if "device_id" in entry.data:
        return {
            entry.data["device_id"]: {
                "name": entry.title,
                "temperature_unit": entry.data.get("temperature_unit"),
            }
        }
    return entry.options.get("devices", entry.data["devices"])


def follow_up_checks_enabled(entry: ConfigEntry) -> bool:
    """Follow-up checks run unless the owner turns them off."""
    return entry.options.get(CONF_FOLLOW_UP_CHECKS) is not False


def sidebar_panel_enabled(entry: ConfigEntry) -> bool:
    """The sidebar panel shows the entry's appliances unless the owner turns it off."""
    return entry.options.get(CONF_SHOW_SIDEBAR_PANEL, DEFAULT_SHOW_SIDEBAR_PANEL) is not False


def follow_up_check_minutes(entry: ConfigEntry) -> int:
    """Return how many minutes without an update start each follow-up check."""
    minutes = entry.options.get(CONF_FOLLOW_UP_CHECK_INTERVAL)
    low, high = FOLLOW_UP_CHECK_MINUTES
    if type(minutes) is int and low <= minutes <= high:
        return minutes
    return DEFAULT_FOLLOW_UP_CHECK_MINUTES


def shared_connection_check_enabled(entry: ConfigEntry) -> bool:
    """The shared connection check is used only when the owner turns it on."""
    return entry.options.get(CONF_SHARED_CONNECTION_CHECK) is True


def shared_connection_check_minutes(entry: ConfigEntry) -> int:
    """Return how many minutes without a message start the shared connection check."""
    minutes = entry.options.get(CONF_SHARED_CONNECTION_CHECK_INTERVAL)
    low, high = SHARED_CHECK_MINUTES
    if type(minutes) is int and low <= minutes <= high:
        return minutes
    return DEFAULT_SHARED_CHECK_MINUTES


def firebase_alerts_enabled(entry: ConfigEntry) -> bool:
    """Firebase alerts are used only when the owner turns them on."""
    return entry.options.get(CONF_FIREBASE_ALERTS) is True


class SubZeroCoordinator(DataUpdateCoordinator[dict]):
    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        client: SubZeroClient,
        device_id: str,
        device: dict,
        read_failed: Callable[[SubZeroCoordinator], None],
    ):
        super().__init__(hass, _LOGGER, config_entry=entry, name=f"{DOMAIN} {device['name']}")
        # Watch checks run on their own timer, which each pushed state update restarts.
        self._unsub_check: CALLBACK_TYPE | None = None
        self._check_due: datetime | None = None
        self._check_job = HassJob(
            self._start_check, f"{DOMAIN} {device['name']} channel check", cancel_on_shutdown=True
        )
        self._unsub_alert_check: CALLBACK_TYPE | None = None
        self._alert_check_job = HassJob(
            self._start_alert_check,
            f"{DOMAIN} {device['name']} alert check",
            cancel_on_shutdown=True,
        )
        self._checks_stopped = False
        self._check_task: asyncio.Task | None = None
        # When the latest check reopened the channel, the latest alert arrived, and
        # the latest alert check started.
        self._last_check: datetime | None = None
        self._alert_at: datetime | None = None
        self._last_alert_check: datetime | None = None
        self._watch_until: datetime | None = None
        # Since when a door has reported open.
        self._door_opened: datetime | None = None
        # Changing it in Configure reloads the entry.
        self._watch_interval = timedelta(minutes=follow_up_check_minutes(entry))
        # A silent check's record, when it started, and the connection it used, until
        # a snapshot shows whether its answer was only late.
        self._late_snapshot: tuple[dict, float, object] | None = None
        self.client = client
        self.data = {}
        self.entry = entry
        self.device_id = device_id
        self.device = dict(device)
        self._read_failed = read_failed
        self.unrecognized_keys: set[str] = set()
        # The zone of the appliance clock's last pushed time, for times without an offset.
        self.clock_zone: tzinfo | None = None
        self.push_stats: dict[str, int | str | None] = {
            "snapshots": 0,
            "updates": 0,
            "last_received": None,
            "check_reads": 0,
            "skipped_reads": 0,
            "missed_updates": 0,
            "channel_reopens": 0,
            "alert_checks": 0,
            "watch_checks": 0,
            "connection_checks": 0,
            "manual_checks": 0,
            "silent_channels": 0,
            "connection_renewals": 0,
        }
        # Per property, the checks that found a change push had not reported.
        self.unpushed_changes: dict[str, int] = {}
        # When recent silent reopens and renewals happened, to compare across appliances.
        self.silent_channel_times: deque[str] = deque(maxlen=RECENT_PUSH_EVENTS)
        self.connection_renewal_times: deque[str] = deque(maxlen=RECENT_PUSH_EVENTS)
        self.recent_checks: deque[dict] = deque(maxlen=RECENT_CHECKS)
        self._channel_snapshot: asyncio.Future[None] | None = None
        self._renewed = False
        self._command_lock = asyncio.Lock()
        self._unsettled = False
        self._state_lock = asyncio.Lock()
        self._read_updates: dict | None = None
        self._read_error: Exception | None = None
        self._channel_error: ApiError | None = None
        self._event_cutoff = dt_util.utcnow()
        # The source that first reported each recent event, by identity.
        self._event_sources: dict[tuple[datetime, int, int], str] = {}
        self._paired_events: set[tuple[datetime, int, int]] = set()
        self._event_listeners: list[Callable[[dict], None]] = []
        self._history_seen = False

    def _check_delay(self) -> timedelta | None:
        """Return how long the next watch check waits after a state update, or None.

        Push alone keeps state, except for a while after an alert and while a door
        reports open, when a silent channel would matter most. Turning off follow-up
        checks in Configure, or polling in the entry's system options, stops them.
        """
        if self.entry.pref_disable_polling or not follow_up_checks_enabled(self.entry):
            return None
        now = dt_util.utcnow()
        if any(self.data.get(key) is True for key in DOOR_KEYS):
            if self._door_opened is None:
                self._door_opened = now
        else:
            self._door_opened = None
        if (self._watch_until is not None and now < self._watch_until) or (
            self._door_opened is not None and now < self._door_opened + DOOR_WATCH
        ):
            return self._watch_interval
        return None

    @callback
    def _schedule_check(self, delay: timedelta | None = None) -> None:
        """Restart the watch check timer while the appliance is reporting.

        Recovery owns retries while an appliance is unavailable, including the
        wait a rate limit asks for.
        """
        self._cancel_check()
        if delay is None:
            delay = self._check_delay()
        if (
            delay is not None
            and self.last_update_success
            and not self._checks_stopped
            and not self.hass.is_stopping
        ):
            self._check_due = dt_util.utcnow() + delay
            self._unsub_check = async_call_later(self.hass, delay, self._check_job)

    @callback
    def _shorten_check(self) -> None:
        """Start the check timer, or bring it forward, but never postpone a check."""
        if (delay := self._check_delay()) is not None and (
            self._check_due is None or self._check_due > dt_util.utcnow() + delay
        ):
            self._schedule_check(delay)

    @callback
    def _cancel_check(self) -> None:
        if self._unsub_check is not None:
            self._unsub_check()
            self._unsub_check = None
        self._check_due = None

    @callback
    def _start_check(self, _now: datetime) -> None:
        self._unsub_check = None
        self._check_due = None
        if self.hass.is_stopping:
            return
        if self._check_task is not None and not self._check_task.done():
            # A push restarted the timer during a check that outlasted the interval.
            self._schedule_check()
            return
        self._start_check_task("watch")

    @callback
    def _start_check_task(self, reason: str) -> asyncio.Task:
        # In the background, so waiting for Home Assistant to settle does not wait
        # for a snapshot.
        self._check_task = self.entry.async_create_background_task(
            self.hass, self._async_run_check(reason), f"{self.name} - channel check"
        )
        return self._check_task

    @callback
    def _schedule_alert_check(self) -> None:
        """Check push soon after a new alert, then keep watching it for a while.

        State often changes again soon after an alert, as a door closes, a timer is
        dismissed, or a cycle moves on, which a silent channel would leave out.
        """
        if self._checks_stopped or self.hass.is_stopping:
            return
        now = dt_util.utcnow()
        self._alert_at = now
        self._watch_until = now + ALERT_WATCH
        self._shorten_check()
        if self._unsub_alert_check is not None:
            return
        delay = timedelta(seconds=ALERT_CHECK_DELAY)
        if self._last_alert_check is not None:
            delay = max(delay, self._last_alert_check + ALERT_CHECK_INTERVAL - now)
        self._unsub_alert_check = async_call_later(self.hass, delay, self._alert_check_job)

    @callback
    def _start_alert_check(self, _now: datetime) -> None:
        self._unsub_alert_check = None
        if self.hass.is_stopping or self._checks_stopped:
            return
        if (
            self._last_check is not None
            and self._alert_at is not None
            and self._last_check >= self._alert_at
        ):
            # A check that started after the latest alert already covers it.
            return
        self._last_alert_check = dt_util.utcnow()
        self._start_check_task("alert")

    async def async_check_now(self) -> None:
        """Reopen the channel and wait for its snapshot, or read status, for current state.

        Joins a check that is already running. The check finishes even if the
        caller is cancelled.
        """
        task = self._check_task
        if task is None or task.done():
            task = self._start_check_task("manual")
        await asyncio.shield(task)

    async def async_shutdown(self) -> None:
        self._checks_stopped = True
        self._cancel_check()
        if self._unsub_alert_check is not None:
            self._unsub_alert_check()
            self._unsub_alert_check = None
        await super().async_shutdown()

    async def _async_run_check(self, reason: str) -> None:
        try:
            await self._async_check_and_read(reason)
        except Exception:
            _LOGGER.exception("Checking %s failed unexpectedly", self.device["name"])
        finally:
            # A state update normally restarts the timer; one that never came
            # must not end the checks.
            if self._unsub_check is None:
                self._schedule_check()

    async def _async_check_and_read(self, reason: str) -> None:
        """Check push, and read status if the channel stays silent.

        `reason` is "alert", "watch" (after an alert or while a door is open),
        "connection" (the shared connection check), or "manual" (the refresh action).
        """
        snapshots = self.push_stats["snapshots"]
        self.push_stats[f"{reason}_checks"] += 1
        record = {"time": None, "reason": reason, "result": None}
        self.recent_checks.append(record)
        answered = await self._async_check_channel(record)
        if answered:
            # The pushed snapshot refreshed state and restarted the timer.
            self._renewed = False
            return
        skipped = self.push_stats["skipped_reads"]
        await self._async_refresh_for("check")
        if (
            answered is False
            and self.last_update_success
            # A rate limit would fail the new connection, for every appliance.
            and self.push_stats["skipped_reads"] == skipped
            # A snapshot that arrived after the wait shows that push still works.
            and self.push_stats["snapshots"] == snapshots
            and not self._renewed
        ):
            # The appliance answers status reads, but its channel pushed nothing.
            # Renewing the connection reopens every channel. Once per silent spell,
            # in case this appliance never answers a reopen.
            self._renewed = True
            record["renewed"] = True
            self.push_stats["connection_renewals"] += 1
            self.connection_renewal_times.append(dt_util.utcnow().isoformat())
            _LOGGER.debug("Renewing push because %s stopped answering", self.device["name"])
            self.client.renew_connection()

    async def _async_check_channel(self, record: dict) -> bool | None:
        """Reopen the update channel and wait for the snapshot the appliance pushes.

        The app reopens every channel each time it returns to the foreground and
        never keeps one open longer, so a channel open for hours may have stopped.
        The snapshot serves as the check's status read. Returns None when the
        reopen fails, and False when no snapshot arrives. `record` gets the time,
        result, and how long the snapshot took.
        """
        async with self._state_lock:
            self._channel_snapshot = self.hass.loop.create_future()
            self._late_snapshot = None
            self._last_check = dt_util.utcnow()
            record["time"] = self._last_check.isoformat()
            self.push_stats["channel_reopens"] += 1
            connection = self.client.connections
            started = time.monotonic()
            _LOGGER.debug("Reopening the update channel for %s", self.device["name"])
            try:
                await self.client.open_channel(self.device_id)
                async with asyncio.timeout(SNAPSHOT_TIMEOUT):
                    await self._channel_snapshot
            except (ApiError, InvalidAuth) as error:
                # The status read that follows reports the error.
                record["result"] = "failed"
                _LOGGER.debug(
                    "Could not reopen the update channel for %s: %s", self.device["name"], error
                )
                return None
            except TimeoutError:
                record["result"] = "silent"
                # A snapshot that still comes on this connection shows push was
                # late, not stopped.
                self._late_snapshot = (record, started, connection)
                self.push_stats["silent_channels"] += 1
                self.silent_channel_times.append(dt_util.utcnow().isoformat())
                _LOGGER.debug(
                    "%s pushed no snapshot after its channel reopened", self.device["name"]
                )
                return False
            finally:
                self._channel_snapshot = None
        record["result"] = "answered"
        record["snapshot_seconds"] = round(time.monotonic() - started, 1)
        return True

    @callback
    def async_set_update_error(self, error: Exception) -> None:
        self._cancel_check()
        super().async_set_update_error(error)

    @callback
    def async_set_updated_data(self, data: dict) -> None:
        super().async_set_updated_data(data)
        self._schedule_check()

    @callback
    def async_add_event_listener(self, listener: Callable[[dict], None]) -> Callable[[], None]:
        self._event_listeners.append(listener)
        return lambda: self._event_listeners.remove(listener)

    @callback
    def _process_events(self, properties: dict, *, history: bool) -> None:
        # The first snapshot or status read only sets the baseline, so an
        # appliance clock running ahead cannot replay events from before loading.
        deliver = self._history_seen or not history
        self._history_seen |= history
        events = []
        for record in notification_records(properties):
            timestamp = appliance_datetime(record["timestamp"], self.clock_zone)
            if timestamp is not None:
                events.append((timestamp, record["notif_seq"], record["notif_type"]))
        for identity in sorted(events):
            self.async_receive_event(
                *identity, deliver=deliver, source="history" if history else "channel"
            )

    @callback
    def async_receive_event(
        self,
        timestamp: datetime,
        sequence: int,
        code: int,
        *,
        deliver: bool = True,
        source: str = "channel",
    ) -> bool:
        """Deliver a new event; return whether listeners received it.

        A new event from Firebase or the channel also starts a channel check. One
        found in a snapshot or status read came with up-to-date state.
        """
        identity = (timestamp, sequence, code)
        if timestamp < self._event_cutoff:
            return False
        if (known := self._event_sources.get(identity)) is not None:
            # A status history copy of a channel event is the same delivery, which
            # must stay open to its Firebase copy.
            if (known == "firebase") != (source == "firebase"):
                self._paired_events.add(identity)
            return False
        counterparts = {"channel", "history"} if source == "firebase" else {"firebase"}
        window = (
            SEQUENCE_ZERO_COPY_WINDOW
            if source == "channel" and sequence == 0
            else timedelta(minutes=5)
        )
        counterpart = min(
            (
                old
                for old, old_source in self._event_sources.items()
                if old_source in counterparts
                and old not in self._paired_events
                and old[1:] == (sequence, code)
                and abs(old[0] - timestamp) <= window
            ),
            key=lambda old: abs(old[0] - timestamp),
            default=None,
        )
        self._event_sources[identity] = source
        if counterpart is not None:
            self._paired_events.update((counterpart, identity))
        if len(self._event_sources) > MAX_EVENT_HISTORY:
            oldest = min(self._event_sources)
            del self._event_sources[oldest]
            self._paired_events.discard(oldest)
            self._event_cutoff = max(self._event_cutoff, oldest[0] + timedelta(microseconds=1))
        # Each copy, whichever source reports it first, fires the event once.
        if counterpart is not None or not deliver:
            return False
        event = {
            "code": code,
            "sequence": sequence,
            "appliance_timestamp": timestamp.isoformat(),
        }
        for listener in self._event_listeners:
            listener(event)
        if source != "history":
            self._schedule_alert_check()
        return True

    @property
    def device_info(self) -> DeviceInfo:
        info = DeviceInfo(identifiers={(DOMAIN, self.device_id)}, name=self.device["name"])
        if not self.data.get("appliance_model"):
            # Until the appliance reports, keep the details the registry saved from
            # its last status rather than clearing them.
            return info
        version = self.data.get("version")
        serial = self.data.get("appliance_serial")
        # From Home Assistant 2026.11, DeviceInfo.update takes only a mapping.
        info.update(
            {
                "manufacturer": appliance_brand(self.data),
                "model": self.data["appliance_model"],
                "serial_number": serial if isinstance(serial, str) else None,
                "sw_version": version.get("fw") if isinstance(version, dict) else None,
            }
        )
        return info

    @asynccontextmanager
    async def _command(self, properties: dict | None = None) -> AsyncIterator[None]:
        """Serialize commands.

        A cancelled command can still change the appliance after the last read, so
        the next command reads state before deciding what to write. `properties`
        are the writes a command makes, if they are all it does.
        """
        async with self._command_lock:
            if self._unsettled:
                await self.async_refresh()
                self._unsettled = False
            if sabbath_enabled(self.data) and not (
                properties and all(sabbath_allows(key, value) for key, value in properties.items())
            ):
                # Like the appliance, which accepts nothing but turning Sabbath mode off.
                raise ServiceValidationError(SABBATH_LOCKED)
            try:
                yield
            except asyncio.CancelledError:
                self._unsettled = True
                raise

    async def async_set_properties(self, properties: dict, *, force: bool = False) -> None:
        """Serialize writes and confirm their result from appliance state.

        Forced writes go out even when the appliance already reports the value,
        which is how the app starts ovens and cancels wash cycles. A value the appliance already reports
        is re-sent as is, without the checks a change needs.
        """
        async with self._command(properties):
            await self._async_write(dict(properties), force=force)

    async def async_start(self, key: str, temperature: int | None = None) -> None:
        """Start with the app's writes, from the state left by earlier commands."""
        async with self._command():
            if self.data.get(key) is True:
                prefix = key.removesuffix("_unit_on")
                properties = {} if temperature is None else {f"{prefix}_set_temp": temperature}
                await self._async_write({**properties, key: True})
            else:
                await self._async_write(start_properties(self.data, key, temperature), force=True)

    async def async_cancel_wash(self) -> None:
        async with self._command():
            if not self.last_update_success:
                raise ServiceValidationError("The appliance is unavailable.")
            if not wash_cancel_enabled(self.data):
                raise ServiceValidationError("There is no wash cycle to cancel.")
            # Like the app, cancel even when the cycle already reports off, as it
            # may during a delayed start.
            await self._async_write({"wash_cycle_on": False}, force=True)

    async def async_dismiss_timer(self, key: str) -> None:
        async with self._command():
            if not self.last_update_success:
                raise ServiceValidationError("The appliance is unavailable.")
            if self.data.get(f"{KITCHEN_TIMERS[key]}_complete") is not True:
                raise ServiceValidationError("The kitchen timer has not finished.")
            # Like the app's "Tap to Dismiss", writing 0 clears a finished timer.
            await self._async_write({key: 0})

    async def _async_write(self, properties: dict, *, force: bool = False) -> None:
        if not self.last_update_success:
            raise ServiceValidationError("The appliance is unavailable.")
        now = dt_util.utcnow()
        changes = {
            key: value
            for key, value in properties.items()
            if not (force and control_matches(self.data, key, value, now, self.clock_zone))
        }
        if changes or not force:
            validate_control_properties(self.data, self.device.get("temperature_unit"), changes)
        requested_at = {}
        try:
            for key, value in properties.items():
                if not self.last_update_success:
                    raise ServiceValidationError("The appliance is unavailable.")
                requested_at[key] = dt_util.utcnow()
                if (
                    force
                    or (
                        key in KITCHEN_TIMERS
                        # Setting a finished timer to 0 clears it, as the app does.
                        and (value > 0 or self.data.get(f"{KITCHEN_TIMERS[key]}_complete") is True)
                    )
                    or not control_matches(
                        self.data, key, value, requested_at[key], self.clock_zone
                    )
                ):
                    requested_at[key] = await self._async_set_property(
                        key, value, resend=key not in changes
                    )
            if not self.last_update_success or any(
                not control_matches(self.data, key, value, requested_at[key], self.clock_zone)
                for key, value in properties.items()
            ):
                raise HomeAssistantError("The appliance did not confirm the requested setting.")
        except InvalidAuth as error:
            self.entry.async_start_reauth(self.hass)
            raise HomeAssistantError("Sign in to Sub-Zero again to change settings.") from error
        except ApiError as error:
            raise HomeAssistantError(str(error)) from error

    async def async_reset_air_filter(self) -> None:
        async with self._command():
            if not self.last_update_success:
                raise ServiceValidationError("The appliance is unavailable.")
            if "air_filter_pct_remaining" not in self.data:
                raise ServiceValidationError("The appliance does not report an air filter.")
            if not supports_air_filter_reset(self.data):
                # Like the app, which shows the appliance's own reset steps instead.
                raise ServiceValidationError("Reset this appliance's air filter at the appliance.")
            try:
                await self.client.reset_air_filter(self.device_id)
            except InvalidAuth as error:
                self.entry.async_start_reauth(self.hass)
                raise HomeAssistantError(
                    "Sign in to Sub-Zero again to reset the air filter."
                ) from error
            except ApiError as error:
                raise HomeAssistantError(str(error)) from error
            await self.async_refresh()

    async def async_set_ice_mode(self, mode: str) -> None:
        async with self._command():
            if not self.last_update_success:
                raise ServiceValidationError("The appliance is unavailable.")
            properties = ice_mode_properties(self.data, mode)
            try:
                for key, value in properties.items():
                    await self._async_set_property(key, value)
            except InvalidAuth as error:
                self.entry.async_start_reauth(self.hass)
                raise HomeAssistantError("Sign in to Sub-Zero again to change settings.") from error
            except ApiError as error:
                raise HomeAssistantError(str(error)) from error
            if ice_mode(self.data) != mode:
                raise HomeAssistantError("The appliance did not confirm the requested ice mode.")

    async def _async_set_property(
        self, key: str, value: bool | int, *, resend: bool = False
    ) -> datetime:
        last_error = None
        for attempt in range(3):
            if not self.last_update_success:
                if attempt:
                    break
                raise ServiceValidationError("The appliance is unavailable.")
            requested_at = dt_util.utcnow()
            matched = control_matches(self.data, key, value, requested_at, self.clock_zone)
            if not resend or not matched:
                validate_control_properties(
                    self.data, self.device.get("temperature_unit"), {key: value}
                )
            confirmed = asyncio.Event()
            acknowledged = False

            @callback
            def confirm() -> None:
                if self.last_update_success and control_matches(
                    self.data, key, value, requested_at, self.clock_zone
                ):
                    confirmed.set()
                else:
                    confirmed.clear()

            remove_listener = self.async_add_listener(confirm)
            try:
                try:
                    async with asyncio.timeout(CONTROL_CONFIRM_TIMEOUT):
                        try:
                            await self.client.set_property(self.device_id, key, value)
                        except RateLimited:
                            raise
                        except ApiError as error:
                            last_error = error
                        else:
                            acknowledged = True
                            if key not in KITCHEN_TIMERS:
                                confirm()
                            await asyncio.wait_for(confirmed.wait(), CONTROL_PUSH_TIMEOUT)
                except TimeoutError:
                    pass
                if matched and not acknowledged:
                    # A value that already matched cannot confirm a write that
                    # failed or went unanswered.
                    continue
                if not confirmed.is_set():
                    # A status read cancelled by the deadline would leave the
                    # appliance marked as failed, so it runs afterwards.
                    await self.async_refresh()
                    confirm()
                if confirmed.is_set():
                    return requested_at
            finally:
                remove_listener()
        message = "The appliance did not confirm the requested setting."
        if last_error is not None:
            message += f" Last command error: {last_error}"
        raise HomeAssistantError(message) from last_error

    async def async_set_ice_delay(
        self,
        duration: int = 0,
        start_offset: int = 0,
        recurring: bool = False,
        *,
        end_current: bool = False,
    ) -> None:
        async with self._command():
            if not self.last_update_success:
                raise ServiceValidationError("The appliance is unavailable.")
            if not is_ice_maker(self.data) or not ICE_DELAY_KEYS.issubset(self.data):
                raise ServiceValidationError("The appliance does not report ice delay settings.")
            try:
                validate_ice_delay(duration, start_offset, recurring)
            except ValueError as error:
                raise ServiceValidationError(str(error)) from error
            if end_current and self.data.get("delay_active") is not True:
                raise ServiceValidationError("There is no active ice delay to end.")
            try:
                if end_current:
                    await self.client.exit_ice_delay(self.device_id)
                else:
                    await self.client.set_ice_delay(
                        self.device_id, duration, start_offset, recurring
                    )
            except InvalidAuth as error:
                self.entry.async_start_reauth(self.hass)
                raise HomeAssistantError("Sign in to Sub-Zero again to change settings.") from error
            except RateLimited as error:
                raise HomeAssistantError(str(error)) from error
            except ApiError as error:
                await self.async_refresh()
                raise HomeAssistantError(str(error)) from error
            await self.async_refresh()

    async def async_refresh(self) -> None:
        """Finish reading status even if the caller is cancelled."""
        await asyncio.shield(
            self.entry.async_create_background_task(
                self.hass, super().async_refresh(), "Sub-Zero status read"
            )
        )

    async def async_request_refresh(self) -> None:
        """Finish a requested status read even if the caller is cancelled."""
        await asyncio.shield(
            self.entry.async_create_background_task(
                self.hass, super().async_request_refresh(), "Sub-Zero status request"
            )
        )

    async def _async_refresh_for(self, reason: str) -> None:
        # The status read runs in a task created here, which copies the reason.
        token = _read_reason.set(reason)
        try:
            await self.async_refresh()
        finally:
            _read_reason.reset(token)

    @callback
    def _async_refresh_finished(self) -> None:
        if self.last_update_success:
            # A status read shows nothing about push, so it never postpones a
            # check, but a door it finds open can bring one forward.
            self._shorten_check()
        else:
            self._cancel_check()
            self._read_failed(self)

    async def _async_update_data(self) -> dict:
        reason = _read_reason.get()
        _read_reason.set(None)
        async with self._state_lock:
            self._read_updates = {}
            self._read_error = None
            try:
                try:
                    data = await self.client.state(self.device_id)
                except ApiError:
                    model = self._read_updates.get("appliance_model")
                    if not isinstance(model, str) or not model:
                        raise
                    data = self.data
                if error := self._read_error or self._channel_error:
                    raise error
                if reason == "check":
                    self._check_missed_updates(data, self._read_updates)
                self.unrecognized_keys.update(data.keys() - STATE_KEYS)
                if "notifs" in data:
                    data = {**data, "notifs": notification_records(data)}
                    self._process_events(data, history=True)
                model = self._read_updates.get("appliance_model")
                if isinstance(model, str) and model and model != data.get("appliance_model"):
                    data = {}
                data = {
                    **{key: value for key, value in data.items() if key in STATE_KEYS},
                    **self._read_updates,
                }
                return self._discard_excluded(data)
            except InvalidAuth as error:
                raise ConfigEntryAuthFailed(str(error)) from error
            except RateLimited as error:
                if reason is not None and self.last_update_success:
                    # Push keeps the appliance current, so a rate limit only skips
                    # a check's read.
                    self.push_stats["skipped_reads"] += 1
                    _LOGGER.debug("Skipping a rate-limited status read for %s", self.device["name"])
                    return self.data
                raise UpdateFailed(str(error), retry_after=error.retry_after) from error
            except ApiError as error:
                raise UpdateFailed(str(error)) from error
            finally:
                self._read_updates = None
                self._read_error = None

    def _check_missed_updates(self, data: dict, pushed: Collection[str] = ()) -> None:
        """Note changes, and door changes in particular, a check found before push.

        `pushed` holds the properties push reported while the read was running.
        """
        self.push_stats["check_reads"] += 1
        compared = (data.keys() & self.data.keys()).difference(UNCOMPARED_READ_KEYS, pushed)
        unpushed = sorted(key for key in compared if data[key] != self.data[key])
        for key in unpushed:
            self.unpushed_changes[key] = self.unpushed_changes.get(key, 0) + 1
        if unpushed:
            _LOGGER.debug(
                "A status read found changes push had not reported for %s: %s",
                self.device["name"],
                ", ".join(unpushed),
            )
        missed = sorted(
            key
            for key in DOOR_KEYS.difference(pushed)
            if type(data.get(key)) is bool
            and type(self.data.get(key)) is bool
            and data[key] != self.data[key]
        )
        if missed:
            _LOGGER.debug("Push did not report %s for %s", ", ".join(missed), self.device["name"])
            self.push_stats["missed_updates"] += 1

    def _discard_excluded(self, data: dict) -> dict:
        """Drop the properties the app discards for the appliance type.

        Like the app, a response without a usable type keeps the type already
        known for the same appliance model.
        """
        if (
            appliance_type(data) is None
            and appliance_type(self.data) is not None
            and data.get("appliance_model") == self.data.get("appliance_model")
        ):
            data = {**data, "appliance_type": self.data["appliance_type"]}
        excluded = excluded_properties(data)
        return {key: value for key, value in data.items() if key not in excluded}

    async def async_recover(self) -> None:
        """Restore unavailable state while the appliance is reporting again."""
        backoff = RECONNECT_DELAY
        while not self.last_update_success:
            _LOGGER.debug("Refreshing %s to recover appliance state", self.device["name"])
            try:
                data = await self._async_update_data()
            except ConfigEntryAuthFailed as error:
                self.async_set_update_error(error)
                self.entry.async_start_reauth(self.hass)
                return
            except Exception as error:
                if self.last_update_success:
                    return
                if not isinstance(error, UpdateFailed):
                    _LOGGER.exception("Sub-Zero state recovery failed unexpectedly")
                self.async_set_update_error(error)
                retry_after = (error.retry_after or 0) if isinstance(error, UpdateFailed) else 0
            else:
                if not self.last_update_success:
                    self.async_set_updated_data(data)
                return
            await asyncio.sleep(max(backoff, retry_after) + random.uniform(0, 5))
            backoff = min(backoff * 2, MAX_RECONNECT_DELAY)

    @callback
    def apply_update(self, update: StateUpdate) -> None:
        self.unrecognized_keys.update(update.properties.keys() - STATE_KEYS)
        if zone := clock_zone(update.properties.get("time")):
            self.clock_zone = zone
        properties = {key: value for key, value in update.properties.items() if key in STATE_KEYS}
        if "appliance_type" in properties and appliance_type(properties) is None:
            # Like the app, an unusable type does not replace the known one.
            del properties["appliance_type"]
        if "notifs" in properties:
            properties["notifs"] = notification_records(properties)
            self._process_events(properties, history=update.full)
        if properties:
            self._read_error = None
            self._channel_error = None
            if not update.full:
                # A pushed change ends a silent spell, so a later one may renew again.
                self._renewed = False
            snapshot = self._channel_snapshot
            if update.full and snapshot is not None and not snapshot.done():
                # Compare before the merge. State already holds what push reported.
                self._check_missed_updates(properties)
                snapshot.set_result(None)
            if update.full and (late := self._late_snapshot) is not None:
                self._late_snapshot = None
                record, started, connection = late
                if connection == self.client.connections:
                    # The silent check's snapshot, after it gave up waiting. A snapshot
                    # on a renewed connection answers that connection's reopen instead.
                    record["late_snapshot_seconds"] = round(time.monotonic() - started, 1)
            if self._read_updates is not None:
                if update.full and properties["appliance_model"] != self.data.get(
                    "appliance_model"
                ):
                    self._read_updates.clear()
                self._read_updates.update(properties)
        self.push_stats["snapshots" if update.full else "updates"] += 1
        self.push_stats["last_received"] = dt_util.utcnow().isoformat()
        _LOGGER.debug(
            "%s %s: %s",
            self.device["name"],
            "snapshot" if update.full else "update",
            {
                key: value
                for key, value in properties.items()
                if key not in PRIVATE_KEYS and not isinstance(value, dict | list)
            },
        )
        if not self.last_update_success and not update.full:
            return
        replace = update.full and (
            not self.last_update_success
            or properties.get("appliance_model") != self.data.get("appliance_model")
        )
        updated = self._discard_excluded(properties if replace else {**self.data, **properties})
        if (
            update.full
            or updated != self.data
            or any(type(value) is not type(self.data.get(key)) for key, value in updated.items())
            or not self.last_update_success
        ):
            self.async_set_updated_data(updated)


class SubZeroFaultsCoordinator(DataUpdateCoordinator[list[ApplianceFault]]):
    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        client: SubZeroClient,
        appliance: SubZeroCoordinator,
        metadata: dict[tuple[str, str], dict | None],
    ):
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=f"{DOMAIN} {appliance.device['name']} faults",
            update_interval=timedelta(minutes=30),
        )
        self.client = client
        self.appliance = appliance
        self._metadata = metadata

    def series_name(self) -> str | None:
        parts = appliance_type(self.appliance.data)
        if parts is None:
            return None
        return FAULT_METADATA_APPLIES_TO_BY_SERIES.get(parts[1])

    def metadata(self, code: str | None) -> dict | None:
        series = self.series_name()
        if not code or not series:
            return None
        return self._metadata.get((code, series))

    async def _async_update_data(self) -> list[ApplianceFault]:
        try:
            faults = await self.client.appliance_faults(self.appliance.device_id)
        except InvalidAuth as error:
            raise ConfigEntryAuthFailed(str(error)) from error
        except RateLimited as error:
            raise UpdateFailed(str(error), retry_after=error.retry_after) from error
        except ApiError as error:
            raise UpdateFailed(str(error)) from error
        series = self.series_name()
        if series is not None:
            for fault in faults:
                key = (fault.code, series)
                if fault.active and fault.code and key not in self._metadata:
                    metadata = await self.client.fault_metadata(fault.code, series)
                    if isinstance(metadata, dict):
                        self._metadata[key] = metadata
        return faults


class SubZeroAccount:
    """Share account tokens and one notification stream across selected appliances."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, client: SubZeroClient):
        self.hass = hass
        self.entry = entry
        self.client = client
        self.coordinators = {
            device_id: SubZeroCoordinator(hass, entry, client, device_id, device, self._read_failed)
            for device_id, device in selected_devices(entry).items()
        }
        self._fault_metadata: dict[tuple[str, str], dict] = {}
        self.fault_coordinators = {
            device_id: SubZeroFaultsCoordinator(
                hass, entry, client, coordinator, self._fault_metadata
            )
            for device_id, coordinator in self.coordinators.items()
        }
        self._initial_states = {device_id: asyncio.Event() for device_id in self.coordinators}
        self._recoveries: dict[str, asyncio.Task] = {}
        # With the shared connection check on, one appliance's channel is checked after
        # the connection goes this long without a message.
        self.connection_check_interval = timedelta(minutes=shared_connection_check_minutes(entry))
        self._unsub_connection_check: CALLBACK_TYPE | None = None
        self._connection_check_job = HassJob(
            self._start_connection_check, f"{DOMAIN} connection check", cancel_on_shutdown=True
        )

    @callback
    def _schedule_connection_check(self, delay: timedelta | None = None) -> None:
        self._cancel_connection_check()
        self._unsub_connection_check = async_call_later(
            self.hass, delay or self.connection_check_interval, self._connection_check_job
        )

    @callback
    def _cancel_connection_check(self) -> None:
        if self._unsub_connection_check is not None:
            self._unsub_connection_check()
            self._unsub_connection_check = None

    @callback
    def _start_connection_check(self, _now: datetime) -> None:
        """Check one channel once the connection goes an interval without a message.

        Silence has always hit every appliance at once, so a channel that answers
        shows that push works for all of them. Each check takes the available
        appliance checked least recently.
        """
        self._unsub_connection_check = None
        if self.hass.is_stopping or self.entry.pref_disable_polling:
            return
        now = dt_util.utcnow()
        received = self.client.notification_stats.get("last_received")
        last = dt_util.parse_datetime(received) if isinstance(received, str) else None
        if last is not None and now < last + self.connection_check_interval:
            # A message shows the connection delivers, so the wait starts from it.
            self._schedule_connection_check(last + self.connection_check_interval - now)
            return
        self._schedule_connection_check()
        coordinators = list(self.coordinators.values())
        if any(
            coordinator._check_task is not None and not coordinator._check_task.done()
            for coordinator in coordinators
        ):
            # A check that is already running shows the same.
            return
        available = [coordinator for coordinator in coordinators if coordinator.last_update_success]
        if available:
            coordinator = min(
                available,
                key=lambda coordinator: (
                    coordinator._last_check or datetime.min.replace(tzinfo=dt_util.UTC)
                ),
            )
            coordinator._start_check_task("connection")

    async def async_setup(self) -> None:
        if not self.coordinators:
            return
        metadata_error: ApiError | None = None
        try:
            appliances = await self.client.appliances()
        except InvalidAuth as error:
            raise ConfigEntryAuthFailed(str(error)) from error
        except RateLimited as error:
            raise ConfigEntryNotReady(str(error)) from error
        except ApiError as error:
            metadata_error = error
        else:
            units = {appliance.id: appliance.temperature_unit for appliance in appliances}
            for coordinator in self.coordinators.values():
                if coordinator.device_id in units:
                    coordinator.device["temperature_unit"] = units[coordinator.device_id]
            devices = {
                device_id: dict(coordinator.device)
                for device_id, coordinator in self.coordinators.items()
            }
            if devices != selected_devices(self.entry):
                if "devices" in self.entry.options:
                    self.hass.config_entries.async_update_entry(
                        self.entry, options={**self.entry.options, "devices": devices}
                    )
                else:
                    self.hass.config_entries.async_update_entry(
                        self.entry, data={**self.entry.data, "devices": devices}
                    )
        self.entry.async_create_background_task(self.hass, self.listen(), "Sub-Zero notifications")
        try:
            try:
                async with asyncio.timeout(INITIAL_STATE_TIMEOUT):
                    await asyncio.gather(*(ready.wait() for ready in self._initial_states.values()))
            except TimeoutError:
                pass
            errors = []
            for coordinator in self.coordinators.values():
                if coordinator.last_update_success and coordinator.data.get("appliance_model"):
                    continue
                if isinstance(coordinator.last_exception, InvalidAuth):
                    raise ConfigEntryAuthFailed(str(coordinator.last_exception))
                try:
                    await coordinator.async_config_entry_first_refresh()
                except ConfigEntryNotReady as error:
                    coordinator.data = {}
                    errors.append(error)
            if errors and len(errors) == len(self.coordinators):
                raise errors[0]
        finally:
            self._initial_states.clear()
        for coordinator in self.coordinators.values():
            if (
                not coordinator.last_update_success
                and coordinator._channel_error is None
                and self.client.push_connected
            ):
                self._start_recovery(coordinator)
        if metadata_error is not None:
            _LOGGER.warning(
                "Could not refresh appliance units; using cached units where available: %s",
                metadata_error,
            )
        for coordinator in self.fault_coordinators.values():
            self.entry.async_create_background_task(
                self.hass, coordinator.async_refresh(), "Sub-Zero faults"
            )
        if shared_connection_check_enabled(self.entry) and not self.entry.pref_disable_polling:
            self._schedule_connection_check()
            self.entry.async_on_unload(self._cancel_connection_check)

    @callback
    def set_error(self, error: Exception) -> None:
        for coordinator in self.coordinators.values():
            coordinator._read_error = error
            coordinator.async_set_update_error(error)
        for ready in self._initial_states.values():
            ready.set()

    @callback
    def _start_recovery(self, coordinator: SubZeroCoordinator) -> None:
        recovery = self._recoveries.get(coordinator.device_id)
        if recovery is None or recovery.done():
            self._recoveries[coordinator.device_id] = self.entry.async_create_background_task(
                self.hass, coordinator.async_recover(), "Sub-Zero state recovery"
            )

    @callback
    def _read_failed(self, coordinator: SubZeroCoordinator) -> None:
        # With the channel open, no reconnect will prompt a recovery read.
        if (
            coordinator._channel_error is None
            and self.client.push_connected
            and self.entry.state is ConfigEntryState.LOADED
            and not isinstance(coordinator.last_exception, ConfigEntryAuthFailed)
        ):
            self._start_recovery(coordinator)

    async def listen(self) -> None:
        backoff = RECONNECT_DELAY
        while True:
            started = time.monotonic()
            recoveries = self._recoveries
            canceled: set[asyncio.Task] = set()
            try:
                async for device_id, update in self.client.watch(list(self.coordinators)):
                    coordinator = self.coordinators[device_id]
                    if isinstance(update, ApiError) or (
                        isinstance(update, StateUpdate) and update.full
                    ):
                        if recovery := recoveries.pop(device_id, None):
                            canceled.add(recovery)
                            recovery.add_done_callback(canceled.discard)
                            recovery.cancel()
                        if ready := self._initial_states.get(device_id):
                            ready.set()
                    if isinstance(update, ApiError):
                        coordinator._read_error = update
                        coordinator._channel_error = update
                        coordinator.async_set_update_error(update)
                    elif isinstance(update, ChannelOpened):
                        coordinator._read_error = None
                        coordinator._channel_error = None
                    else:
                        coordinator.apply_update(update)
                    if (
                        not coordinator.last_update_success
                        and device_id not in self._initial_states
                        and not isinstance(coordinator.last_exception, ConfigEntryAuthFailed)
                        and (
                            isinstance(update, ChannelOpened)
                            or isinstance(update, StateUpdate)
                            and not update.properties.keys().isdisjoint(STATE_KEYS)
                        )
                    ):
                        self._start_recovery(coordinator)
                raise ApiError("Sub-Zero's notification stream ended.")
            except InvalidAuth as error:
                self.set_error(error)
                self.entry.async_start_reauth(self.hass)
                return
            except ApiError as error:
                self.set_error(error)
                retry_after = error.retry_after if isinstance(error, RateLimited) else 0
            except Exception as error:
                _LOGGER.exception("Sub-Zero's notification stream failed unexpectedly")
                self.set_error(error)
                retry_after = 0
            finally:
                pending = {*recoveries.values(), *canceled}
                for recovery in pending:
                    recovery.cancel()
                if pending:
                    await asyncio.gather(*pending, return_exceptions=True)
                recoveries.clear()
            if time.monotonic() - started >= 120:
                backoff = RECONNECT_DELAY
            await asyncio.sleep(max(backoff, retry_after) + random.uniform(0, 5))
            backoff = min(backoff * 2, MAX_RECONNECT_DELAY)
