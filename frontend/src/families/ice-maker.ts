/** Dedicated ice makers: production, the ice delay schedule, cleaning and the filter. */
import type { DrawingState } from "../drawings/types";
import {
  buttonAction,
  buttonReady,
  compact,
  countdown,
  detailsSection,
  doors,
  durationSeconds,
  formatClock,
  formatDateTime,
  formatDuration,
  has,
  isOn,
  needsService,
  numberOf,
  parseTime,
  read,
  reading,
  section,
  selectControl,
} from "./common";
import { optionLabel } from "./options";
import type { ApplianceContext, Control, FamilyModel, InfoRow, Section, StatusPill } from "./types";

const DOORS = ["ice_door_ajar"];
// Cleaning stages that aren't a cleaning in progress.
const IDLE_STAGES = new Set(["Off", "Not cleaning", "Cleaning complete"]);

function producing(ctx: ApplianceContext): boolean | null {
  const on = isOn(ctx, "ice_maker_on", "binary_sensor");
  if (on !== null) return on;
  const option = read(ctx, "ice_maker_mode", "select");
  return option === "On" ? true : option === "Off" ? false : null;
}

function cleaning(ctx: ApplianceContext): boolean {
  const stage = read(ctx, "ice_maker_clean_stage", "sensor");
  return isOn(ctx, "ice_maker_clean_on", "binary_sensor") === true || (stage !== null && !IDLE_STAGES.has(stage));
}

function paused(ctx: ApplianceContext): boolean {
  return isOn(ctx, "delay_active", "binary_sensor") === true;
}

/** The scheduled delay in words: "From 10:00 PM for 8 h", or "Daily from …". */
function schedule(ctx: ApplianceContext): string | null {
  const seconds = durationSeconds(ctx.state("delay_duration", "sensor"));
  if (!seconds) return null;
  const start = parseTime(read(ctx, "delay_start_time", "sensor"));
  const duration = formatDuration(ctx.t, seconds);
  const daily = isOn(ctx, "delay_recurring", "binary_sensor") === true;
  if (start === null) return daily ? ctx.t("value.daily_for", { duration }) : duration;
  const time = formatClock(ctx.hass, start);
  return ctx.t(daily ? "value.daily_from" : "value.from_for", { time, duration });
}

function status(ctx: ApplianceContext): string | null {
  const reported = read(ctx, "ice_maker_status", "sensor");
  if (reported !== null) return optionLabel(ctx.t, reported);
  const on = producing(ctx);
  return on === null ? null : ctx.t(on ? "value.on" : "value.off");
}

function iceSection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  return section("ice", t("section.ice_maker"), [
    selectControl(ctx, "ice_maker_mode", t("control.ice_maker"), { locks: ["ice_maker_mode", "ice_maker_on"] }),
    has(ctx, "ice_maker_status", "sensor") ? reading("ice_maker_status", t("control.status"), status(ctx)) : null,
  ]);
}

function delaySection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  const delays = has(ctx, "delay_duration", "sensor") || has(ctx, "end_ice_delay", "button") || has(ctx, "cancel_ice_delay", "button");
  if (!delays) return null;
  const end = paused(ctx) ? read(ctx, "delay_end_time", "sensor") : null;
  const planned = schedule(ctx);
  const sabbath = isOn(ctx, "sabbath_on", "binary_sensor") === true;
  const form: Control = {
    kind: "ice_delay",
    id: "schedule_ice_delay",
    label: t("control.schedule_delay"),
    device_id: ctx.appliance.device_id,
    disabled: !ctx.appliance.available || sabbath,
    reason: !ctx.appliance.available ? t("reason.offline") : sabbath ? t("lock.sabbath") : null,
  };
  return section("ice_delay", t("section.ice_delay"), [
    end ? countdown("delay_end_time", t("control.delay_left"), end) : null,
    planned ? reading("delay_schedule", t("control.delay_schedule"), planned) : null,
    form,
    // These only mean something while there's a delay or a schedule to end.
    buttonReady(ctx, "end_ice_delay") ? buttonAction(ctx, "end_ice_delay", t("control.end_delay"), t("action.end")) : null,
    buttonReady(ctx, "cancel_ice_delay")
      ? buttonAction(ctx, "cancel_ice_delay", t("control.cancel_delay"), t("action.cancel_schedule"))
      : null,
  ]);
}

function cleaningSection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  const stage = read(ctx, "ice_maker_clean_stage", "sensor");
  const next = parseTime(read(ctx, "next_clean_time", "sensor"));
  const cycles = numberOf(ctx, "next_clean_cycles", "sensor");
  const now = isOn(ctx, "clean_now_on", "binary_sensor");
  const soon = isOn(ctx, "clean_soon_on", "binary_sensor");
  const due = now ? t("value.due_now") : soon ? t("value.due_soon") : now === false || soon === false ? t("value.not_due") : null;
  return section("cleaning", t("section.cleaning"), [
    has(ctx, "ice_maker_clean_stage", "sensor")
      ? reading("ice_maker_clean_stage", t("control.clean_stage"), stage === null ? null : optionLabel(t, stage))
      : null,
    has(ctx, "clean_now_on", "binary_sensor") || has(ctx, "clean_soon_on", "binary_sensor")
      ? reading("clean_due", t("control.clean_due"), due, { tone: now ? "alert" : soon ? "warning" : "normal" })
      : null,
    has(ctx, "next_clean_time", "sensor")
      ? reading("next_clean_time", t("control.next_cleaning"), next === null ? null : formatDateTime(ctx.hass, next, ctx.now))
      : null,
    has(ctx, "next_clean_cycles", "sensor")
      ? reading("next_clean_cycles", t("control.cycles_until_cleaning"), cycles === null ? null : String(Math.round(cycles)))
      : null,
  ]);
}

