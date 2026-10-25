/**
 * Refrigerators, freezers, wine storage, beverage centers and drawers: their zones, doors, ice
 * maker, modes, settings and filters.
 */
import type { DrawingState } from "../drawings/types";
import {
  anyOpen,
  buttonAction,
  climateSetpoint,
  compact,
  countdown,
  detailsSection,
  doors,
  formatTemperature,
  has,
  isOn,
  join,
  needsService,
  numberOf,
  numberSetpoint,
  percent,
  read,
  reading,
  section,
  selectControl,
  switchToggle,
  toNumber,
  withUnit,
} from "./common";
import { optionLabel } from "./options";
import type { ApplianceContext, Control, FamilyModel, InfoRow, Section, StatusPill } from "./types";

type Zone = "ref" | "ref2" | "frz" | "wine" | "wine2";

const ZONES: readonly Zone[] = ["ref", "ref2", "frz", "wine", "wine2"];
export const REFRIGERATION_DOORS = ZONES.map((zone) => `${zone}_door_ajar`);

function zones(ctx: ApplianceContext): Zone[] {
  return ZONES.filter((zone) => has(ctx, `${zone}_set_temp`));
}

/** The app's zone names: two wine zones are Upper and Lower. */
export function zoneName(ctx: ApplianceContext, zone: Zone | "crisp", short = false): string {
  const name = zone === "wine2" ? "wine_lower" : zone === "wine" && has(ctx, "wine2_set_temp") ? "wine_upper" : zone;
  return ctx.t(short ? `zone.short.${name}` : `zone.${name}`);
}

/** A zone's setpoint in the user's unit. The sensor stays available while the controls are locked. */
export function zoneSetpoint(ctx: ApplianceContext, zone: Zone | "crisp"): number | null {
  const key = `${zone}_set_temp`;
  return numberOf(ctx, key, "sensor", "number") ?? toNumber(ctx.state(key, "climate")?.attributes?.temperature);
}

type IceMode = "off" | "on" | "max" | "night";

const ICE_OPTIONS: Record<string, IceMode> = { Off: "off", On: "on", "Max ice": "max", "Night ice": "night" };
const ICE_NAMES: Record<IceMode, string> = { off: "Off", on: "On", max: "Max ice", night: "Night ice" };

function hasIce(ctx: ApplianceContext): boolean {
  return has(ctx, "ice_maker_mode", "select") || has(ctx, "ice_maker_on", "binary_sensor");
}

/** The ice maker's mode, from the Ice maker select or, while that's locked, its binary sensors. */
export function iceMode(ctx: ApplianceContext): IceMode | null {
  const option = read(ctx, "ice_maker_mode", "select");
  if (option !== null && option in ICE_OPTIONS) return ICE_OPTIONS[option];
  const on = isOn(ctx, "ice_maker_on", "binary_sensor");
  if (on === null) return null;
  if (isOn(ctx, "max_ice_on", "binary_sensor") === true) return "max";
  if (isOn(ctx, "night_ice_on", "binary_sensor") === true) return "night";
  return on ? "on" : "off";
}

/** The operating mode's option, from the Mode select or the mode binary sensors. */
function operatingMode(ctx: ApplianceContext): string | null {
  const option = read(ctx, "operating_mode", "select");
  if (option !== null) return option;
  if (isOn(ctx, "sabbath_on", "binary_sensor")) return "Sabbath";
  if (isOn(ctx, "high_use_on", "binary_sensor")) return "High use";
  if (isOn(ctx, "short_vacation_on", "binary_sensor")) return "Short vacation";
  if (isOn(ctx, "long_vacation_on", "binary_sensor")) return "Long vacation";
  return has(ctx, "sabbath_on", "binary_sensor") ? "Normal" : null;
}

function filterTone(value: number | null): "normal" | "warning" | "alert" {
  if (value === null) return "normal";
  return value <= 0 ? "alert" : value <= 10 ? "warning" : "normal";
}

/**
 * The filter with the least life left. The card's rows have no color, so a filter that's low or
 * spent says so in words ("0% · Replace"), where the full view colors it.
 */
