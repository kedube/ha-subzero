import { html, nothing, svg, type SVGTemplateResult } from "lit";
import { n, type Camera, type Rect } from "./refrigeration/geometry";
import { cavity, crisperBins } from "./refrigeration/interior";
import { buildLayout, type Front, type Layout } from "./refrigeration/layout";
import { defs, finishOf, type Scene } from "./refrigeration/materials";
import { pulledDrawer, swungDoor, type OpenFront } from "./refrigeration/open";
import {
  badge,
  cabinet,
  closedFront,
  floorShadow,
  handleDiameter,
  handlePlacement,
  kick,
  LABEL_H,
  readout,
  sideHinges,
  top,
  type IceMark,
} from "./refrigeration/parts";
import type { DrawingInput, DrawingRenderer, DrawingState } from "./types";

/** Room above the cabinet and beside a closed one, and beyond the farthest point of an open door. */
const HEADROOM = 10;
const SIDE = 26;
const MARGIN = 10;
/**
 * The floor line's height above the drawing's bottom edge, as a share of the drawing, as in the
 * other modules: cards fit every drawing to one height, so a row of them lines up.
 */
const FLOOR = 0.03;

/**
 * Sub-Zero refrigeration: every form in RefrigerationSpec, drawn as a product rendering in
 * true proportions (see refrigeration/layout.ts for the measurements and for which state key
 * opens which door or drawer).
 */
export const renderRefrigeration: DrawingRenderer = (input) => {
  if (input.spec.family !== "refrigeration") return null;
  const layout = buildLayout(input.spec);
  const scene = sceneFor(input, layout);
  const state = input.state;
  const open = layout.fronts.map((front) => front.keys.some((key) => state.doors[key] === true));

  const backs: SVGTemplateResult[] = [];
  const fronts: SVGTemplateResult[] = [];
  const closed: SVGTemplateResult[] = [];
  const parts = new Map<number, OpenFront>();
  const drawnCavities = new Set<number>();

  layout.fronts.forEach((front, index) => {
    if (!open[index]) {
      closed.push(closedFront(scene, front, index, state));
      return;
    }
    const part = openFront(scene, front, index, state);
    parts.set(index, part);
    if (front.kind === "door") {
      // French doors share one interior: draw its opening once, across both doors.
      if (!drawnCavities.has(front.cavityId)) {
        drawnCavities.add(front.cavityId);
        const sharing = layout.fronts.filter((f) => f.cavityId === front.cavityId);
        backs.push(opening(union(sharing.map((f) => f.rect)), front));
        backs.push(cavity(scene, front, { glass: false, state }));
      }
    } else {
      backs.push(part.back);
    }
    fronts.push(part.front);
  });

  // The viewBox holds still while doors open: centered on the cabinet, and as wide and tall as
  // the fronts need when open, so a card or the full view shows the cabinet at one size and in
  // one place whatever the doors do.
  const { reach, y0, y1 } = openExtent(scene, layout, state, parts);
  const box = { x: -reach, y: y0, w: layout.w + 2 * reach, h: y1 - y0 };
  const ui = unitsPerPixel(box.h, input.pixelHeight);

  const lightPools = layout.fronts
    .filter((front, index) => open[index] && front.kind === "door")
    .map(
      (front) =>
        svg`<ellipse cx=${n(front.rect.x + front.rect.w / 2)} cy=${n(layout.h + 1)} rx=${n(front.rect.w * 0.75)} ry=${n((y1 - layout.h) * 0.7)} fill=${scene.ref("pool")} />`,
    );

  const offline = !state.available;
  const label = ariaLabel(layout, open, state);
  return html`<svg
    viewBox=${[box.x, box.y, box.w, box.h].map(n).join(" ")}
    preserveAspectRatio="xMidYMax meet"
    role="img"
    aria-label=${label}
    xmlns="http://www.w3.org/2000/svg"
  >
    ${defs(scene)}
    ${input.reducedMotion ? nothing : svg`<style>${`.${scene.id("readout")}{transition:opacity .25s ease}`}</style>`}
    ${floorShadow(scene, box.h)}
    ${lightPools}
    <g filter=${offline ? scene.ref("offline") : nothing} opacity=${offline && scene.theme === "dark" ? 0.85 : 1}>
      ${cabinet(scene)}
      ${top(scene)}
      ${kick(scene)}
      ${sideHinges(scene)}
      ${closed}
      ${backs}
      ${fronts}
    </g>
    <g opacity=${offline ? 0.7 : 1}>${readouts(scene, layout, open, parts, state, ui)}</g>
  </svg>`;
};

