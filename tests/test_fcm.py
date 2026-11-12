"""Firebase appliance alerts and subscription recovery."""

import asyncio
import os
from base64 import urlsafe_b64encode
from datetime import timedelta
from unittest.mock import AsyncMock

import http_ece
import pytest
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec
from firebase_messaging import FcmPushClient, FcmRegisterConfig
from firebase_messaging.proto.mcs_pb2 import DataMessageStanza
from homeassistant.util import dt as dt_util

from custom_components.subzero.alert_loc_keys import ALERT_LOCATION_KEYS
from custom_components.subzero.api import ApiError, RateLimited
from custom_components.subzero.fcm import PushClient, header_parameter, parse_alert
from tests.common import (
    async_capture_events,
    async_fire_time_changed,
)

oven = pytest.mark.parametrize(
    "cloud_appliance",
    [
        {
            "appliance_model": "TEST-OVEN",
            "appliance_type": "1.15.2.5",
            "cav_at_set_temp": False,
            "notifs": [],
        }
    ],
    indirect=True,
)


async def run_checks(hass, seconds=3):
    """Fire the check timers due within `seconds`, then wait for the checks they start."""
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=seconds))
    while checks := [
        task
        for task in hass._background_tasks
        # From Home Assistant 2026.11 the set also holds futures, which have no name.
        if isinstance(task, asyncio.Task)
        and task.get_name().endswith(" - channel check")
        and not task.done()
    ]:
        await asyncio.gather(*checks, return_exceptions=True)
    await hass.async_block_till_done()


def message(device_id="appliance", code="209", sequence="50", timestamp=None):
    when = timestamp or dt_util.utcnow() + timedelta(seconds=2)
    return {
        "data": {
            "deviceId": device_id,
            "value": code,
            "notifSeq": sequence,
            "event_time": str(int(when.timestamp() * 1000)),
        },
        "fcmMessageId": "synthetic-message-id",
    }


def encrypted_message(crypto_key="dh={key}", encryption="salt={salt}", *, padded=False):
    """A Firebase data message encrypted for new credentials, as a sender builds it.

    The header formats take the sender's `key` and the `salt`, which senders leave
    unpadded.
    """
    receiver = ec.generate_private_key(ec.SECP256R1())
    sender = ec.generate_private_key(ec.SECP256R1())
    point = (serialization.Encoding.X962, serialization.PublicFormat.UncompressedPoint)
    secret, salt = os.urandom(16), os.urandom(16)

    def text(value):
        return urlsafe_b64encode(value).decode("ascii")

    credentials = {
        "gcm": {"app_id": "app"},
        "keys": {
            "private": text(
                receiver.private_bytes(
                    serialization.Encoding.DER,
                    serialization.PrivateFormat.PKCS8,
                    serialization.NoEncryption(),
                )
            ),
            "secret": text(secret),
        },
    }
    message = DataMessageStanza(
        persistent_id="1",
        raw_data=http_ece.encrypt(
            b'{"data": {"deviceId": "appliance"}}',
            salt=salt,
            private_key=sender,
            dh=receiver.public_key().public_bytes(*point),
            auth_secret=secret,
            version="aesgcm",
        ),
    )
    values = {"key": text(sender.public_key().public_bytes(*point)), "salt": text(salt)}
    if not padded:
        values = {name: value.rstrip("=") for name, value in values.items()}
    for name, value in {
        "crypto-key": crypto_key.format(**values),
        "encryption": encryption.format(**values),
        "subtype": "app",
    }.items():
        message.app_data.add(key=name, value=value)
    return credentials, message


def push_client(client_type, credentials, received):
    return client_type(
        lambda message, _id, _context: received.append(message),
        FcmRegisterConfig("project", "app", "key", "sender"),
        credentials,
    )


@pytest.mark.parametrize(
    ("header", "name", "value"),
    [
        ("dh=AAAA", "dh", "AAAA"),
        ("salt=BB==", "salt", "BB=="),
        ("dh=AAA", "dh", "AAA="),
        ("dh=AAA; p256ecdsa=CCC", "dh", "AAA="),
        ("p256ecdsa=CCC;dh=AAAAAA", "dh", "AAAAAA=="),
        ("dh=AAA,p256ecdsa=CCC", "dh", "AAA="),
        ("DH = AAA", "dh", "AAA="),
        ('salt="BB"', "salt", "BB=="),
        ("p256ecdsa=CCCC; rs=4096", "dh", None),
        ("AAAA", "dh", None),
    ],
)
def test_header_parameter_is_read_by_name_with_padding(header, name, value):
    assert header_parameter(header, name) == value


