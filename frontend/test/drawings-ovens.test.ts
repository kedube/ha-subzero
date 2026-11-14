// What the three oven drawings (range, wall oven, generic oven) share: one reading of a cavity's
// state for its heat, its readout and its words, and the wall oven's width and knobs. Without a
// DOM: the drawings' markup is written out by drawing-markup.ts.
import { describe, expect, it } from "vitest";
import { renderDrawing } from "../src/drawings/index";
import { isSelfCleaning, ovenHeat, ovenReadout, ovenWords, type HeatScale } from "../src/drawings/oven-state";
import type { DrawingInput, DrawingState, OvenState } from "../src/drawings/types";
import { hasKnobs, ovenWidth } from "../src/drawings/wall-oven/layout";
import { makeTranslate } from "../src/i18n";
import type { Appearance, ApplianceSpec, GenericSpec, RangeSpec, WallOvenSpec } from "../src/types";
import { problems, serialize } from "./drawing-markup";

const t = makeTranslate("en");
const APPEARANCE: Appearance = { finish: "stainless", panel_color: null, knobs: "red", handle: "tubular", style: null, form: null };
const OFF: OvenState = {
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
};
const HEATING: OvenState = { ...OFF, on: true, progress: 0.5, temp: "350°", mode: "Bake" };
const CLEANING: OvenState = { ...OFF, on: true, self_clean: true, temp: "880°", mode: "Self clean" };

const RANGE: RangeSpec = {
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
};
const wallOven = (over: Partial<WallOvenSpec> = {}): WallOvenSpec => ({
  family: "wall_oven",
  form: "single",
  width: 30,
  series: "m",
  style: "professional",
  ovens: [{ prefix: "cav", position: "single", width: 30 }],
  knob: true,
  generic: false,
  ...over,
});
const DOUBLE = wallOven({
  form: "double",
  ovens: [
    { prefix: "cav", position: "upper", width: 30 },
    { prefix: "cav2", position: "lower", width: 30 },
  ],
});
const GENERIC_OVEN: GenericSpec = { family: "generic", form: "oven", width: null, generic: true };

function draw(spec: ApplianceSpec, state: Partial<DrawingState>, over: Partial<DrawingInput> = {}): string {
  return serialize(
    renderDrawing({
      uid: "szc1",
      spec,
      appearance: APPEARANCE,
      state: { available: true, doors: {}, readouts: {}, ...state },
      theme: "light",
      t,
      ...over,
    }),
  );
}
const spokenBy = (markup: string) => /aria-label="([^"]*)"/.exec(markup)?.[1];
const viewBox = (markup: string) => (/viewBox="([^"]*)"/.exec(markup)?.[1] ?? "").split(" ").map(Number);

describe("a cavity's state", () => {
  it("is self-cleaning only while the cavity is on", () => {
    expect(isSelfCleaning(CLEANING)).toBe(true);
    expect(isSelfCleaning({ ...OFF, self_clean: true })).toBe(false);
    expect(isSelfCleaning(HEATING)).toBe(false);
    expect(isSelfCleaning(null)).toBe(false);
    expect(isSelfCleaning(undefined)).toBe(false);
  });

  it("glows on each drawing's own scale", () => {
    const scale: HeatScale = { clean: 1, preheated: 0.7, start: 0.2, span: 0.4, unknown: 0.5 };
    expect(ovenHeat(OFF, scale)).toBe(0);
    expect(ovenHeat(null, scale)).toBe(0);
    expect(ovenHeat({ ...OFF, self_clean: true, preheated: true, progress: 1 }, scale)).toBe(0);
    expect(ovenHeat({ ...HEATING, progress: 0 }, scale)).toBeCloseTo(0.2);
    expect(ovenHeat({ ...HEATING, progress: 0.5 }, scale)).toBeCloseTo(0.4);
    expect(ovenHeat({ ...HEATING, progress: 7 }, scale)).toBeCloseTo(0.6);
    expect(ovenHeat({ ...HEATING, progress: -1 }, scale)).toBeCloseTo(0.2);
    expect(ovenHeat({ ...HEATING, progress: null }, scale)).toBe(0.5);
    expect(ovenHeat({ ...HEATING, preheated: true }, scale)).toBe(0.7);
    expect(ovenHeat(CLEANING, scale)).toBe(1);
    // A drawing without a self-clean look glows as it does while cooking.
    expect(ovenHeat({ ...CLEANING, preheated: true }, { ...scale, clean: undefined })).toBe(0.7);
  });

  it("reads out the temperature, a ring while preheating, the lock while cleaning, and chips", () => {
    expect(ovenReadout(null)).toBeNull();
    expect(ovenReadout(OFF)).toBeNull();
    expect(ovenReadout(HEATING)).toEqual({ label: { text: "350°", progress: 0.5, icon: null }, chips: [] });
    expect(ovenReadout({ ...HEATING, preheated: true, progress: 1 })?.label).toEqual({ text: "350°", progress: null, icon: null });
    expect(ovenReadout({ ...HEATING, progress: 3 })?.label?.progress).toBe(1);
    expect(ovenReadout({ ...CLEANING, probe: true })).toEqual({ label: { text: "880°", progress: null, icon: "lock" }, chips: ["probe"] });
    // Off, self-clean shows nothing; the probe and Remote Ready still do.
    expect(ovenReadout({ ...OFF, self_clean: true, temp: "880°" })).toBeNull();
    expect(ovenReadout({ ...OFF, self_clean: true, remote_ready: true })).toEqual({ label: null, chips: ["remote"] });
  });

  it("is said the same way for every oven", () => {
    const words = (state: OvenState, display: string | null = null) => ovenWords(t, [{ position: "single", state }], display);
    expect(words(OFF)).toEqual(["off"]);
    expect(words(HEATING)).toEqual(["heating 350°"]);
    expect(words({ ...HEATING, preheated: true, light: true, probe: true, remote_ready: true }, "4:12")).toEqual([
      "preheated 350°",
      "light on",
      "probe in",
      "Remote Ready",
      "timer 4:12",
    ]);
    expect(words({ ...CLEANING, light: true })).toEqual(["self-cleaning"]);
    expect(words({ ...OFF, self_clean: true })).toEqual(["off"]);
    expect(words({ ...OFF, door_open: true, light: true })).toEqual(["door open"]);
    expect(
      ovenWords(
        t,
        [
          { position: "upper", state: HEATING },
          { position: "lower", state: undefined },
        ],
        null,
      ),
    ).toEqual(["upper oven: heating 350°"]);
  });
});