function sceneFor(input: DrawingInput, layout: Layout): Scene {
  // Several drawings share one shadow root, so every id carries the uid (kept id-safe).
  const uid = input.uid.replace(/[^A-Za-z0-9_-]/g, "_") || "rf";
  // The eye: a product photo's for full-size units, so doors swing in mild perspective. For
  // undercounter drawers it's a standing person's, so a pulled drawer is seen from above; for
  // undercounter doors it's level with the door's middle, as in the photos, which keeps a
  // swung door above the floor line.
  const drawers = layout.fronts.some((front) => front.kind === "drawer");
  const camera: Camera = !layout.undercounter
    ? { cx: layout.w / 2, cy: layout.h - 470, d: 2200 }
    : drawers
      ? { cx: layout.w / 2, cy: layout.h - 560, d: 2200 }
      : { cx: layout.w / 2, cy: layout.span.y1 / 2, d: 2200 };
  const inside: Camera = { ...camera, d: layout.undercounter ? 1000 : 1150 };
  return {
    id: (name) => `${uid}-${name}`,
    ref: (name) => `url(#${uid}-${name})`,
    layout,
    finish: finishOf(input.appearance),
    handle: input.appearance.handle,
    camera,
    inside,
    theme: input.theme,
  };
}

function openFront(s: Scene, front: Front, index: number, state: DrawingState): OpenFront {
  return front.kind === "door" ? swungDoor(s, front, index) : pulledDrawer(s, front, index, state);
}

/**
 * The drawing's extent with every front that can open shown open, so opening one never moves
 * or rescales the drawing: how far it reaches past either side of the cabinet, its top and
 * bottom, and the floor line at the share of the height the other modules use.
 */
function openExtent(
  s: Scene,
  layout: Layout,
  state: DrawingState,
  opened: Map<number, OpenFront>,
): { reach: number; y0: number; y1: number } {
  let reach = SIDE;
  let y0 = -HEADROOM;
  let y1 = layout.h;
  layout.fronts.forEach((front, index) => {
    if (!front.keys.length) return;
    for (const [x, y] of (opened.get(index) ?? openFront(s, front, index, state)).points) {
      reach = Math.max(reach, -x + MARGIN, x - layout.w + MARGIN);
      y0 = Math.min(y0, y - 6);
      y1 = Math.max(y1, y + 2);
    }
  });
  return { reach, y0, y1: Math.max(y1, layout.h + (FLOOR * (layout.h - y0)) / (1 - FLOOR)) };
}

/**
 * Drawing units per CSS pixel of UI: from the height the drawing is shown at when the caller
 * knows it, else text at 3% of the drawing's height. A label never takes more than an eighth
 * of a thumbnail's height.
 */
function unitsPerPixel(viewHeight: number, pixelHeight?: number): number {
  const most = (0.125 * viewHeight) / LABEL_H;
  if (pixelHeight && pixelHeight > 0) return Math.min(viewHeight / pixelHeight, most);
  return (0.03 * viewHeight) / 12;
}

