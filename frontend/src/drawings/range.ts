import { html, nothing } from "lit";
import type { RangeSpec } from "../types";
import { Ids } from "./materials-core";
import { ovenReadout, ovenWords } from "./oven-state";
import { labelScale, zoneReadout } from "./overlay";
import { floorAndFeet, lowerBody, upperBand } from "./range/body";
import { controlPanel, screenActive, type Ovens } from "./range/controls";
import { gasTop, inductionTop } from "./range/cooktop";
import { rangeLayout, type RangeLayout } from "./range/layout";
import { rangeDefs } from "./range/materials";
import { closedDoor, openDoor, openingBox, windowBox } from "./range/oven";
import type { Translate } from "../i18n";
import type { DrawingRenderer, DrawingState } from "./types";
import { spoken } from "./words";

/**
 * Wolf dual fuel, gas and induction ranges, modeled on the DF48850/S/P and IR36550/S/T:
 * true proportions for 30″ to 60″ widths, the rangetop with its grates and griddle,
 * charbroiler or French top, red, black or stainless knobs, and live oven state.
 */
export const renderRange: DrawingRenderer = (input) => {
  if (input.spec.family !== "range") return null;
  const spec: RangeSpec = input.spec;
  const layout = rangeLayout(spec);
  const ids = new Ids(input.uid);
  const ovens: Ovens = input.state.ovens ?? {};
  const display = input.state.display ?? null;
  const reducedMotion = !!input.reducedMotion;
  const box = layout.viewBox;
  return html`<svg
    viewBox="${box.x} ${box.y} ${box.w} ${box.h}"
    role="img"
    aria-label=${ariaLabel(input.t, layout, input.state)}
  >
    ${rangeDefs(ids, layout.width, input.appearance.knobs)}
    <g filter=${input.state.available ? nothing : ids.url("offline")}>
      ${floorAndFeet(layout, ids, input.theme)} ${lowerBody(layout, ids)}
      ${layout.induction
        ? inductionTop(layout, ids, screenActive(ovens, display), reducedMotion)
        : gasTop(layout, ids)}
      ${upperBand(layout, ids)}
      ${layout.doors.map((door) =>
        ovens[door.slot.prefix]?.door_open
          ? nothing
          : closedDoor(layout, ids, door, ovens[door.slot.prefix] ?? null, reducedMotion),
      )}
      ${controlPanel(layout, ids, input.appearance.knobs, ovens, display, reducedMotion, input.t)}
      ${layout.doors.map((door) =>
        ovens[door.slot.prefix]?.door_open
          ? openDoor(layout, ids, door, ovens[door.slot.prefix] ?? null, reducedMotion)
          : nothing,
      )}
    </g>
    ${input.state.available ? readouts(layout, ids, ovens, labelScale(box.h, input.pixelHeight), reducedMotion) : nothing}
  </svg>`;
};

/** Each oven's readout, over its window or, with the door down, over the opening. */
function readouts(layout: RangeLayout, ids: Ids, ovens: Ovens, scale: number, reducedMotion: boolean) {
  const style = { shadow: ids.url("pill-shadow") };
  return layout.doors.map((door) => {
    const state = ovens[door.slot.prefix] ?? null;
    const content = ovenReadout(state);
    if (!content) return nothing;
    let zone;
    if (state?.door_open) {
      const { ox0, ox1, oy0, oy1 } = openingBox(layout, door);
      zone = { x0: ox0, y0: oy0, x1: ox1, y1: oy1 };
    } else {
      const glass = windowBox(layout, door.x0, door.x1, layout.floorY - layout.levels.doorTop);
      zone = { x0: glass.gx0, y0: glass.gy0, x1: glass.gx1, y1: glass.gy1 };
    }
    return zoneReadout(style, zone, content, scale, reducedMotion);
  });
}

/** What the drawing shows, for screen readers, e.g. "Range, right oven: heating 350°, left oven: off". */
function ariaLabel(t: Translate, layout: RangeLayout, state: DrawingState): string {
  const ovens = layout.doors.map((door) => ({ position: door.slot.position, state: state.ovens?.[door.slot.prefix] }));
  return spoken(t, [
    t(layout.induction ? "drawing.range_induction" : "drawing.range"),
    state.available ? null : t("drawing.offline"),
    ...ovenWords(t, ovens, state.display),
  ]);
}