describe("an oven that's off but still reports Self clean", () => {
  const stale = { ...OFF, self_clean: true, temp: "880°", mode: "Self clean" };
  const off = { ...OFF, temp: "880°", mode: "Self clean" };

  it.each([
    ["range", RANGE],
    ["wall oven", DOUBLE],
    ["generic oven", GENERIC_OVEN],
  ] as const)("draws as off on the %s", (_name, spec) => {
    for (const other of [OFF, HEATING]) {
      const drawn = draw(spec, { ovens: { cav: stale, cav2: other }, display: "4:12" });
      expect(drawn).toBe(draw(spec, { ovens: { cav: off, cav2: other }, display: "4:12" }));
      expect(spokenBy(drawn)).not.toContain("self-cleaning");
    }
  });

  it("differs from one that's cleaning", () => {
    for (const spec of [RANGE, DOUBLE]) {
      expect(draw(spec, { ovens: { cav: CLEANING } })).not.toBe(draw(spec, { ovens: { cav: { ...CLEANING, self_clean: false } } }));
      expect(spokenBy(draw(spec, { ovens: { cav: CLEANING } }))).toContain("self-cleaning");
    }
  });
});

describe("oven drawings' words", () => {
  const busy: DrawingState["ovens"] = {
    cav: { ...HEATING, probe: true, remote_ready: true },
    cav2: { ...HEATING, preheated: true, progress: 1, temp: "325°", light: true },
  };

  it("are the range's on the wall oven and the generic oven", () => {
    expect(spokenBy(draw(RANGE, { ovens: busy, display: "4:12" }))).toBe(
      "Range, left oven: preheated 325°, left oven: light on, right oven: heating 350°, right oven: probe in, right oven: Remote Ready, timer 4:12",
    );
    expect(spokenBy(draw(DOUBLE, { ovens: busy, display: "4:12" }))).toBe(
      "Double wall oven, upper oven: heating 350°, upper oven: probe in, upper oven: Remote Ready, lower oven: preheated 325°, lower oven: light on, timer 4:12",
    );
    expect(spokenBy(draw(wallOven(), { ovens: { cav: busy.cav }, display: "4:12" }))).toBe(
      "Wall oven, heating 350°, probe in, Remote Ready, timer 4:12",
    );
    expect(spokenBy(draw(GENERIC_OVEN, { ovens: { cav: busy.cav }, display: "4:12" }))).toBe(
      "Wall oven, heating 350°, probe in, Remote Ready, timer 4:12",
    );
    expect(spokenBy(draw(GENERIC_OVEN, { ovens: busy }))).toBe(
      "Double wall oven, upper oven: heating 350°, upper oven: probe in, upper oven: Remote Ready, lower oven: preheated 325°, lower oven: light on",
    );
  });

  it("say off, door open and offline", () => {
    expect(spokenBy(draw(wallOven(), { ovens: { cav: OFF } }))).toBe("Wall oven, off");
    expect(spokenBy(draw(wallOven(), { ovens: { cav: { ...OFF, door_open: true } } }))).toBe("Wall oven, door open");
    expect(spokenBy(draw(wallOven(), { ovens: {} }))).toBe("Wall oven");
    expect(spokenBy(draw(wallOven(), { available: false, ovens: { cav: HEATING } }))).toBe("Wall oven, offline, heating 350°");
    // The generic drawing shows nothing of an offline appliance's state, so it says nothing of it.
    expect(spokenBy(draw(GENERIC_OVEN, { available: false, ovens: { cav: HEATING } }))).toBe("Wall oven, offline");
  });

  it("speak the panel's language", () => {
    const german = serialize(
      renderDrawing({ uid: "szc1", spec: wallOven(), appearance: APPEARANCE, state: { available: true, doors: {}, readouts: {}, ovens: { cav: HEATING } }, theme: "light", t: makeTranslate("de") }),
    );
    expect(spokenBy(german)).toBe("Einbaubackofen, heizt 350°");
  });
});

