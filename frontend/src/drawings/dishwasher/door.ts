import { nothing, svg, type SVGTemplateResult } from "lit";
import {
  barHandle,
  type BarStyle,
  type Defs,
  outline,
  painted,
  panelTone,
  polyPath,
  shade,
  stainless,
} from "../generic/materials";

/**
 * The Cove door: Cove's stainless door panel kit with a tubular or pro handle, or a custom
 * cabinet panel. Measurements from the DW2450 design guide: a 23 3/4″ × 30 3/8″ panel in a
 * 24″ opening, over a 4″ toe kick with a 1/8″ reveal under the countertop. Handles are
 * 21 1/4″ (tubular) and 19 1/2″ (pro) long, centered about 1.6″ below the top edge.
 */

export const DW_HEIGHT = 345;
export const KICK_HEIGHT = 40;
export const DOOR_TOP = 1.25;
export const DOOR_BOTTOM = DW_HEIGHT - KICK_HEIGHT;
export const PANEL_HEIGHT = DOOR_BOTTOM - DOOR_TOP;
/** Each side of the 23 3/4″ panel in a 24″ opening. */
export const PANEL_INSET = 1.25;

export type Front =
  | { kind: "stainless"; handle: BarStyle | null }
  | { kind: "panel"; color: [number, number, number]; handle: BarStyle | null };

/**
 * Where a point on the door lands in the drawing. The door's own coordinates are u across
 * from its left edge and v down from its top edge, in drawing units.
 */
export interface DoorView {
  at(u: number, v: number): [number, number];
  /** How far something standing `depth` in front of the door drops on screen, per unit. */
  lift: number;
  width: number;
  height: number;
}

/** The closed door, straight on. */
export function closedView(width: number): DoorView {
  const pw = width - 2 * PANEL_INSET;
  return {
    at: (u, v) => [PANEL_INSET + u, DOOR_TOP + v],
    lift: 0,
    width: pw,
    height: PANEL_HEIGHT,
  };
}

/**
 * The door swung down about its bottom hinge by `angle`, seen from a little above: it
 * foreshortens, and its top edge, now nearer the viewer, widens slightly.
 */
export function openView(width: number, angle: number, widen = 0.06): DoorView {
  const pw = width - 2 * PANEL_INSET;
  const cos = Math.cos(angle);
  const cx = width / 2;
  return {
    at: (u, v) => {
      const rise = PANEL_HEIGHT - v;
      const scale = 1 + widen * (rise / PANEL_HEIGHT);
      return [cx + (u - pw / 2) * scale, DOOR_BOTTOM - rise * cos];
    },
    lift: Math.sin(angle),
    width: pw,
    height: PANEL_HEIGHT,
  };
}

/** A rectangle in door coordinates as a (possibly foreshortened) quadrilateral path. */
export function quad(view: DoorView, u0: number, v0: number, u1: number, v1: number): string {
  return polyPath([view.at(u0, v0), view.at(u1, v0), view.at(u1, v1), view.at(u0, v1)]);
}

/**
 * The door's folded edges: a bright top edge, the sides falling off into a thin dark line (the
 * left one barely lit), and a shadowed bottom edge.
 */
function edgeLight(view: DoorView, strength: number): SVGTemplateResult {
  const { width: w, height: h } = view;
  return svg`
    <path d=${quad(view, 0, 0, w, 0.9)} fill="#ffffff" opacity=${0.75 * strength} />
    <path d=${quad(view, 0, 0.9, w, 2.2)} fill="#ffffff" opacity=${0.18 * strength} />
    <path d=${quad(view, 0, 0, 0.8, h)} fill="#ffffff" opacity=${0.12 * strength} />
    <path d=${quad(view, 0.8, 0, 2, h)} fill="#000000" opacity=${0.05 * strength} />
    <path d=${quad(view, w - 0.9, 0, w, h)} fill="#000000" opacity=${0.22 * strength} />
    <path d=${quad(view, w - 2.2, 0, w - 0.9, h)} fill="#000000" opacity=${0.06 * strength} />
    <path d=${quad(view, 0, h - 1, w, h)} fill="#000000" opacity=${0.32 * strength} />
    ${outline(quad(view, 0, 0, w, h), 0.4, 0.55)}
  `;
}

function handleOn(d: Defs, view: DoorView, style: BarStyle, v: number): SVGTemplateResult {
  const length = Math.min(style === "pro" ? 195 : 212.5, view.width - 16);
  const inset = (view.width - length) / 2;
  // Pro brackets stand the bar about 2.4″ off the door, tubular standoffs about 1.8″.
  const depth = style === "pro" ? 24 : 18;
  const [x1, y] = view.at(inset, v);
  const [x2] = view.at(view.width - inset, v);
  const drop = depth * view.lift;
  return barHandle(d, x1, x2, y + drop, style, drop);
}

