import type { Translate } from "../i18n";

/**
 * The translation key for an option string the integration reports in English, e.g.
 * "Convection bake" is "option.convection_bake": lowercase, with each run of other characters
 * as one underscore.
 */
export function optionKey(option: string): string {
  return `option.${option.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
}

/** The option in the user's language, or the integration's own string when there's no key. */
export function optionLabel(t: Translate, option: string): string {
  const key = optionKey(option);
  const label = t(key);
  return label === key ? option : label;
}
