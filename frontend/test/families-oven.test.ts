import { describe, expect, it } from "vitest";
import { familyModel } from "../src/families/index";
import { preheatProgress } from "../src/families/oven";
import type { Control, Section } from "../src/families/types";
import { range, wallOven } from "./fixtures/appliances";
import { context, inMinutes, offline, withLocks, withStates, type EntityTable, type Fixture } from "./fixtures/hass";

const model = familyModel(range().appliance);

function sections(fixture: Fixture, options: Parameters<typeof context>[1] = {}): Section[] {
  return familyModel(fixture.appliance).sections(context(fixture, options));
}

function section(list: Section[], id: string): Section {
  const found = list.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`no section ${id} in ${list.map((candidate) => candidate.id).join(", ")}`);
  return found;
}

function control(list: Section[], sectionId: string, id: string): Control {
  const found = section(list, sectionId).controls.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`no control ${id} in ${sectionId}`);
  return found;
}

/** The right oven (cav) baking at 350°: on, preheating from 75°, now at 210°. */
function baking(prefix: "cav" | "cav2" = "cav", extra: EntityTable = {}): Fixture {
  return withStates(range(), {
    [`${prefix}_unit_on`]: { binary_sensor: "on" },
    [`${prefix}_cook_mode`]: { select: "Bake", sensor: "Bake" },
    [`${prefix}_set_temp`]: { climate: ["heat", { temperature: 350, min_temp: 200, max_temp: 550, supported_features: 385 }], sensor: "350" },
    [`${prefix}_temp`]: { sensor: "210" },
    ...extra,
  });
}

const fromSeventyFive = { preheatStart: () => 75 };

describe("range (DF48850SP), off", () => {
  it("reads Off, not the stale temperature", () => {
    const state = model.drawingState(context(range()));
    expect(state.ovens?.cav).toEqual({
      on: false,
      preheated: false,
      progress: null,
      light: false,
      door_open: false,
      probe: false,
      remote_ready: false,
      self_clean: false,
      temp: null,
      mode: null,
    });
    expect(state.display).toBeNull();
    expect(state.doors).toEqual({ cav2_door_ajar: false, cav_door_ajar: false });
    expect(model.display(context(range()))).toEqual({ text: "Off", caption: null });
    expect(model.status(context(range()))).toEqual({ text: "Off", tone: "neutral" });
  });

  it("names the cavities as the app does, in the drawing's order", () => {
    expect(model.infoRows(context(range()))).toEqual([
      { label: "Left oven", value: "Off" },
      { label: "Right oven", value: "Off" },
    ]);
    expect(sections(range()).map((part) => part.id)).toEqual(["cav2", "cav", "kitchen_timer", "kitchen_timer2", "settings", "details"]);
    expect(section(sections(range()), "cav").title).toBe("Right oven");
  });

  it("starts an oven that's off closed when there are two, so the one that's on shows first", () => {
    const list = sections(baking());
    expect(section(list, "cav2").collapsed).toBe(true);
    expect(section(list, "cav").collapsed).toBeUndefined();
    // Waiting in Remote Ready, it's about to be used, so it stays open.
    const ready = sections(withStates(range(), { cav2_remote_ready: { binary_sensor: "on" } }));
    expect(section(ready, "cav2").collapsed).toBeUndefined();
    // A wall oven's only oven is always open.
    const single = wallOven();
    const spec = single.appliance.spec;
    if (spec.family !== "wall_oven") throw new Error("not a wall oven");
    const one = { ...single, appliance: { ...single.appliance, spec: { ...spec, form: "single" as const, ovens: [spec.ovens[0]] } } };
    expect(section(sections(one), "cav").collapsed).toBeUndefined();
  });

  it("explains why the cavity's controls wait", () => {
    const list = sections(range());
    expect(control(list, "cav", "cav_power")).toMatchObject({
      kind: "toggle",
      value: false,
      disabled: true,
      reason: "Turn on Remote Ready at the oven to start it from here.",
      action: { type: "climate_power", entity_id: "climate.range_cav_set_temp" },
    });
    expect(control(list, "cav", "cav_set_temp")).toMatchObject({
      kind: "setpoint",
      value: null,
      min: 85,
      max: 550,
      step: 5,
      disabled: true,
      reason: "Available while the oven is on or in Remote Ready.",
    });
    expect(control(list, "cav", "cav_cook_mode")).toMatchObject({ disabled: true, reason: "Available while the oven is on or in Remote Ready." });
    // No Start outside Remote Ready, and no probe target without a probe.
    expect(section(list, "cav").controls.map((part) => part.id)).toEqual(["cav_power", "cav_set_temp", "cav_cook_mode", "cav_light_on", "cav_probe"]);
    expect(control(list, "cav", "cav_probe")).toMatchObject({ value: "Not connected" });
  });
});

