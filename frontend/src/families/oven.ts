/**
 * Wolf ovens, one model for ranges and wall ovens: each cavity's power, temperature, mode,
 * remote start, light, probe and timers, plus the kitchen timers.
 */
import type { DrawingState, OvenState } from "../drawings/types";
import type { OvenSlot } from "../types";
import {
  anyOpen,
  applianceType,
  base,
  buttonAction,
  buttonReady,
  clamp,
  climateSetpoint,
  climateTakesTemperature,
  compact,
  countdown,
  detailsSection,
  doors,
  durationControl,
  formatClock,
  formatCountdown,
  formatTemperature,
  has,
  isOn,
  join,
  needsService,
  numberOf,
  numberSetpoint,
  parseTime,
  read,
  reading,
  roomTemperature,
  section,
  selectControl,
  switchToggle,
  toNumber,
} from "./common";
import { optionLabel } from "./options";
import type { ApplianceContext, Control, DisplayText, FamilyModel, InfoRow, Section, StatusPill } from "./types";

type Prefix = "cav" | "cav2";

export interface Cavity {
  prefix: Prefix;
  position: OvenSlot["position"];
}

const KITCHEN_TIMERS = ["kitchen_timer", "kitchen_timer2"] as const;
// Modes Wolf requires starting at the oven (MANUAL_COOK_MODES in const.py).
const MANUAL_MODES = new Set(["Broil", "Convection broil", "Proof", "Self clean"]);
// Ovens with a mode knob, which the integration checks for mode changes (KNOB_OVEN_TYPES).
const KNOB_TYPES = new Set([
  "4.1.3",
  "4.2.3",
  "8.1.0",
  "8.2.0",
  "8.3.0",
  "8.4.1",
  "8.4.2",
  "8.5.1",
  "8.6.1",
  "8.6.2",
  "15.1.3",
  "15.2.3",
]);
const RANGE_SERIES = 8;

// Keys every oven cavity reports one of.
const CAVITY_KEYS = ["unit_on", "set_temp", "temp", "cook_mode", "door_ajar", "light_on", "remote_ready"];

function reports(ctx: ApplianceContext, prefix: Prefix): boolean {
  return CAVITY_KEYS.some((suffix) => has(ctx, `${prefix}_${suffix}`)) || has(ctx, `remote_start_${prefix}_unit_on`);
}

/** Whether the appliance has an oven cavity or kitchen timer, for appliances of unknown family. */
export function hasOven(ctx: ApplianceContext): boolean {
  return reports(ctx, "cav") || reports(ctx, "cav2") || KITCHEN_TIMERS.some((prefix) => has(ctx, `${prefix}_active`));
}

/**
 * The cavities in the drawing's order: left to right on a range, top to bottom on a wall oven.
 * The spec has them; without one, two cavities on a range (series 8) are left and right.
 */
export function cavities(ctx: ApplianceContext): Cavity[] {
  const spec = ctx.appliance.spec;
  if ((spec.family === "range" || spec.family === "wall_oven") && spec.ovens?.length) {
    const listed = spec.ovens.map(({ prefix, position }) => ({ prefix, position }));
    const reported = listed.filter((cavity) => reports(ctx, cavity.prefix));
    return reported.length ? reported : listed;
  }
  const found = (["cav", "cav2"] as const).filter((prefix) => reports(ctx, prefix));
  if (found.length < 2) return found.map((prefix) => ({ prefix, position: "single" }));
  return applianceType(ctx.appliance)?.[0] === RANGE_SERIES
    ? [
        { prefix: "cav2", position: "left" },
        { prefix: "cav", position: "right" },
      ]
    : [
        { prefix: "cav", position: "upper" },
        { prefix: "cav2", position: "lower" },
      ];
}

/** The app's names: Right and Left oven on a range, Upper and Lower on a double wall oven. */
export function cavityName(ctx: ApplianceContext, cavity: Cavity): string {
  return ctx.t(`cavity.${cavity.position}`);
}

/**
 * Preheat progress from 0 to 1: how far the temperature has come from where the preheat
 * started (or room temperature) to the setpoint. Null while off or without a setpoint, 1 once
 * the oven says it's at temperature.
 */
