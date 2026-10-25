import { html, nothing, svg, type SVGTemplateResult } from "lit";
import type { Appearance } from "../types";
import { closedView, door, DOOR_TOP, DW_HEIGHT, type Front, openView, toeKick, topReveal } from "./dishwasher/door";
import { controlStrip, interior, OPEN_ANGLE, OPEN_WIDEN, stripTop } from "./dishwasher/open";
import { dishwasherOverlay, dishwasherWords, doorOpen, FLOOR_LIGHT } from "./dishwasher/status";
import { Defs, floorShadow, materialDefs, paintDefs, parseColor } from "./generic/materials";
import { LABEL_H, labelScale, statusRow } from "./generic/overlay";
import type { DrawingInput, DrawingRenderer } from "./types";
import { spoken } from "./words";

/**
 * The Cove dishwasher (DW2450, DW2450WS): a 24″ door taking Cove's stainless panel kit or a
 * custom cabinet panel. Live state shows the way the Cove does: its floor status light glows
 * red while a cycle runs, green when it's done and blue for a delayed start, the door swings
 * down to show the lit tub, and progress and warnings float over the door as small frosted
 * chips.
 */

/** The viewBox height: the dishwasher, its floor shadow and light, and a little headroom. */
export const DW_VIEW_HEIGHT = DW_HEIGHT + 20;

/**
 * Cove's stainless kit with the chosen handle, or a panel in the owner's color. The kit always
 * ships with a handle, so a stainless door without one gets the tubular handle.
 */
export function dishwasherFront(appearance: Appearance): Front {
  const handle = appearance.handle === "none" ? null : appearance.handle === "pro" ? "pro" : "tubular";
  if (appearance.finish === "stainless") return { kind: "stainless", handle: handle ?? "tubular" };
  const fallback: Record<string, string> = { black: "#2a2b2d", carbon: "#3b3d40", white: "#f1f0ec" };
  const color = parseColor(appearance.panel_color ?? fallback[appearance.finish], "#ebe8e1");
  return { kind: "panel", color, handle };
}

/**
 * The door, closed or swung open over the lit tub, and where the status row sits on it: in
 * the door's upper part, below the handle (pro brackets reach 8 units under its center line,
 * and 2.4″ off the door when it's open), with room for a row `labelHeight` tall.
 */
export function dishwasherBody(
  d: Defs,
  width: number,
  front: Front,
  open: boolean,
  controls: boolean,
  labelHeight: number,
): { body: SVGTemplateResult; statusY: number } {
  const reach = front.handle === "pro" ? 8 : front.handle ? 3.5 : 0;
  if (open) {
    const view = openView(width, OPEN_ANGLE, OPEN_WIDEN);
    const handleBottom = view.at(0, 16)[1] + 24 * view.lift + reach;
    return {
      body: svg`
        ${interior(d, width, stripTop(view) + 1)}
        ${toeKick(d, width, front)}
        ${door(d, view, front)}
        ${controlStrip(d, view, front, controls)}
      `,
      statusY: Math.max(view.at(0, view.height * 0.35)[1], handleBottom + 8 + labelHeight / 2),
    };
  }
  return {
    body: svg`
      ${topReveal(width)}
      ${toeKick(d, width, front)}
      ${door(d, closedView(width), front)}
    `,
    statusY: Math.max(53, DOOR_TOP + 16 + reach + 8 + labelHeight / 2),
  };
}

/**
 * Cove's floor light: a pool of colored light thrown on the floor in front of the toe kick,
 * with only a faint spill back onto the kick's foot.
 */
export function floorLight(d: Defs, width: number, color: string): SVGTemplateResult {
  return svg`
    <defs>
      <radialGradient id=${d.id("floor-light")} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color=${color} stop-opacity="0.75" />
        <stop offset="0.45" stop-color=${color} stop-opacity="0.3" />
        <stop offset="1" stop-color=${color} stop-opacity="0" />
      </radialGradient>
      <radialGradient id=${d.id("floor-spill")} cx="0.5" cy="1" r="0.55">
        <stop offset="0" stop-color=${color} stop-opacity="0.12" />
        <stop offset="1" stop-color=${color} stop-opacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx=${width / 2} cy=${DW_HEIGHT + 5.5} rx=${width * 0.36} ry="6" fill=${d.url("floor-light")} />
    <ellipse cx=${width / 2} cy=${DW_HEIGHT + 4} rx=${width * 0.17} ry="2" fill=${color} opacity="0.5"
      filter=${d.url("blur-s")} />
    <rect x="6" y=${DW_HEIGHT - 10} width=${width - 12} height="10" fill=${d.url("floor-spill")} />
  `;
}

export const renderDishwasher: DrawingRenderer = (input: DrawingInput) => {
  const { spec, state } = input;
  if (spec.family !== "dishwasher") return null;
  const d = new Defs(input.uid);
  const width = Math.round((spec.width ?? 24) * 10);
  const front = dishwasherFront(input.appearance);
  const open = doorOpen(state);
  const reducedMotion = !!input.reducedMotion;
  const dw = state.dishwasher;
  // The floor light goes out when the door opens, as on the Cove.
  const lightColor = state.available && !open && dw ? FLOOR_LIGHT[dw.status] : undefined;
  const scale = labelScale(DW_VIEW_HEIGHT, input.pixelHeight);
  const { body, statusY } = dishwasherBody(d, width, front, open, true, LABEL_H * scale);
  const { label, chips } = dishwasherOverlay(state);
  const { t } = input;
  const description = spoken(t, [t("drawing.dishwasher"), ...dishwasherWords(t, state), state.available ? null : t("drawing.offline")]);
  const margin = 14;
  return html`<svg
    viewBox=${`${-margin} -4 ${width + 2 * margin} ${DW_VIEW_HEIGHT}`}
    role="img"
    aria-label=${description}
  >
    <defs>
      ${materialDefs(d)}
      ${front.kind === "panel" ? paintDefs(d, "panel", front.color) : nothing}
    </defs>
    ${floorShadow(d, 0, width, DW_HEIGHT, input.theme)}
    <g filter=${state.available ? nothing : d.url("offline")}>${body}</g>
    ${lightColor ? floorLight(d, width, lightColor) : nothing}
    ${statusRow(d, width / 2, statusY, label, chips, reducedMotion, scale)}
  </svg>`;
};