@pytest.mark.parametrize(
    ("crypto_key", "encryption"),
    [
        ("dh={key}", "salt={salt}"),
        ("dh={key}; p256ecdsa={key}", "salt={salt}"),
        ("p256ecdsa={key};dh={key}", "salt={salt}"),
        ("DH={key}", 'salt="{salt}"'),
    ],
)
async def test_push_client_reads_messages_the_library_cannot(crypto_key, encryption):
    credentials, message = encrypted_message(crypto_key, encryption)
    received = []
    with pytest.raises(ValueError):
        # Unpadded or signed keys stop firebase-messaging 0.4.5.
        push_client(FcmPushClient, credentials, received)._handle_data_message(message)
    push_client(PushClient, credentials, received)._handle_data_message(message)
    assert received == [{"data": {"deviceId": "appliance"}}]


@pytest.mark.parametrize(
    ("crypto_key", "encryption"),
    [
        ("dh={key}", "salt={salt}"),
        ("DH={key}", "SALT={salt}"),
        ("dh ={key}", "salt ={salt}"),
        # No parameter by that name, so the library's own reading stands.
        ("xx={key}", "abcd={salt}"),
    ],
)
async def test_push_client_reads_every_message_the_library_can(crypto_key, encryption):
    credentials, message = encrypted_message(crypto_key, encryption, padded=True)
    for client_type in (FcmPushClient, PushClient):
        received = []
        push_client(client_type, credentials, received)._handle_data_message(message)
        assert received == [{"data": {"deviceId": "appliance"}}]


async def test_push_client_keeps_the_library_reading_when_it_works():
    credentials, message = encrypted_message(padded=True)
    header = message.app_data[0]
    # The library's decoder ignores stray characters that reading by name would keep.
    header.value = sent = f"{header.value[:40]} ;{header.value[40:]}"
    received = []
    push_client(PushClient, credentials, received)._handle_data_message(message)
    assert received == [{"data": {"deviceId": "appliance"}}]
    assert header.value == sent


@pytest.mark.parametrize("damage", ["payload", "key", "header"])
async def test_push_client_skips_a_message_it_cannot_read(caplog, damage):
    credentials, message = encrypted_message()
    if damage == "payload":
        message.raw_data = message.raw_data[:-1] + bytes([message.raw_data[-1] ^ 1])
    elif damage == "key":
        message.app_data[0].value = "dh=AAAA"
    else:
        del message.app_data[0]
    received = []
    # Returning lets the client acknowledge the message and keep listening.
    push_client(PushClient, credentials, received)._handle_data_message(message)
    assert received == []
    assert "Skipped a Firebase message" in caplog.text


@pytest.mark.parametrize(
    "payload",
    [
        {},
        {"data": None},
        {"data": {"deviceId": "appliance", "value": "bad", "notifSeq": "1", "event_time": "1"}},
        {"data": {"deviceId": "appliance", "value": "201", "notifSeq": "-1", "event_time": "1"}},
        {
            "data": {
                "deviceId": "appliance",
                "value": "201",
                "notifSeq": "1",
                "event_time": "999999999999999999999",
            }
        },
    ],
)
def test_malformed_firebase_messages_are_ignored(payload):
    assert parse_alert(payload) is None


@oven
async def test_firebase_alert_uses_the_appliance_event_entity(hass, cloud_appliance):
    manager = cloud_appliance.entry.runtime_data.alerts
    events = async_capture_events(hass, "state_changed")
    timestamp = dt_util.utcnow() + timedelta(seconds=2)
    manager._on_alert(message(timestamp=timestamp), "persistent-id", None)
    await hass.async_block_till_done()
    event = hass.states.get("event.kitchen_appliance_event")
    assert event.attributes["event_type"] == "kitchen_timer_under_one_minute"
    assert event.attributes["code"] == 209
    assert event.attributes["sequence"] == 50
    assert (
        event.attributes["appliance_timestamp"]
        == dt_util.utc_from_timestamp(int(timestamp.timestamp() * 1000) / 1000).isoformat()
    )

    manager._on_alert(message(device_id="another-appliance", timestamp=timestamp), "x", None)
    manager._on_alert({"data": {"value": "209"}}, "x", None)
    await hass.async_block_till_done()
    assert (
        len(
            [
                item
                for item in events
                if item.data.get("entity_id") == "event.kitchen_appliance_event"
                and item.data.get("new_state")
                and item.data["new_state"].attributes.get("code") == 209
            ]
        )
        == 1
    )


