/**
 * The families tables cover everything the panel shows: every option string the integration's
 * selects and enum sensors can report, every lock code, every event type, in all nine
 * languages with the same placeholders. Option strings are read from the integration's own
 * source, so a new option there fails here until it has a translation.
 */
import { describe, expect, it } from "vitest";
import { optionKey, optionLabel } from "../src/families/options";
import { LANGUAGES, TABLES, makeTranslate } from "../src/i18n";

async function repoFile(path: string): Promise<string> {
  // Typed loosely: the frontend's tsconfig has no Node types, and only this test reads files.
  const fs = (await import(/* @vite-ignore */ "node:fs" as string)) as {
    readFileSync(path: URL, encoding: "utf8"): string;
  };
  return fs.readFileSync(new URL(path, import.meta.url), "utf8");
}

/** The text of a Python `NAME = {...}` literal. */
function block(source: string, name: string): string {
  const start = source.indexOf(`${name} = {`);
  if (start < 0) throw new Error(`${name} not found`);
  let depth = 0;
  for (let index = source.indexOf("{", start); index < source.length; index++) {
    if (source[index] === "{") depth++;
    if (source[index] === "}" && --depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`${name} isn't closed`);
}

const matches = (text: string, pattern: RegExp) => [...text.matchAll(pattern)].map((match) => match[1]);
const keysWithNumbers = (text: string) => matches(text, /"([^"]+)":\s*-?\d+/g);
const numberedNames = (text: string) => matches(text, /\d+:\s*"([^"]+)"/g);
const keysWithStrings = (text: string) => matches(text, /"([^"]+)":\s*"/g);

async function integrationOptions(): Promise<Set<string>> {
  const constants = await repoFile("../../custom_components/subzero/const.py");
  const select = await repoFile("../../custom_components/subzero/select.py");
  const sensor = await repoFile("../../custom_components/subzero/sensor.py");
  const options = new Set<string>([
    ...keysWithNumbers(block(constants, "COOK_MODES")),
    ...numberedNames(block(constants, "WASH_CYCLES")),
    ...numberedNames(block(constants, "WASH_STATUSES")),
    ...keysWithNumbers(block(constants, "DISHWASHER_MODES")),
    ...keysWithNumbers(block(constants, "FRIDGE_ENUM_OPTIONS")),
    ...numberedNames(block(constants, "HUMIDITY_LABELS")),
    ...keysWithNumbers(block(constants, "DOOR_AJAR_TIMEOUTS")),
    ...keysWithNumbers(block(constants, "LEGACY_ACCENT_LIGHT_OPTIONS")),
    ...keysWithStrings(block(constants, "ICE_MODES")),
    ...keysWithNumbers(block(constants, "HOOD_SENSITIVITY")),
    ...numberedNames(block(constants, "ICE_CLEAN_STAGES")),
    ...matches(constants.slice(constants.indexOf("BROIL_LEVELS")).split("\n")[0], /"(\w+)"/g),
    ...keysWithStrings(block(select, "MODES")),
  ]);
  // Options select.py writes out: the ice maker's, the Mode select's first, and delay start's hours.
  for (const option of ["Off", "On", "Normal"]) options.add(option);
  expect(select).toContain(`f"{hours} hour{'s' if hours != 1 else ''}": hours for hours in range(1, 13)`);
  for (let hours = 1; hours <= 12; hours++) options.add(`${hours} hour${hours === 1 ? "" : "s"}`);
  // The dedicated ice maker's status sensor.
  const status = sensor.slice(sensor.indexOf('key="ice_maker_status"'));
  for (const option of matches(status.slice(0, status.indexOf("]")), /"([^"]+)"/g).slice(2)) options.add(option);
  return options;
}

describe("families translations", () => {
  it("translates every option the integration can report, in every language", async () => {
    const options = await integrationOptions();
    expect(options.size).toBeGreaterThan(80);
    for (const option of ["Convection bake", "Pots and pans", "12 hours", "Descale fill", "Delayed", "Max ice", "Enhanced"]) {
      expect(options).toContain(option);
    }
    for (const language of LANGUAGES) {
      const table = TABLES[language].families;
      const missing = [...options].filter((option) => !(optionKey(option) in table));
      expect(missing, language).toEqual([]);
    }
    expect(optionLabel(makeTranslate("de"), "Convection bake")).toBe("Heißluft-Backen");
    expect(optionLabel(makeTranslate("zh-Hans"), "Self clean")).toBe("自清洁");
  });

  it("falls back to the integration's string for an option it doesn't know", () => {
    expect(optionKey("Par-baked pizza")).toBe("option.par_baked_pizza");
    expect(optionLabel(makeTranslate("fr"), "Par-baked pizza")).toBe("Par-baked pizza");
  });

  it("has a reason for every lock code", async () => {
    const types = await repoFile("../src/types.ts");
    const union = types.slice(types.indexOf("export type LockCode"), types.indexOf(";", types.indexOf("export type LockCode")));
    const codes = matches(union, /"(\w+)"/g);
    expect(codes).toHaveLength(7);
    for (const language of LANGUAGES) {
      for (const code of codes) expect(TABLES[language].families[`lock.${code}`], `${language} lock.${code}`).toBeTruthy();
    }
  });

  it("names every event type", async () => {
    const constants = await repoFile("../../custom_components/subzero/const.py");
    const types = numberedNames(block(constants, "NOTIFICATION_TYPES"));
    expect(types.length).toBeGreaterThan(40);
    for (const language of LANGUAGES) {
      for (const type of types) expect(TABLES[language].families[`event.${type}`], `${language} event.${type}`).toBeTruthy();
    }
  });

  it("has the same keys and placeholders in every language, all translated", () => {
    const english = TABLES.en.families;
    const placeholders = (text: string) => matches(text, /\{(\w+)\}/g).sort();
    for (const language of LANGUAGES) {
      const table = TABLES[language].families;
      expect(Object.keys(table).sort(), language).toEqual(Object.keys(english).sort());
      for (const [key, text] of Object.entries(table)) {
        expect(text.trim(), `${language} ${key}`).not.toBe("");
        expect(placeholders(text), `${language} ${key}`).toEqual(placeholders(english[key]));
      }
      if (language === "en") continue;
      // A handful are the same word in some languages (units, "Remote Ready", "Offline").
      const same = Object.keys(table).filter((key) => table[key] === english[key]);
      expect(same.length, `${language}: ${same.join(", ")}`).toBeLessThan(Object.keys(table).length / 20);
    }
  });
});
