import { describe, expect, it } from "vitest";
import { LANGUAGES, TABLES, makeTranslate, resolveLanguage } from "../src/i18n";

// Every language must say everything English says, with the same {placeholders}, in both
// tables: the shell's and the family models'. A missing key would quietly show English.
const KINDS = ["shell", "families"] as const;
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

describe("the two tables", () => {
  it.each(LANGUAGES)("in %s don't define the same key twice", (language) => {
    const shell = TABLES[language].shell;
    const shared = Object.keys(TABLES[language].families).filter((key) => key in shell);
    // The families table would silently win (makeTranslate merges it last).
    expect(shared).toEqual([]);
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
