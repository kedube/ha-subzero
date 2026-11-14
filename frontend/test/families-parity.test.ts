// @vitest-environment happy-dom
/**
 * The panel's copies of the integration's constants say what the integration's say. Each is
 * read from the Python source, so a change there fails here until the panel follows. What the
 * integration can send instead (which ovens have a mode knob, whose ovens are right and left)
 * comes with each appliance, in its `traits`.
 */
import { describe, expect, it } from "vitest";
// First, so Lit finds its dev-mode notice already silenced.
import "./shell-fixtures";
import { MIN_BRIGHTNESS } from "../src/controls/light";
import { PANEL_COLOR_NAMES } from "../src/data/appearance";
import { DISHWASHER_OPTIONS, WASH_STATUSES } from "../src/families/dishwasher";
import { MANUAL_MODES } from "../src/families/oven";
import { LANGUAGES, TABLES } from "../src/i18n";
import { block, keysWithStrings, matches, numberedNames, repoFile } from "./fixtures/python";

const constants = () => repoFile("custom_components/subzero/const.py");

describe("the panel's copies of the integration's constants", () => {
  it("has the cooking modes Wolf requires starting at the oven (MANUAL_COOK_MODES)", async () => {
    const source = await constants();
    const numbers = matches(block(source, "MANUAL_COOK_MODES"), /(\d+)/g);
    expect(numbers.length).toBeGreaterThan(0);
    const names = Object.fromEntries([...block(source, "COOK_MODES").matchAll(/"([^"]+)":\s*(\d+)/g)].map((match) => [match[2], match[1]]));
    expect([...MANUAL_MODES].sort()).toEqual(numbers.map((number) => names[number]).sort());
  });

  it("has the dishwasher's option switches, in the integration's order (DISHWASHER_SWITCHES)", async () => {
    const keys = keysWithStrings(block(await constants(), "DISHWASHER_SWITCHES"));
    expect(keys.length).toBeGreaterThan(0);
    expect(DISHWASHER_OPTIONS).toEqual(keys);
    // And a label for each.
    for (const key of keys) expect(TABLES.en.families[`control.${key}`], key).toBeTruthy();
  });

  it("has every wash status the sensor can report (WASH_STATUSES)", async () => {
    const names = [...new Set(numberedNames(block(await constants(), "WASH_STATUSES")))];
    expect(names.length).toBeGreaterThan(0);
    expect(Object.keys(WASH_STATUSES)).toEqual(names);
  });

  it("names each of the integration's panel colors (PANEL_COLORS)", async () => {
    const api = await repoFile("custom_components/subzero/panel_api.py");
    const colors = matches(block(api, "PANEL_COLORS", "("), /"(#[0-9a-fA-F]{6})"/g);
    expect(colors.length).toBeGreaterThan(0);
    expect(Object.keys(PANEL_COLOR_NAMES)).toEqual(colors.map((color) => color.toLowerCase()));
    for (const language of LANGUAGES) {
      for (const name of Object.values(PANEL_COLOR_NAMES)) expect(TABLES[language].shell[`panel_color.${name}`], `${language} ${name}`).toBeTruthy();
    }
  });

  it("starts the task light's brightness where the integration does (HOOD_INTEGER_RANGES)", async () => {
    const range = /"light_percent":\s*\((\d+),\s*(\d+)\)/.exec(block(await constants(), "HOOD_INTEGER_RANGES"));
    expect(range).not.toBeNull();
    expect(MIN_BRIGHTNESS).toBe(Number(range![1]));
    // The slider's other end is a plain 100.
    expect(Number(range![2])).toBe(100);
  });
});
