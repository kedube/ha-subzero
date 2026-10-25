/**
 * Panel text in the integration's nine languages. Each language has three flat tables of
 * dotted keys: shell/<lang>.json (panel, overview, card, appearance editor),
 * families/<lang>.json (family models, controls, full view) and drawings/<lang>.json (what the
 * drawings say: their screen-reader descriptions and a range's touchscreen). Placeholders look
 * like {name}. English fills any key a language lacks; test/i18n.test.ts checks every language
 * has exactly the English keys.
 */
import drawingsDe from "./drawings/de.json";
import drawingsEn from "./drawings/en.json";
import drawingsEs from "./drawings/es.json";
import drawingsFr from "./drawings/fr.json";
import drawingsIt from "./drawings/it.json";
import drawingsNl from "./drawings/nl.json";
import drawingsPl from "./drawings/pl.json";
import drawingsSv from "./drawings/sv.json";
import drawingsZhHans from "./drawings/zh-Hans.json";
import familiesDe from "./families/de.json";
import familiesEn from "./families/en.json";
import familiesEs from "./families/es.json";
import familiesFr from "./families/fr.json";
import familiesIt from "./families/it.json";
import familiesNl from "./families/nl.json";
import familiesPl from "./families/pl.json";
import familiesSv from "./families/sv.json";
import familiesZhHans from "./families/zh-Hans.json";
import shellDe from "./shell/de.json";
import shellEn from "./shell/en.json";
import shellEs from "./shell/es.json";
import shellFr from "./shell/fr.json";
import shellIt from "./shell/it.json";
import shellNl from "./shell/nl.json";
import shellPl from "./shell/pl.json";
import shellSv from "./shell/sv.json";
import shellZhHans from "./shell/zh-Hans.json";

export const LANGUAGES = ["en", "de", "es", "fr", "it", "nl", "pl", "sv", "zh-Hans"] as const;
export type Language = (typeof LANGUAGES)[number];

type Table = Record<string, string>;

export const TABLES: Record<Language, { shell: Table; families: Table; drawings: Table }> = {
  en: { shell: shellEn, families: familiesEn, drawings: drawingsEn },
  de: { shell: shellDe, families: familiesDe, drawings: drawingsDe },
  es: { shell: shellEs, families: familiesEs, drawings: drawingsEs },
  fr: { shell: shellFr, families: familiesFr, drawings: drawingsFr },
  it: { shell: shellIt, families: familiesIt, drawings: drawingsIt },
  nl: { shell: shellNl, families: familiesNl, drawings: drawingsNl },
  pl: { shell: shellPl, families: familiesPl, drawings: drawingsPl },
  sv: { shell: shellSv, families: familiesSv, drawings: drawingsSv },
  "zh-Hans": { shell: shellZhHans, families: familiesZhHans, drawings: drawingsZhHans },
};

export type Translate = (key: string, vars?: Record<string, string | number>) => string;

/**
 * The panel language for a Home Assistant language tag: a regional variant uses its base
 * ("de-CH" is "de"), any Chinese uses Simplified (the only Chinese the integration ships),
 * and anything else English.
 */
export function resolveLanguage(language: string | undefined): Language {
  if (!language) return "en";
  if ((LANGUAGES as readonly string[]).includes(language)) return language as Language;
  const base = language.split(/[-_]/)[0].toLowerCase();
  if (base === "zh") return "zh-Hans";
  return (LANGUAGES as readonly string[]).includes(base) ? (base as Language) : "en";
}

export function makeTranslate(language: string | undefined): Translate {
  const lang = resolveLanguage(language);
  const table: Table = {
    ...TABLES.en.shell,
    ...TABLES.en.families,
    ...TABLES.en.drawings,
    ...TABLES[lang].shell,
    ...TABLES[lang].families,
    ...TABLES[lang].drawings,
  };
  return (key, vars) => {
    const text = table[key] ?? key;
    return vars ? text.replace(/\{(\w+)\}/g, (match, name) => String(vars[name] ?? match)) : text;
  };
}
