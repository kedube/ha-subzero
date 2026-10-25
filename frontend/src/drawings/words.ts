import type { Translate } from "../i18n";
import type { OvenSlot } from "../types";

/**
 * What a drawing says for screen readers, in the panel's language: its name, then what's going
 * on, e.g. "Range, left oven: heating 350°, right oven: off".
 */
export function spoken(t: Translate, phrases: ReadonlyArray<string | null | undefined | false>): string {
  return phrases.filter((phrase): phrase is string => !!phrase).join(t("drawing.separator"));
}

/**
 * One oven's phrases. On an appliance with two ovens each is led by the oven's name; a single
 * oven's stand alone.
 */
export function ovenPhrases(t: Translate, position: OvenSlot["position"], states: string[]): string[] {
  if (position === "single") return states;
  const oven = t(`drawing.oven.${position}`);
  return states.map((state) => t("drawing.oven_state", { oven, state }));
}

/** A state with the oven's temperature after it, when there is one (e.g. "heating 350°"). */
export function withTemperature(state: string, temp: string | null): string {
  return temp ? `${state} ${temp}` : state;
}
