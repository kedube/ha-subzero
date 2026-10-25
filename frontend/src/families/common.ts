/**
 * What the family models share: reading entities by property key, formatting values the way
 * the panel shows them, and building controls that follow the entities exactly, locks and
 * unavailable states included.
 */
import type { HassEntity, HomeAssistant } from "../hass";
import type { Translate } from "../i18n";
import type { EntityDomain, LockCode, PanelAppliance } from "../types";
import { optionLabel } from "./options";
import type { ApplianceContext, Control, Section } from "./types";

// ---------------------------------------------------------------------------------------------
// Reading entities

/** An entity's state, or null when it has none ("unavailable", "unknown"). */
export function stateValue(entity: HassEntity | undefined): string | null {
  const state = entity?.state;
  if (state === undefined || state === "" || state === "unavailable" || state === "unknown") return null;
  return state;
}

const DOMAINS: readonly EntityDomain[] = [
  "sensor",
  "binary_sensor",
  "number",
  "select",
  "switch",
  "climate",
  "button",
  "fan",
  "light",
  "event",
];

/**
 * The first state a property key has among the domains, in order (any domain if none are
 * given). A key on two platforms reads the other when one has no value, so a locked number
 * entity still leaves its sensor.
 */
export function read(ctx: ApplianceContext, key: string, ...domains: EntityDomain[]): string | null {
  for (const domain of domains.length ? domains : DOMAINS) {
    const value = stateValue(ctx.state(key, domain));
    if (value !== null) return value;
  }
  return null;
}

/** "on" or "off" as a boolean; null when there's no value. Binary sensors and switches. */
export function isOn(ctx: ApplianceContext, key: string, ...domains: EntityDomain[]): boolean | null {
  const state = read(ctx, key, ...(domains.length ? domains : (["binary_sensor", "switch"] as const)));
  return state === "on" ? true : state === "off" ? false : null;
}

export function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string" || value.trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function numberOf(ctx: ApplianceContext, key: string, ...domains: EntityDomain[]): number | null {
  return toNumber(read(ctx, key, ...domains));
}

export function has(ctx: ApplianceContext, key: string, ...domains: EntityDomain[]): boolean {
  return ctx.entityId(key, ...domains) !== undefined;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Door flags for the drawing: every door key the appliance has an entity for. */
export function doors(ctx: ApplianceContext, keys: readonly string[]): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const key of keys) {
    if (has(ctx, key, "binary_sensor")) result[key] = isOn(ctx, key, "binary_sensor") === true;
  }
  return result;
}

export function anyOpen(ctx: ApplianceContext, keys: readonly string[]): boolean {
  return keys.some((key) => isOn(ctx, key, "binary_sensor") === true);
}

/** Series, category and version from `appliance_type` ("17.8.2.0" is 8, 2, 0), as controls.py reads it. */
export function applianceType(appliance: PanelAppliance): [number, number, number] | null {
  const parts = (appliance.appliance_type ?? "").split(".");
  if (parts.length === 3) parts.unshift("0");
  if (parts.length !== 4 || !parts.every((part) => /^\d+$/.test(part))) return null;
  return [Number(parts[1]), Number(parts[2]), Number(parts[3])];
}

// ---------------------------------------------------------------------------------------------
// Formatting

export function temperatureUnit(hass: HomeAssistant): string {
  return hass.config?.unit_system?.temperature || "°F";
}

export function isCelsius(hass: HomeAssistant): boolean {
  return temperatureUnit(hass).includes("C");
}

/** Where a preheat starts when the panel never saw the cavity's first reading. */
export function roomTemperature(hass: HomeAssistant): number {
  return isCelsius(hass) ? 21 : 70;
}

/** "38°": temperatures already come in the user's unit, and the panel shows whole degrees. */
export function formatTemperature(value: number | null): string {
  if (value === null) return "—";
  const rounded = Math.round(value);
  return `${rounded === 0 ? 0 : rounded}°`;
}

export function parseTime(value: unknown): number | null {
  if (typeof value !== "string" || !value) return null;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? null : ms;
}

function language(hass: Pick<HomeAssistant, "locale" | "language">): string {
  return hass.locale?.language || hass.language || "en";
}

// The locales Home Assistant's frontend formats each of its number formats with.
const NUMBER_LOCALES: Record<string, string[] | undefined> = {
  comma_decimal: ["en-US", "en"],
  decimal_comma: ["de", "es", "it"],
  space_comma: ["fr", "sv", "cs"],
  system: undefined,
};
const numberFormats = new Map<string, Intl.NumberFormat>();