export function preheatProgress(
  on: boolean,
  preheated: boolean,
  temperature: number | null,
  setpoint: number | null,
  start: number | null,
  room: number,
): number | null {
  if (!on) return null;
  if (preheated) return 1;
  if (temperature === null || setpoint === null) return null;
  // A start at or above the setpoint can't measure progress; room temperature still can.
  for (const from of [start, room]) {
    if (from !== null && setpoint > from) return clamp((temperature - from) / (setpoint - from), 0, 1);
  }
  return temperature >= setpoint ? 1 : 0;
}

interface CavityReading {
  on: boolean;
  preheated: boolean;
  temperature: number | null;
  setpoint: number | null;
  /** The cooking mode as the integration names it ("Bake"). */
  mode: string | null;
  light: boolean;
  door: boolean;
  probe: boolean;
  remoteReady: boolean;
  progress: number | null;
}

function cavityReading(ctx: ApplianceContext, prefix: Prefix): CavityReading {
  const climate = ctx.state(`${prefix}_set_temp`, "climate");
  const climateState = read(ctx, `${prefix}_set_temp`, "climate");
  const on = isOn(ctx, `${prefix}_unit_on`, "binary_sensor") ?? (climateState !== null && climateState !== "off");
  const preheated = isOn(ctx, `${prefix}_at_set_temp`, "binary_sensor") === true;
  const temperature = numberOf(ctx, `${prefix}_temp`, "sensor") ?? toNumber(climate?.attributes?.current_temperature);
  const setpoint = numberOf(ctx, `${prefix}_set_temp`, "sensor") ?? toNumber(climate?.attributes?.temperature);
  return {
    on,
    preheated,
    temperature,
    setpoint,
    mode: read(ctx, `${prefix}_cook_mode`, "sensor", "select"),
    light: isOn(ctx, `${prefix}_light_on`, "switch", "binary_sensor") === true,
    door: isOn(ctx, `${prefix}_door_ajar`, "binary_sensor") === true,
    probe: isOn(ctx, `${prefix}_probe_on`, "binary_sensor") === true,
    remoteReady: isOn(ctx, `${prefix}_remote_ready`, "binary_sensor") === true,
    progress: preheatProgress(on, preheated, temperature, setpoint, ctx.preheatStart(prefix), roomTemperature(ctx.hass)),
  };
}

function modeLabel(ctx: ApplianceContext, reading: CavityReading): string | null {
  return reading.mode && reading.mode !== "Off" ? optionLabel(ctx.t, reading.mode) : null;
}

/** What a cavity is set to, as the app says it: "Bake 350°", or "Broil · High". */
function setting(ctx: ApplianceContext, prefix: Prefix, reading: CavityReading): string | null {
  const mode = modeLabel(ctx, reading);
  const level = read(ctx, `${prefix}_broil_level`, "sensor");
  if (mode && level) return `${mode} · ${optionLabel(ctx.t, level)}`;
  if (mode && reading.setpoint !== null) return `${mode} ${formatTemperature(reading.setpoint)}`;
  return mode ?? (reading.setpoint !== null ? formatTemperature(reading.setpoint) : null);
}

function knobOven(ctx: ApplianceContext): boolean {
  const type = applianceType(ctx.appliance);
  return type !== null && KNOB_TYPES.has(type.join("."));
}

interface RunningTimer {
  prefix: (typeof KITCHEN_TIMERS)[number];
  left: number;
}

/** Active kitchen timers, soonest first. */
function runningTimers(ctx: ApplianceContext): RunningTimer[] {
  return compact(
    KITCHEN_TIMERS.map((prefix) => {
      if (isOn(ctx, `${prefix}_active`, "binary_sensor") !== true) return null;
      const end = parseTime(read(ctx, `${prefix}_end_time`, "sensor"));
      return end === null ? null : { prefix, left: Math.max(0, end - ctx.now) };
    }),
  ).sort((a, b) => a.left - b.left);
}

/** Why Start can't be pressed, mirroring the integration's remote start checks. */
function startReasons(ctx: ApplianceContext, prefix: Prefix, reading: CavityReading): Array<string | null> {
  const t = ctx.t;
  return [
    reading.door ? t("reason.close_oven_door") : null,
    !reading.mode || reading.mode === "Off" ? t("reason.choose_mode") : null,
    MANUAL_MODES.has(reading.mode ?? "") || isOn(ctx, `${prefix}_gourmet_mode_on`, "binary_sensor") ? t("reason.manual_mode") : null,
    reading.setpoint === null ? t("reason.set_temperature") : null,
  ];
}

