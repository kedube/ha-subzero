/** Cove dishwashers: the wash cycle, its options, delay start, mode and remote start. */
import type { DrawingState } from "../drawings/types";
import {
  anyOpen,
  buttonAction,
  buttonReady,
  clamp,
  compact,
  detailsSection,
  doors,
  formatClock,
  formatCountdown,
  has,
  isOn,
  join,
  needsService,
  parseTime,
  read,
  reading,
  section,
  selectControl,
  switchToggle,
} from "./common";
import { optionLabel } from "./options";
import type { ApplianceContext, Control, DisplayText, FamilyModel, InfoRow, Section, StatusPill } from "./types";

export type WashStatus = NonNullable<DrawingState["dishwasher"]>["status"];

// The Wash status sensor's words, as WASH_STATUSES names them.
const STATUSES: Record<string, WashStatus> = {
  Idle: "idle",
  Running: "running",
  Paused: "paused",
  Canceling: "canceling",
  Drying: "drying",
  Done: "done",
  Delayed: "delayed",
  Error: "error",
};
const STATUS_NAMES = Object.fromEntries(Object.entries(STATUSES).map(([name, status]) => [status, name])) as Record<WashStatus, string>;
// A cycle under way, which the progress ring and time left follow.
const UNDER_WAY = new Set<WashStatus>(["running", "paused", "canceling", "drying"]);
// DISHWASHER_SWITCHES in const.py.
export const DISHWASHER_OPTIONS = ["heated_dry_on", "extended_dry_on", "high_temp_wash_on", "sani_rinse_on", "top_rack_only_on"];
const DOORS = ["door_ajar"];

export function washStatus(ctx: ApplianceContext): WashStatus | null {
  const reported = read(ctx, "wash_status", "sensor");
  if (reported !== null && reported in STATUSES) return STATUSES[reported];
  const on = isOn(ctx, "wash_cycle_on", "binary_sensor");
  return on === null ? null : on ? "running" : "idle";
}

function delayed(ctx: ApplianceContext, status: WashStatus | null): boolean {
  return status === "delayed" || isOn(ctx, "delay_start_timer_active", "binary_sensor") === true;
}

function cycleName(ctx: ApplianceContext): string | null {
  const cycle = read(ctx, "wash_cycle", "sensor", "select");
  return cycle === null ? null : optionLabel(ctx.t, cycle);
}

/**
 * Cycle progress from 0 to 1: from when the Wash cycle active sensor last turned on, which
 * history knows, to the reported end time. Null when either is unknown; 1 when done.
 */
export function cycleProgress(ctx: ApplianceContext): number | null {
  const status = washStatus(ctx);
  if (status === "done") return 1;
  if (status === null || !UNDER_WAY.has(status)) return null;
  const sensorId = ctx.entityId("wash_cycle_on", "binary_sensor");
  if (!sensorId) return null;
  const turnedOn = ctx.since(sensorId);
  const end = parseTime(read(ctx, "wash_cycle_end_time", "sensor"));
  if (turnedOn === null || end === null) return null;
  // After a delayed start the sensor may have been on through the delay, so washing began when
  // the delay ran out; an older delay's end, from before the sensor turned on, doesn't count.
  const delayEnd = parseTime(read(ctx, "delay_start_timer_end_time", "sensor"));
  const start = delayEnd !== null && delayEnd > turnedOn && delayEnd <= ctx.now ? delayEnd : turnedOn;
  if (end <= start) return null;
  return clamp((ctx.now - start) / (end - start), 0, 1);
}

/**
 * Time left in the cycle, or until a delayed start, as the display shows it: "0:42:17", with the
 * hours always there, as on the GE card. A bare "0:43" beside an oven timer's minutes and seconds
 * would read as 43 seconds.
 */
function timeLeft(ctx: ApplianceContext, status: WashStatus | null): string | null {
  if (delayed(ctx, status)) {
    const start = parseTime(read(ctx, "delay_start_timer_end_time", "sensor"));
    return start === null ? null : formatCountdown(start - ctx.now, true);
  }
  if (status === null || !UNDER_WAY.has(status)) return null;
  const end = parseTime(read(ctx, "wash_cycle_end_time", "sensor"));
  return end === null ? null : formatCountdown(end - ctx.now, true);
}