function weakestFilter(ctx: ApplianceContext): InfoRow | null {
  const filters = compact(
    (["water", "air"] as const).map((kind) => {
      const value = numberOf(ctx, `${kind}_filter_pct_remaining`, "sensor");
      return value === null ? null : { kind, value };
    }),
  );
  if (!filters.length) return null;
  const weakest = filters.reduce((low, filter) => (filter.value < low.value ? filter : low));
  const tone = filterTone(weakest.value);
  const word = tone === "alert" ? ctx.t("value.replace") : tone === "warning" ? ctx.t("value.low") : null;
  return { label: ctx.t(`info.${weakest.kind}_filter`), value: join([percent(weakest.value), word]) ?? "—" };
}

function zonesSection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  const controls: Array<Control | null> = [];
  for (const zone of zones(ctx)) {
    const key = `${zone}_set_temp`;
    const shown = numberOf(ctx, `${zone}_display_temp`, "sensor");
    const hint = join([
      shown === null ? null : t("value.now", { temp: formatTemperature(shown) }),
      isOn(ctx, `${zone}_door_ajar`, "binary_sensor") ? t("value.door_open") : null,
    ]);
    // The freezer setpoint waits while Max ice runs, as on the appliance.
    const reasons = [zone === "frz" && isOn(ctx, "max_ice_on", "binary_sensor") ? t("reason.max_ice") : null];
    const name = zoneName(ctx, zone);
    controls.push(
      numberSetpoint(ctx, key, name, { hint, reasons }) ??
        climateSetpoint(ctx, key, name, { hint, reasons }) ??
        reading(key, name, formatTemperature(zoneSetpoint(ctx, zone)), { hint }),
    );
  }
  if (has(ctx, "crisp_temp_mode") || has(ctx, "crisp_set_temp")) {
    const automatic = read(ctx, "crisp_temp_mode", "select") === "Automatic";
    controls.push(
      selectControl(ctx, "crisp_temp_mode", t("control.crisper_mode")),
      numberSetpoint(ctx, "crisp_set_temp", zoneName(ctx, "crisp"), {
        reasons: [automatic ? t("reason.crisper_auto") : null],
      }),
    );
  }
  if (has(ctx, "wine_temp_alert_on", "binary_sensor")) {
    const alert = isOn(ctx, "wine_temp_alert_on", "binary_sensor");
    controls.push(
      reading("wine_temp_alert_on", t("control.wine_temp_alert"), alert === null ? null : t(alert ? "value.alert" : "value.normal"), {
        tone: alert ? "alert" : "normal",
      }),
    );
  }
  return section("zones", t("section.temperatures"), controls);
}

function iceSection(ctx: ApplianceContext): Section | null {
  if (!hasIce(ctx)) return null;
  const t = ctx.t;
  const mode = iceMode(ctx);
  const maxEnd = isOn(ctx, "max_ice_on", "binary_sensor") ? read(ctx, "max_ice_end_time", "sensor") : null;
  return section("ice", t("section.ice_maker"), [
    selectControl(ctx, "ice_maker_mode", t("control.ice_maker"), { locks: ["ice_maker_mode", "ice_maker_on"] }) ??
      reading("ice_maker_mode", t("control.ice_maker"), mode === null ? null : optionLabel(t, ICE_NAMES[mode])),
    maxEnd ? countdown("max_ice_end_time", t("control.max_ice_left"), maxEnd) : null,
  ]);
}

function modesSection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  const highUseEnd = isOn(ctx, "high_use_on", "binary_sensor") ? read(ctx, "high_use_end_time", "sensor") : null;
  const mode = operatingMode(ctx);
  return section("modes", t("section.modes"), [
    // The Mode select is how Sabbath mode is turned off, so the integration never locks it for
    // Sabbath; ignore a Sabbath code should one be reported for it.
    selectControl(ctx, "operating_mode", t("control.operating_mode"), { ignoreLocks: ["sabbath"] }) ??
      (mode === null ? null : reading("operating_mode", t("control.operating_mode"), optionLabel(t, mode))),
    highUseEnd ? countdown("high_use_end_time", t("control.high_use_left"), highUseEnd) : null,
  ]);
}

function settingsSection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  return section(
    "settings",
    t("section.settings"),
    [
      selectControl(ctx, "humidity_control", t("control.humidity")),
      selectControl(ctx, "night_mode", t("control.night_mode")),
      selectControl(ctx, "accent_light_level", t("control.accent_light")),
      selectControl(ctx, "door_ajar_timeout", t("control.door_open_delay")),
      switchToggle(ctx, "air_filter_on", t("control.air_purification")),
      switchToggle(ctx, "internal_dispenser_enabled", t("control.dispenser")),
    ],
    true,
  );
}