function cavitySection(ctx: ApplianceContext, cavity: Cavity): Section | null {
  const t = ctx.t;
  const prefix = cavity.prefix;
  const now = cavityReading(ctx, prefix);
  // The integration changes the temperature and mode only while the oven runs or is in Remote Ready.
  const notReady = now.on || now.remoteReady ? null : t("reason.oven_not_ready");
  const climateId = ctx.entityId(`${prefix}_set_temp`, "climate");
  const climate = climateId ? ctx.hass.states[climateId] : undefined;
  const startKey = `remote_start_${prefix}_unit_on`;
  const controls: Array<Control | null> = [];

  if (climateId) {
    // Turning on goes through Start and its confirmation, so the switch only turns the oven off.
    const offReason = has(ctx, startKey, "button")
      ? t(now.remoteReady ? "reason.use_start" : "reason.remote_ready_oven")
      : t("reason.start_at_oven");
    controls.push({
      kind: "toggle",
      ...base(ctx, `${prefix}_unit_on`, t("control.power"), climate, {
        id: `${prefix}_power`,
        reasons: [now.on ? null : offReason],
      }),
      action: { type: "climate_power", entity_id: climateId },
      value: now.on,
    });
  }

  // A locked climate entity is unavailable and reports no features, which doesn't make its mode
  // one without a temperature: the setpoint stays, locked, with the value from its sensor.
  const takesTemperature = climate?.state === "unavailable" || climateTakesTemperature(climate);
  // A mode without a temperature (Broil, Self clean) shows its broil level instead.
  if (!(now.on && !takesTemperature)) {
    const noTemperature = now.mode && now.mode !== "Off" ? t("reason.no_temperature") : t("reason.choose_mode");
    controls.push(
      climateSetpoint(ctx, `${prefix}_set_temp`, t("control.temperature"), {
        hint: now.on && now.temperature !== null ? t("value.now", { temp: formatTemperature(now.temperature) }) : null,
        reasons: [notReady, takesTemperature ? null : noTemperature],
      }),
    );
  }

  const knobLocked = knobOven(ctx) && isOn(ctx, `${prefix}_mode_change_enabled`, "binary_sensor") === false;
  controls.push(
    selectControl(ctx, `${prefix}_cook_mode`, t("control.cook_mode"), {
      reasons: [notReady, knobLocked ? t("reason.mode_change_disabled") : null],
      fallback: read(ctx, `${prefix}_cook_mode`, "sensor"),
    }),
  );

  if (!now.on && now.remoteReady && has(ctx, startKey, "button")) {
    controls.push(
      buttonAction(ctx, startKey, t("control.remote_start"), t("action.start"), {
        confirm: t(`confirm.start.${cavity.position}`, { setting: setting(ctx, prefix, now) ?? "—" }),
        tone: "primary",
        locks: [startKey, `${prefix}_unit_on`],
        reasons: buttonReady(ctx, startKey) ? [] : startReasons(ctx, prefix, now),
      }),
    );
  }

  controls.push(switchToggle(ctx, `${prefix}_light_on`, t("control.light")));

  if (has(ctx, `${prefix}_probe_on`, "binary_sensor")) {
    const done = isOn(ctx, `${prefix}_probe_at_set_temp`, "binary_sensor") === true;
    const close = isOn(ctx, `${prefix}_probe_within_10deg`, "binary_sensor") === true;
    controls.push(
      reading(
        `${prefix}_probe`,
        t("control.probe"),
        now.probe ? formatTemperature(numberOf(ctx, `${prefix}_probe_temp`, "sensor")) : t("value.not_connected"),
        {
          hint: now.probe ? (done ? t("value.probe_done") : close ? t("value.probe_close") : null) : null,
          tone: now.probe && done ? "warning" : "normal",
        },
      ),
    );
    if (now.probe) {
      controls.push(numberSetpoint(ctx, `${prefix}_probe_set_temp`, t("control.probe_target"), { reasons: [notReady] }));
    }
  }

  const timerEnd = isOn(ctx, `${prefix}_cook_timer_active`, "binary_sensor") ? read(ctx, `${prefix}_cook_timer_end_time`, "sensor") : null;
  if (isOn(ctx, `${prefix}_cook_timer_complete`, "binary_sensor")) {
    controls.push(reading(`${prefix}_cook_timer`, t("control.cook_timer"), t("value.done"), { tone: "warning" }));
  } else if (timerEnd) {
    const soon = isOn(ctx, `${prefix}_cook_timer_within_1min`, "binary_sensor");
    controls.push(countdown(`${prefix}_cook_timer`, t("control.cook_timer"), timerEnd, soon ? t("value.under_minute") : null));
  }

  if (isOn(ctx, `${prefix}_gourmet_mode_on`, "binary_sensor")) {
    // Gourmet program names stay as the integration reports them: there are 79 of them.
    controls.push(reading(`${prefix}_gourmet`, t("control.gourmet"), read(ctx, `${prefix}_gourmet_recipe`, "sensor") ?? t("value.on")));
  }

  const level = read(ctx, `${prefix}_broil_level`, "sensor");
  if (level) controls.push(reading(`${prefix}_broil_level`, t("control.broil_level"), optionLabel(t, level)));

  // With two ovens, one that's off (and not waiting in Remote Ready) starts closed: its controls are
  // mostly locked, and on a phone they'd push the other oven out of sight. The pill says it's off.
  const idle = !now.on && !now.remoteReady && cavities(ctx).length > 1;
  return section(prefix, cavityName(ctx, cavity), controls, idle);
}