function cycleSection(ctx: ApplianceContext, status: WashStatus | null): Section | null {
  const t = ctx.t;
  const busy = status !== null && status !== "idle" ? t("reason.dishwasher_busy") : null;
  const waiting = delayed(ctx, status);
  const underWay = status !== null && UNDER_WAY.has(status);
  const end = underWay ? read(ctx, "wash_cycle_end_time", "sensor") : null;
  const endsAt = parseTime(end);
  const startsAt = waiting ? read(ctx, "delay_start_timer_end_time", "sensor") : null;
  const remoteReady = isOn(ctx, "remote_ready", "binary_sensor");
  const startKey = "remote_start_wash_cycle_on";
  // Ticking with the view's clock, and in hours like the display, so the two read the same.
  const left = (at: number | null) => (at === null ? null : formatCountdown(at - ctx.now, true));
  const controls: Array<Control | null> = [
    has(ctx, "wash_status", "sensor")
      ? reading("wash_status", t("control.status"), status === null ? null : optionLabel(t, STATUS_NAMES[status]), {
          tone: status === "error" ? "alert" : "normal",
        })
      : null,
    end
      ? reading("wash_cycle_end_time", t("control.time_left"), left(endsAt), {
          hint: endsAt === null ? null : t("value.ends_at", { time: formatClock(ctx.hass, endsAt) }),
        })
      : null,
    startsAt ? reading("delay_start_timer_end_time", t("control.starts_in"), left(parseTime(startsAt))) : null,
    selectControl(ctx, "wash_cycle", t("control.wash_cycle"), { reasons: [busy], fallback: read(ctx, "wash_cycle", "sensor") }),
    selectControl(ctx, "delay_start_timer_duration", t("control.delay_start")),
  ];
  if (!underWay && !waiting && has(ctx, startKey, "button")) {
    controls.push(
      buttonAction(ctx, startKey, t("control.remote_start"), t("action.start"), {
        confirm: t("confirm.start_dishwasher", { cycle: cycleName(ctx) ?? "—" }),
        tone: "primary",
        locks: [startKey, "wash_cycle_on"],
        // What the integration checks before a remote start.
        reasons: buttonReady(ctx, startKey)
          ? []
          : [
              remoteReady !== true ? t("reason.remote_ready_dishwasher") : null,
              isOn(ctx, "door_ajar", "binary_sensor") ? t("reason.close_door") : null,
              isOn(ctx, "sabbath_on", "binary_sensor") ? t("lock.sabbath") : null,
            ],
      }),
    );
  }
  if (underWay || waiting) {
    controls.push(
      buttonAction(ctx, "cancel_wash_cycle", t("control.cancel_cycle"), t("action.cancel_cycle"), {
        confirm: t("confirm.cancel_cycle"),
        tone: "danger",
        locks: ["cancel_wash_cycle", "wash_cycle_on"],
      }),
    );
  }
  if (has(ctx, "remote_ready", "binary_sensor")) {
    controls.push(reading("remote_ready", t("control.remote_ready"), remoteReady === null ? null : t(remoteReady ? "value.on" : "value.off")));
  }
  return section("cycle", t("section.cycle"), controls);
}

function optionsSection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  return section(
    "options",
    t("section.options"),
    DISHWASHER_OPTIONS.map((key) => switchToggle(ctx, key, t(`control.${key}`))),
  );
}

function modeSection(ctx: ApplianceContext, status: WashStatus | null): Section | null {
  const t = ctx.t;
  const busy = status !== null && status !== "idle" ? t("reason.dishwasher_busy") : null;
  return section("modes", t("section.modes"), [selectControl(ctx, "mode", t("control.dishwasher_mode"), { reasons: [busy] })]);
}

function lowReading(ctx: ApplianceContext, key: string, label: string): Control | null {
  if (!has(ctx, key, "binary_sensor")) return null;
  const low = isOn(ctx, key, "binary_sensor");
  return reading(key, label, low === null ? null : ctx.t(low ? "value.low" : "value.ok"), { tone: low ? "warning" : "normal" });
}

function maintenanceSection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  return section("maintenance", t("section.maintenance"), [
    lowReading(ctx, "rinse_aid_low", t("control.rinse_aid")),
    lowReading(ctx, "softener_low", t("control.softener")),
  ]);
}

