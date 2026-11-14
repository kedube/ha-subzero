# Changelog

Versions have two decimal places and go up by 0.01: 1.00, 1.01, up to 1.99, then 2.00.

## 1.09

### Added

- **Translated entity names.** Entity names follow Home Assistant's language in German, French, Dutch, Spanish, Simplified Chinese, Italian, Polish, and Swedish. The entity IDs you already have don't change. States and option names, such as **Bake**, stay in English, so automations keep working.
- **Repairs.** Home Assistant raises a repair when an appliance you selected is no longer on your Sub-Zero account, and when Firebase appliance alerts fail to start three times in a row. Each repair says what to do and clears itself once the cause is gone, or when you turn alerts off or remove the account.
- An oven's climate entity shows whether the cavity is off, preheating, or heating at its temperature.
- Display temperatures and filter life remaining keep long-term statistics, so their graphs go back further than the recorder's history.
- In the sidebar panel, tapping the name of a control or reading opens Home Assistant's details dialog for its entity. Buttons such as **Start oven** don't do this, so the panel's confirmation can't be skipped.
- **Door open** in the panel says for how long, such as **Door open · 4 min**.
- The panel's overview cards show each appliance's latest event and when it happened.
- **Show 30 days** under Recent events lists up to 200 events. Home Assistant keeps 10 days of history by default, so the list is usually shorter.
- Turning an oven off from the panel asks first, since it ends what's cooking.

### Fixed

- Opening the live connection to Sub-Zero, including its handshake, now has a 30-second limit, after which it's retried. Before, only the reply to the handshake had a limit, so a connection that stalled while opening held up reconnecting.
- An appliance whose updates fail to open is marked unavailable at once. Before, this waited for the next message or keep-alive.
- When Sub-Zero rate-limits a retry for an appliance that failed to open, the integration waits as asked and keeps the connection, so the other appliances keep updating. Before, every appliance reconnected.
- Recent events in the panel shows the newest event at once. Before, it was always one event behind while the appliance's view was open.
- Kitchen timer: tapping the preset that equals the minutes left now restarts the timer, and a custom time you're typing isn't overwritten as the timer counts down.
- Ice delay **Later** gives the right time across a daylight saving change.
- Setpoints in the panel show the unit of their own entity, and preheat progress is right when the temperature and the setpoint use different units.
- Numbers in the panel follow Home Assistant's 1'234.56 format.
- After Home Assistant reconnects, the panel reloads its appliances, or shows the error with **Try again**, instead of keeping an outdated list.
- An appliance on two Sub-Zero accounts is listed once in the panel.
- An oven that is off is never shown as self-cleaning, in its status or in the drawing of a range, even when its mode still says Self clean.
- The hood light control no longer lags after a change.
- Controls no longer keep their state when you move directly from one appliance's view to another's.
- A control changed again before the first change finishes stays busy until both finish.
- The Appearance preview shows exactly what saving gives, such as a wine storage's glass door when you choose that form.
- Knob color is offered for M Series wall ovens, which are drawn with knobs, and the editor shows it only for the Professional style, the one drawn with knobs.
- 24″ and 36″ wall ovens, such as steam and speed ovens and the 36″ L Series, are drawn at their own width instead of as 30″ ovens.
- A dishwasher's time left in the panel counts down with the display.
- A custom panel color that reads as wood, such as tan, gets a wood grain on a dishwasher, as it does on a refrigerator. The eight preset colors are unchanged.
- Screen readers describe wall ovens the way they describe ranges, such as "heating 350°", "preheated 350°" or "off", with the probe, Remote Ready and the kitchen timer.
- The panel's offline label reads **Offline** in Dutch, Polish, and Swedish, like the rest of the panel in those languages.

### Changed

- At startup, appliances that haven't sent their state are read all at once instead of one after another, so Home Assistant starts faster with several appliances.
- The **Active faults** history keeps the number of faults, not each fault's details, which take a lot of space in the recorder. The current details are still shown on the entity.

### Security

- The Validate workflow's third-party actions are pinned to exact commits.
- The panel's drawings stay well formed whatever ids they're given, and the Appearance preview's drawing uses ids of its own.

### Development

- Dependabot checks the workflow actions, the panel's npm packages, and the Python test requirements monthly.
- The panel takes knob ovens and left and right ovens from the integration instead of keeping its own copies, and a test checks that the constants it still copies match the integration's.
- The panel's history, clock, and drawing evaluation each have one implementation. The drawings share one overlay, one set of material helpers, and one oven-state model.
- New tests cover sign-in error paths, Firebase alerts, repairs, translated names, and the connection's timeouts and rate limits. A new panel test draws about 8,700 appliance variants without a browser and checks each drawing.

### Documentation

- The README describes repairs, statistics, translated entity names, and the oven's climate states. PROTOCOL.md describes the connect timeout, how channel results and rate limits are handled, and the parallel reads at startup.

## 1.08

### Fixed