function timerSection(ctx: ApplianceContext, prefix: (typeof KITCHEN_TIMERS)[number]): Section | null {
  const t = ctx.t;
  const durationKey = `${prefix}_duration`;
  if (!has(ctx, durationKey, "number") && !has(ctx, `${prefix}_active`, "binary_sensor")) return null;
  const end = isOn(ctx, `${prefix}_active`, "binary_sensor") ? read(ctx, `${prefix}_end_time`, "sensor") : null;
  const endsAt = parseTime(end);
  return section(prefix, t(`control.${prefix}`), [
    end ? countdown(`${prefix}_end_time`, t("control.time_left"), end, endsAt === null ? null : t("value.ends_at", { time: formatClock(ctx.hass, endsAt) })) : null,
    durationControl(ctx, durationKey, t("control.duration"), [5, 10, 15, 30, 60]),
    isOn(ctx, `${prefix}_complete`, "binary_sensor")
      ? buttonAction(ctx, `dismiss_${prefix}`, t("control.timer_finished"), t("action.dismiss"), {
          locks: [`dismiss_${prefix}`, durationKey],
        })
      : null,
  ]);
}

function settingsSection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  const sabbath = isOn(ctx, "sabbath_on", "binary_sensor");
  return section(
    "settings",
    t("section.settings"),
    [
      selectControl(ctx, "door_ajar_timeout", t("control.door_open_delay")),
      has(ctx, "sabbath_on", "binary_sensor")
        ? reading("sabbath_on", t("control.sabbath"), sabbath === null ? null : t(sabbath ? "value.on" : "value.off"))
        : null,
    ],
    true,
  );
}

function doorKeys(ctx: ApplianceContext): string[] {
  return cavities(ctx).map((cavity) => `${cavity.prefix}_door_ajar`);
}

