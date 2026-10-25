import { describe, expect, it } from "vitest";
import { cycleProgress } from "../src/families/dishwasher";
import { familyModel } from "../src/families/index";
import type { Control, Section } from "../src/families/types";
import { dishwasher } from "./fixtures/appliances";
import { NOW, context, inMinutes, offline, withLocks, withStates, type Fixture } from "./fixtures/hass";

const model = familyModel(dishwasher().appliance);
const STARTED = NOW - 30 * 60_000;

function sections(fixture: Fixture, options: Parameters<typeof context>[1] = {}): Section[] {
  return model.sections(context(fixture, options));
}

function control(list: Section[], id: string): Control | undefined {
  return list.flatMap((part) => part.controls).find((candidate) => candidate.id === id);
}

/** Running Normal: started 30 minutes ago, ends in an hour. */
function running(): Fixture {
  return withLocks(
    withStates(dishwasher(), {
      wash_status: { sensor: "Running" },
      wash_cycle_on: { binary_sensor: "on" },
      wash_cycle: { sensor: "Normal", select: "unavailable" },
      wash_cycle_end_time: { sensor: inMinutes(60) },
      heated_dry_on: { switch: "unavailable" },
      sani_rinse_on: { switch: "unavailable" },
      mode: { select: "unavailable" },
      delay_start_timer_duration: { select: "unavailable" },
      cancel_wash_cycle: { button: "unknown" },
    }),
    { heated_dry_on: "wash_not_idle", sani_rinse_on: "wash_not_idle", delay_start_timer_duration: "delay_not_idle" },
  );
}

const since = (entityId: string) => (entityId === "binary_sensor.dishwasher_wash_cycle_on" ? STARTED : null);

describe("dishwasher (DW2450), idle", () => {
  it("draws the door, the status and the warnings", () => {
    expect(model.drawingState(context(dishwasher()))).toEqual({
      available: true,
      doors: { door_ajar: false },
      readouts: {},
      sabbath: false,
      dishwasher: {
        status: "idle",
        progress: null,
        remote_ready: false,
        door_open: false,
        rinse_aid_low: false,
        softener_low: false,
        display: null,
      },
    });
  });

  it("shows the chosen cycle and options", () => {
    const ctx = context(dishwasher());
    expect(model.status(ctx)).toEqual({ text: "Idle", tone: "neutral" });
    expect(model.display(ctx)).toEqual({ text: "--:--", caption: "Auto" });
    expect(model.infoRows(ctx)).toEqual([
      { label: "Cycle", value: "Auto" },
      { label: "Options", value: "None" },
    ]);
    const chosen = withStates(dishwasher(), { heated_dry_on: { switch: "on" }, sani_rinse_on: { switch: "on" } });
    expect(model.infoRows(context(chosen))[1]).toEqual({ label: "Options", value: "Extra dry · Sani-rinse" });
  });

  it("offers the cycles in a dropdown's worth of options, and the five options as switches", () => {
    const list = sections(dishwasher());
    expect(list.map((part) => part.id)).toEqual(["cycle", "options", "modes", "maintenance", "details"]);
    const cycle = control(list, "wash_cycle");
    expect(cycle).toMatchObject({ kind: "select", value: "Auto", disabled: false });
    expect(cycle?.kind === "select" && cycle.options.length).toBe(12);
    expect(list.find((part) => part.id === "options")?.controls.map((part) => [part.id, part.label])).toEqual([
      ["heated_dry_on", "Extra dry"],
      ["extended_dry_on", "Extended dry"],
      ["high_temp_wash_on", "High temp wash"],
      ["sani_rinse_on", "Sani-rinse"],
      ["top_rack_only_on", "Top rack only"],
    ]);
    expect(control(list, "mode")).toMatchObject({ kind: "select", value: "Off" });
    expect(control(list, "cancel_wash_cycle")).toBeUndefined();
  });

  it("explains why Start waits, then asks before starting", () => {
    expect(control(sections(dishwasher()), "remote_start_wash_cycle_on")).toMatchObject({
      disabled: true,
      reason: "Turn on Remote Ready at the dishwasher first.",
    });
    const ready = withStates(dishwasher(), { remote_ready: { binary_sensor: "on" }, remote_start_wash_cycle_on: { button: "unknown" } });
    expect(control(sections(ready), "remote_start_wash_cycle_on")).toMatchObject({
      kind: "action",
      disabled: false,
      confirm: "Start Auto on the dishwasher?",
      button: "Start",
      tone: "primary",
    });
    expect(model.status(context(ready))).toEqual({ text: "Remote Ready", tone: "accent" });
    expect(control(sections(ready, { language: "fr" }), "remote_start_wash_cycle_on")).toMatchObject({
      confirm: "Démarrer Automatique sur le lave-vaisselle ?",
    });
  });

  it("shows the door, child lock and Sabbath in the pill", () => {
    expect(model.status(context(withStates(dishwasher(), { door_ajar: { binary_sensor: "on" } })))).toEqual({ text: "Door open", tone: "amber" });
    expect(model.status(context(withStates(dishwasher(), { mode: { select: "Child lock" } })))).toEqual({ text: "Child lock", tone: "neutral" });
    expect(model.status(context(withStates(dishwasher(), { sabbath_on: { binary_sensor: "on" }, mode: { select: "Sabbath" } })))).toEqual({
      text: "Sabbath",
      tone: "gray",
    });
  });
});