describe("range, cooking", () => {
  it("preheats from where the oven started", () => {
    const ctx = context(baking(), fromSeventyFive);
    const cav = model.drawingState(ctx).ovens?.cav;
    expect(cav).toMatchObject({ on: true, temp: "210°", mode: "Bake", preheated: false });
    expect(cav?.progress).toBeCloseTo((210 - 75) / (350 - 75), 5);
    expect(model.status(ctx)).toEqual({ text: "Preheating 49%", tone: "warm" });
    expect(model.display(ctx)).toEqual({ text: "210°", caption: "Right oven · Bake" });
    expect(model.infoRows(ctx)).toEqual([
      { label: "Left oven", value: "Off" },
      { label: "Right oven", value: "Bake 350°" },
    ]);
  });

  it("starts from room temperature without a start point, in the user's unit", () => {
    expect(model.status(context(baking()))).toEqual({ text: `Preheating ${Math.round(((210 - 70) / (350 - 70)) * 100)}%`, tone: "warm" });
    const celsius = withStates(baking(), {
      cav_set_temp: { climate: ["heat", { temperature: 177 }], sensor: "177" },
      cav_temp: { sensor: "99" },
    });
    expect(model.drawingState(context(celsius, { unit: "°C" })).ovens?.cav?.progress).toBeCloseTo((99 - 21) / (177 - 21), 5);
  });

  it("is preheated once the oven says so", () => {
    const hot = baking("cav", { cav_at_set_temp: { binary_sensor: "on" }, cav_temp: { sensor: "351" } });
    const ctx = context(hot, fromSeventyFive);
    expect(model.drawingState(ctx).ovens?.cav).toMatchObject({ preheated: true, progress: 1 });
    expect(model.status(ctx)).toEqual({ text: "Preheated", tone: "green" });
  });

  it("shows both cavities when both run", () => {
    const both = withStates(baking("cav"), {
      cav2_unit_on: { binary_sensor: "on" },
      cav2_cook_mode: { select: "Roast", sensor: "Roast" },
      cav2_set_temp: { climate: ["heat", { temperature: 325 }], sensor: "325" },
      cav2_temp: { sensor: "300" },
    });
    expect(model.display(context(both))).toEqual({ text: "300° · 210°", caption: "Roast · Bake" });
  });

  it("lets the switch turn a running oven off, with the temperature now in the hint", () => {
    const list = sections(baking(), fromSeventyFive);
    expect(control(list, "cav", "cav_power")).toMatchObject({ value: true, disabled: false, reason: null });
    expect(control(list, "cav", "cav_set_temp")).toMatchObject({ value: 350, min: 200, max: 550, disabled: false, hint: "Now 210°" });
    const mode = control(list, "cav", "cav_cook_mode");
    expect(mode).toMatchObject({ kind: "select", value: "Bake", disabled: false });
    expect(mode.kind === "select" && mode.options.map((option) => option.value)).toContain("Warm");
  });

  it("shows self clean and its locks", () => {
    const cleaning = withLocks(
      withStates(range(), {
        cav_unit_on: { binary_sensor: "on" },
        cav_cook_mode: { select: "unavailable", sensor: "Self clean" },
        cav_set_temp: { climate: ["heat", { supported_features: 384 }], sensor: "880" },
        cav_temp: { sensor: "700" },
      }),
      { cav_set_temp: "self_clean", cav_cook_mode: "self_clean", cav_light_on: "self_clean", cav2_set_temp: "self_clean" },
    );
    const ctx = context(cleaning);
    expect(model.status(ctx)).toEqual({ text: "Self clean", tone: "warm" });
    expect(model.drawingState(ctx).ovens?.cav?.self_clean).toBe(true);
    const list = sections(cleaning);
    // It can still be turned off; there's no temperature to set in this mode.
    expect(control(list, "cav", "cav_power")).toMatchObject({ disabled: false, value: true });
    expect(section(list, "cav").controls.some((part) => part.id === "cav_set_temp")).toBe(false);
    expect(control(list, "cav", "cav_light_on")).toMatchObject({
      disabled: true,
      reason: "The oven is self-cleaning. It can only be turned off.",
    });
    // The locked mode select still shows the mode, from the sensor.
    expect(control(list, "cav", "cav_cook_mode")).toMatchObject({ disabled: true, value: "Self clean" });
  });

  it("keeps the light off during Proof", () => {
    const proofing = withLocks(baking(), { cav_light_on: "proof_light" });
    expect(control(sections(proofing), "cav", "cav_light_on")).toMatchObject({
      disabled: true,
      reason: "The oven light stays off during Proof.",
    });
  });

  it("shows a locked setpoint from its sensor, and none for an oven that's off", () => {
    // In Sabbath the oven's climate entity and the probe's number are locked, so unavailable.
    const sabbath = withLocks(
      baking("cav", {
        cav_set_temp: { climate: ["unavailable", { temperature: undefined, supported_features: undefined }], sensor: "350" },
        cav_probe_on: { binary_sensor: "on" },
        cav_probe_temp: { sensor: "131" },
        cav_probe_set_temp: { number: "unavailable", sensor: "145" },
      }),
      { cav_set_temp: "sabbath", cav_probe_set_temp: "sabbath" },
    );
    const list = sections(sabbath);
    expect(control(list, "cav", "cav_set_temp")).toMatchObject({ disabled: true, value: 350 });
    expect(control(list, "cav", "cav_probe_set_temp")).toMatchObject({ disabled: true, value: 145 });
    expect(control(sections(range()), "cav", "cav_set_temp")).toMatchObject({ value: null });
  });

  it("follows the knob: no mode change unless the oven allows one", () => {
    const fixed = withStates(baking(), { cav_mode_change_enabled: { binary_sensor: "off" } });
    expect(control(sections(fixed), "cav", "cav_cook_mode")).toMatchObject({
      disabled: true,
      reason: "The oven isn't taking mode changes right now.",
    });
  });

  it("shows the probe and its target while it's in", () => {
    const probing = baking("cav", {
      cav_probe_on: { binary_sensor: "on" },
      cav_probe_temp: { sensor: "131" },
      cav_probe_set_temp: { number: "145", sensor: "145" },
      cav_probe_at_set_temp: { binary_sensor: "off" },
    });
    const list = sections(probing);
    expect(control(list, "cav", "cav_probe")).toMatchObject({ value: "131°", hint: null });
    expect(control(list, "cav", "cav_probe_set_temp")).toMatchObject({ kind: "setpoint", value: 145, min: 120, max: 210, step: 5 });
    expect(model.infoRows(context(probing))[2]).toEqual({ label: "Probe · Right oven", value: "131° → 145°" });
    expect(model.drawingState(context(probing)).ovens?.cav?.probe).toBe(true);
  });
});

