/**
 * Panel text in the integration's nine languages. Each language has two flat tables of
 * dotted keys: shell/<lang>.json (panel, overview, card, appearance editor) and
 * families/<lang>.json (family models, controls, full view). Placeholders look like {name}.
 * English fills any key a language lacks; test/i18n.test.ts checks every language has
 * exactly the English keys.
 */
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

export const TABLES: Record<Language, { shell: Table; families: Table }> = {
  en: { shell: shellEn, families: familiesEn },
  de: { shell: shellDe, families: familiesDe },
  es: { shell: shellEs, families: familiesEs },
  fr: { shell: shellFr, families: familiesFr },
  it: { shell: shellIt, families: familiesIt },
  nl: { shell: shellNl, families: familiesNl },
  pl: { shell: shellPl, families: familiesPl },
  sv: { shell: shellSv, families: familiesSv },
  "zh-Hans": { shell: shellZhHans, families: familiesZhHans },
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
    ...TABLES[lang].shell,
    ...TABLES[lang].families,
  };
  return (key, vars) => {
    const text = table[key] ?? key;
    return vars ? text.replace(/\{(\w+)\}/g, (match, name) => String(vars[name] ?? match)) : text;
  };
}