describe("dishwasher, running", () => {
  it("runs the progress ring from the cycle's start to its end", () => {
    const ctx = context(running(), { since });
    expect(cycleProgress(ctx)).toBeCloseTo(30 / 90, 5);
    expect(model.drawingState(ctx).dishwasher).toMatchObject({ status: "running", display: "1:00:00" });
    expect(cycleProgress(context(running()))).toBeNull();
  });

  it("shows the time left and when it ends", () => {
    const ctx = context(running(), { since });
    expect(model.status(ctx)).toEqual({ text: "Running", tone: "accent" });
    expect(model.display(ctx)).toEqual({ text: "1:00:00", caption: "Normal" });
    // Two option switches are locked and so unavailable: what they're set to is unknown.
    expect(model.infoRows(ctx)).toEqual([
      { label: "Cycle", value: "Normal" },
      { label: "Ends", value: "15:00" },
      { label: "Options", value: "—" },
    ]);
    const chosen = withStates(running(), { high_temp_wash_on: { switch: "on" } });
    expect(model.infoRows(context(chosen, { since }))[2]).toEqual({ label: "Options", value: "High temp wash" });
    // Every option locked and unknown: no row of nothing but a dash.
    const allLocked = withStates(running(), {
      extended_dry_on: { switch: "unavailable" },
      high_temp_wash_on: { switch: "unavailable" },
      top_rack_only_on: { switch: "unavailable" },
    });
    expect(model.infoRows(context(allLocked, { since })).map((row) => row.label)).toEqual(["Cycle", "Ends"]);
  });

  it("shows the hours with the minutes, so 43 minutes never reads as 43 seconds", () => {
    const later = context(running(), { since, now: NOW + 17 * 60_000 + 43_000 });
    expect(model.display(later)).toEqual({ text: "0:42:17", caption: "Normal" });
  });

  it("locks the options with their reasons and offers Cancel with a question", () => {
    const list = sections(running(), { since });
    expect(control(list, "heated_dry_on")).toMatchObject({
      disabled: true,
      reason: "Wash options can change only while the dishwasher is idle.",
    });
    expect(control(list, "delay_start_timer_duration")).toMatchObject({
      disabled: true,
      reason: "Delay start can change only while the dishwasher is idle or delayed.",
    });
    // The locked select still shows the cycle, from the sensor.
    expect(control(list, "wash_cycle")).toMatchObject({ disabled: true, reason: "Can change only while the dishwasher is idle.", value: "Normal" });
    expect(control(list, "remote_start_wash_cycle_on")).toBeUndefined();
    expect(control(list, "cancel_wash_cycle")).toMatchObject({
      kind: "action",
      confirm: "Cancel the wash cycle?",
      button: "Cancel cycle",
      tone: "danger",
      disabled: false,
    });
    // In hours and seconds like the display, ticking with the view's clock.
    expect(control(list, "wash_cycle_end_time")).toMatchObject({ kind: "reading", value: "1:00:00", hint: "Ends at 15:00" });
    const later = model.sections(context(running(), { since, now: NOW + 10 * 60_000 + 27_000 }));
    expect(control(later, "wash_cycle_end_time")).toMatchObject({ value: "0:49:33" });
  });

  it("dries, then finishes", () => {
    const drying = withStates(running(), { wash_status: { sensor: "Drying" } });
    expect(model.status(context(drying))).toEqual({ text: "Drying", tone: "accent" });
    expect(model.display(context(drying))).toEqual({ text: "1:00:00", caption: "Normal · Drying" });
    const done = withStates(dishwasher(), { wash_status: { sensor: "Done" }, wash_cycle: { sensor: "Normal" } });
    expect(model.status(context(done))).toEqual({ text: "Done", tone: "green" });
    expect(cycleProgress(context(done))).toBe(1);
    expect(model.display(context(done))).toEqual({ text: "0:00:00", caption: "Done" });
  });
});

