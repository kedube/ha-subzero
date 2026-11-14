import type { Translate } from "../i18n";
import type { OvenSlot } from "../types";
import { clamp } from "./materials-core";
import type { LabelSpec, OverlayIcon, Readout } from "./overlay";
import type { OvenState } from "./types";
import { ovenPhrases, withTemperature } from "./words";

/*
 * What an oven is doing, worked out one way for every drawing of an oven: the range, the wall
 * oven and the generic oven. Each takes its heat, its readout and its screen-reader words from
 * here, so they can't disagree about a state; what stays with each drawing is how its photos
 * show that state (how brightly the cavity glows, what its screen looks like).
 */

/**
 * Self-clean is running. Only a cavity that's on can be cleaning: an oven that's off draws and
 * reads as off whatever else it reports (see `OvenState.self_clean`).
 */
export function isSelfCleaning(state: OvenState | null | undefined): boolean {
  return !!state && state.on && state.self_clean;
}

/** How brightly a cavity glows, 0 to 1, for each thing it can be doing: one drawing's numbers. */
export interface HeatScale {
  /** Self-cleaning, far hotter than cooking. Without it, a self-clean glows as cooking does. */
  clean?: number;
  /** At the setpoint. */
  preheated: number;
  /** Preheating: `start` as it begins, rising by `span` as it nears the setpoint. */
  start: number;
  span: number;
  /** On, but how far along it is isn't known. */
  unknown: number;
}

/** The glow of a cavity on a drawing's scale; 0 while it's off. */
export function ovenHeat(state: OvenState | null | undefined, scale: HeatScale): number {
  if (!state?.on) return 0;
  if (scale.clean !== undefined && isSelfCleaning(state)) return scale.clean;
  if (state.preheated) return scale.preheated;
  if (state.progress === null) return scale.unknown;
  return scale.start + scale.span * clamp(state.progress);
}

/**
 * What an oven's readout shows over its window: the temperature with a ring while it preheats
 * (or the self-clean lock), and chips for the probe and Remote Ready. Null when there's nothing
 * to show.
 */
export function ovenReadout(state: OvenState | null | undefined): Readout | null {
  if (!state) return null;
  const chips: OverlayIcon[] = [];
  if (state.probe) chips.push("probe");
  if (state.remote_ready) chips.push("remote");
  let label: LabelSpec | null = null;
  if (isSelfCleaning(state)) label = { text: state.temp, progress: null, icon: "lock" };
  else if (state.on) {
    const progress = !state.preheated && state.progress !== null ? clamp(state.progress) : null;
    if (state.temp || progress !== null) label = { text: state.temp, progress, icon: null };
  }
  return label || chips.length ? { label, chips } : null;
}

/** What one oven is doing, in the panel's language, e.g. ["heating 350°", "probe in"]. */
function ovenStates(t: Translate, oven: OvenState): string[] {
  const cleaning = isSelfCleaning(oven);
  const states: string[] = [];
  if (oven.door_open) states.push(t("drawing.state.door_open"));
  if (cleaning) states.push(t("drawing.state.self_cleaning"));
  else if (oven.on) {
    states.push(withTemperature(t(oven.preheated ? "drawing.state.preheated" : "drawing.state.heating"), oven.temp));
  } else if (!oven.door_open) states.push(t("drawing.state.off"));
  if (oven.light && !oven.door_open && !cleaning) states.push(t("drawing.state.light_on"));
  if (oven.probe) states.push(t("drawing.state.probe_in"));
  if (oven.remote_ready) states.push(t("drawing.state.remote_ready"));
  return states;
}

/** One of an appliance's ovens, for its words: where it is and what it reports (if it does). */
export interface SpokenOven {
  position: OvenSlot["position"];
  state: OvenState | null | undefined;
}

/**
 * What an appliance's ovens are doing, for the screen-reader description after its name, e.g.
 * ["right oven: heating 350°", "left oven: off", "timer 4:12"]. An oven that reports nothing is
 * left out.
 */
export function ovenWords(t: Translate, ovens: SpokenOven[], display: string | null | undefined): string[] {
  const phrases: string[] = [];
  for (const { position, state } of ovens) {
    if (state) phrases.push(...ovenPhrases(t, position, ovenStates(t, state)));
  }
  if (display) phrases.push(t("drawing.timer", { time: display }));
  return phrases;
}