function filtersSection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  const air = numberOf(ctx, "air_filter_pct_remaining", "sensor");
  const water = numberOf(ctx, "water_filter_pct_remaining", "sensor");
  return section("filters", t("section.filters"), [
    has(ctx, "air_filter_pct_remaining", "sensor")
      ? reading("air_filter_pct_remaining", t("control.air_filter"), percent(air), { tone: filterTone(air) })
      : null,
    has(ctx, "water_filter_pct_remaining", "sensor")
      ? reading("water_filter_pct_remaining", t("control.water_filter"), percent(water), { tone: filterTone(water) })
      : null,
    has(ctx, "water_filter_gal_remaining", "sensor")
      ? reading("water_filter_gal_remaining", t("control.water_filter_capacity"), withUnit(ctx.hass, ctx.state("water_filter_gal_remaining", "sensor")))
      : null,
    buttonAction(ctx, "reset_air_filter", t("control.reset_air_filter"), t("action.reset")),
  ]);
}

export const refrigeration: FamilyModel = {
  drawingState(ctx): DrawingState {
    const state: DrawingState = {
      available: ctx.appliance.available,
      doors: doors(ctx, REFRIGERATION_DOORS),
      readouts: {},
      sabbath: isOn(ctx, "sabbath_on", "binary_sensor") === true,
    };
    for (const zone of [...ZONES, "crisp"] as const) {
      const value = zoneSetpoint(ctx, zone);
      if (value !== null) state.readouts[zone] = formatTemperature(value);
    }
    const mode = hasIce(ctx) ? iceMode(ctx) : null;
    if (mode !== null) state.ice = { on: mode !== "off", mode };
    return state;
  },

  status(ctx): StatusPill {
    const t = ctx.t;
    if (!ctx.appliance.available) return { text: t("pill.offline"), tone: "gray" };
    if (anyOpen(ctx, REFRIGERATION_DOORS)) return { text: t("pill.door_open"), tone: "amber" };
    if (needsService(ctx)) return { text: t("pill.service"), tone: "red" };
    if (isOn(ctx, "wine_temp_alert_on", "binary_sensor")) return { text: t("pill.temp_alert"), tone: "red" };
    if (isOn(ctx, "sabbath_on", "binary_sensor")) return { text: t("pill.sabbath"), tone: "gray" };
    if (isOn(ctx, "unit_on", "binary_sensor") === false) return { text: t("pill.off"), tone: "neutral" };
    if (isOn(ctx, "high_use_on", "binary_sensor")) return { text: t("pill.high_use"), tone: "accent" };
    if (isOn(ctx, "short_vacation_on", "binary_sensor") || isOn(ctx, "long_vacation_on", "binary_sensor")) {
      return { text: t("pill.vacation"), tone: "neutral" };
    }
    return { text: t("pill.normal"), tone: "neutral" };
  },

  infoRows(ctx): InfoRow[] {
    const t = ctx.t;
    const rows: InfoRow[] = [];
    const set = compact(
      zones(ctx).map((zone) => {
        const value = zoneSetpoint(ctx, zone);
        return value === null ? null : { zone, temp: formatTemperature(value) };
      }),
    );
    if (set.length === 1) rows.push({ label: t("info.set_to"), value: set[0].temp });
    else if (set.length) {
      rows.push({ label: t("info.set_to"), value: set.map(({ zone, temp }) => `${zoneName(ctx, zone, true)} ${temp}`).join(" · ") });
    }
    const mode = hasIce(ctx) ? iceMode(ctx) : null;
    if (mode !== null) rows.push({ label: t("info.ice_maker"), value: optionLabel(t, ICE_NAMES[mode]) });
    const filter = weakestFilter(ctx);
    if (filter) rows.push(filter);
    if (rows.length < 2) {
      const operating = operatingMode(ctx);
      if (operating !== null) rows.push({ label: t("info.mode"), value: optionLabel(t, operating) });
    }
    return rows.slice(0, 3);
  },

  // Refrigeration has no display: the zone readouts sit on the doors instead.
  display: () => null,

  sections(ctx): Section[] {
    return compact([zonesSection(ctx), iceSection(ctx), modesSection(ctx), settingsSection(ctx), filtersSection(ctx), detailsSection(ctx)]);
  },
};