describe("range, Remote Ready", () => {
  const ready = (button = "2026-10-24T11:00:00+00:00") =>
    withStates(range(), {
      cav_remote_ready: { binary_sensor: "on" },
      cav_cook_mode: { select: "Bake", sensor: "Bake" },
      cav_set_temp: { climate: ["off", { temperature: 350, min_temp: 200, max_temp: 550, supported_features: 385 }], sensor: "350" },
      remote_start_cav_unit_on: { button },
    });

  it("asks before starting the right oven", () => {
    const list = sections(ready());
    expect(control(list, "cav", "remote_start_cav_unit_on")).toEqual({
      kind: "action",
      id: "remote_start_cav_unit_on",
      label: "Remote start",
      hint: null,
      disabled: false,
      reason: null,
      action: { type: "button", entity_id: "button.range_remote_start_cav_unit_on" },
      confirm: "Start the right oven at Bake 350°?",
      button: "Start",
      tone: "primary",
    });
    // The switch points at Start rather than starting without asking.
    expect(control(list, "cav", "cav_power")).toMatchObject({ disabled: true, reason: "Use Start below to turn it on." });
    expect(control(list, "cav", "cav_set_temp")).toMatchObject({ disabled: false, value: 350 });
    expect(model.status(context(ready()))).toEqual({ text: "Remote Ready", tone: "accent" });
    expect(model.drawingState(context(ready())).ovens?.cav?.remote_ready).toBe(true);
  });

  it("says why Start can't be pressed", () => {
    const open = withStates(ready("unavailable"), { cav_door_ajar: { binary_sensor: "on" } });
    expect(control(sections(open), "cav", "remote_start_cav_unit_on")).toMatchObject({
      disabled: true,
      reason: "Close the oven door first.",
    });
    const broil = withStates(ready("unavailable"), { cav_cook_mode: { select: "Broil", sensor: "Broil" } });
    expect(control(sections(broil), "cav", "remote_start_cav_unit_on")).toMatchObject({ reason: "Start this mode at the oven." });
  });

  it("translates the question", () => {
    expect(control(sections(ready(), { language: "de" }), "cav", "remote_start_cav_unit_on")).toMatchObject({
      confirm: "Rechten Backofen mit Backen 350° starten?",
      button: "Starten",
    });
  });
});

