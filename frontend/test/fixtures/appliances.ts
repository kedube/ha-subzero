/**
 * The owner's five appliances, with the property keys they report and made-up values, plus a
 * hood, a dedicated ice maker and a double wall oven. Each has the entities the integration
 * creates for those keys (a setpoint is a number, a climate and a sensor; a cooking mode a
 * select and a sensor; and so on).
 */
import { makeFixture, type EntityTable, type Fixture } from "./hass";

const DOOR_DELAYS = ["Off", "1 minute", "2 minutes", "5 minutes", "10 minutes"];
const FRIDGE_MODES = ["Normal", "Sabbath", "High use", "Short vacation", "Long vacation"];
const EVENT: EntityTable = {
  appliance_event: { event: ["2026-10-24T11:00:00.000+00:00", { event_type: "refrigerator_door_ajar" }] },
};
const COMMON: EntityTable = {
  ap_rssi: { sensor: ["-48", { unit_of_measurement: "dBm" }] },
  service_required: { binary_sensor: "off" },
  active_faults: { sensor: ["0", { faults: [] }] },
  ...EVENT,
};

function setpoint(value: string, min: number, max: number): EntityTable[string] {
  return {
    number: [value, { min, max, step: 1, unit_of_measurement: "°F" }],
    climate: ["cool", { temperature: Number(value), min_temp: min, max_temp: max, target_temp_step: 1, supported_features: 1 }],
    sensor: [value, { unit_of_measurement: "°F" }],
  };
}

/** CL4850SID: 48″ Classic side-by-side with internal dispenser (17.11.3.3). */
export function fridge(): Fixture {
  return makeFixture({
    id: "fridge",
    name: "Refrigerator",
    brand: "Sub-Zero",
    model: "CL4850SID",
    type: "17.11.3.3",
    spec: {
      family: "refrigeration",
      form: "side_by_side",
      line: "classic",
      width: 48,
      glass: false,
      dispenser: "internal",
      ice: true,
      drawers: null,
      zones: 2,
      outdoor: false,
      generic: false,
    },
    entities: {
      ...COMMON,
      air_filter_on: { switch: "on" },
      air_filter_pct_remaining: { sensor: ["56", { unit_of_measurement: "%" }] },
      crisp_set_temp: { number: ["36", { min: 36, max: 40, step: 1 }], sensor: "36" },
      crisp_temp_mode: { select: ["Automatic", { options: ["Automatic", "Manual"] }] },
      door_ajar_timeout: { select: ["5 minutes", { options: DOOR_DELAYS }] },
      frz_door_ajar: { binary_sensor: "off" },
      frz_set_temp: setpoint("0", -5, 5),
      high_use_end_time: { sensor: "unknown" },
      high_use_on: { binary_sensor: "off" },
      high_use_start_time: { sensor: "unknown" },
      humidity_control: { select: ["Normal", { options: ["Normal", "Enhanced"] }] },
      ice_maker_on: { binary_sensor: "on" },
      ice_maker_mode: { select: ["On", { options: ["Off", "On", "Max ice", "Night ice"] }] },
      long_vacation_on: { binary_sensor: "off" },
      max_ice_end_time: { sensor: "unknown" },
      max_ice_on: { binary_sensor: "off" },
      max_ice_start_time: { sensor: "unknown" },
      night_ice_on: { binary_sensor: "off" },
      night_mode: { select: ["Disabled", { options: ["Disabled", "Enabled"] }] },
      operating_mode: { select: ["Normal", { options: FRIDGE_MODES }] },
      ref_door_ajar: { binary_sensor: "off" },
      ref_set_temp: setpoint("38", 34, 42),
      sabbath_on: { binary_sensor: "off" },
      short_vacation_on: { binary_sensor: "off" },
      unit_on: { binary_sensor: "on" },
      water_filter_pct_remaining: { sensor: ["74", { unit_of_measurement: "%" }] },
    },
  });
}

