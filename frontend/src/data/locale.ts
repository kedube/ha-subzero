import type { HomeAssistant } from "../hass";
import { makeTranslate, type Translate } from "../i18n";

type LocaleSource = Pick<HomeAssistant, "language" | "locale"> | undefined;

/** The user's language tag, as Home Assistant's own frontend picks it. */
export function languageOf(hass: LocaleSource): string {
  return hass?.locale?.language || hass?.language || "en";
}

// makeTranslate merges four tables, and every card asks for a translator on every render.
const translators = new Map<string, Translate>();

export function translatorFor(hass: LocaleSource): Translate {
  const language = languageOf(hass);
  let translate = translators.get(language);
  if (!translate) {
    translate = makeTranslate(language);
    translators.set(language, translate);
  }
  return translate;
}

const collators = new Map<string, Intl.Collator>();

/** Compares names the way the user's language sorts them, with numbers in numeric order. */
export function collatorFor(language: string): Intl.Collator {
  let collator = collators.get(language);
  if (!collator) {
    try {
      collator = new Intl.Collator(language, { numeric: true, sensitivity: "base" });
    } catch {
      // An invalid tag throws; the browser's default order is still better than none.
      collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
    }
    collators.set(language, collator);
  }
  return collator;
}

/** The message in a rejected service or websocket call, e.g. `{code, message}` from Home Assistant. */
export function errorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string" && message) return message;
  }
  if (typeof error === "string" && error) return error;
  return String(error ?? "");
}
