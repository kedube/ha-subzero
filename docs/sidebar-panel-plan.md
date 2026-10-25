# Sub-Zero sidebar panel: implementation plan

Final, 2026-10-24. Not committed.

## 1. Decisions

From the 2026-10-24 questions:

- **Panel only.** It's a sidebar panel. No Lovelace cards and no dashboard resource.
- **Sidebar entry:** "Sub-Zero", `mdi:fridge-outline`, visible to every user. The name is a brand, so it isn't translated.
- **On by default.** A Configure option turns it off.
- **Layout:** an overview with one card per appliance in the GE appliance card's style, grouped by area. Tapping a card opens a full view with every control.
- **Coverage:** every appliance the integration supports gets a detailed drawing, including forms and older generations outside the original list. Anything the panel can't recognize gets a generic drawing for its type.
- **Only this integration's appliances.** Appliances from esphome-subzero-ble aren't included.
- **Appearance setting:** set per appliance and seen the same by every user. Only admins can change it; everyone can view and control. Defaults are stainless with red knobs. Finish, knob color and style override what the model number doesn't tell us.
- **Realistic drawings:** each drawing is modeled on the actual product photos of that model and should read like a product rendering, not a cartoon (the owner's addition, 2026-10-24). Photos are references only: they're never traced, embedded or committed.
- **No branding in drawings:** no Sub-Zero, Wolf or Cove logos or badges. Red knobs are a registered Wolf trademark and are drawn because you chose them as the default.
- **Ovens that are off** read "Off" instead of their last, stale temperature. The window keeps its normal look and glows only while the cavity heats. The sensor entity is unchanged.
- **Range ovens:** 30″ and 36″ ranges have one oven. 48″ ranges have two, with the larger on the right (`cav`, "Right oven"), as on your DF48850. 60″ ranges have two ovens of the same size.
- **One release:** everything ships together in the next version (§8).

## 2. How it fits together

```
 Appliances ──push──▶ coordinators ──▶ entities (sensor, climate, select, …)
                          │                    ▲            │
                          │ structure,         │ service    │ live state
                          │ locks              │ calls      │ (hass.states)
                          ▼                    │            ▼
               panel_api.py (websocket) ────────────▶ <subzero-panel> (Lit)
               appliance_spec.py (model → drawing)       overview / full view
               appearance store (.storage)              drawings, controls
```

- The panel reads live values from `hass.states`. It controls appliances only through the existing entities and the `subzero.*` actions. Sabbath mode, self-clean, wash-cycle locks and Remote Ready keep working exactly as they do on device pages.
- A websocket subscription sends structure the frontend can't derive cleanly:
  - which entity holds which property key;
  - the drawing spec worked out from the model number and appliance type;
  - the Appearance setting;
  - lock reasons.

## 3. Backend (Python)

### 3.1 Option

- `const.py`: add `CONF_SHOW_SIDEBAR_PANEL = "show_sidebar_panel"` and `DEFAULT_SHOW_SIDEBAR_PANEL = True`. These are ha-norman's names.
- `config_flow.py`: add a `BooleanSelector` to the options step, labeled "Show Sub-Zero in the sidebar". Save it only when it's `False`, as Follow-up checks does.
- Add a `sidebar_panel_enabled(entry)` helper next to `follow_up_checks_enabled`.
- Add the label and description to `strings.json` and the 8 translations. `test_translations.py` already checks they match.
- No migration is needed, because a missing key means on. Existing users get the panel when they upgrade. Say so in CHANGELOG.
- `OptionsFlowWithReload` already reloads the entry. Setup and unload then bring the sidebar up to date.

### 3.2 `frontend.py`

Modeled on `ha-norman/custom_components/norman/frontend.py`, without the Lovelace part:

- **Static files:** serve `custom_components/subzero/frontend/` at `/subzero` with `cache_headers=True`.
  - The module URL carries `?v=<manifest version>-<first 8 hex digits of the bundle's SHA-256>`. The hash is read once at setup, in the executor.
  - So every build gets a new URL, not just every release, and a test install before the release never loads a cached panel.
- **Panel registration:** `panel_custom.async_register_panel(frontend_url_path="sub-zero", webcomponent_name="subzero-panel", sidebar_title="Sub-Zero", sidebar_icon="mdi:fridge-outline", module_url=…, require_admin=False)`.
  - The panel path must differ from the static path. A reload of `/subzero` would hit the static handler instead of the frontend; ha-norman learned this the hard way.
- **One panel for the integration:** it's in the sidebar while any entry set up since Home Assistant started still exists, is enabled and has the option on, and it lists those entries' appliances.
  - An entry that's reloading or retrying setup keeps the panel, and keeps its appliances in the panel, marked unavailable until setup finishes. Without this, a reload (after any Configure change or a reauth) would empty open panels or remove the panel and send viewers elsewhere.
  - Disabling an entry, turning its option off or removing it takes the panel away at once.
- **Best effort:** a failure is logged and never fails setup.
- **`manifest.json`:** add `after_dependencies: ["frontend", "http", "panel_custom"]`, as ha-norman does.

### 3.3 `panel_api.py` (websocket)

**`subzero/panel/subscribe`** (all users) sends a snapshot, then per-appliance updates. One appliance looks like this:

```json
{
  "device_id": "<HA device id>",
  "appliance_id": "<Sub-Zero device id>",
  "entry_id": "…",
  "brand": "Wolf",
  "model": "DF48850SP",
  "appliance_type": "17.8.2.0",
  "spec": {"family": "range", "width": 48, "fuel": "dual_fuel", "burners": 8,
           "surfaces": [], "ovens": {"cav": "right", "cav2": "left"}},
  "appearance": {"finish": "stainless", "knobs": "red"},
  "entities": {"cav_set_temp": {"climate": "climate.range_right_oven",
                                "sensor": "sensor.range_right_oven_setpoint"}, "…": {}},
  "locks": {"cav_cook_mode": "self_clean"},
  "available": true
}
```

- **The entity map** comes from the entity registry. The unique ID is `{appliance_id}_{key}`; strip the known appliance ID prefix to get the key.
  - Keys are grouped by domain, because some keys have entities on two platforms. Setpoints, for example, are both a number and a climate entity.
  - Disabled entities are left out.
- **Updates are sent when** any of these happens, and only when something changed:
  - entities are added, removed or renamed (`EVENT_ENTITY_REGISTRY_UPDATED`);
  - lock reasons change after a coordinator update;
  - the Appearance setting is saved;
  - an entry is set up or unloaded.
- **Names and areas** come from `hass.devices` and `hass.areas` in the frontend. They aren't sent.

**`subzero/panel/set_appearance`** is `@require_admin` and takes `{appliance_id, appearance}`. It checks the values against the appliance's family, saves them and pushes an update.

### 3.4 `appliance_spec.py` (model and type → drawing spec)

This is a pure module with no Home Assistant imports, tested table-first.

- **Inputs:**
  - the model string, normalized: uppercase, with `/`, `-` and spaces removed;
  - the series from `appliance_type()`, named as in `FAULT_METADATA_APPLIES_TO_BY_SERIES`;
  - the properties present, using the existing `is_fridge`, `is_wine`, `is_oven`, `is_dishwasher`, `is_hood`, `is_ice_maker` and `has_left_and_right_ovens`, plus the zone and door keys.
- **Order:** model pattern first, then series, then properties, then generic.
- **Output:**
  - `family` and `form`;
  - `width` in inches;
  - modifiers: glass door, dispenser (none, external or internal), ice, zones, doors and drawers with their door keys, handle and style hints, front (panel or stainless);
  - for ranges: fuel, burners, surfaces, ovens and their relative widths;
  - for wall ovens: single or double, series (L, E, M) and style (Professional, Transitional, Contemporary).
- **Sources for the pattern table**, all research only and kept out of the repo:
  - the app's model-to-name table, which gives width and form (`devices/models/default_names.dart`: `48" Side-by-Side`, `30" Over-and-Under`, `24" Drawer Refrigerator`, …);
  - the app's rangetop parser (`rangetop_cooking_surface.dart`: griddle, double griddle, charbroiler, French top);
  - the demo catalog's model numbers (`services/demo/demo_service.dart`);
  - Sub-Zero and Wolf model nomenclature.
- **When detection is wrong or generic,** the Appearance setting can override the form (§3.5).

### 3.5 Appearance store

- Kept in `Store(hass, 1, "subzero.panel")` as `{appliance_id: {...}}`. Only values that differ from the defaults are saved.
- Fields by family:

| Family | Fields (default first) |
|---|---|
| Refrigeration (incl. wine, beverage, ice) | finish: stainless / panel-ready (panel color: white, cream, gray, navy, sage, black, walnut, oak) / black; handle: from model, else tubular / pro / none; form override |
| Range | knobs: red / black / brushed stainless; form override (rangetop) |
| Wall oven | style: from model, else Professional / Transitional / Contemporary; finish: stainless / black / carbon; knob color for knob models |
| Dishwasher | finish: stainless (the door kit) / panel-ready (panel color); handle: tubular / pro / none. The model never says which front: WS in DW2450WS is the water softener. |
| Hood | type: from model, else wall / island / insert |

- **Cleanup:** settings are dropped for appliances that no entry has any more, at setup and in `async_remove_entry`, the same way excluded entities are cleaned up in `__init__.py`.

### 3.6 Lock reasons

- `control_lock()` returns English sentences. Give each reason a stable code (`sabbath`, `self_clean`, `proof_light`, `wash_not_idle`, `cycle_no_option`, `delay_not_idle`, `cycle_no_delay`) and keep the messages for errors.
- The subscription sends codes, and only for keys that have entities on that appliance. The panel shows the reason translated, next to the disabled control.

### 3.7 Diagnostics, docs

- **Integration diagnostics:** add `panel: {enabled_entries, registered, module_url}` and each appliance's spec and Appearance.
- **README:**
  - a new "Sidebar panel" section with light and dark screenshots from the `.private/screenshots` harness;
  - an Options table row for the new option.
- **CHANGELOG:** an entry, including that the panel appears by default after upgrading.

### 3.8 Backend tests

- **`test_panel.py`:** modeled on ha-norman's 14 `test_sidebar_panel.py` tests.
  - The panel is registered by default and not when the option is off.
  - It's removed on unload.
  - Two entries share one panel.
  - Toggling the option through the options flow updates the sidebar.
  - The static path is registered once, and the module URL carries the version.
  - Registration failures don't break setup.
- **`test_panel_api.py`:**
  - the snapshot for your five captures;
  - keys on two platforms (number and climate);
  - disabled entities left out;
  - updates on entity discovery, lock changes and Appearance saves;
  - `set_appearance` refuses non-admins and invalid values.
- **`test_appliance_spec.py`:** every model in the research tables and fixtures maps to its expected spec. Unknown models fall back by series and properties.
- **Options flow:** the new toggle is saved only as `False`.

## 4. Frontend

### 4.1 Toolchain

- **Same stack as ha-energy-monitor-card and ha-light-control:**
  - Lit 3, TypeScript (strict) and esbuild;
  - vitest with happy-dom for unit tests;
  - playwright-core for screenshots.
- **Source** lives in a top-level `frontend/`. `npm run check` runs typecheck, tests and build.
- **The build** is one minified ES module, `custom_components/subzero/frontend/subzero-panel.js`, committed.
  - It can't be under `dist/`, which `.gitignore` ignores.
  - `release.yml` builds the HACS zip with `git archive` of `custom_components/subzero`, so the zip picks the bundle up without changes.
- **CI:** add a `frontend` job to `validate.yml`. It runs `setup-node`, `npm ci` and `npm run check`, then `git diff --exit-code custom_components/subzero/frontend` so a stale bundle fails.
- **Self-contained:** drawings are SVG generated in code, with no image files. The panel uses only the `hass` object (`states`, `devices`, `areas`, `callService`, `callWS`, `connection`, `formatEntityState`, `language`, `locale`, `user`, `themes`). It doesn't use Home Assistant's internal `ha-*` elements, which a custom panel can't count on being loaded and which change between releases. All controls are our own, in the GE card's style.

Layout:

```
frontend/src/
  subzero-panel.ts        panel element, routing, toolbar
  data/                   subscription, joins with hass.devices/areas/states
  families/               per-family view models: refrigeration, oven, dishwasher, hood, ice
  views/                  overview.ts, appliance.ts (full view), appearance.ts
  card/                   GE-style frame: header, status pill, display, info panel, confirm bar
  controls/               stepper, segmented select, toggle, action+confirm, duration, countdown
  drawings/               materials.ts, refrigeration.ts, range.ts, wall-oven.ts, hood.ts,
                          dishwasher.ts, generic.ts
  i18n/                   en, de, es, fr, it, nl, pl, sv, zh-Hans
frontend/gallery/         dev page: every variant × finish × state, light and dark
frontend/test/            unit tests
```

### 4.2 Panel shell

- **Routes:** `/sub-zero` is the overview and `/sub-zero/<device_id>` is an appliance's full view. Both can be linked to directly, and Back works.
- **Toolbar:** "Sub-Zero", with a menu button on narrow screens (fires `hass-toggle-menu`) and a back button in the full view.
- **Grouping:**
  - by device area, in Home Assistant's area order, with "No area" last;
  - within an area, refrigeration, then wine and beverage, ice, cooking, ventilation, and dishwasher; then by name;
  - the name is `name_by_user`, else `name`.
- **Empty state:** with no appliances, the panel links to Configure.
- **Theme:** Home Assistant's CSS variables, so light and dark both work. The drawings keep their own material palettes.
- **Languages:** panel text is bundled for the integration's 9 languages and picked from `hass.language`, with regional fallback as in ha-norman's `panel_title`. Entity states use `hass.formatEntityState`, and numbers and times use `hass.locale`. A test checks every language has the same keys.

### 4.3 Overview card (GE style)

- **Header:** appliance name on the left. A status pill on the right, colored by state:
  - neutral: Normal, Off;
  - accent: Running, Cooling down;
  - warm: Preheating, Cooking;
  - amber: Door open;
  - green: Done, Preheated;
  - red: Service, Error;
  - gray: Offline, Sabbath.
- **The live drawing,** with what §6 lists for each family.
- **Display:** amber digits as on the GE card, only where the real appliance has a display. Ovens show temperature or a timer; the dishwasher shows time left. Refrigeration shows zone readouts on the doors instead.
- **Info panel:** a translucent rounded box with 2–3 label and value rows (§6).
- **Offline appliances** are greyed out with an "Offline" pill.
- **Grid:** responsive, about 360–440 px per card, one column on phones.

### 4.4 Full view

- **Layout:** a large drawing, display and status at the top. Sections below:
  1. everyday controls (zones, cavities, or cycle);
  2. modes;
  3. settings;
  4. filters and maintenance;
  5. details (Wi-Fi, firmware, uptime, active faults with Sub-Zero's titles and resolution steps);
  6. recent events, from the Appliance event entity's history;
  7. a Refresh button (`subzero.refresh`);
  8. Appearance, for admins.
- **Controls and how they act:**

| Control | Home Assistant call | Used for |
|---|---|---|
| Setpoint stepper | `climate.set_temperature` / `number.set_value` | zones, cavities, probe target. Limits and step come from entity attributes. |
| Segmented / select | `select.select_option` | modes, cook mode, cycle, ice maker, settings |
| Toggle | `switch.*`, `climate.turn_on/off` | options, light, air purification, oven on/off |
| Action with confirm | `button.press` | `remote_start_cav_unit_on`, `remote_start_cav2_unit_on`, `remote_start_wash_cycle_on`, `cancel_wash_cycle`. Other buttons (dismiss timer, reset filter, end or cancel ice delay) act at once. |
| Duration | `number.set_value` | kitchen timers and delayed shutoff, 0–719 min, with presets |
| Fan / light | `fan.set_percentage`, `light.turn_on` (`brightness_pct`, `color_temp_kelvin`) | hood |
| Ice delay form | `subzero.schedule_ice_delay` | 1–12 h, now or later today, once or daily |

- **Locked controls** are disabled and show the translated reason from `locks`. Unavailable entities show "—".
- **Errors:** a rejected call shows Home Assistant's error message inline.
- **Confirmations** appear in an inline bar like the GE card's ("Start the right oven at Bake 350°?" with Cancel and Start).

### 4.5 Drawing system

- **Parametric Lit `svg` templates per family,** built from shared parts:
  - body and toe kick;
  - grille, for Classic, BI and PRO;
  - doors, drawers and handles;
  - glass with contents: bottles for wine, cans for beverage, shelves for refrigerators;
  - dispenser;
  - rangetop surfaces, knobs and oven doors;
  - wall-oven control panels;
  - hood shells;
  - the dishwasher door.
- **Proportions:**
  - Widths and heights come from published dimensions, so a drawing reads as the right form: a 15″ undercounter, an 84″ column, a 60″ range.
  - Every overview card fits its drawing to the same height.
- **Materials** (`materials.ts`):
  - brushed stainless;
  - panel-ready, as flat panel colors with reveal lines;
  - black glass and carbon;
  - knobs in red, black or brushed stainless;
  - tubular or pro handles.
- **Gallery:** `npm run gallery` renders every variant in every finish, light and dark, in the key states. It's used for review and for screenshot tests.

### 4.6 Unit tests

- Per-family view models against the fixtures (§7): status pill, info rows, display, preheat and probe progress, countdowns, lock text.
- Languages have the same keys.
- Route parsing.

## 5. Drawing catalog

Detected forms and modifiers. Model families come from the app's default-name table and demo catalog unless marked "nomenclature".

### Sub-Zero refrigeration

| Line | Form | Widths | Example models | Modifiers detected |
|---|---|---|---|---|
| Classic (and BI) | Over-and-under | 30, 36 | CL3050U, CL3650UG, CL3650UID; BI-30U, BI-36U | glass, internal dispenser |
| Classic (and BI) | French door | 36, 42, 48 | CL3650UFD, CL4250UFDID, CL4850UFD; BI-36UFD, BI-42UFD | internal dispenser |
| Classic (and BI) | Side-by-side | 42, 48 (BI 36) | CL4250SD, CL4850SID; BI-36S, BI-48SD | external or internal dispenser |
| Classic (and BI) | Columns: refrigerator, freezer | 36 | CL3650R, CL3650RG, CL3650RID, CL3650F; BI-36R, BI-36F | glass, internal dispenser |
| Classic | Wine | 30 | CL3050W | |
| Designer (and IC/IW) | Columns: refrigerator, freezer with ice, wine | 18, 24, 30, 36 | DEC2450R, DEC3050RID, DEC1850FI, DEC1850W; IC-30R, IC-24FI, IW-24 | internal dispenser, ice |
| Designer (and IT) | Tall: over-and-under, all refrigerator, all freezer | 30, 36 | DET3050CI, DET3650CIID, DET3050R, DET3050FI; IT-36CI | internal dispenser |
| Designer (and IW) | Tall: wine over drawers | 30 | DET3050WCI, DET3050WR; IW-30CI, IW-30R | freezer drawer with ice |
| Designer | Undercounter: refrigerator, beverage, wine | 15, 24 | DEU2450R, DEU1550BG, DEU2450BG, DEU1550W, DEU2450W, your DEU2450WDZ | glass; one or two zones (from properties) |
| Designer (and ID) | Undercounter drawers: refrigerator, freezer, combination | 24, 27, 30, 36 | DEU2450DR, DEU2450DFI, DEU2750DR, DEU3050DCI, DEU3650DC; ID-30CI | ice |
| Designer | Undercounter ice maker | 15 | DEU1550I, DEU1550IP, DEU1550NI | |
| PRO | Over-and-under | 36 | PRO3650, PRO3650G | glass |
| PRO | Side-by-side | 48 | PRO4850, PRO4850G (nomenclature) | glass |
| Older wine (series 5) | closest wine form | | | |

### Wolf

| Form | Widths | Example models | Modifiers detected |
|---|---|---|---|
| Dual fuel range | 30, 36, 48, 60 | DF30450; DF36650, DF36450C, DF36450G; DF48850, DF48650C, DF48650G, DF48450CG, DF48450DG, DF48450F; DF60650CG, DF60650DG, DF60650F; older DF304…DF606 | burners; griddle, double griddle, charbroiler or French top; oven layout from the width (§1) |
| Induction range | 30, 36 | IR304TM, IR36550, IR365TM | zones; Transitional style |
| Wall oven | 30 (L also 36) | SO30F, SO36U (L); SO30-2, DO30-2 (the first E); SO3050PE, DO3050TE (E); SO30PM, DO30TM, SO30CM, DO3050PM (M) | single or double; series; style |
| Ventilation hood | from model | series 23, e.g. VWLP3050PS6 | type if the model shows it |
| Other Wolf ovens (steam, speed) | 24, 30 | — | drawn as a single wall oven |

### Cove

| Form | Width | Models | Modifiers detected |
|---|---|---|---|
| Dishwasher | 24 | DW2450, DW2450WS (with a water softener) | none: both take a custom panel or the stainless door kit |

Anything unrecognized gets a generic drawing for its type: refrigerator, wine, ice maker, oven, hood or dishwasher.

## 6. What each family shows

Property keys are the integration's own, from `const.py` and the platform files.

### Refrigeration, wine, beverage

- **Drawing:**
  - setpoint readouts on each door or drawer (`ref_set_temp`, `ref2_set_temp`, `frz_set_temp`, `wine_set_temp`, `wine2_set_temp`);
  - each door swings ajar with an interior glow (`ref_door_ajar`, `ref2_door_ajar`, `frz_door_ajar`, `wine_door_ajar`, `wine2_door_ajar`);
  - an ice indicator on the freezer door (`ice_maker_on`, `max_ice_on`, `night_ice_on`);
  - glass doors show their contents.
- **Pill priority:**
  1. Offline;
  2. Door open;
  3. Service (`service_required`, active faults);
  4. Sabbath;
  5. High use, Vacation;
  6. Normal.
- **Info rows:**
  - zone setpoints ("Refrigerator 38° · Freezer 0°" or "Upper 55° · Lower 45°");
  - ice maker mode;
  - the filter with the least life left.
- **Full view:**
  - zones: setpoint, display temperature, door; crisper with `crisp_temp_mode` and `crisp_set_temp`;
  - ice maker: `ice_maker_mode`, plus Max ice start and end;
  - mode: `operating_mode`, plus High use start and end;
  - settings: `humidity_control`, `night_mode`, `accent_light_level`, `door_ajar_timeout`, `air_filter_on`, `internal_dispenser_enabled`;
  - filters: `air_filter_pct_remaining`, `water_filter_pct_remaining`, `water_filter_gal_remaining`, and `reset_air_filter` (series 22);
  - wine: `wine_temp_alert_on`.

### Dedicated ice makers

- **Drawing:** the door (`ice_door_ajar`), an ice bin that dims while production is paused, and a cleaning badge.
- **Pill:** Making ice, Paused (delay), Cleaning, Door open, or Off.
- **Full view:**
  - ice on or off;
  - delay: `delay_active`, `delay_start_offset`, `delay_duration`, `delay_recurring`, the schedule form, `end_ice_delay` and `cancel_ice_delay`;
  - cleaning: `ice_maker_clean_stage`, `next_clean_time`, `next_clean_cycles`, `clean_soon_on`, `clean_now_on`;
  - filter: `filter_count`, `filter_max_count`;
  - `winterize_on`, `failsafe_on`, `door_ajar_timeout`, Sabbath.

### Ovens (ranges and wall ovens)

- **Drawing:**
  - oven doors follow the range's oven layout (§1);
  - each cavity's window glows while it's on, brighter as it nears the setpoint (`cav_unit_on`, `cav_temp`, `cav_set_temp`). While off, the window keeps its normal look;
  - the window lights up with the interior light (`cav_light_on`);
  - the door swings ajar (`cav_door_ajar`);
  - a probe icon appears (`cav_probe_on`);
  - the same for `cav2_*`;
  - the rangetop is drawn but static, because burners aren't connected;
  - range knobs use the Appearance color.
- **Display:** each cavity's temperature and mode while it's on, and "Off" while it's off. A preheat ring until `cav_at_set_temp`, and kitchen-timer countdowns (`kitchen_timer_end_time`, `kitchen_timer2_end_time`).
- **Pill:** Self clean, Preheating NN%, Cooking or Preheated, Remote Ready, Timer m:ss, Door open, or Off.
- **Info rows:** "Right oven · Bake 350°" or "Off" for each cavity, using the app's Right/Left and Upper/Lower names. Probe and timers when active.
- **Full view, for each cavity:**
  - climate on or off and setpoint, within the mode's range;
  - `cav_cook_mode`;
  - Start (`remote_start_cav_unit_on`), only in Remote Ready, with confirmation;
  - light;
  - probe: `cav_probe_temp`, `cav_probe_set_temp`, `cav_probe_within_10deg`, `cav_probe_at_set_temp`;
  - cook timer: active, end time, under a minute, complete;
  - Gourmet: `cav_gourmet_mode_on`, `cav_gourmet_recipe`;
  - broil level;
  - `cav_mode_change_enabled` on knob ovens.
- **Full view, appliance-wide:** kitchen timers (`kitchen_timer_duration`, `kitchen_timer2_duration`, and `dismiss_kitchen_timer`/`dismiss_kitchen_timer2`) and Sabbath.
- **Preheat start point:** the cavity's temperature when it turned on, from history; 70 °F when there's no history.

### Cove dishwasher

- **Drawing:** the door tilts open (`door_ajar`), a light bar shows while running, a progress ring runs, and a check mark shows when done. Rinse aid and softener warnings appear as small icons (`rinse_aid_low`, `softener_low`).
- **Display:** time left until `wash_cycle_end_time`, or the delay countdown until `delay_start_timer_end_time`.
- **Progress ring:** runs from the cycle's start, found in the history of `wash_cycle_on`, as the GE card does, to `wash_cycle_end_time`.
- **Pill:** the `wash_status` words (Idle, Running, Paused, Canceling, Drying, Done, Delayed, Error), plus Remote Ready, Door open, Child lock and Sabbath.
- **Info rows:** Cycle, Ends (or Starts), and the options that are on.
- **Full view:**
  - `wash_cycle`;
  - options: the five `DISHWASHER_SWITCHES`, each locked with its reason;
  - `delay_start_timer_duration`;
  - `mode`;
  - Start (`remote_start_wash_cycle_on`) and Cancel (`cancel_wash_cycle`), both with confirmation;
  - status: `remote_ready`, `service_required`.

### Wolf ventilation hood

- **Drawing:** light glow under the hood, in color temperature and brightness (`light_on`, `light_percent`, `color_level`); halo glow (`halo_max_percent`); a fan animation that follows `fan_speed`.
- **Pill:** Fan 1–4, Light, Delayed shutoff, or Off.
- **Full view:**
  - fan;
  - light: brightness and white temperature;
  - halo;
  - `auto_sensivity`;
  - delayed shutoff: `delay_enabled` and `delay_off_duration`;
  - `key_tone_on` and `user_lock_on`;
  - filter usage and allowance.

### Every appliance

Active faults, recent appliance events, Refresh, and Wi-Fi and firmware details.

## 7. Testing and verification

- **Fixtures** go in `tests/fixtures/appliances/*.json`, shared by pytest and the frontend. Each holds only property values, with no app text or images. They come from:
  - the app's demo property sets, more than 100 types across every series the integration knows (`.research/blutter-4.6.0/…/services/demo/properties/t<series>_<category>_<version>.dart`, in `~/Downloads/github/ha-subzero.sav`), paired with demo model numbers;
  - your five redacted captures from `.private/screenshots/states.json`.
- **Visual loop:** Playwright renders the gallery in Chrome. I review the screenshots and refine each drawing before moving on.
- **Style checkpoint:** you sign off on the first two detailed drawings, your CL4850SID and DF48850SP, in light and dark and in a few states, before the rest are drawn.
- **End to end:** the `.private/screenshots` demo harness runs the real integration and panel against `states.json`. It's used for the full-flow check and the README screenshots.
- **Real devices,** your five appliances, before the version bump.
  - You install the branch build on your HA: unzip an `ha_subzero.zip` built from the branch into `/config/custom_components/subzero` and restart. It's the same `git archive` that `release.yml` runs.
  - Then work through this checklist:
  - doors on every appliance;
  - oven preheat, cooking, kitchen and cook timers, probe, the self-clean lock;
  - Sabbath;
  - a dishwasher cycle from start to done, and delay start;
  - filters;
  - an appliance going offline;
  - controls from the panel in Celsius and Fahrenheit.
- **Mobile and access:** the narrow layout in the companion app, keyboard use, and reduced motion.
- **Real hardware is limited.** Your five appliances are the only real ones. Everything else is checked against fixtures, as the GE card was.

## 8. Phases and release

- **One release.** All work happens on a `sidebar-panel` branch, so main can still ship bug-fix releases in the meantime.
- **Shipping it:** merge the branch, then bump `manifest.json` on main to the next version. That's 1.02 unless a fix ships first. `release.yml` then publishes it.

| Phase | Work | Checkpoint |
|---|---|---|
| 0 | `appliance_spec.py`, the research table, fixtures, spec tests | — |
| 1 | Option, `frontend.py`, `panel_api.py`, appearance store, lock codes, diagnostics, translations, backend tests | — |
| 2 | Frontend toolchain and CI; shell (routes, areas, theme, i18n); card frame; full view with every control; a generic drawing for each family | — |
| 3 | Detailed drawings of your refrigerator (CL4850SID) and range (DF48850SP) | **Style sign-off** from you, in light and dark and a few states |
| 4 | Your other three appliances, then the rest of the refrigeration: Classic, BI, Designer columns, tall units, undercounter and drawers, Integrated, PRO, wine, beverage, ice makers | — |
| 5 | Wolf: dual fuel and induction ranges with every rangetop, wall ovens (L, E, M × Professional, Transitional, Contemporary), hoods, other ovens; Cove fronts | **Gallery review** of every drawing by you |
| 6 | README section and screenshots, CHANGELOG; the branch build on your HA | **Real-device checklist** (§7), then merge and release |

## 9. Risks and items to verify

- **Model nomenclature gaps.** Some models aren't in the app's tables: your DEU2450WDZ, PRO 48, wall ovens and hoods. Detection falls back to series and properties, and the Appearance form override covers anything it gets wrong.
- **48″ oven proportions.** You confirmed the larger oven is on the right. The exact split (30″ + 18″ expected) comes from Wolf's spec sheets.
- **The rangetop is decorative.** Burners and cooktops report nothing.
- **Everything lands at once.** That makes the real-device check before the bump important. Anything found after the release goes into the following version.
- **Frontend APIs.** Only the documented `hass` object is used. A Home Assistant frontend change to `hass.devices` or `hass.areas` would need an update.
- **Paths.** The panel at `/sub-zero` and the files at `/subzero` must stay different.
- **New toolchain.** The repo gains Node 22+ and `package-lock.json`. Every frontend change needs a rebuilt, committed bundle, which CI enforces.
- **Trademarks.** No logos or badges. Red knobs are drawn at your direction.
