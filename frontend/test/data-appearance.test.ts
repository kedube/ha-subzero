import { describe, expect, it } from "vitest";
import {
  appearanceChanges,
  formChoices,
  isHexColor,
  previewSpec,
  sameAppearance,
} from "../src/data/appearance";
import type { AppearanceOptions, WallOvenSpec } from "../src/types";
import { DEFAULT_APPEARANCE, SPECS, makeAppliance } from "./shell-fixtures";

const FRIDGE_OPTIONS: AppearanceOptions = {
  finish: ["stainless", "panel", "black"],
  panel_colors: ["#f4f2ec"],
  knobs: null,
  handle: ["tubular", "pro", "none"],
  style: null,
  forms: ["side_by_side", "french_door"],
};

describe("appearanceChanges", () => {
  it("sends only the fields that changed", () => {
    const pending = { ...DEFAULT_APPEARANCE, handle: "pro" as const };
    expect(appearanceChanges(DEFAULT_APPEARANCE, pending, FRIDGE_OPTIONS)).toEqual({ handle: "pro" });
    expect(appearanceChanges(DEFAULT_APPEARANCE, { ...DEFAULT_APPEARANCE }, FRIDGE_OPTIONS)).toEqual({});
  });

  it("sends a panel color with a panel-ready finish, and clears it when leaving it", () => {
    const panel = { ...DEFAULT_APPEARANCE, finish: "panel" as const, panel_color: "#f4f2ec" };
    expect(appearanceChanges(DEFAULT_APPEARANCE, panel, FRIDGE_OPTIONS)).toEqual({
      finish: "panel",
      panel_color: "#f4f2ec",
    });
    expect(appearanceChanges(panel, DEFAULT_APPEARANCE, FRIDGE_OPTIONS)).toEqual({
      finish: "stainless",
      panel_color: null,
    });
  });

  it("leaves out fields the appliance doesn't offer", () => {
    const pending = { ...DEFAULT_APPEARANCE, knobs: "black" as const, style: "contemporary" as const };
    expect(appearanceChanges(DEFAULT_APPEARANCE, pending, FRIDGE_OPTIONS)).toEqual({});
  });

  it("sends a cleared form override as null", () => {
    const saved = { ...DEFAULT_APPEARANCE, form: "french_door" };
    expect(appearanceChanges(saved, DEFAULT_APPEARANCE, FRIDGE_OPTIONS)).toEqual({ form: null });
  });
});

describe("previewSpec", () => {
  const fridge = makeAppliance("fridge", SPECS.sideBySide, { appearance_options: FRIDGE_OPTIONS });

  it("keeps the spec when the form doesn't change", () => {
    expect(previewSpec(fridge, DEFAULT_APPEARANCE)).toBe(fridge.spec);
  });

  it("draws a pending form", () => {
    expect(previewSpec(fridge, { ...DEFAULT_APPEARANCE, form: "french_door" })).toEqual({
      ...SPECS.sideBySide,
      form: "french_door",
    });
  });

  it("goes back to the detected form when the override is cleared", () => {
    const overridden = { ...fridge, spec: { ...SPECS.sideBySide, form: "french_door" as const } };
    expect(previewSpec(overridden, DEFAULT_APPEARANCE).form).toBe("side_by_side");
  });

  it("gives a wall oven the cavities of its form", () => {
    const single = makeAppliance("oven", SPECS.wallOven);
    const double = previewSpec(single, { ...DEFAULT_APPEARANCE, form: "double" }) as WallOvenSpec;
    expect(double.ovens).toEqual([
      { prefix: "cav", position: "upper", width: 30 },
      { prefix: "cav2", position: "lower", width: 30 },
    ]);
    const back = previewSpec({ ...single, spec: double, detected_form: "double" }, { ...DEFAULT_APPEARANCE, form: "single" });
    expect((back as WallOvenSpec).ovens).toEqual([{ prefix: "cav", position: "single", width: 30 }]);
  });
});

describe("formChoices", () => {
  it("lists the family's forms, with the detected one even if missing", () => {
    const fridge = makeAppliance("fridge", SPECS.sideBySide, {
      appearance_options: { ...FRIDGE_OPTIONS, forms: ["french_door", "over_under"] },
    });
    expect(formChoices(fridge)).toEqual(["side_by_side", "french_door", "over_under"]);
    expect(formChoices({ ...fridge, appearance_options: FRIDGE_OPTIONS })).toEqual(["side_by_side", "french_door"]);
  });
});

describe("helpers", () => {
  it("compares every field", () => {
    expect(sameAppearance(DEFAULT_APPEARANCE, { ...DEFAULT_APPEARANCE })).toBe(true);
    expect(sameAppearance(DEFAULT_APPEARANCE, { ...DEFAULT_APPEARANCE, form: "x" })).toBe(false);
  });

  it("accepts only #rrggbb colors", () => {
    expect(isHexColor("#A1b2C3")).toBe(true);
    expect(isHexColor("#abc")).toBe(false);
    expect(isHexColor("red")).toBe(false);
    expect(isHexColor(null)).toBe(false);
  });
});