function union(rects: Rect[]): Rect {
  const x0 = Math.min(...rects.map((r) => r.x));
  const y0 = Math.min(...rects.map((r) => r.y));
  const x1 = Math.max(...rects.map((r) => r.x + r.w));
  const y1 = Math.max(...rects.map((r) => r.y + r.h));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/** The cabinet's face flange around an open door's opening. */
function opening(r: Rect, front: Front): SVGTemplateResult {
  const dark = front.contents === "wine" || front.contents === "beverage" || front.contents === "ice";
  return svg`<rect x=${n(r.x)} y=${n(r.y)} width=${n(r.w)} height=${n(r.h)} fill=${dark ? "#2a2522" : "#dfe4e6"} />
    <rect x=${n(r.x)} y=${n(r.y)} width=${n(r.w)} height=${n(r.h)} fill="none" stroke="#000" stroke-opacity="0.25" stroke-width="1.2" />`;
}

function iceMark(state: DrawingState): IceMark {
  if (!state.ice?.on) return null;
  return state.ice.mode === "max" ? "max" : state.ice.mode === "night" ? "night" : "on";
}

interface Spot {
  x: number;
  y: number;
}

/**
 * Zone readouts: frosted labels in the upper part of each zone, clear of handles, knobs and
 * displays. `ui` is drawing units per CSS pixel of label.
 */
function readouts(
  s: Scene,
  layout: Layout,
  open: boolean[],
  parts: Map<number, OpenFront>,
  state: DrawingState,
  ui: number,
): SVGTemplateResult[] {
  const pill = LABEL_H * ui;
  const out: SVGTemplateResult[] = [];
  layout.fronts.forEach((front, index) => {
    const r = front.rect;
    // Doors: centered in the clear area beside the handle; drawers and windows: centered.
    const handleSide = front.kind === "door" ? (front.hinge === "left" ? 1 : -1) : 0;
    const clearX = r.x + r.w / 2 - handleSide * 18;
    // On an open door, the label moves onto the lit interior.
    const inside = open[index] && front.kind === "door" ? onInterior(front, pill) : null;
    for (const zone of front.zones) {
      const text = state.readouts[zone.zone];
      if (!text || (zone.openOnly && !open[index])) continue;
      const spot: Spot = zone.openOnly
        ? onCrisper(s, front, pill)
        : front.kind === "drawer"
          ? belowPulled(underHandle(s, front, parts.get(index), pill), front, parts, pill)
          : zone.top !== undefined
            ? { x: zone.x ?? clearX, y: zone.top + 0.8 * pill }
            : (inside ?? { x: zone.x ?? clearX, y: r.y + r.h * (zone.at ?? 0.15) });
      const mark = front.ice && zone.zone === "frz" ? iceMark(state) : null;
      out.push(readout(s, spot.x, spot.y, text, ui, mark));
    }
    if (front.contents === "ice" && state.ice_maker) {
      const icon = state.ice_maker.cleaning ? "cleaning" : state.ice_maker.paused ? "paused" : state.ice_maker.making ? "making" : null;
      const spot = inside ?? { x: clearX, y: r.y + r.h * 0.2 };
      if (icon) out.push(badge(s, spot.x, spot.y, ui, icon));
    }
  });
  return out;
}

/** Just under a drawer's handle; a pulled drawer carries its label along. */
function underHandle(s: Scene, front: Front, part: OpenFront | undefined, pill: number): Spot {
  const r = front.rect;
  const p = handlePlacement(s, front);
  const below = p ? p.y - r.y + handleDiameter(s) / 2 : r.h * 0.12;
  const m = part?.moved ?? { ...r, k: 1 };
  return { x: m.x + (r.w / 2) * m.k, y: m.y + below * m.k + 0.25 * pill + pill / 2 };
}

/** Moved down past any drawer pulled out over this one, which hides its handle. */
function belowPulled(spot: Spot, front: Front, parts: Map<number, OpenFront>, pill: number): Spot {
  let y = spot.y;
  for (const part of parts.values()) {
    const m = part.moved;
    if (!m || m.y >= front.rect.y) continue;
    const bottom = m.y + m.h;
    if (bottom > y - pill / 2) y = bottom + 0.25 * pill + pill / 2;
  }
  return { x: spot.x, y };
}

/** Centered near the top of an open door's interior. */
function onInterior(front: Front, pill: number): Spot {
  const c = front.cavity;
  return { x: c.x + c.w / 2, y: c.y + Math.max(pill, 0.1 * c.h) };
}

/** On the top crisper's left third, clear of its handle in the middle. */
function onCrisper(s: Scene, front: Front, pill: number): Spot {
  const [bin] = crisperBins(s, front);
  if (!bin) return { x: front.cavity.x + front.cavity.w / 2, y: front.cavity.y + front.cavity.h * 0.8 };
  return { x: bin.x + bin.w / 6, y: bin.y + 0.8 * pill };
}

function ariaLabel(layout: Layout, open: boolean[], state: DrawingState): string {
  const names = new Set<string>();
  layout.fronts.forEach((front, index) => {
    if (open[index]) names.add(`${front.name} open`);
  });
  const parts = [layout.name, ...names];
  if (!state.available) parts.push("offline");
  return parts.join(", ");
}
