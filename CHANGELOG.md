# Changelog

Versions have two decimal places and go up by 0.01: 1.00, 1.01, up to 1.99, then 2.00.

## 1.01 (unreleased)

### Added

- **Follow-up checks** and **Follow-up check interval** in Configure. Follow-up checks are the checks that run for 10 minutes after an event, and for up to 15 minutes while a door is open, whenever the interval passes without an update. They stay on by default, and the interval can be set from 1 to 10 minutes, with 2 as the default. With them off, each event still gets its one check two seconds later. Diagnostics show both settings.

## 1.00 (unreleased)

The first release as a standalone integration, at [kedube/ha-subzero](https://github.com/kedube/ha-subzero). It continues from releases 0.6.2 to 0.9.0, whose notes remain on the [releases page](https://github.com/kedube/ha-subzero/releases). This entry covers everything since 0.8.6, including what 0.8.7 and 0.9.0 shipped.

### Upgrading

- Your entries, devices, entities, and entity IDs carry over, and there is nothing to set up again. HACS offers 1.00 as an update to any 0.x version.
- **Periodic status checks are gone, along with the status refresh interval option.** Live updates keep state, and the integration checks them after events and while a door is open. For checks on a schedule as well, turn on the new **Shared connection check** in Configure.
- In diagnostics, `periodic_reads` is now `check_reads`.

### Version numbers

- Releases are numbered 1.00, 1.01, and so on, up to 1.99 and then 2.00. Tags use the bare version, such as `1.01`, with no `v`.
- There are no pre-releases, because Home Assistant doesn't accept a version such as `1.01b1`.

### Added

- **Sub-Zero: Refresh** (`subzero.refresh`) brings the selected appliances up to date and returns when it's done, restoring live updates if they had stopped. Call it in an automation before acting on a sensor's current value.
- **Shared connection check**, off by default. Whenever no update has arrived for its interval, it checks the appliance checked least recently. The interval is set in Configure, from 1 to 60 minutes, and defaults to 3. Silence has always affected every appliance at once, so this finds a stopped connection within about one interval.
- Diagnostics list each appliance's last 20 checks, with their reason, result, and timing, including an answer that arrives after a check stopped waiting. They count checks by kind (`alert_checks`, `watch_checks`, `connection_checks`, `manual_checks`), and the integration download lists the last 10 connections and why each ended.

### Changed

- Every new appliance event, whether Firebase or the live connection reports it first, checks that appliance two seconds later. The check asks the appliance to resend its state and, if it doesn't answer, reads its state and reconnects. Before, only a Firebase alert started a status read, which never restored live updates.
- For 10 minutes after an event, and for up to 15 minutes while a door is open, a check runs whenever 2 minutes pass without an update.
- A status read, such as one confirming a control, no longer delays a check.
- The device registry is updated only when an appliance's model, serial number, or firmware changes, not on every update.
- The documentation is rewritten, and the integration's documentation, issue, and code owner links point to the new repository.
- The integration has its own icon and logo, an original snowflake, instead of Sub-Zero's trademarked one, since it's an unofficial integration. The logo has a version for dark themes.

### Fixed

- A check that fails unexpectedly no longer stops later checks.
- A check whose answer arrives just after the 16-second wait no longer reconnects every appliance.
- An update from an appliance ends a silent spell, so a connection that goes quiet again later can reconnect again. Before, an appliance that stayed busy after a reconnect kept the next one from happening.
- A check that comes due while another is still running waits instead of running alongside it.
- Checks no longer start while Home Assistant is shutting down.
- Firebase registration changes saved one after another are all written. Before, changes after the first could be lost on restart.
- Removing the integration logs each appliance whose alert subscriptions couldn't be removed, even when a later appliance times out.
- A response that isn't valid text is reported as an invalid response instead of an unexpected error.