@pytest.mark.parametrize(
    "cloud_appliance",
    [
        {
            "appliance_model": "TEST-OVEN",
            "appliance_type": "1.15.2.5",
            "cav_set_temp": 350,
            "notifs": [],
        }
    ],
    indirect=True,
)
async def test_firebase_alert_checks_push_and_refreshes_a_sensor_after_missed_push(
    hass, cloud_appliance
):
    manager = cloud_appliance.entry.runtime_data.alerts
    client = cloud_appliance.client
    coordinator = cloud_appliance.coordinator
    before = client.state.await_count
    old_sensor = hass.states.get("sensor.kitchen_oven_setpoint").state
    cloud_appliance.state["cav_set_temp"] = 375  # The channel missed this change.
    manager._on_alert(message(code="201"), "first", None)
    manager._on_alert(message(code="203", sequence="51"), "second", None)
    await run_checks(hass, seconds=1)
    client.open_channel.assert_not_awaited()
    await run_checks(hass)
    # One check for the burst. The channel stays silent, so the check reads status
    # and renews push.
    client.open_channel.assert_awaited_once_with("appliance")
    assert client.state.await_count == before + 1
    assert coordinator.push_stats["alert_checks"] == 1
    client.renew_connection.assert_called_once_with()
    assert coordinator.data["cav_set_temp"] == 375
    assert hass.states.get("sensor.kitchen_oven_setpoint").state != old_sensor


@oven
async def test_an_event_starts_one_check_whichever_source_reports_it_first(hass, cloud_appliance):
    coordinator = cloud_appliance.coordinator
    manager = cloud_appliance.entry.runtime_data.alerts
    when = dt_util.utcnow() + timedelta(seconds=1)
    coordinator.async_receive_event(when, 0, 106)
    manager._on_alert(message(code="106", sequence="0", timestamp=when), "copy", None)
    await run_checks(hass)
    cloud_appliance.client.open_channel.assert_awaited_once_with("appliance")
    assert coordinator.push_stats["alert_checks"] == 1


@oven
async def test_status_history_copy_keeps_a_channel_event_open_to_its_firebase_copy(
    hass, cloud_appliance
):
    manager = cloud_appliance.entry.runtime_data.alerts
    coordinator = cloud_appliance.coordinator
    received = []
    coordinator.async_add_event_listener(received.append)
    channel = (dt_util.utcnow() + timedelta(seconds=2)).replace(microsecond=872000)
    coordinator.async_receive_event(channel, 46, 101)
    # A status read or reopened channel reports the same event again in its history.
    coordinator.async_receive_event(channel, 46, 101, source="history")
    # Firebase times have whole seconds.
    copy = channel.replace(microsecond=0)
    manager._on_alert(message(code="101", sequence="46", timestamp=copy), "copy", None)
    await run_checks(hass)
    assert len(received) == 1
    assert coordinator.push_stats["alert_checks"] == 1


@oven
async def test_saved_registration_ids_do_not_change_with_the_callers_dict(cloud_appliance):
    manager = cloud_appliance.entry.runtime_data.alerts
    ids = {"appliance": "first-registration"}
    manager._save(fcm_registration_ids=ids)
    # Otherwise the next save would match the entry's data and never be written.
    ids["other"] = "second-registration"
    assert cloud_appliance.entry.data["fcm_registration_ids"] == {"appliance": "first-registration"}


@oven
async def test_alert_check_counts_changes_push_had_not_reported(hass, cloud_appliance):
    coordinator = cloud_appliance.coordinator
    cloud_appliance.state["cav_at_set_temp"] = True  # The channel missed this change.
    coordinator.async_receive_event(dt_util.utcnow() + timedelta(seconds=1), 52, 201)
    await run_checks(hass)
    assert coordinator.data["cav_at_set_temp"] is True
    assert coordinator.unpushed_changes == {"cav_at_set_temp": 1}
    [record] = coordinator.recent_checks
    assert dt_util.parse_datetime(record.pop("time")) <= dt_util.utcnow()
    assert record == {"reason": "alert", "result": "silent", "renewed": True}