describe("a wall oven's width", () => {
  it("follows the spec: 24″, 30″ and 36″, and 30″ when it isn't known", () => {
    expect(ovenWidth(30)).toBe(298.75);
    expect(ovenWidth(null)).toBe(298.75);
    expect(ovenWidth(24)).toBeCloseTo(239);
    expect(ovenWidth(36)).toBeCloseTo(358.5);
    // Nothing narrower or wider is made; a stray width is kept in range.
    expect(ovenWidth(12)).toBe(ovenWidth(24));
    expect(ovenWidth(60)).toBe(ovenWidth(36));
  });

  it("sets the drawing's width and leaves its height", () => {
    const ovens = { cav: HEATING };
    const [, , w30, h30] = viewBox(draw(wallOven(), { ovens }));
    const [, , w24, h24] = viewBox(draw(wallOven({ width: 24 }), { ovens }));
    const [, , w36, h36] = viewBox(draw(wallOven({ width: 36 }), { ovens }));
    expect([w24, w30, w36]).toEqual([255, 314.75, 374.5]);
    expect([h24, h36]).toEqual([h30, h30]);
    expect(draw(wallOven({ width: null }), { ovens })).toBe(draw(wallOven(), { ovens }));
    // The cavities' widths stand in for a missing overall width.
    const slots = [{ prefix: "cav" as const, position: "single" as const, width: 24 }];
    expect(viewBox(draw(wallOven({ width: null, ovens: slots }), { ovens }))[2]).toBe(255);
  });

  it("keeps every part on the oven, in every style", () => {
    for (const width of [24, 36]) {
      for (const form of ["single", "double"] as const) {
        for (const series of ["e", "m"] as const) {
          for (const style of ["professional", "transitional", "contemporary"] as const) {
            const spec = wallOven({ ...(form === "double" ? DOUBLE : {}), width, series, style, knob: series === "m" });
            const ovens = { cav: HEATING, cav2: { ...HEATING, door_open: true } };
            expect(problems(draw(spec, { ovens }), "szc1"), `${width} ${form} ${series} ${style}`).toEqual([]);
            const right = ovenWidth(width);
            // Knobs (circles) and legends (text) stay within the panel, clear of its ends. Offline, the
            // drawing has no readouts, whose pills have coordinates of their own.
            const markup = draw(spec, { available: false, ovens });
            const places = [...markup.matchAll(/<(?:circle|text)[^>]*?\s(?:cx|x)="(-?[0-9.]+)"/g)].map((match) => Number(match[1]));
            expect(Math.min(...places), `${width} ${form} ${series} ${style}`).toBeGreaterThan(8);
            expect(Math.max(...places), `${width} ${form} ${series} ${style}`).toBeLessThan(right - 8);
          }
        }
      }
    }
  });
});

describe("a wall oven's knobs", () => {
  it("are drawn on a Professional oven that has a knob, is an M, or is of an unknown series", () => {
    const knobs = (spec: Partial<WallOvenSpec>, style: Appearance["style"] = null) => hasKnobs(wallOven(spec), { style });
    expect(knobs({ series: "m", knob: false })).toBe(true);
    expect(knobs({ series: null, knob: false })).toBe(true);
    expect(knobs({ series: "e", knob: true })).toBe(true);
    expect(knobs({ series: "l", knob: true })).toBe(true);
    expect(knobs({ series: "e", knob: false })).toBe(false);
    expect(knobs({ series: "l", knob: false })).toBe(false);
    // The style is the Appearance setting's, else the model's, else Professional.
    expect(knobs({ series: "m", style: "transitional" })).toBe(false);
    expect(knobs({ series: "m", style: "transitional" }, "professional")).toBe(true);
    expect(knobs({ series: "m", style: "professional" }, "contemporary")).toBe(false);
    expect(knobs({ series: "m", style: null })).toBe(true);
  });

  it("show in the drawing exactly then", () => {
    const hasKnobGradient = (spec: WallOvenSpec, appearance: Appearance) =>
      serialize(renderDrawing({ uid: "szc1", spec, appearance, state: { available: true, doors: {}, readouts: {} }, theme: "light", t })).includes('id="szc1-knob"');
    for (const series of ["l", "e", "m", null] as const) {
      for (const style of ["professional", "transitional", "contemporary", null] as const) {
        for (const knob of [false, true]) {
          for (const override of [null, "professional", "transitional"] as const) {
            const spec = wallOven({ series, style, knob });
            const appearance = { ...APPEARANCE, style: override };
            expect(hasKnobGradient(spec, appearance), JSON.stringify({ series, style, knob, override })).toBe(hasKnobs(spec, appearance));
          }
        }
      }
    }
  });
});