/**
 * A number as Home Assistant writes it for the user, with `min` to `max` decimals: in their number
 * format ("454,2" with a decimal comma), else their language's; "none" is digits without grouping.
 */
export function formatNumber(hass: Pick<HomeAssistant, "locale" | "language">, value: number, max = 0, min = 0): string {
  const format = hass.locale?.number_format;
  const locales = format === "none" ? "en-US" : format && format in NUMBER_LOCALES ? NUMBER_LOCALES[format] : language(hass);
  const key = `${format}|${String(locales)}|${min}|${max}`;
  let formatter = numberFormats.get(key);
  if (!formatter) {
    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
      ...(format === "none" ? { useGrouping: false } : {}),
    };
    try {
      formatter = new Intl.NumberFormat(locales, options);
    } catch {
      // An unknown language tag throws; the browser's own format still reads.
      formatter = new Intl.NumberFormat(undefined, options);
    }
    numberFormats.set(key, formatter);
  }
  return formatter.format(value);
}

/**
 * The zone the user sees times in: the server's when their profile asks for it, else undefined
 * for the browser's own.
 */
export function timeZone(hass: Pick<HomeAssistant, "locale" | "config">): string | undefined {
  const choice = hass.locale?.time_zone;
  return choice === "server" ? hass.config?.time_zone || undefined : undefined;
}

/** Whether the browser's own locale uses a 12-hour clock, as "system" asks. */
function systemHour12(): boolean | undefined {
  try {
    return new Intl.DateTimeFormat(undefined, { hour: "numeric" }).resolvedOptions().hour12;
  } catch {
    return undefined;
  }
}

function clockOptions(hass: HomeAssistant): Intl.DateTimeFormatOptions {
  const format = hass.locale?.time_format;
  const zone = timeZone(hass);
  // "language" follows the user's language, which formatting with it already does.
  const hour12 = format === "12" ? true : format === "24" ? false : format === "system" ? systemHour12() : undefined;
  return {
    hour: "numeric",
    minute: "2-digit",
    ...(hour12 === undefined ? {} : { hour12 }),
    ...(zone ? { timeZone: zone } : {}),
  };
}

function formatWith(hass: HomeAssistant, options: Intl.DateTimeFormatOptions, ms: number): string {
  try {
    return new Intl.DateTimeFormat(language(hass), options).format(ms);
  } catch {
    // An unknown language tag or zone throws; English still says when.
    return new Intl.DateTimeFormat("en", { ...options, timeZone: undefined }).format(ms);
  }
}

/** A time of day in the user's format, e.g. "6:42 PM" or "18:42". */
export function formatClock(hass: HomeAssistant, ms: number): string {
  return formatWith(hass, clockOptions(hass), ms);
}

function dayOf(hass: HomeAssistant, ms: number): string {
  return formatWith(hass, { year: "numeric", month: "2-digit", day: "2-digit", timeZone: timeZone(hass) }, ms);
}

/** The time alone when it's today, else the date and time. */
export function formatDateTime(hass: HomeAssistant, ms: number, now: number): string {
  if (dayOf(hass, ms) === dayOf(hass, now)) return formatClock(hass, ms);
  return formatWith(hass, { month: "short", day: "numeric", ...clockOptions(hass) }, ms);
}

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Time left as on a timer: "4:05", or "1:04:05" from an hour. Rounds up, so 0:00 means done.
 * `hours` always shows them ("0:04:05"), beside a display that counts in hours and minutes.
 */
