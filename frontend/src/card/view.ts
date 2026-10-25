import { nothing, type TemplateResult } from "lit";
import { renderGeneric } from "../drawings/generic";
import { renderDrawing } from "../drawings/index";
import type { DrawingInput, DrawingState } from "../drawings/types";
import { familyModel, makeContext, type ContextHelpers } from "../families/index";
import type { DisplayText, InfoRow, StatusPill } from "../families/types";
import type { HomeAssistant } from "../hass";
import type { Translate } from "../i18n";
import type { Appearance, ApplianceSpec, PanelAppliance } from "../types";

/** What the overview card shows for an appliance, from its family model. */
export interface CardView {
  status: StatusPill;
  rows: InfoRow[];
  display: DisplayText | null;
  /** The display has nothing live to show, so its digits are greyed (see displayIdle). */
  dim: boolean;
  state: DrawingState;
}

/**
 * Whether the display has nothing live to show: every oven off with no kitchen timer running, or
 * a dishwasher idle, done or stopped by an error. The GE card greys its digits then, so the
 * brightest thing on a quiet overview isn't an "Off".
 */
export function displayIdle(state: DrawingState): boolean {
  if (state.ovens) return !Object.values(state.ovens).some((oven) => oven?.on) && !state.display;
  const status = state.dishwasher?.status;
  return status === "idle" || status === "done" || status === "error";
}

const reported = new Set<string>();
// A message that changes every time (one quoting a value, say) would otherwise grow the set
// on every clock tick.
const REPORTS_KEPT = 200;

/**
 * Runs one piece of a family model or drawing, so an appliance whose state surprises it shows
 * a plainer card instead of breaking the whole panel. Each failure is logged once, not on every
 * clock tick.
 */
export function attempt<T>(what: string, run: () => T, fallback: T): T {
  try {
    return run();
  } catch (error) {
    const key = `${what}: ${String(error)}`;
    if (!reported.has(key) && reported.size < REPORTS_KEPT) {
      reported.add(key);
      console.error(`Sub-Zero panel: ${what} failed`, error);
    }
    return fallback;
  }
}

export function cardView(
  appliance: PanelAppliance,
  hass: HomeAssistant,
  t: Translate,
  now: number,
  helpers: ContextHelpers,
): CardView {
  const model = familyModel(appliance);
  const ctx = makeContext(appliance, hass, t, now, helpers);
  const what = (part: string) => `${appliance.spec.family} ${part} for ${appliance.device_id}`;
  const state = attempt(what("drawing state"), () => model.drawingState(ctx), {
    available: appliance.available,
    doors: {},
    readouts: {},
  });
  if (!appliance.available) {
    // Nothing it last reported can be trusted, so the display goes dark; the info rows show the
    // entities' own unavailable values.
    return {
      status: { text: t("status.offline"), tone: "gray" },
      rows: attempt(what("info rows"), () => model.infoRows(ctx), []),
      display: null,
      dim: true,
      state: { ...state, available: false },
    };
  }
  return {
    status: attempt(what("status"), () => model.status(ctx), { text: "", tone: "neutral" }),
    rows: attempt(what("info rows"), () => model.infoRows(ctx), []),
    display: attempt(what("display"), () => model.display(ctx), null),
    dim: displayIdle(state),
    state,
  };
}

export function prefersReducedMotion(): boolean {
  try {
    return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/**
 * The drawing's input. `pixelHeight` is the height it's shown at (see DrawingSize); the
 * Appearance editor's preview also passes its pending look and form.
 */
export function drawingInput(
  appliance: PanelAppliance,
  state: DrawingState,
  hass: Pick<HomeAssistant, "themes"> | undefined,
  uid: string,
  look: { appearance?: Appearance; spec?: ApplianceSpec; pixelHeight?: number } = {},
): DrawingInput {
  return {
    uid,
    spec: look.spec ?? appliance.spec,
    appearance: look.appearance ?? appliance.appearance,
    state: appliance.available ? state : { ...state, available: false },
    theme: hass?.themes?.darkMode ? "dark" : "light",
    reducedMotion: prefersReducedMotion(),
    ...(look.pixelHeight ? { pixelHeight: look.pixelHeight } : {}),
  };
}

/** The appliance's drawing; the generic one if its module fails, and nothing if that does too. */
export function safeDrawing(input: DrawingInput): TemplateResult | typeof nothing {
  const drawing = attempt(`${input.spec.family} drawing`, () => renderDrawing(input), null);
  return (
    drawing ??
    attempt<TemplateResult | typeof nothing>(
      `${input.spec.family} generic drawing`,
      () => renderGeneric(input),
      nothing,
    )
  );
}