describe("dishwasher, delayed start", () => {
  const delayed = withStates(dishwasher(), {
    wash_status: { sensor: "Delayed" },
    delay_start_timer_active: { binary_sensor: "on" },
    delay_start_timer_end_time: { sensor: inMinutes(125) },
    cancel_wash_cycle: { button: "unknown" },
  });

  it("counts down to the start", () => {
    const ctx = context(delayed);
    expect(model.status(ctx)).toEqual({ text: "Delayed", tone: "neutral" });
    expect(model.display(ctx)).toEqual({ text: "2:05:00", caption: "Starts 16:05" });
    expect(model.drawingState(ctx).dishwasher).toMatchObject({ status: "delayed", display: "2:05:00", progress: null });
    expect(model.infoRows(ctx)[1]).toEqual({ label: "Starts", value: "16:05" });
    const list = sections(delayed);
    expect(control(list, "delay_start_timer_end_time")).toMatchObject({ kind: "reading", label: "Starts in", value: "2:05:00" });
    expect(control(list, "cancel_wash_cycle")).toMatchObject({ disabled: false });
  });

  it("runs the progress ring from when the delay ran out, if the cycle was on through it", () => {
    const delayEnd = NOW - 20 * 60_000;
    const washing = withStates(running(), { delay_start_timer_end_time: { sensor: new Date(delayEnd).toISOString() } });
    // On since the delay was set, 3 hours ago; washing for 20 minutes of 80.
    const onThroughDelay = (entityId: string) => (entityId === "binary_sensor.dishwasher_wash_cycle_on" ? NOW - 3 * 3600_000 : null);
    expect(cycleProgress(context(washing, { since: onThroughDelay }))).toBeCloseTo(20 / 80, 5);
    // An older delay, from before the cycle turned on, doesn't count.
    const old = withStates(running(), { delay_start_timer_end_time: { sensor: new Date(NOW - 2 * 3600_000).toISOString() } });
    expect(cycleProgress(context(old, { since }))).toBeCloseTo(30 / 90, 5);
  });

  it("treats a counting delay as delayed even when the status still says Idle", () => {
    const quiet = withStates(delayed, { wash_status: { sensor: "Idle" } });
    expect(model.drawingState(context(quiet)).dishwasher?.status).toBe("delayed");
  });
});

describe("dishwasher, problems", () => {
  it("shows errors, warnings and offline", () => {
    expect(model.status(context(withStates(dishwasher(), { wash_status: { sensor: "Error" } })))).toEqual({ text: "Error", tone: "red" });
    const low = withStates(dishwasher(), { rinse_aid_low: { binary_sensor: "on" } });
    expect(model.drawingState(context(low)).dishwasher?.rinse_aid_low).toBe(true);
    expect(control(sections(low), "rinse_aid_low")).toMatchObject({ value: "Low", tone: "warning" });
    expect(control(sections(dishwasher()), "softener_low")).toBeUndefined();
    const gone = offline(dishwasher());
    expect(model.status(context(gone))).toEqual({ text: "Offline", tone: "gray" });
    expect(model.display(context(gone))).toBeNull();
    expect(control(sections(gone), "heated_dry_on")).toMatchObject({ disabled: true, reason: "The appliance is offline." });
  });
});