/** DEU2450BG: 24″ Designer undercounter beverage center (17.13.3.1). */
export function beverage(): Fixture {
  return makeFixture({
    id: "beverage",
    name: "Beverage center",
    brand: "Sub-Zero",
    model: "DEU2450BG",
    type: "17.13.3.1",
    spec: {
      family: "refrigeration",
      form: "undercounter_beverage",
      line: "designer",
      width: 24,
      glass: true,
      dispenser: "none",
      ice: false,
      drawers: null,
      zones: 1,
      outdoor: false,
      generic: false,
    },
    entities: {
      ...COMMON,
      accent_light_level: { select: ["High", { options: ["Off", "Low", "Medium", "High"] }] },
      door_ajar_timeout: { select: ["5 minutes", { options: DOOR_DELAYS }] },
      high_use_end_time: { sensor: "unknown" },
      high_use_on: { binary_sensor: "off" },
      high_use_start_time: { sensor: "unknown" },
      long_vacation_on: { binary_sensor: "off" },
      operating_mode: { select: ["Normal", { options: FRIDGE_MODES }] },
      ref_door_ajar: { binary_sensor: "off" },
      ref_set_temp: setpoint("41", 34, 55),
      sabbath_on: { binary_sensor: "off" },
      short_vacation_on: { binary_sensor: "off" },
      unit_on: { binary_sensor: "on" },
    },
  });
}

/** DEU2450WDZ: 24″ Designer undercounter wine storage with two zones (17.14.2.0). */
export function wine(): Fixture {
  return makeFixture({
    id: "wine",
    name: "Wine storage",
    brand: "Sub-Zero",
    model: "DEU2450WDZ",
    type: "17.14.2.0",
    spec: {
      family: "refrigeration",
      form: "undercounter_wine",
      line: "designer",
      width: 24,
      glass: true,
      dispenser: "none",
      ice: false,
      drawers: null,
      zones: 2,
      outdoor: false,
      generic: false,
    },
    entities: {
      ...COMMON,
      accent_light_level: { select: ["High", { options: ["Off", "Low", "Medium", "High"] }] },
      door_ajar_timeout: { select: ["5 minutes", { options: DOOR_DELAYS }] },
      operating_mode: { select: ["Normal", { options: ["Normal", "Sabbath"] }] },
      sabbath_on: { binary_sensor: "off" },
      unit_on: { binary_sensor: "on" },
      wine2_set_temp: setpoint("55", 40, 65),
      wine_door_ajar: { binary_sensor: "off" },
      wine_set_temp: setpoint("45", 40, 65),
      wine_temp_alert_on: { binary_sensor: "off" },
    },
  });
}

const RANGE_MODES = ["Off", "Bake", "Roast", "Bake stone", "Convection roast", "Convection", "Dehydrate", "Warm"];

function cavity(prefix: "cav" | "cav2", modes: string[], temperature: string): EntityTable {
  return {
    [`${prefix}_at_set_temp`]: { binary_sensor: "off" },
    [`${prefix}_broil_level`]: { sensor: "unknown" },
    [`${prefix}_cook_mode`]: { select: ["Off", { options: modes }], sensor: "Off" },
    [`${prefix}_cook_timer_complete`]: { binary_sensor: "off" },
    [`${prefix}_door_ajar`]: { binary_sensor: "off" },
    [`${prefix}_gourmet_mode_on`]: { binary_sensor: "off" },
    [`${prefix}_gourmet_recipe`]: { sensor: "None" },
    [`${prefix}_light_on`]: { switch: "off" },
    [`${prefix}_probe_at_set_temp`]: { binary_sensor: "off" },
    [`${prefix}_probe_on`]: { binary_sensor: "off" },
    [`${prefix}_probe_set_temp`]: { number: ["unknown", { min: 120, max: 210, step: 5 }], sensor: "unknown" },
    [`${prefix}_probe_temp`]: { sensor: "unknown" },
    [`${prefix}_remote_ready`]: { binary_sensor: "off" },
    // While off: no target temperature, the fallback range, and TURN_ON | TURN_OFF.
    [`${prefix}_set_temp`]: {
      climate: ["off", { min_temp: 85, max_temp: 550, target_temp_step: 5, supported_features: 384, current_temperature: null }],
      sensor: "unknown",
    },
    // An oven that's off keeps reporting its last temperature.
    [`${prefix}_temp`]: { sensor: temperature },
    [`${prefix}_unit_on`]: { binary_sensor: "off" },
    [`remote_start_${prefix}_unit_on`]: { button: "unavailable" },
  };
}

