import { nothing, type TemplateResult } from "lit";
import { renderGeneric } from "../drawings/generic";
import { renderDrawing } from "../drawings/index";
import type { DrawingInput, DrawingState } from "../drawings/types";
import { translatorFor } from "../data/locale";
import { doorClosedSince, eventName, liveEvent, ovenNames, type OvenNames } from "../families/events";
import { familyModel, makeContext, type ContextHelpers } from "../families/index";
import type { ApplianceContext, DisplayText, FamilyModel, InfoRow, StatusPill } from "../families/types";
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
  /**
   * The appliance's latest event, from its event entity's live state: its name, and when, in ms.
   * Null once it's older than EVENT_SHOWN_FOR, or for a door alert whose door has closed.
   */
  event: { name: string; time: number } | null;
}

/**
 * How long the overview card shows an appliance's latest event: long enough for a wash that
 * ended overnight, not so long that an alert from days ago reads as news. The full view's
 * Recent events keeps the history.
 */
export const EVENT_SHOWN_FOR = 12 * 60 * 60 * 1000;

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

/** What an appliance's family model says of it now, for whoever draws it. */
export interface Evaluation {
  ctx: ApplianceContext;
  state: DrawingState;
  status: StatusPill;
  display: DisplayText | null;
  /** The display has nothing live to show, so its digits are greyed (see displayIdle). */
  dim: boolean;
  /** Runs another piece of the model the same guarded way: info rows, sections. */
  part<T>(name: string, run: (model: FamilyModel) => T, fallback: T): T;
}

/**
 * Asks the appliance's family model for its drawing state, status and display, each on its own:
 * a model that trips over an appliance's state shows less, never a broken card or page. The
 * overview card, the full view and the Appearance editor's preview all read an appliance this way.
 */
export function evaluate(
  appliance: PanelAppliance,
  hass: HomeAssistant,
  t: Translate,
  now: number,
  helpers: ContextHelpers,
): Evaluation {
  const model = familyModel(appliance);
  const ctx = makeContext(appliance, hass, t, now, helpers);
  const part = <T>(name: string, run: (model: FamilyModel) => T, fallback: T): T =>
    attempt(`${appliance.spec?.family} ${name} for ${appliance.device_id}`, () => run(model), fallback);
  const state = part<DrawingState>("drawing state", () => model.drawingState(ctx), {
    available: appliance.available,
    doors: {},
    readouts: {},
  });
  if (!appliance.available) {
    // Nothing it last reported can be trusted, so the display goes dark; info rows and controls
    // show the entities' own unavailable values.
    return {
      ctx,
      state: { ...state, available: false },
      status: { text: t("pill.offline"), tone: "gray" },
      display: null,
      dim: true,
      part,
    };
  }
  return {
    ctx,
    state,
    status: part<StatusPill>("status", () => model.status(ctx), { text: "", tone: "neutral" }),
    display: part<DisplayText | null>("display", () => model.display(ctx), null),
    dim: displayIdle(state),
    part,
  };
}

export function cardView(
  appliance: PanelAppliance,
  hass: HomeAssistant,
  t: Translate,
  now: number,
  helpers: ContextHelpers,
): CardView {
  const { state, status, display, dim, ctx, part } = evaluate(appliance, hass, t, now, helpers);
  const eventId = appliance.entities?.appliance_event?.event;
  const latest = eventId ? liveEvent(hass.states[eventId]) : null;
  const live = latest && now - latest.time < EVENT_SHOWN_FOR && !doorClosedSince(latest.type, state.doors) ? latest : null;
  return {
    status,
    rows: part("info rows", (model) => model.infoRows(ctx), []),
    display,
    dim,
    state,
    // Named as the full view's list names it: a range's ovens are its Right and Left.
    event: live && { name: eventName(t, live.type, part<OvenNames>("oven names", () => ovenNames(ctx), {})), time: live.time },
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
  hass: Pick<HomeAssistant, "themes" | "language" | "locale"> | undefined,
  uid: string,
  look: { appearance?: Appearance; spec?: ApplianceSpec; pixelHeight?: number } = {},
): DrawingInput {
  return {
    uid,
    spec: look.spec ?? appliance.spec,
    appearance: look.appearance ?? appliance.appearance,
    state: appliance.available ? state : { ...state, available: false },
    theme: hass?.themes?.darkMode ? "dark" : "light",
    t: translatorFor(hass),
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
