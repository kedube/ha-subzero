import { describe, expect, it } from "vitest";
import { LANGUAGES, TABLES, makeTranslate, resolveLanguage } from "../src/i18n";

// Every language must say everything English says, with the same {placeholders}, in all three
// tables: the shell's, the family models' and the drawings'. A missing key would quietly show
// English.
const KINDS = ["shell", "families", "drawings"] as const;
const OTHERS = LANGUAGES.filter((language) => language !== "en");

function placeholders(text: string): string[] {
  return [...new Set(text.match(/\{\w+\}/g) ?? [])].sort();
}

describe.each(KINDS)("the %s tables", (kind) => {
  const english = TABLES.en[kind];

  it("are flat tables of non-empty strings under dotted keys", () => {
    for (const language of LANGUAGES) {
      for (const [key, value] of Object.entries(TABLES[language][kind])) {
        expect(key, `${language} ${key}`).toMatch(/^[^.\s{}]+(\.[^.\s{}]+)+$/);
        expect(typeof value, `${language} ${key}`).toBe("string");
        expect((value as string).trim(), `${language} ${key}`).not.toBe("");
      }
    }
  });

  it.each(OTHERS)("in %s have exactly the English keys", (language) => {
    const keys = Object.keys(TABLES[language][kind]);
    const missing = Object.keys(english).filter((key) => !keys.includes(key));
    const extra = keys.filter((key) => !(key in english));
    expect({ missing, extra }).toEqual({ missing: [], extra: [] });
  });

  it.each(OTHERS)("in %s keep every key's placeholders", (language) => {
    const table = TABLES[language][kind];
    const mismatched = Object.entries(english)
      .filter(([key, text]) => key in table && placeholders(table[key]).join() !== placeholders(text).join())
      .map(([key]) => key);
    expect(mismatched).toEqual([]);
  });
});

describe("the three tables", () => {
  it.each(LANGUAGES)("in %s don't define the same key twice", (language) => {
    const tables = TABLES[language];
    const keys = KINDS.flatMap((kind) => Object.keys(tables[kind]));
    // The table makeTranslate merges last would silently win.
    expect(keys.filter((key, index) => keys.indexOf(key) !== index)).toEqual([]);
  });
});

describe("the drawings table", () => {
  const english = TABLES.en.drawings;

  it("names every form, front, oven and wash status the drawings say", () => {
    const wanted = [
      ...[
        ...["side_by_side", "french_door", "over_under", "column_refrigerator", "column_freezer", "column_wine"],
        ...["tall_refrigerator", "tall_freezer", "tall_over_under", "wine_over_drawers", "undercounter_refrigerator"],
        ...["undercounter_beverage", "undercounter_wine", "undercounter_drawers", "ice_maker"],
        ...["freezer_drawers", "combination_drawers"],
      ].map((name) => `drawing.refrigeration.${name}`),
      ...["door", "refrigerator_door", "freezer_door", "wine_door", "ice_maker_door", "refrigerator_drawer", "freezer_drawer"].map(
        (front) => `drawing.open.${front}`,
      ),
      ...["left", "right", "upper", "lower"].map((position) => `drawing.oven.${position}`),
      ...["wall", "island", "insert", "hood"].map((form) => `drawing.hood.${form}`),
      ...["running", "paused", "canceling", "drying", "done", "delayed", "error"].map((status) => `drawing.wash.${status}`),
    ];
    expect(wanted.filter((key) => !(key in english))).toEqual([]);
  });

  it.each(OTHERS)("in %s is translated", (language) => {
    const table = TABLES[language].drawings;
    // A few read the same: the list punctuation, Wolf's "Remote Ready", and words like "Timer".
    const same = Object.keys(table).filter((key) => table[key] === english[key]);
    expect(same.length, same.join(", ")).toBeLessThan(Object.keys(table).length / 10);
  });
});

describe("the shell table", () => {
  const english = TABLES.en.shell;
  const FORMS = [
    "side_by_side",
    "french_door",
    "over_under",
    "column_refrigerator",
    "column_freezer",
    "column_wine",
    "tall_refrigerator",
    "tall_freezer",
    "tall_over_under",
    "wine_over_drawers",
    "undercounter_refrigerator",
    "undercounter_beverage",
    "undercounter_wine",
    "undercounter_drawers",
    "ice_maker",
    "range",
    "single",
    "double",
    "wall",
    "island",
    "insert",
    "hood",
    "dishwasher",
    "refrigerator",
    "wine",
    "oven",
    "appliance",
  ];

  it("names every form in types.ts, every finish, knob, handle, style and family", () => {
    const wanted = [
      ...FORMS.map((form) => `form.${form}`),
      ...["stainless", "panel", "black", "carbon", "white"].map((finish) => `finish.${finish}`),
      ...["red", "black", "stainless"].map((knobs) => `knobs.${knobs}`),
      ...["tubular", "pro", "none"].map((handle) => `handle.${handle}`),
      ...["professional", "transitional", "contemporary"].map((style) => `style.${style}`),
      ...["refrigeration", "range", "wall_oven", "hood", "dishwasher", "generic"].map((family) => `family.${family}`),
    ];
    expect(wanted.filter((key) => !(key in english))).toEqual([]);
  });

  it("keeps the brand name untranslated", () => {
    for (const language of LANGUAGES) expect(TABLES[language].shell["panel.title"]).toBe("Sub-Zero");
  });
});

describe("makeTranslate", () => {
  it("fills placeholders and falls back to English, then to the key", () => {
    const t = makeTranslate("de");
    expect(t("appearance.error", { message: "Zeitüberschreitung" })).toBe("Speichern fehlgeschlagen: Zeitüberschreitung");
    expect(t("no.such.key")).toBe("no.such.key");
  });

  it("picks a regional language's base, and Simplified Chinese for any Chinese", () => {
    expect(resolveLanguage("de-CH")).toBe("de");
    expect(resolveLanguage("zh-Hant")).toBe("zh-Hans");
    expect(resolveLanguage("pt-BR")).toBe("en");
    expect(resolveLanguage(undefined)).toBe("en");
  });
});