function kitchenTimer(prefix: "kitchen_timer" | "kitchen_timer2"): EntityTable {
  return {
    [`${prefix}_active`]: { binary_sensor: "off" },
    [`${prefix}_complete`]: { binary_sensor: "off" },
    [`${prefix}_duration`]: { number: ["0", { min: 0, max: 719, step: 1 }] },
    [`${prefix}_end_time`]: { sensor: "unknown" },
    [`${prefix}_start_time`]: { sensor: "unknown" },
    [`dismiss_${prefix}`]: { button: "unavailable" },
  };
}

/** DF48850SP: 48″ dual fuel range, a small left oven (cav2) and a large right one (17.8.2.0). */
export function range(): Fixture {
  return makeFixture({
    id: "range",
    name: "Range",
    brand: "Wolf",
    model: "DF48850SP",
    type: "17.8.2.0",
    spec: {
      family: "range",
      form: "range",
      width: 48,
      fuel: "dual_fuel",
      burners: 8,
      surfaces: [],
      ovens: [
        { prefix: "cav2", position: "left", width: 18 },
        { prefix: "cav", position: "right", width: 30 },
      ],
      style: "professional",
      generic: false,
    },
    entities: {
      ...COMMON,
      ...cavity("cav", RANGE_MODES, "403"),
      ...cavity("cav2", RANGE_MODES.filter((mode) => mode !== "Bake stone"), "74"),
      cav_mode_change_enabled: { binary_sensor: "on" },
      cav2_mode_change_enabled: { binary_sensor: "on" },
      ...kitchenTimer("kitchen_timer"),
      ...kitchenTimer("kitchen_timer2"),
      sabbath_on: { binary_sensor: "off" },
    },
  });
}

const E_SERIES_MODES = ["Off", "Bake", "Roast", "Bake stone", "Convection bake", "Convection roast", "Convection", "Dehydrate"];

/** DO3050TE: a 30″ E series double wall oven (17.3.2.2), with cook timers. */
export function wallOven(): Fixture {
  return makeFixture({
    id: "wall_oven",
    name: "Wall oven",
    brand: "Wolf",
    model: "DO3050TE",
    type: "17.3.2.2",
    spec: {
      family: "wall_oven",
      form: "double",
      width: 30,
      series: "e",
      style: "transitional",
      ovens: [
        { prefix: "cav", position: "upper", width: 30 },
        { prefix: "cav2", position: "lower", width: 30 },
      ],
      knob: false,
      generic: false,
    },
    entities: {
      ...COMMON,
      ...cavity("cav", E_SERIES_MODES, "75"),
      ...cavity("cav2", E_SERIES_MODES.filter((mode) => mode !== "Convection bake"), "75"),
      cav_cook_timer_active: { binary_sensor: "off" },
      cav_cook_timer_end_time: { sensor: "unknown" },
      cav_cook_timer_within_1min: { binary_sensor: "off" },
      cav2_cook_timer_active: { binary_sensor: "off" },
      cav2_cook_timer_end_time: { sensor: "unknown" },
      cav2_cook_timer_within_1min: { binary_sensor: "off" },
      ...kitchenTimer("kitchen_timer"),
      sabbath_on: { binary_sensor: "off" },
    },
  });
}

const WASH_CYCLES = [
  "Auto",
  "Normal",
  "Heavy",
  "Quick",
  "Pots and pans",
  "Soak and scrub",
  "Light",
  "Crystal and china",
  "Rinse and hold",
  "Plastics",
  "Energy",
  "Extra quiet",
];
const DELAYS = ["Off", ...Array.from({ length: 12 }, (_, index) => `${index + 1} hour${index ? "s" : ""}`)];