describe("kitchen timers", () => {
  const timing = withStates(range(), {
    kitchen_timer_active: { binary_sensor: "on" },
    kitchen_timer_end_time: { sensor: new Date(Date.parse(inMinutes(4)) + 12_000).toISOString() },
    kitchen_timer_duration: { number: "5" },
  });

  it("counts down in the pill and the display while the ovens are off", () => {
    const ctx = context(timing);
    expect(model.status(ctx)).toEqual({ text: "Timer 4:12", tone: "accent" });
    expect(model.display(ctx)).toEqual({ text: "4:12", caption: "Kitchen timer" });
    expect(model.drawingState(ctx).display).toBe("4:12");
    expect(model.infoRows(ctx)[2]).toEqual({ label: "Kitchen timer", value: "4:12" });
  });

  it("sets the duration in minutes and offers Dismiss when it's done", () => {
    const list = sections(timing);
    expect(section(list, "kitchen_timer").controls.map((part) => part.kind)).toEqual(["countdown", "duration"]);
    expect(control(list, "kitchen_timer", "kitchen_timer_duration")).toEqual({
      kind: "duration",
      id: "kitchen_timer_duration",
      label: "Duration",
      hint: null,
      disabled: false,
      reason: null,
      action: { type: "number", entity_id: "number.range_kitchen_timer_duration" },
      value: 5,
      min: 0,
      max: 719,
      presets: [5, 10, 15, 30, 60],
    });
    const done = withStates(range(), {
      kitchen_timer_complete: { binary_sensor: "on" },
      dismiss_kitchen_timer: { button: "unknown" },
    });
    expect(model.status(context(done))).toEqual({ text: "Timer done", tone: "green" });
    expect(control(sections(done), "kitchen_timer", "dismiss_kitchen_timer")).toMatchObject({
      kind: "action",
      confirm: null,
      button: "Dismiss",
      disabled: false,
    });
  });
});