export function formatCountdown(ms: number, hours = false): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const whole = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return whole || hours ? `${whole}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

/**
 * A length of time in words: "45 min", "2 h 5 min", "3 d 4 h". `hours` keeps it in whole
 * hours from an hour on, as filter usage is counted.
 */
export function formatDuration(t: Translate, seconds: number, unit: "auto" | "hours" = "auto"): string {
  const minutes = Math.max(0, Math.round(seconds / 60));
  if (minutes < 60) return t("unit.minutes", { n: minutes });
  if (unit === "hours") return t("unit.hours", { n: Math.round(minutes / 60) });
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours < 48) return rest ? t("unit.hours_minutes", { h: hours, m: rest }) : t("unit.hours", { n: hours });
  const days = Math.floor(hours / 24);
  const extra = hours % 24;
  return extra ? t("unit.days_hours", { d: days, h: extra }) : t("unit.days", { n: days });
}

const SECONDS_PER: Record<string, number> = { ms: 0.001, s: 1, min: 60, h: 3600, d: 86400 };

/** A duration sensor in seconds, whatever display unit the user picked for it. */
export function durationSeconds(entity: HassEntity | undefined): number | null {
  const value = toNumber(stateValue(entity));
  if (value === null) return null;
  const unit = entity?.attributes?.unit_of_measurement;
  return value * (typeof unit === "string" && unit in SECONDS_PER ? SECONDS_PER[unit] : 1);
}

/**
 * A sensor's value with its unit as Home Assistant shows it, e.g. "120 gal", or "454,2 L" with a
 * decimal comma: its own formatting where it has it, else one decimal in the user's format.
 */
export function withUnit(hass: HomeAssistant, entity: HassEntity | undefined): string {
  const value = stateValue(entity);
  if (value === null || !entity) return "—";
  if (hass.formatEntityState) {
    try {
      return hass.formatEntityState(entity);
    } catch {
      // A frontend that can't format it; the panel's own formatting below still reads.
    }
  }
  const number = toNumber(value);
  const unit = entity.attributes?.unit_of_measurement;
  const shown = number === null ? value : formatNumber(hass, number, 1);
  return typeof unit === "string" && unit ? `${shown} ${unit}` : shown;
}

export function join(parts: ReadonlyArray<string | null | undefined | false>, separator = " · "): string | null {
  const kept = parts.filter((part): part is string => typeof part === "string" && part !== "");
  return kept.length ? kept.join(separator) : null;
}

export function percent(value: number | null): string {
  return value === null ? "—" : `${Math.round(value)}%`;
}

// ---------------------------------------------------------------------------------------------
// Controls

export interface ControlOptions {
  /** Defaults to the property key. */
  id?: string;
  hint?: string | null;
  /** Keys whose lock code disables the control; defaults to the property key. */
  locks?: string[];
  /** Lock codes that don't apply to this control (see operating_mode). */
  ignoreLocks?: LockCode[];
  /** Why the control can't be used right now; the first that's set wins. */
  reasons?: ReadonlyArray<string | null | undefined | false>;
}

interface Gate {
  disabled: boolean;
  reason: string | null;
}

export function lockReason(
  ctx: ApplianceContext,
  keys: readonly string[],
  ignore: readonly LockCode[] = [],
): string | null {
  for (const key of keys) {
    const code = ctx.appliance.locks?.[key];
    if (code && !ignore.includes(code)) return ctx.t(`lock.${code}`);
  }
  return null;
}

/**
 * Whether a control can be used, and why not: the appliance being offline, a lock from the
 * integration, a reason the family knows, then the entity being unavailable.
 */
function gate(ctx: ApplianceContext, key: string, entity: HassEntity | undefined, options: ControlOptions): Gate {
  if (!ctx.appliance.available) return { disabled: true, reason: ctx.t("reason.offline") };
  const lock = lockReason(ctx, options.locks ?? [key], options.ignoreLocks);
  if (lock) return { disabled: true, reason: lock };
  for (const reason of options.reasons ?? []) if (reason) return { disabled: true, reason };
  if (!entity || entity.state === "unavailable") return { disabled: true, reason: ctx.t("reason.unavailable") };
  return { disabled: false, reason: null };
}

export function entityFor(ctx: ApplianceContext, key: string, domain: EntityDomain) {
  const entityId = ctx.entityId(key, domain);
  return entityId ? { entityId, entity: ctx.hass.states[entityId] as HassEntity | undefined } : null;
}

/** The id, label, hint and disabled state every control starts from. */
export function base(
  ctx: ApplianceContext,
  key: string,
  label: string,
  entity: HassEntity | undefined,
  options: ControlOptions = {},
) {
  return { id: options.id ?? key, label, hint: options.hint ?? null, ...gate(ctx, key, entity, options) };
}

/** Minutes from a number entity, with presets: kitchen timers and the hood's delayed shutoff. */
export function durationControl(
  ctx: ApplianceContext,
  key: string,
  label: string,
  presets: number[],
  options: ControlOptions = {},
): Control | null {
  const found = entityFor(ctx, key, "number");
  if (!found) return null;
  const attributes = found.entity?.attributes ?? {};
  const value = toNumber(stateValue(found.entity));
  return {
    kind: "duration",
    ...base(ctx, key, label, found.entity, options),
    action: { type: "number", entity_id: found.entityId },
    value: value === null ? null : Math.round(value),
    min: toNumber(attributes.min) ?? 0,
    max: toNumber(attributes.max) ?? 719,
    presets,
  };
}

/**
 * A setpoint from a number entity: refrigeration zones, probe targets. A locked number entity
 * is unavailable and has no value, so the setpoint's sensor, which keeps reporting, shows it.
 */
export function numberSetpoint(
  ctx: ApplianceContext,
  key: string,
  label: string,
  options: ControlOptions = {},
): Control | null {
  const found = entityFor(ctx, key, "number");
  if (!found) return null;
  const attributes = found.entity?.attributes ?? {};
  return {
    kind: "setpoint",
    ...base(ctx, key, label, found.entity, options),
    action: { type: "number", entity_id: found.entityId },
    value: toNumber(stateValue(found.entity)) ?? numberOf(ctx, key, "sensor"),
    min: toNumber(attributes.min) ?? 0,
    max: toNumber(attributes.max) ?? 100,
    step: toNumber(attributes.step) ?? 1,
    unit: temperatureUnit(ctx.hass),
  };
}

/** Whether a climate entity takes a target temperature now (an oven in Broil doesn't). */
export function climateTakesTemperature(entity: HassEntity | undefined): boolean {
  const features = toNumber(entity?.attributes?.supported_features);
  // ClimateEntityFeature.TARGET_TEMPERATURE is 1.
  if (features !== null) return (features & 1) === 1;
  return entity?.attributes?.temperature !== undefined;
}

/**
 * A setpoint from a climate entity: oven cavities. While the entity is unavailable (locked) it
 * has no attributes, so the setpoint's sensor shows the value; an oven that's off has none.
 */
export function climateSetpoint(
  ctx: ApplianceContext,
  key: string,
  label: string,
  options: ControlOptions = {},
): Control | null {
  const found = entityFor(ctx, key, "climate");
  if (!found) return null;
  const attributes = found.entity?.attributes ?? {};
  const unavailable = !found.entity || found.entity.state === "unavailable";
  return {
    kind: "setpoint",
    ...base(ctx, key, label, found.entity, options),
    action: { type: "climate_temperature", entity_id: found.entityId },
    value: toNumber(attributes.temperature) ?? (unavailable ? numberOf(ctx, key, "sensor") : null),
    min: toNumber(attributes.min_temp) ?? 0,
    max: toNumber(attributes.max_temp) ?? 100,
    step: toNumber(attributes.target_temp_step) ?? (isCelsius(ctx.hass) ? 0.5 : 1),
    unit: temperatureUnit(ctx.hass),
  };
}

/**
 * A select entity's options. `fallback` is shown while the select has no value, e.g. the
 * cooking mode or wash cycle from their sensors while the select is locked.
 */
export function selectControl(
  ctx: ApplianceContext,
  key: string,
  label: string,
  options: ControlOptions & { fallback?: string | null } = {},
): Control | null {
  const found = entityFor(ctx, key, "select");
  if (!found) return null;
  const offered = found.entity?.attributes?.options;
  const values = Array.isArray(offered) ? offered.filter((option): option is string => typeof option === "string") : [];
  return {
    kind: "select",
    ...base(ctx, key, label, found.entity, options),
    action: { type: "select", entity_id: found.entityId },
    value: stateValue(found.entity) ?? options.fallback ?? null,
    options: values.map((value) => ({ value, label: optionLabel(ctx.t, value) })),
  };
}

export function switchToggle(
  ctx: ApplianceContext,
  key: string,
  label: string,
  options: ControlOptions = {},
): Control | null {
  const found = entityFor(ctx, key, "switch");
  if (!found) return null;
  const state = stateValue(found.entity);
  return {
    kind: "toggle",
    ...base(ctx, key, label, found.entity, options),
    action: { type: "switch", entity_id: found.entityId },
    value: state === "on" ? true : state === "off" ? false : null,
  };
}

export function buttonAction(
  ctx: ApplianceContext,
  key: string,
  label: string,
  button: string,
  options: ControlOptions & { confirm?: string | null; tone?: "primary" | "danger" } = {},
): Control | null {
  const found = entityFor(ctx, key, "button");
  if (!found) return null;
  return {
    kind: "action",
    ...base(ctx, key, label, found.entity, options),
    action: { type: "button", entity_id: found.entityId },
    confirm: options.confirm ?? null,
    button,
    ...(options.tone ? { tone: options.tone } : {}),
  };
}

/** Whether a button entity can be pressed now; buttons report "unavailable" when they can't. */
export function buttonReady(ctx: ApplianceContext, key: string): boolean {
  const found = entityFor(ctx, key, "button");
  return Boolean(found?.entity && found.entity.state !== "unavailable");
}

export function reading(
  id: string,
  label: string,
  value: string | null,
  options: { tone?: "normal" | "warning" | "alert"; hint?: string | null } = {},
): Control {
  return {
    kind: "reading",
    id,
    label,
    value: value ?? "—",
    hint: options.hint ?? null,
    ...(options.tone ? { tone: options.tone } : {}),
  };
}

export function countdown(id: string, label: string, end: string | null, hint: string | null = null): Control {
  return { kind: "countdown", id, label, end, hint };
}

export function section(
  id: string,
  title: string,
  controls: ReadonlyArray<Control | null | undefined>,
  collapsed = false,
): Section | null {
  const kept = controls.filter((control): control is Control => Boolean(control));
  return kept.length ? { id, title, controls: kept, ...(collapsed ? { collapsed: true } : {}) } : null;
}

export function compact<T>(items: ReadonlyArray<T | null | undefined>): T[] {
  return items.filter((item): item is T => item !== null && item !== undefined);
}

// ---------------------------------------------------------------------------------------------
// What every appliance has

interface Fault {
  code?: unknown;
  severity?: unknown;
  description?: unknown;
  title?: unknown;
  resolution_steps?: unknown;
}

const SEVERITIES = new Set(["undefined", "low", "medium", "high", "critical", "urgent", "unknown"]);
const SERIOUS = new Set(["high", "critical", "urgent"]);

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : typeof value === "number" ? String(value) : null;
}

/** The Active faults sensor's faults, each with Sub-Zero's title and resolution when it has them. */
export function activeFaults(ctx: ApplianceContext): Fault[] {
  const entity = ctx.state("active_faults", "sensor");
  if (!stateValue(entity)) return [];
  const faults = entity?.attributes?.faults;
  return Array.isArray(faults) ? faults.filter((fault): fault is Fault => Boolean(fault) && typeof fault === "object") : [];
}

export function faultCount(ctx: ApplianceContext): number {
  return numberOf(ctx, "active_faults", "sensor") ?? 0;
}

export function needsService(ctx: ApplianceContext): boolean {
  return isOn(ctx, "service_required", "binary_sensor") === true || faultCount(ctx) > 0;
}

function faultReading(ctx: ApplianceContext, fault: Fault, index: number): Control {
  const t = ctx.t;
  const code = text(fault.code);
  const title = text(fault.title);
  const description = text(fault.description);
  const severity = text(fault.severity) ?? "unknown";
  const label = title ?? description ?? (code ? t("control.fault", { code }) : t("control.fault_unknown"));
  const hint = join(
    [
      code && (title || description) ? t("control.fault_code", { code }) : null,
      title && description && description !== title ? description : null,
      text(fault.resolution_steps),
    ],
    "\n",
  );
  return reading(`fault_${index}`, label, t(`severity.${SEVERITIES.has(severity) ? severity : "unknown"}`), {
    tone: SERIOUS.has(severity) ? "alert" : "warning",
    hint,
  });
}

export function wifiQuality(rssi: number): "excellent" | "good" | "fair" | "weak" {
  if (rssi >= -50) return "excellent";
  if (rssi >= -60) return "good";
  if (rssi >= -70) return "fair";
  return "weak";
}

/** Service, faults and the appliance's own details; open when there's a problem to read. */
export function detailsSection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  const service = isOn(ctx, "service_required", "binary_sensor");
  const faults = activeFaults(ctx);
  const count = numberOf(ctx, "active_faults", "sensor");
  const rssi = numberOf(ctx, "ap_rssi", "sensor");
  const uptime = durationSeconds(ctx.state("uptime", "sensor"));
  const controls: Array<Control | null> = [
    has(ctx, "service_required", "binary_sensor")
      ? reading("service_required", t("control.service"), service === null ? null : t(service ? "value.required" : "value.not_needed"), {
          tone: service ? "alert" : "normal",
        })
      : null,
    has(ctx, "active_faults", "sensor")
      ? reading("active_faults", t("control.faults"), count === null ? null : count === 0 ? t("value.no_faults") : String(count), {
          tone: count ? "alert" : "normal",
        })
      : null,
    ...faults.map((fault, index) => faultReading(ctx, fault, index)),
    has(ctx, "ap_rssi", "sensor")
      ? reading("ap_rssi", t("control.wifi"), rssi === null ? null : `${t(`wifi.${wifiQuality(rssi)}`)} · ${Math.round(rssi)} dBm`)
      : null,
    has(ctx, "uptime", "sensor") ? reading("uptime", t("control.uptime"), uptime === null ? null : formatDuration(t, uptime)) : null,
    ctx.appliance.model ? reading("model", t("control.model"), ctx.appliance.model) : null,
    ctx.appliance.appliance_type ? reading("appliance_type", t("control.appliance_type"), ctx.appliance.appliance_type) : null,
  ];
  return section("details", t("section.details"), controls, !(service || faults.length || (count ?? 0) > 0));
}