function filterSection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  const inserted = isOn(ctx, "water_filter_inserted", "binary_sensor");
  const used = durationSeconds(ctx.state("filter_count", "sensor"));
  const allowed = durationSeconds(ctx.state("filter_max_count", "sensor"));
  return section("filters", t("section.filters"), [
    has(ctx, "water_filter_inserted", "binary_sensor")
      ? reading("water_filter_inserted", t("control.water_filter"), inserted === null ? null : t(inserted ? "value.inserted" : "value.missing"), {
          tone: inserted === false ? "warning" : "normal",
        })
      : null,
    has(ctx, "filter_count", "sensor") ? reading("filter_count", t("control.filter_usage"), used === null ? null : formatDuration(t, used, "hours")) : null,
    has(ctx, "filter_max_count", "sensor")
      ? reading("filter_max_count", t("control.filter_allowance"), allowed === null ? null : formatDuration(t, allowed, "hours"))
      : null,
  ]);
}

function onOff(ctx: ApplianceContext, key: string): string | null {
  const value = isOn(ctx, key, "binary_sensor");
  return value === null ? null : ctx.t(value ? "value.on" : "value.off");
}

function settingsSection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  return section(
    "settings",
    t("section.settings"),
    [
      selectControl(ctx, "door_ajar_timeout", t("control.door_open_delay")),
      has(ctx, "winterize_on", "binary_sensor") ? reading("winterize_on", t("control.winterized"), onOff(ctx, "winterize_on")) : null,
      has(ctx, "failsafe_on", "binary_sensor")
        ? reading("failsafe_on", t("control.failsafe"), onOff(ctx, "failsafe_on"), {
            tone: isOn(ctx, "failsafe_on", "binary_sensor") ? "alert" : "normal",
          })
        : null,
      has(ctx, "sabbath_on", "binary_sensor") ? reading("sabbath_on", t("control.sabbath"), onOff(ctx, "sabbath_on")) : null,
    ],
    true,
  );
}

export const iceMaker: FamilyModel = {
  drawingState(ctx): DrawingState {
    const on = producing(ctx) === true;
    const winterized = isOn(ctx, "winterize_on", "binary_sensor") === true;
    const failed = isOn(ctx, "failsafe_on", "binary_sensor") === true;
    const busy = cleaning(ctx);
    return {
      available: ctx.appliance.available,
      doors: doors(ctx, DOORS),
      readouts: {},
      sabbath: isOn(ctx, "sabbath_on", "binary_sensor") === true,
      ice_maker: { making: on && !paused(ctx) && !winterized && !failed && !busy, paused: paused(ctx), cleaning: busy },
    };
  },

  status(ctx): StatusPill {
    const t = ctx.t;
    if (!ctx.appliance.available) return { text: t("pill.offline"), tone: "gray" };
    if (isOn(ctx, "ice_door_ajar", "binary_sensor")) return { text: t("pill.door_open"), tone: "amber" };
    if (needsService(ctx) || isOn(ctx, "failsafe_on", "binary_sensor")) return { text: t("pill.service"), tone: "red" };
    if (cleaning(ctx)) return { text: t("pill.cleaning"), tone: "accent" };
    if (isOn(ctx, "clean_now_on", "binary_sensor")) return { text: t("pill.cleaning_due"), tone: "amber" };
    if (isOn(ctx, "sabbath_on", "binary_sensor")) return { text: t("pill.sabbath"), tone: "gray" };
    if (paused(ctx)) return { text: t("pill.paused"), tone: "neutral" };
    if (producing(ctx) !== true || isOn(ctx, "winterize_on", "binary_sensor")) return { text: t("pill.off"), tone: "neutral" };
    return { text: t("pill.making_ice"), tone: "accent" };
  },

  infoRows(ctx): InfoRow[] {
    const t = ctx.t;
    const rows: InfoRow[] = [];
    const shown = status(ctx);
    if (shown !== null) rows.push({ label: t("info.status"), value: shown });
    const end = paused(ctx) ? parseTime(read(ctx, "delay_end_time", "sensor")) : null;
    const planned = schedule(ctx);
    if (end !== null) rows.push({ label: t("info.delay"), value: t("value.until", { time: formatClock(ctx.hass, end) }) });
    else if (planned) rows.push({ label: t("info.delay"), value: planned });
    const stage = read(ctx, "ice_maker_clean_stage", "sensor");
    const next = parseTime(read(ctx, "next_clean_time", "sensor"));
    const cycles = numberOf(ctx, "next_clean_cycles", "sensor");
    if (cleaning(ctx) && stage !== null) rows.push({ label: t("info.cleaning"), value: optionLabel(t, stage) });
    else if (next !== null) rows.push({ label: t("info.next_cleaning"), value: formatDateTime(ctx.hass, next, ctx.now) });
    else if (cycles !== null) rows.push({ label: t("info.next_cleaning"), value: t("value.in_cycles", { n: Math.round(cycles) }) });
    return rows.slice(0, 3);
  },

  display: () => null,

  sections(ctx): Section[] {
    return compact([iceSection(ctx), delaySection(ctx), cleaningSection(ctx), filterSection(ctx), settingsSection(ctx), detailsSection(ctx)]);
  },
};