describe("range, offline", () => {
  it("has no display and disables everything", () => {
    const gone = offline(range());
    expect(model.display(context(gone))).toBeNull();
    expect(model.status(context(gone))).toEqual({ text: "Offline", tone: "gray" });
    expect(control(sections(gone), "cav", "cav_cook_mode")).toMatchObject({ disabled: true, reason: "The appliance is offline." });
  });
});

describe("double wall oven (DO3050TE)", () => {
  const wall = familyModel(wallOven().appliance);

  it("calls the cavities Upper and Lower oven, top to bottom", () => {
    expect(wall.infoRows(context(wallOven()))).toEqual([
      { label: "Upper oven", value: "Off" },
      { label: "Lower oven", value: "Off" },
    ]);
    expect(sections(wallOven()).map((part) => part.id)).toEqual(["cav", "cav2", "kitchen_timer", "settings", "details"]);
  });

  it("asks before starting the lower oven", () => {
    const ready = withStates(wallOven(), {
      cav2_remote_ready: { binary_sensor: "on" },
      cav2_cook_mode: { select: "Convection roast", sensor: "Convection roast" },
      cav2_set_temp: { climate: ["off", { temperature: 375, supported_features: 385 }], sensor: "375" },
      remote_start_cav2_unit_on: { button: "unknown" },
    });
    expect(control(sections(ready), "cav2", "remote_start_cav2_unit_on")).toMatchObject({
      confirm: "Start the lower oven at Convection roast 375°?",
    });
  });

  it("counts the cooking timer down, and says when it's done", () => {
    const timing = withStates(wallOven(), {
      cav_unit_on: { binary_sensor: "on" },
      cav_cook_mode: { select: "Bake", sensor: "Bake" },
      cav_cook_timer_active: { binary_sensor: "on" },
      cav_cook_timer_end_time: { sensor: inMinutes(0.5) },
      cav_cook_timer_within_1min: { binary_sensor: "on" },
    });
    expect(control(sections(timing), "cav", "cav_cook_timer")).toEqual({
      kind: "countdown",
      id: "cav_cook_timer",
      label: "Cooking timer",
      end: inMinutes(0.5),
      hint: "Under a minute",
    });
    const done = withStates(timing, { cav_cook_timer_complete: { binary_sensor: "on" } });
    expect(control(sections(done), "cav", "cav_cook_timer")).toMatchObject({ kind: "reading", value: "Done" });
  });

  it("names a single oven just Oven", () => {
    const single = wallOven();
    single.appliance.spec = { ...single.appliance.spec, form: "single", ovens: [{ prefix: "cav", position: "single", width: 30 }] } as typeof single.appliance.spec;
    expect(familyModel(single.appliance).infoRows(context(single))[0]).toEqual({ label: "Oven", value: "Off" });
  });
});

describe("preheat progress", () => {
  it("runs from the start point to the setpoint, clamped", () => {
    expect(preheatProgress(false, false, 200, 350, 75, 70)).toBeNull();
    expect(preheatProgress(true, true, 100, 350, 75, 70)).toBe(1);
    expect(preheatProgress(true, false, null, 350, 75, 70)).toBeNull();
    expect(preheatProgress(true, false, 200, null, 75, 70)).toBeNull();
    expect(preheatProgress(true, false, 75, 350, 75, 70)).toBe(0);
    expect(preheatProgress(true, false, 212.5, 350, 75, 70)).toBeCloseTo(0.5, 5);
    expect(preheatProgress(true, false, 360, 350, 75, 70)).toBe(1);
    expect(preheatProgress(true, false, 60, 350, 75, 70)).toBe(0);
    expect(preheatProgress(true, false, 210, 350, null, 70)).toBeCloseTo(0.5, 5);
  });

  it("falls back to room temperature when the start point is above the setpoint", () => {
    expect(preheatProgress(true, false, 210, 350, 400, 70)).toBeCloseTo(0.5, 5);
  });
});