export const oven: FamilyModel = {
  drawingState(ctx): DrawingState {
    const ovens: Partial<Record<Prefix, OvenState>> = {};
    for (const cavity of cavities(ctx)) {
      const now = cavityReading(ctx, cavity.prefix);
      ovens[cavity.prefix] = {
        on: now.on,
        preheated: now.preheated,
        progress: now.progress,
        light: now.light,
        door_open: now.door,
        probe: now.probe,
        remote_ready: now.remoteReady,
        self_clean: now.mode === "Self clean",
        // An oven that's off reports its last temperature, which is stale.
        temp: now.on && now.temperature !== null ? formatTemperature(now.temperature) : null,
        mode: now.on ? modeLabel(ctx, now) : null,
      };
    }
    const timer = runningTimers(ctx)[0];
    return {
      available: ctx.appliance.available,
      doors: doors(ctx, doorKeys(ctx)),
      readouts: {},
      ovens,
      display: timer ? formatCountdown(timer.left) : null,
      sabbath: isOn(ctx, "sabbath_on", "binary_sensor") === true,
    };
  },

  status(ctx): StatusPill {
    const t = ctx.t;
    if (!ctx.appliance.available) return { text: t("pill.offline"), tone: "gray" };
    const readings = cavities(ctx).map((cavity) => cavityReading(ctx, cavity.prefix));
    if (readings.some((now) => now.on && now.mode === "Self clean")) return { text: t("pill.self_clean"), tone: "warm" };
    const heating = readings.filter((now) => now.on && !now.preheated && now.progress !== null);
    if (heating.length) {
      // Never 100% before the oven itself says it's there.
      const pct = Math.min(99, Math.round(Math.min(...heating.map((now) => now.progress ?? 0)) * 100));
      return { text: t("pill.preheating", { pct }), tone: "warm" };
    }
    if (readings.some((now) => now.on)) {
      return readings.some((now) => now.on && now.preheated)
        ? { text: t("pill.preheated"), tone: "green" }
        : { text: t("pill.cooking"), tone: "warm" };
    }
    if (needsService(ctx)) return { text: t("pill.service"), tone: "red" };
    if (isOn(ctx, "sabbath_on", "binary_sensor")) return { text: t("pill.sabbath"), tone: "gray" };
    if (readings.some((now) => now.remoteReady)) return { text: t("pill.remote_ready"), tone: "accent" };
    const timer = runningTimers(ctx)[0];
    if (timer) return { text: t("pill.timer", { time: formatCountdown(timer.left) }), tone: "accent" };
    if (KITCHEN_TIMERS.some((prefix) => isOn(ctx, `${prefix}_complete`, "binary_sensor"))) {
      return { text: t("pill.timer_done"), tone: "green" };
    }
    if (anyOpen(ctx, doorKeys(ctx))) return { text: t("pill.door_open"), tone: "amber" };
    return { text: t("pill.off"), tone: "neutral" };
  },

  infoRows(ctx): InfoRow[] {
    const t = ctx.t;
    const list = cavities(ctx);
    const rows: InfoRow[] = list.map((cavity) => {
      const now = cavityReading(ctx, cavity.prefix);
      return {
        label: cavityName(ctx, cavity),
        value: now.on ? (setting(ctx, cavity.prefix, now) ?? t("value.on")) : t("value.off"),
      };
    });
    for (const timer of runningTimers(ctx)) {
      rows.push({ label: t(`control.${timer.prefix}`), value: formatCountdown(timer.left) });
    }
    for (const cavity of list) {
      if (isOn(ctx, `${cavity.prefix}_probe_on`, "binary_sensor") !== true) continue;
      const temperature = numberOf(ctx, `${cavity.prefix}_probe_temp`, "sensor");
      const target = numberOf(ctx, `${cavity.prefix}_probe_set_temp`, "sensor", "number");
      rows.push({
        label: list.length > 1 ? `${t("info.probe")} · ${cavityName(ctx, cavity)}` : t("info.probe"),
        value: target === null ? formatTemperature(temperature) : `${formatTemperature(temperature)} → ${formatTemperature(target)}`,
      });
    }
    return rows.slice(0, 3);
  },

  display(ctx): DisplayText | null {
    if (!ctx.appliance.available) return null;
    const t = ctx.t;
    const list = cavities(ctx);
    const running = list
      .map((cavity) => ({ cavity, now: cavityReading(ctx, cavity.prefix) }))
      .filter(({ now }) => now.on);
    if (!running.length) {
      const timer = runningTimers(ctx)[0];
      if (timer) return { text: formatCountdown(timer.left), caption: t(`control.${timer.prefix}`) };
      return { text: t("value.off"), caption: null };
    }
    const temperature = ({ now }: (typeof running)[number]) => formatTemperature(now.temperature ?? now.setpoint);
    if (running.length === 1) {
      const [only] = running;
      return {
        text: temperature(only),
        caption: join([list.length > 1 ? cavityName(ctx, only.cavity) : null, modeLabel(ctx, only.now)]),
      };
    }
    return {
      text: running.map(temperature).join(" · "),
      caption: running.map(({ cavity, now }) => modeLabel(ctx, now) ?? cavityName(ctx, cavity)).join(" · "),
    };
  },

  sections(ctx): Section[] {
    return compact([
      ...cavities(ctx).map((cavity) => cavitySection(ctx, cavity)),
      ...KITCHEN_TIMERS.map((prefix) => timerSection(ctx, prefix)),
      settingsSection(ctx),
      detailsSection(ctx),
    ]);
  },
};