/**
 * A door tilted toward the viewer, as in Cove's photo of the open door: a narrow shadow under
 * the control strip's lip, the upper middle catching the most light, darker toward the hinge.
 */
function tiltShade(d: Defs, view: DoorView): SVGTemplateResult | typeof nothing {
  if (!view.lift) return nothing;
  return svg`
    <defs>
      <linearGradient id=${d.id("tilt")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000" stop-opacity="0.22" />
        <stop offset="0.04" stop-color="#000" stop-opacity="0.04" />
        <stop offset="0.3" stop-color="#fff" stop-opacity="0.06" />
        <stop offset="1" stop-color="#000" stop-opacity="0.08" />
      </linearGradient>
    </defs>
    <path d=${quad(view, 0, 0, view.width, view.height)} fill=${d.url("tilt")} />
  `;
}

/** Cove's stainless door: a brushed slab with folded edges, and the chosen handle. */
function stainlessDoor(d: Defs, view: DoorView, handle: BarStyle | null): SVGTemplateResult {
  const { width: w, height: h } = view;
  return svg`
    ${stainless(d, quad(view, 0, 0, w, h), { dim: view.lift ? 0.1 * view.lift : 0 })}
    ${tiltShade(d, view)}
    ${edgeLight(view, 1)}
    ${handle ? handleOn(d, view, handle, 16) : nothing}
  `;
}

/**
 * A custom cabinet panel in the owner's color: a flat slab, as on Cove's panel-ready photo
 * and the refrigeration module's panel fronts, with a 1/8″ eased edge catching the light along
 * its top and left. The handle sits where Cove's stainless kit puts it.
 */
function panelDoor(
  d: Defs,
  view: DoorView,
  color: [number, number, number],
  handle: BarStyle | null,
): SVGTemplateResult {
  const { width: w, height: h } = view;
  const dim = view.lift ? 0.1 * view.lift : 0;
  return svg`
    ${painted(d, "panel", quad(view, 0, 0, w, h), color, { dim })}
    ${tiltShade(d, view)}
    <path d=${quad(view, 0, 0, w, 0.5)} fill="#fff" opacity="0.3" />
    <path d=${quad(view, 0, 0.5, 0.5, h)} fill="#fff" opacity="0.3" />
    <path d=${quad(view, 0.5, h - 0.5, w, h)} fill="#000" opacity="0.2" />
    <path d=${quad(view, w - 0.5, 0.5, w, h - 0.5)} fill="#000" opacity="0.2" />
    ${outline(quad(view, 0, 0, w, h), 0.3, 0.4)}
    ${handle ? handleOn(d, view, handle, 16) : nothing}
  `;
}

export function door(d: Defs, view: DoorView, front: Front): SVGTemplateResult {
  return front.kind === "stainless"
    ? stainlessDoor(d, view, front.handle)
    : panelDoor(d, view, front.color, front.handle);
}

/**
 * The toe kick under the door: Cove's stainless kickplate, a touch darker than the door with a
 * thin bright line along its top, or the cabinetry's own kick in a shadowed tone of the panel.
 * The line also keeps a black kick apart from a dark page.
 */
export function toeKick(d: Defs, width: number, front: Front): SVGTemplateResult {
  const x = 6;
  const w = width - 12;
  const y = DOOR_BOTTOM;
  const h = KICK_HEIGHT;
  const path = `M${x} ${y}h${w}v${h}h${-w}Z`;
  return svg`
    ${front.kind === "stainless"
      ? stainless(d, path, { dim: 0.08 })
      : svg`<path d=${path} fill=${shade(panelTone(front.color), -0.22)} />`}
    <rect x=${x} y=${y} width=${w} height="5" fill=${d.url("ao-down")} opacity="0.3" />
    <rect x=${x} y=${y + 0.1} width=${w} height="0.6" fill="#fff" opacity="0.5" />
    <rect x=${x} y=${y + h - 0.8} width=${w} height="0.8" fill="#000" opacity="0.35" />
    <rect x=${x} y=${y} width="0.7" height=${h} fill="#000" opacity="0.2" />
    <rect x=${x + w - 0.7} y=${y} width="0.7" height=${h} fill="#000" opacity="0.25" />
  `;
}

/** The 1/8″ reveal under the countertop, where the dark frame behind the door shows. */
export function topReveal(width: number): SVGTemplateResult {
  return svg`<rect x=${PANEL_INSET + 0.5} y="0" width=${width - 2 * PANEL_INSET - 1} height=${DOOR_TOP}
    fill="#2b2c2d" opacity="0.55" />`;
}