@oven
async def test_alert_check_keeps_sensor_available_when_read_is_rate_limited(hass, cloud_appliance):
    coordinator = cloud_appliance.coordinator
    cloud_appliance.client.state.side_effect = RateLimited(60)
    coordinator.async_receive_event(dt_util.utcnow() + timedelta(seconds=1), 52, 201)
    await run_checks(hass)
    assert coordinator.last_update_success
    assert coordinator.push_stats["skipped_reads"] == 1
    # A rate limit would fail the new connection too.
    cloud_appliance.client.renew_connection.assert_not_called()


@oven
async def test_repeated_firebase_alerts_of_same_type_change_event_state(hass, cloud_appliance):
    manager = cloud_appliance.entry.runtime_data.alerts
    events = async_capture_events(hass, "state_changed")
    first = dt_util.utcnow() + timedelta(seconds=1)
    manager._on_alert(message(code="106", sequence="0", timestamp=first), "one", None)
    manager._on_alert(
        message(code="106", sequence="0", timestamp=first + timedelta(minutes=2)), "two", None
    )
    await hass.async_block_till_done()
    states = [
        item.data["new_state"]
        for item in events
        if item.data.get("entity_id") == "event.kitchen_appliance_event"
        and item.data.get("new_state")
        and item.data["new_state"].attributes.get("event_type") == "refrigerator_setpoint_changed"
    ]
    assert len(states) == 2
    assert states[0].state != states[1].state


@oven
async def test_repeated_sequence_zero_events_each_absorb_one_firebase_copy(hass, cloud_appliance):
    manager = cloud_appliance.entry.runtime_data.alerts
    coordinator = cloud_appliance.coordinator
    received = []
    coordinator.async_add_event_listener(received.append)
    first = dt_util.utcnow() + timedelta(seconds=1)
    second = first + timedelta(minutes=2)
    coordinator.async_receive_event(first, 0, 106)
    manager._on_alert(
        message(code="106", sequence="0", timestamp=first + timedelta(seconds=10)), "one", None
    )
    coordinator.async_receive_event(second, 0, 106)
    manager._on_alert(
        message(code="106", sequence="0", timestamp=second + timedelta(seconds=10)), "two", None
    )
    await hass.async_block_till_done()
    assert [item["code"] for item in received] == [106, 106]


@oven
async def test_firebase_first_absorbs_its_channel_copy(cloud_appliance):
    manager = cloud_appliance.entry.runtime_data.alerts
    coordinator = cloud_appliance.coordinator
    received = []
    coordinator.async_add_event_listener(received.append)

    def millis(when):
        return dt_util.utc_from_timestamp(int(when.timestamp() * 1000) / 1000).isoformat()

    # A nonzero sequence identifies the event, even at another time.
    first = dt_util.utcnow() + timedelta(seconds=1)
    manager._on_alert(message(code="209", sequence="50", timestamp=first), "one", None)
    coordinator.async_receive_event(first + timedelta(seconds=20), 50, 209)
    # Sequence 0 does not, so only a channel event at the same time is a copy.
    second = first + timedelta(minutes=10)
    manager._on_alert(message(code="106", sequence="0", timestamp=second), "two", None)
    coordinator.async_receive_event(second, 0, 106)
    third = second + timedelta(minutes=10)
    manager._on_alert(message(code="106", sequence="0", timestamp=third), "three", None)
    coordinator.async_receive_event(third + timedelta(seconds=10), 0, 106)
    assert [item["appliance_timestamp"] for item in received] == [
        millis(first),
        millis(second),
        millis(third),
        (third + timedelta(seconds=10)).isoformat(),
    ]


@oven
async def test_firebase_first_absorbs_its_status_history_copy(cloud_appliance):
    manager = cloud_appliance.entry.runtime_data.alerts
    coordinator = cloud_appliance.coordinator
    received = []
    coordinator.async_add_event_listener(received.append)
    when = dt_util.utcnow() + timedelta(seconds=2)
    manager._on_alert(message(code="106", sequence="0", timestamp=when), "one", None)
    cloud_appliance.state["notifs"] = [
        {
            "timestamp": (when + timedelta(seconds=1)).isoformat(),
            "notif_seq": 0,
            "notif_type": 106,
        }
    ]
    await coordinator.async_refresh()
    assert [event["code"] for event in received] == [106]