- **Start oven** now works on Wolf ovens other than E series and M series. These ovens report no cooking mode or temperature while they wait in Remote Ready, so Start oven stayed unavailable. Now you choose the cooking mode and temperature in Home Assistant or the sidebar panel while the oven waits in Remote Ready, then press **Start oven**. As the app does, Home Assistant keeps your choice and sends it with the start. E series and M series ovens still start with the mode and temperature set at the oven.
- Firebase appliance alerts no longer stop with `Incorrect padding, shutting down FcmPushClient`, logged every minute. The Firebase library can't read alerts whose encryption details arrive in a newer format, and its fix isn't released yet, so the integration now reads those alerts itself.
- `climate.set_temperature` with `hvac_mode: heat` on an oven checks the temperature you give it, instead of the oven's previous setpoint.

### Changed

- Choosing a cooking mode for a remote start fills in the app's usual temperature for it, such as 350 °F for Bake, which you can change before starting.
- The mode and temperature chosen for a start are discarded when Remote Ready ends, on an appliance error, or when the connection to Sub-Zero drops, so an old choice can't start the oven later. They can't be chosen while Home Assistant is reconnecting.

### Diagnostics

- An appliance's diagnostics show the mode and temperature chosen for its remote start that haven't been sent yet.

### Documentation

- Development setup installs `pytest-homeassistant`, the test package for Home Assistant 2026.11 and later. Tests run on 2026.8 and 2026.11.

## 1.07

### Changed

- When the live connection to Sub-Zero drops, appliances stay available for up to 2 minutes while the integration reconnects. Before, a short drop, such as an internet blip, made every entity unavailable and logged an error for each appliance. Entities keep their last values meanwhile, and the **Live reporting mode** sensor shows **Disconnected**. Reconnecting reopens every appliance's updates, which brings them all up to date. If reconnecting takes longer than 2 minutes, the appliances become unavailable as before.
- A connection that drops after working for at least 2 minutes is retried at once, as the Sub-Zero app does, instead of after 30 seconds.
- Checks while the connection is down read the appliance's state directly instead of waiting 16 seconds for an answer that can't arrive.

### Diagnostics

- Each connection that was closed or lost records how: a close from Sub-Zero with its code and reason, or a dropped network connection.
- Connection attempts that failed are listed with when and why, such as a network error.

## 1.06

### Fixed

- Home Assistant 2026.11 no longer logs three warnings at startup asking you to report Sub-Zero's temperature controls to the integration's author. 2026.11 renamed how climate entities report their temperatures, and the old names stop working in 2027.11.
- Kitchen timer numbers no longer read millions of minutes or unknown while a timer runs, and a timer set from Home Assistant on a range is now confirmed instead of failing. Ovens report a timer start time that can be decades early or after the timer's end, and the number was the end minus that start. It now shows the minutes left, counting down each minute, as the app does.

### Changed

- From Home Assistant 2026.11, Sub-Zero is marked as reaching its appliances through the cloud when you browse for an integration to add.
- **Dismiss kitchen timer** also stops a running timer, like the app's Cancel. Before, it only cleared a finished one.
- On ovens with two kitchen timers, the first timer's entities are named **Kitchen timer 1**, so Home Assistant lists them before **Kitchen timer 2**. Existing entities keep their entity IDs.

### Removed

- The **Kitchen timer start** and **Kitchen timer 2 start** sensors. Ovens report wrong start times, and the app never shows them. The end time sensors stay.

### Documentation

- The README notes which appliances can't connect to Sub-Zero's cloud, such as Wolf steam and speed ovens, microwaves, and cooktops, so they never appear in Home Assistant.

## 1.05

### Fixed

- The integration loads on Home Assistant 2026.11. It failed to set up its devices there, because 2026.11 changed how device details are passed.

### Changed

- From Home Assistant 2026.11, Sub-Zero is listed under **Appliances & cleaning** when you browse for an integration to add.

## 1.04

### Fixed

- The sidebar panel's drawings are now in your language too. Each drawing's description for screen readers, and the words on a dual fuel range's touchscreen, such as Preheated, Timer and Lock, were always in English. Legends printed on the appliance itself, such as a wall oven's knob legends, stay in English, as Wolf prints them.

## 1.02

### Added

- **Sidebar panel.** A **Sub-Zero** entry in the sidebar shows each appliance as a card with a drawing of it, modeled on its product photos, that follows its live state: doors swing open, ovens glow while they heat, a dishwasher counts down. Cards are grouped by area. An appliance's full view has every control, its recent events, and Refresh. Locked controls say why, and starting an oven or a dishwasher, or canceling a wash, asks first.
- **Show Sub-Zero in the sidebar** in Configure. It's on by default, so the panel appears after upgrading; turn it off to remove the panel.
- **Appearance**, in an appliance's full view, for admins: stainless or a custom panel color, knob color, handle, an oven's style, and the appliance's form when the drawing doesn't match. Everyone sees the same Appearance. The default is stainless with red knobs.
- Diagnostics show whether the panel is in the sidebar, and how it draws each appliance.

### Development

- The panel's source is in `frontend/` (TypeScript and Lit). The built bundle is committed in `custom_components/subzero/frontend/`, and the Validate workflow checks that it matches the source.

## 1.01

### Added

- **Follow-up checks** and **Follow-up check interval** in Configure. Follow-up checks are the checks that run for 10 minutes after an event, and for up to 15 minutes while a door is open, whenever the interval passes without an update. They stay on by default, and the interval can be set from 1 to 10 minutes, with 2 as the default. With them off, each event still gets its one check two seconds later. Diagnostics show both settings.

## 1.00

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
