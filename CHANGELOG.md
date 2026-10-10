# Changelog

## Unreleased

### Changed

- The integration type is **hub** again, as Home Assistant documents for integrations that add several devices. The **Add account** label does not depend on it.

## 0.8.2 (2026-10-09)

### Changed

- The integration page's add button reads **Add account** instead of **Add hub**, since each entry is a Sub-Zero account. Home Assistant versions without custom button labels keep showing Add hub.
- The integration type changed from hub to service.

## 0.8.1 (2026-10-09)

### Upgrade notes

- **Firebase appliance alerts are now opt-in.** New installations start with them off; turn them on during setup or under **Configure**. Installations that were already receiving them keep them on.

### Changed

- **Sabbath mode** now allows one change: turning it off. Choose **Normal** in a refrigerator or wine unit's **Mode** control, or **Off** in a dishwasher's. Every other control stays blocked while Sabbath mode is on, as it is at the appliance. Previously, Sabbath mode could only be turned off at the appliance.
- **Timestamps without an offset** are read in the appliance clock's time zone, taken from the clock time each push reports. Status reads report the clock in UTC, so they no longer affect it. Until the first push, Home Assistant's time zone is used. When the appliance's offset matches Home Assistant's time zone, that zone is used, so daylight saving changes are handled.
- **Kitchen timer writes** are confirmed only when the timer's end time is within 65 seconds of the requested duration. The appliance clock has been seen within about 15 seconds of real time.

### Added

- **Cancel wash cycle** is also available while a delayed start counts down. A delayed start set remotely did not report the Delayed status in testing, so the button was missing. During a delay, the cancel counts only once the delay ends.
- Appliance diagnostics show `clock_zone`, the time zone used for timestamps without an offset.
- Appliance diagnostics list `recent_silent_channels` and `recent_connection_renewals`, the times of the last 10 of each. Comparing them across appliances shows whether the shared connection went quiet or one appliance's channel did.

### Fixed

- A rejected kitchen timer write could be reported as confirmed when a late update showed a timer restarted for another reason. An end time that could not be read also counted as a restart.
- The Firebase alert registration lookup now reads Sub-Zero's list response, as the app does. Before, an existing registration was not found and was created again on every sync.
- An appliance event no longer fires twice when Firebase delivers it before the live channel. Firebase times have whole seconds while channel times have milliseconds, so the copies never matched exactly. A copy is now matched by code and sequence within five minutes. For sequence 0, which some appliances use for every event, the match must be within five seconds.
- Removing the integration now removes its Sub-Zero alert subscriptions. Sub-Zero offers no way to delete the registration record itself, so that remains but receives no alerts.

### Documentation

- PROTOCOL.md records the measured channel silences, the `time` offsets of pushes and status reads, notification timestamp formats and sequence numbers, the app's dishwasher cancel rules, the Firebase registration lookup, and the stale oven temperature reading.