@oven
async def test_firebase_can_be_disabled_without_starting_a_listener(
    hass, cloud_appliance, monkeypatch
):
    entry = cloud_appliance.entry
    started = []
    cleaned = []
    monkeypatch.setattr(
        "custom_components.subzero.fcm.FcmAlerts.start", lambda self: started.append(self)
    )
    monkeypatch.setattr(
        "custom_components.subzero.fcm.FcmAlerts.start_cleanup", lambda self: cleaned.append(self)
    )
    hass.config_entries.async_update_entry(entry, options={"firebase_alerts": False})
    await hass.config_entries.async_reload(entry.entry_id)
    assert not hasattr(entry.runtime_data, "alerts")
    assert not started and not cleaned

    hass.config_entries.async_update_entry(
        entry,
        data={
            **entry.data,
            "fcm_psid": "test-psid",
            "fcm_registration_ids": {"appliance": "registration-id"},
        },
    )
    await hass.config_entries.async_reload(entry.entry_id)
    assert not started
    assert len(cleaned) == 1


@oven
async def test_disabled_firebase_keeps_sensor_and_channel_events_working(hass, cloud_appliance):
    entry = cloud_appliance.entry
    hass.config_entries.async_update_entry(entry, options={"firebase_alerts": False})
    await hass.config_entries.async_reload(entry.entry_id)
    assert not hasattr(entry.runtime_data, "alerts")

    await cloud_appliance.update(
        {
            "cav_set_temp": 375,
            "notifs": [
                {
                    "notif_seq": 7,
                    "notif_type": 201,
                    "timestamp": (dt_util.utcnow() + timedelta(seconds=1)).isoformat(),
                }
            ],
        }
    )
    assert entry.runtime_data.coordinators["appliance"].data["cav_set_temp"] == 375
    assert hass.states.get("sensor.kitchen_oven_setpoint").state not in {
        "unknown",
        "unavailable",
    }
    assert (
        hass.states.get("event.kitchen_appliance_event").attributes["event_type"]
        == "oven_preheated"
    )


@oven
async def test_disabling_removes_only_our_saved_subscriptions(cloud_appliance):
    manager = cloud_appliance.entry.runtime_data.alerts
    client = cloud_appliance.client
    client.alert_types = AsyncMock(return_value={101, 106})
    client.unsubscribe_alerts = AsyncMock()
    manager._save(fcm_psid="test-psid", fcm_registration_ids={"appliance": "registration-id"})
    assert await manager._remove_subscriptions("test-psid", set())
    client.unsubscribe_alerts.assert_awaited_once_with("test-psid", "appliance", {101, 106})
    assert manager.entry.data["fcm_registration_ids"] == {}


@oven
async def test_disabled_cleanup_does_not_connect_to_firebase(cloud_appliance, monkeypatch):
    manager = cloud_appliance.entry.runtime_data.alerts
    client = cloud_appliance.client
    client.alert_types = AsyncMock(return_value={101})
    client.unsubscribe_alerts = AsyncMock()
    manager._save(fcm_psid="test-psid", fcm_registration_ids={"appliance": "registration-id"})
    monkeypatch.setattr(
        "custom_components.subzero.fcm.PushClient",
        lambda *args, **kwargs: pytest.fail("Firebase connection started while disabled"),
    )
    await manager._cleanup_loop()
    client.unsubscribe_alerts.assert_awaited_once_with("test-psid", "appliance", {101})


@oven
async def test_subscriptions_survive_registration_http_500(cloud_appliance):
    manager = cloud_appliance.entry.runtime_data.alerts
    client = cloud_appliance.client
    client.alert_registration = AsyncMock(return_value=None)
    client.register_for_alerts = AsyncMock(side_effect=ApiError("HTTP 500", status=500))
    client.alert_types = AsyncMock(return_value=set())
    client.subscribe_alerts = AsyncMock()

    assert not await manager._sync("test-psid", "test-token")
    client.subscribe_alerts.assert_awaited_once()
    args = client.subscribe_alerts.await_args.args
    assert args[:2] == ("test-psid", "appliance")
    assert {206, 209, 221} <= args[2].keys()
    assert "door" not in args[2][216]
    assert "door" in args[2][218]
    first_id = client.register_for_alerts.await_args.args[0]["id"]

    await manager._sync("test-psid", "test-token")
    assert client.register_for_alerts.await_args.args[0]["id"] == first_id
    assert cloud_appliance.entry.data["fcm_registration_ids"]["appliance"] == first_id