export const dishwasher: FamilyModel = {
  drawingState(ctx): DrawingState {
    const status = washStatus(ctx);
    return {
      available: ctx.appliance.available,
      doors: doors(ctx, DOORS),
      readouts: {},
      sabbath: isOn(ctx, "sabbath_on", "binary_sensor") === true,
      dishwasher: {
        status: status === "idle" && delayed(ctx, status) ? "delayed" : (status ?? "idle"),
        progress: cycleProgress(ctx),
        remote_ready: isOn(ctx, "remote_ready", "binary_sensor") === true,
        door_open: isOn(ctx, "door_ajar", "binary_sensor") === true,
        rinse_aid_low: isOn(ctx, "rinse_aid_low", "binary_sensor") === true,
        softener_low: isOn(ctx, "softener_low", "binary_sensor") === true,
        display: timeLeft(ctx, status),
      },
    };
  },

  status(ctx): StatusPill {
    const t = ctx.t;
    if (!ctx.appliance.available) return { text: t("pill.offline"), tone: "gray" };
    const status = washStatus(ctx);
    const word = (name: WashStatus) => optionLabel(t, STATUS_NAMES[name]);
    if (status === "error") return { text: word("error"), tone: "red" };
    if (status === "running" || status === "drying" || status === "canceling") return { text: word(status), tone: "accent" };
    if (status === "paused") return { text: word("paused"), tone: "neutral" };
    if (delayed(ctx, status)) return { text: word("delayed"), tone: "neutral" };
    if (status === "done") return { text: word("done"), tone: "green" };
    if (anyOpen(ctx, DOORS)) return { text: t("pill.door_open"), tone: "amber" };
    if (needsService(ctx)) return { text: t("pill.service"), tone: "red" };
    if (isOn(ctx, "sabbath_on", "binary_sensor")) return { text: t("pill.sabbath"), tone: "gray" };
    if (read(ctx, "mode", "select") === "Child lock") return { text: optionLabel(t, "Child lock"), tone: "neutral" };
    if (isOn(ctx, "remote_ready", "binary_sensor")) return { text: t("pill.remote_ready"), tone: "accent" };
    return { text: word("idle"), tone: "neutral" };
  },

  infoRows(ctx): InfoRow[] {
    const t = ctx.t;
    const status = washStatus(ctx);
    const rows: InfoRow[] = [{ label: t("info.cycle"), value: cycleName(ctx) ?? "—" }];
    const end = status !== null && UNDER_WAY.has(status) ? parseTime(read(ctx, "wash_cycle_end_time", "sensor")) : null;
    const start = delayed(ctx, status) ? parseTime(read(ctx, "delay_start_timer_end_time", "sensor")) : null;
    if (end !== null) rows.push({ label: t("info.ends"), value: formatClock(ctx.hass, end) });
    else if (start !== null) rows.push({ label: t("info.starts"), value: formatClock(ctx.hass, start) });
    const offered = DISHWASHER_OPTIONS.filter((key) => has(ctx, key, "switch"));
    // The option switches are locked, and so unavailable, while a cycle runs: those without a
    // state are unknown, and "None" is only said when every one is known to be off. A row of
    // nothing but unknowns is left out.
    const states = offered.map((key) => ({ key, on: isOn(ctx, key, "switch") }));
    if (states.some(({ on }) => on !== null)) {
      const chosen = join(states.filter(({ on }) => on === true).map(({ key }) => t(`control.${key}`)));
      const unknown = states.some(({ on }) => on === null);
      rows.push({ label: t("info.options"), value: chosen ?? (unknown ? "—" : t("value.none")) });
    }
    return rows.slice(0, 3);
  },

  display(ctx): DisplayText | null {
    if (!ctx.appliance.available) return null;
    const t = ctx.t;
    const status = washStatus(ctx);
    const cycle = cycleName(ctx);
    if (delayed(ctx, status)) {
      const start = parseTime(read(ctx, "delay_start_timer_end_time", "sensor"));
      return {
        text: timeLeft(ctx, status) ?? "--:--",
        caption: start === null ? optionLabel(t, "Delayed") : t("display.starts_at", { time: formatClock(ctx.hass, start) }),
      };
    }
    if (status !== null && UNDER_WAY.has(status)) {
      return { text: timeLeft(ctx, status) ?? "--:--", caption: join([cycle, status === "running" ? null : optionLabel(t, STATUS_NAMES[status])]) };
    }
    if (status === "done") return { text: "0:00:00", caption: optionLabel(t, "Done") };
    if (status === "error") return { text: "--:--", caption: optionLabel(t, "Error") };
    return { text: "--:--", caption: cycle };
  },

  sections(ctx): Section[] {
    const status = washStatus(ctx);
    return compact([cycleSection(ctx, status), optionsSection(ctx), modeSection(ctx, status), maintenanceSection(ctx), detailsSection(ctx)]);
  },
};