/** DW2450: a Cove dishwasher with a custom panel (17.6.1.0). */
export function dishwasher(): Fixture {
  return makeFixture({
    id: "dishwasher",
    name: "Dishwasher",
    brand: "Cove",
    model: "DW2450",
    type: "17.6.1.0",
    spec: { family: "dishwasher", form: "dishwasher", width: 24, front: "panel", generic: false },
    entities: {
      ...COMMON,
      cancel_wash_cycle: { button: "unavailable" },
      delay_start_timer_active: { binary_sensor: "off" },
      delay_start_timer_duration: { select: ["Off", { options: DELAYS }] },
      delay_start_timer_end_time: { sensor: "unknown" },
      delay_start_timer_start_time: { sensor: "unknown" },
      door_ajar: { binary_sensor: "off" },
      extended_dry_on: { switch: "off" },
      heated_dry_on: { switch: "off" },
      high_temp_wash_on: { switch: "off" },
      mode: { select: ["Off", { options: ["Off", "Child lock", "Sabbath"] }] },
      remote_ready: { binary_sensor: "off" },
      remote_start_wash_cycle_on: { button: "unavailable" },
      rinse_aid_low: { binary_sensor: "off" },
      sabbath_on: { binary_sensor: "off" },
      sani_rinse_on: { switch: "off" },
      top_rack_only_on: { switch: "off" },
      wash_cycle: { select: ["Auto", { options: WASH_CYCLES }], sensor: "Auto" },
      wash_cycle_end_time: { sensor: "unknown" },
      wash_cycle_on: { binary_sensor: "off" },
      wash_status: { sensor: "Idle" },
    },
  });
}

/** A Wolf wall hood (series 23): fan, task light with white temperature, halo, delayed shutoff. */
export function hood(): Fixture {
  return makeFixture({
    id: "hood",
    name: "Hood",
    brand: "Wolf",
    model: "VWLP3050PS6",
    type: "17.23.1.0",
    spec: { family: "hood", form: "wall", width: 30, generic: false },
    entities: {
      ...COMMON,
      auto_sensivity: { select: ["Medium", { options: ["Off", "Low", "Medium", "High"] }] },
      delay_enabled: { switch: "off" },
      delay_off_duration: { number: ["5", { min: 0, max: 719, step: 1, unit_of_measurement: "min" }] },
      fan_on: { fan: ["on", { percentage: 50, percentage_step: 25, supported_features: 49 }] },
      filter_count: { sensor: ["432000", { unit_of_measurement: "s" }] },
      filter_max_count: { sensor: ["1080000", { unit_of_measurement: "s" }] },
      halo_max_percent: { switch: "off" },
      key_tone_on: { switch: "on" },
      light_on: {
        light: [
          "on",
          {
            brightness: 204,
            color_temp_kelvin: 3850,
            min_color_temp_kelvin: 2700,
            max_color_temp_kelvin: 5000,
            supported_color_modes: ["color_temp"],
            color_mode: "color_temp",
          },
        ],
      },
      user_lock_on: { switch: "off" },
    },
  });
}

/** DEU1550IP: a 15″ Designer undercounter ice maker (series 21). */
export function iceMaker(): Fixture {
  return makeFixture({
    id: "ice",
    name: "Ice maker",
    brand: "Sub-Zero",
    model: "DEU1550IP",
    type: "17.21.1.0",
    spec: {
      family: "refrigeration",
      form: "ice_maker",
      line: "designer",
      width: 15,
      glass: false,
      dispenser: "none",
      ice: true,
      drawers: null,
      zones: 0,
      outdoor: false,
      generic: false,
    },
    entities: {
      ...COMMON,
      cancel_ice_delay: { button: "unavailable" },
      clean_now_on: { binary_sensor: "off" },
      clean_soon_on: { binary_sensor: "off" },
      delay_active: { binary_sensor: "off" },
      delay_duration: { sensor: ["0", { unit_of_measurement: "s" }] },
      delay_end_time: { sensor: "unknown" },
      delay_recurring: { binary_sensor: "off" },
      delay_start_time: { sensor: "unknown" },
      door_ajar_timeout: { select: ["5 minutes", { options: DOOR_DELAYS }] },
      end_ice_delay: { button: "unavailable" },
      failsafe_on: { binary_sensor: "off" },
      ice_door_ajar: { binary_sensor: "off" },
      ice_maker_clean_on: { binary_sensor: "off" },
      ice_maker_clean_stage: { sensor: "Not cleaning" },
      ice_maker_mode: { select: ["On", { options: ["Off", "On"] }] },
      ice_maker_on: { binary_sensor: "on" },
      ice_maker_status: { sensor: "On" },
      next_clean_cycles: { sensor: "1200" },
      next_clean_time: { sensor: "2026-11-20T14:00:00+00:00" },
      sabbath_on: { binary_sensor: "off" },
      water_filter_inserted: { binary_sensor: "on" },
      winterize_on: { binary_sensor: "off" },
    },
  });
}