@oven
async def test_matching_registration_token_needs_no_update(cloud_appliance):
    manager = cloud_appliance.entry.runtime_data.alerts
    client = cloud_appliance.client
    client.alert_registration = AsyncMock(
        return_value={"id": "existing-id", "fcmToken": "test-token"}
    )
    client.register_for_alerts = AsyncMock()
    client.alert_types = AsyncMock(return_value=set(ALERT_LOCATION_KEYS) & set(range(200, 300)))
    client.subscribe_alerts = AsyncMock()
    assert await manager._sync("test-psid", "test-token")
    client.register_for_alerts.assert_not_awaited()
    client.subscribe_alerts.assert_not_awaited()


@oven
async def test_range_subscription_names_right_and_left_cavities(cloud_appliance):
    manager = cloud_appliance.entry.runtime_data.alerts
    cloud_appliance.coordinator.data.update(
        {"appliance_type": "1.8.2.5", "cav2_at_set_temp": False}
    )
    client = cloud_appliance.client
    client.alert_registration = AsyncMock(return_value=None)
    client.register_for_alerts = AsyncMock()
    client.alert_types = AsyncMock(return_value=set())
    client.subscribe_alerts = AsyncMock()
    assert await manager._sync("test-psid", "test-token")
    keys = client.subscribe_alerts.await_args.args[2]
    assert "right" in keys[201] and "left" in keys[202]
    assert "left" in keys[216] and "right" in keys[218]


@oven
async def test_firebase_listener_saves_credentials_and_stops(cloud_appliance, monkeypatch):
    manager = cloud_appliance.entry.runtime_data.alerts
    synced = asyncio.Event()
    instances = []

    class FakePush:
        def __init__(self, callback, config, credentials, save, **kwargs):
            self.do_listen = False
            self.tasks = []
            self.credentials = {"fcm": {"registration": {"token": "test-token"}}}
            self.save = save
            instances.append(self)

        async def checkin_or_register(self):
            self.save(self.credentials)
            return "test-token"

        async def start(self):
            self.do_listen = True

        async def stop(self):
            self.do_listen = False

    async def sync(psid, token):
        assert psid == manager.entry.data["fcm_psid"]
        assert token == "test-token"
        synced.set()
        return True

    monkeypatch.setattr("custom_components.subzero.fcm.PushClient", FakePush)
    monkeypatch.setattr(manager, "_sync", sync)
    manager._task = asyncio.create_task(manager._run())
    await asyncio.wait_for(synced.wait(), timeout=1)
    await manager.stop()
    assert manager.entry.data["fcm_credentials"] == instances[0].credentials
    assert len(manager.entry.data["fcm_psid"]) == 16
    assert not instances[0].do_listen


@oven
async def test_stopped_firebase_listener_task_is_restarted(cloud_appliance, monkeypatch):
    manager = cloud_appliance.entry.runtime_data.alerts
    recreated = asyncio.Event()
    instances = []

    class FakePush:
        def __init__(self, callback, config, credentials, save, **kwargs):
            self.do_listen = False
            self.tasks = []
            self.credentials = {"fcm": {"registration": {"token": "test-token"}}}
            instances.append(self)
            if len(instances) == 2:
                recreated.set()

        async def checkin_or_register(self):
            return "test-token"

        async def start(self):
            self.do_listen = True
            self.tasks = [asyncio.get_running_loop().create_future()]
            self.tasks[0].set_result(None)

        async def stop(self):
            self.do_listen = False

    async def sync(psid, token):
        return True

    monkeypatch.setattr("custom_components.subzero.fcm.PushClient", FakePush)
    monkeypatch.setattr("custom_components.subzero.fcm.HEALTH_CHECK_INTERVAL", 0.01)
    monkeypatch.setattr(manager, "_sync", sync)
    manager._task = asyncio.create_task(manager._run())
    await asyncio.wait_for(recreated.wait(), timeout=1)
    await manager.stop()
    assert len(instances) >= 2
