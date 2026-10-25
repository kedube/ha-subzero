import { nothing, svg, type SVGTemplateResult } from "lit";
import type { KnobColor, OvenSlot } from "../../types";
import { dishwasherBody, floorLight } from "../dishwasher";
import { DW_HEIGHT } from "../dishwasher/door";
import { dishwasherOverlay, dishwasherWords, doorOpen, FLOOR_LIGHT } from "../dishwasher/status";
import { KNOB_PALETTE } from "../range/materials";
import type { DrawingState, OvenState } from "../types";
import {
  barHandle,
  bevel,
  blackGlass,
  type Defs,
  type FaceOptions,
  kickGrille,
  outline,
  polyPath,
  rectPath,
  stainless,
  vBarHandle,
} from "./materials";
import { LABEL_H, labelScale, statusRow } from "./overlay";

/**
 * Plain, model-agnostic drawings for an appliance the panel knows only the type of: true
 * proportions for the type and a few telltale details, in the same materials as the
 * detailed drawings, so they never look like placeholders.
 */

export interface FormContext {
  d: Defs;
  state: DrawingState;
  knobs: KnobColor;
  reducedMotion: boolean;
  /** The drawing's height on screen in CSS pixels, when the caller knows it: labels use it. */
  pixelHeight?: number;
}

export interface Drawn {
  /** Width and height in 0.1″ units; floor-standing appliances stand on y = height. */
  width: number;
  height: number;
  /** Room left under the appliance in the viewBox, e.g. for the light a hood casts. */
  below: number;
  /** Stands on the floor (gets a contact shadow) rather than hanging in a wall. */
  floor: boolean;
  body: SVGTemplateResult;
  /** Drawn over the body, outside the offline filter: lights and UI labels. */
  over?: SVGTemplateResult | typeof nothing;
  /** English description for the aria-label. */
  label: string[];
}

/** Room above every drawing, where an open door's nearer edge can rise. */
export const HEADROOM = 10;

/** The viewBox height renderGeneric gives a drawing: the appliance, the room under it, margins. */
export function viewHeight(drawn: Pick<Drawn, "height" | "below" | "floor">): number {
  return drawn.height + drawn.below + (drawn.floor ? 16 : 8) + HEADROOM;
}

/** How much to scale UI labels in a drawing of this size (see `labelScale`). */
function uiScale(c: FormContext, height: number, below: number, floor: boolean): number {
  return labelScale(viewHeight({ height, below, floor }), c.pixelHeight);
}

const n = (value: number) => Math.round(value * 100) / 100;

/** A flush stainless door or drawer front with folded, lit edges. */
function slab(d: Defs, x: number, y: number, w: number, h: number, options: FaceOptions = {}): SVGTemplateResult {
  return svg`
    ${stainless(d, rectPath(x, y, w, h), options)}
    ${bevel(x, y, w, h, 0.9)}
    ${outline(rectPath(x, y, w, h), 0.4, 0.5)}
  `;
}

/** A gap between doors: a dark shadow line with the lower door's lit top edge under it. */
function gapH(x: number, y: number, w: number): SVGTemplateResult {
  return svg`
    <rect x=${x} y=${y - 0.9} width=${w} height="1.8" fill="#1d1e1f" opacity="0.85" />
    <rect x=${x} y=${y + 0.9} width=${w} height="0.6" fill="#ffffff" opacity="0.55" />`;
}

/** A gap between side-by-side doors. */
function gapV(x: number, y: number, h: number): SVGTemplateResult {
  return svg`<rect x=${x - 0.9} y=${y} width="1.8" height=${h} fill="#1d1e1f" opacity="0.85" />`;
}

/** A flush drawer front with a tubular handle `handleY` below its top. */
function drawerFront(d: Defs, x: number, y: number, w: number, h: number, handleY: number): SVGTemplateResult {
  const inset = Math.min(30, w * 0.09);
  return svg`${slab(d, x, y, w, h)}${barHandle(d, x + inset, x + w - inset, y + handleY, "tubular")}`;
}

interface Pulled {
  body: SVGTemplateResult;
  /** Where a point on the closed front lands once the drawer is pulled out. */
  at(px: number, py: number): [number, number];
}

type BinContents = "produce" | "freezer";

/**
 * What shows over a pulled drawer's front, between x0 and x1 and from `top` down (the front
 * hides the rest): fruit and greens in a refrigerator drawer, frosted packs in a freezer.
 */
function binContents(
  d: Defs,
  key: string,
  kind: BinContents,
  x0: number,
  x1: number,
  top: number,
  bottom: number,
): SVGTemplateResult {
  const band = bottom - top;
  // A fixed jitter, so a drawer is stocked the same way every time.
  const jitter = (i: number) => ((i * 7919 + 104729) % 997) / 997;
  const items: SVGTemplateResult[] = [];
  if (kind === "freezer") {
    const fills = ["#eef3f6", "#d3dfe7", "#e4ddd0", "#c2d1dc"];
    for (let i = 0, x = x0 + 3; x < x1 - 12; i++) {
      const w = Math.min(24 + 18 * jitter(i), x1 - x - 2);
      const t = top + band * (0.22 + 0.38 * jitter(i + 5));
      items.push(svg`
        <rect x=${n(x)} y=${n(t)} width=${n(w)} height=${n(bottom - t + 12)} rx="2.2" fill=${fills[i % 4]} />
        <rect x=${n(x + w - 3)} y=${n(t + 1)} width="3" height=${n(bottom - t + 10)} rx="1.5" fill="#000"
          opacity="0.1" />
        <rect x=${n(x + 1.5)} y=${n(t + 0.8)} width=${n(w - 4)} height="1" rx="0.5" fill="#fff" opacity="0.75" />`);
      x += w + 2.5;
    }
  } else {
    // Two loose rows, the back one smaller and in shadow: each piece a gradient and its half
    // width and height (greens and cucumbers longer than apples, lemons and oranges).
    const kinds: Array<[string, number, number]> = [
      ["fruit-r", 7.5, 6.8],
      ["fruit-g", 13, 7.5],
      ["fruit-o", 6.8, 6.2],
      ["fruit-c", 14, 4.4],
      ["fruit-y", 6.4, 5.2],
      ["fruit-r", 7, 6.4],
      ["fruit-g", 11, 7],
    ];
    for (const row of [0, 1]) {
      const s = row ? 1 : 0.8;
      for (let i = row * 3, x = x0 + 2 + row * 5; x < x1 - 8; i++) {
        const [fill, hw, hh] = kinds[i % kinds.length];
        const size = s * (0.88 + 0.24 * jitter(i + 11));
        const rx = hw * size;
        const ry = hh * size;
        const cx = x + rx;
        const cy = top + band * (row ? 0.42 + 0.16 * jitter(i + 2) : 0.08 + 0.14 * jitter(i + 4)) + ry;
        // Greens are matte with a few veins; fruit carries a soft highlight.
        const veins =
          `M${n(cx - rx * 0.7)} ${n(cy + ry * 0.1)}Q${n(cx)} ${n(cy - ry * 0.5)} ${n(cx + rx * 0.7)} ${n(cy)}` +
          `M${n(cx - rx * 0.2)} ${n(cy - ry * 0.25)}L${n(cx - rx * 0.05)} ${n(cy + ry * 0.6)}`;
        const finish =
          fill === "fruit-g"
            ? svg`<path d=${veins} fill="none" stroke="#d6e6a8" stroke-opacity="0.45" stroke-width="0.6" />`
            : svg`<ellipse cx=${n(cx - rx * 0.32)} cy=${n(cy - ry * 0.42)} rx=${n(rx * 0.22)} ry=${n(ry * 0.13)}
                fill="#fff" opacity=${row ? 0.22 : 0.12} />`;
        const shadowed = row
          ? nothing
          : svg`<ellipse cx=${n(cx)} cy=${n(cy)} rx=${n(rx)} ry=${n(ry)} fill="#000" opacity="0.18" />`;
        items.push(svg`
          <ellipse cx=${n(cx + 1)} cy=${n(cy + 1.6)} rx=${n(rx)} ry=${n(ry)} fill="#000" opacity="0.16" />
          <ellipse cx=${n(cx)} cy=${n(cy)} rx=${n(rx)} ry=${n(ry)} fill=${d.url(`${fill}-${key}`)} />
          ${finish}${shadowed}`);
        x += 2 * rx - 2 + 3 * jitter(i + 7);
      }
    }
  }
  const fruit = (name: string, light: string, base: string, dark: string) => svg`
    <radialGradient id=${d.id(`${name}-${key}`)} cx="0.38" cy="0.32" r="0.75">
      <stop offset="0" stop-color=${light} />
      <stop offset="0.55" stop-color=${base} />
      <stop offset="1" stop-color=${dark} />
    </radialGradient>`;
  return svg`
    ${kind === "produce"
      ? svg`<defs>
          ${fruit("fruit-r", "#c4493d", "#962c24", "#5c1712")}
          ${fruit("fruit-g", "#a3bf6a", "#6b8f3c", "#3a5722")}
          ${fruit("fruit-y", "#ead36d", "#c9a63a", "#85681c")}
          ${fruit("fruit-o", "#e9a456", "#c27326", "#7a4311")}
          ${fruit("fruit-c", "#6f9450", "#3f6630", "#21391a")}
        </defs>`
      : nothing}
    ${items}
  `;
}

/**
 * A drawer pulled out a few inches, seen from slightly above, the way the refrigeration
 * drawings show one: its front comes forward, a touch larger and lower, uncovering the
 * cool-lit drawer between side walls that run back into the dark opening, and casts a soft
 * shadow on what's below it. `front` is the closed front at (x, y), `w` by `h`.
 */
function pulledDrawer(
  d: Defs,
  key: string,
  x: number,
  y: number,
  w: number,
  h: number,
  front: SVGTemplateResult,
  contents: BinContents,
): Pulled {
  const k = 1.04;
  const drop = Math.round(Math.min(26, Math.max(14, h * 0.15)));
  const mx = x - ((k - 1) * w) / 2;
  const my = y + drop;
  const mw = w * k;
  const mh = h * k;
  const inset = 5;
  const wall = 4.5;
  const backY = y + 3;
  const frontY = my + 0.6;
  const [bl, br] = [x + inset + 3, x + w - inset - 3];
  const [fl, fr] = [mx + 5 * k, mx + mw - 5 * k];
  const floor = polyPath([
    [bl + wall, backY],
    [br - wall, backY],
    [fr - wall * k, frontY],
    [fl + wall * k, frontY],
  ]);
  // The left wall; the right one is its mirror image about the drawer's center.
  const sideL = polyPath([[bl, backY], [bl + wall, backY], [fl + wall * k, frontY], [fl, frontY]]);
  const rib = (bl + br) / 2;
  const ribFront = (fl + fr) / 2;
  const moved = `translate(${n(mx)} ${n(my)}) scale(${k}) translate(${n(-x)} ${n(-y)})`;
  return {
    body: svg`
      <defs>
        <linearGradient id=${d.id(`bin-${key}`)} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#9eabb4" />
          <stop offset="0.45" stop-color="#dfe6eb" />
          <stop offset="1" stop-color="#f1f5f7" />
        </linearGradient>
        <linearGradient id=${d.id(`bin-side-${key}`)} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#c3ccd2" />
          <stop offset="1" stop-color="#8d9aa3" />
        </linearGradient>
        <clipPath id=${d.id(`bin-clip-${key}`)}><path d=${floor} /></clipPath>
      </defs>
      <rect x=${x} y=${y} width=${w} height=${h} fill="#232527" />
      <rect x=${x + inset} y=${y + 2.5} width=${w - 2 * inset} height=${h - 4} fill="#0f1011" />
      <path d=${floor} fill=${d.url(`bin-${key}`)} />
      <path d=${`M${n(rib)} ${n(backY)}L${n(ribFront)} ${n(frontY)}`} stroke="#8796a0" stroke-width="1.6" />
      <path d=${`M${n(rib - 0.8)} ${n(backY)}L${n(ribFront - 0.8)} ${n(frontY)}`} stroke="#fff" stroke-opacity="0.6"
        stroke-width="0.5" />
      <g clip-path=${d.url(`bin-clip-${key}`)}>
        ${binContents(d, key, contents, bl + wall, br - wall, backY + 2, frontY)}
      </g>
      <rect x=${x + inset} y=${backY} width=${w - 2 * inset} height="5" fill="#000" opacity="0.28" />
      <path d=${sideL} fill=${d.url(`bin-side-${key}`)} />
      <path d=${sideL} fill=${d.url(`bin-side-${key}`)} transform=${`translate(${n(br + bl)} 0) scale(-1 1)`} />
      <path d=${`M${n(bl)} ${n(backY)}L${n(fl)} ${n(frontY)}M${n(br)} ${n(backY)}L${n(fr)} ${n(frontY)}`}
        stroke="#fff" stroke-opacity="0.6" stroke-width="0.8" />
      <rect x=${n(mx + 6)} y=${n(my + mh - 5)} width=${n(mw - 12)} height="11" fill="#000" opacity="0.34"
        filter=${d.url("blur-m")} />
      <g transform=${moved}>${front}</g>
    `,
    at: (px, py) => [mx + (px - x) * k, my + (py - y) * k],
  };
}

/** The cool-lit cabinet behind an open door: liner, glass shelves, a shadow under the top. */
function cabinet(
  d: Defs,
  key: string,
  x: number,
  y: number,
  w: number,
  h: number,
  shelves: number[],
): SVGTemplateResult {
  const wall = Math.min(16, w * 0.06);
  const inset = h * 0.025;
  return svg`
    <defs>
      <linearGradient id=${d.id(`liner-${key}`)} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#eef3f6" />
        <stop offset="1" stop-color="#c9d3da" />
      </linearGradient>
    </defs>
    <rect x=${x} y=${y} width=${w} height=${h} fill=${d.url(`liner-${key}`)} />
    <path d=${polyPath([[x, y], [x + wall, y + inset], [x + wall, y + h - inset], [x, y + h]])} fill="#9fadb7"
      opacity="0.55" />
    <path d=${polyPath([[x + w, y], [x + w - wall, y + inset], [x + w - wall, y + h - inset], [x + w, y + h]])}
      fill="#ffffff" opacity="0.4" />
    ${shelves.map(
      (f) => svg`
        <rect x=${x + wall} y=${n(y + h * f - 5)} width=${w - 2 * wall} height="5" fill="#ffffff" opacity="0.22" />
        <rect x=${x + 1} y=${n(y + h * f)} width=${w - 2} height="1.6" fill="#ffffff" opacity="0.85" />
        <rect x=${x + 1} y=${n(y + h * f + 1.6)} width=${w - 2} height="2.2" fill="#6f7f8a" opacity="0.35" />`,
    )}
    <rect x=${x} y=${y} width=${w} height="18" fill=${d.url("ao-down")} opacity="0.6" />
  `;
}

type HandleKind = "v" | "h" | null;

/**
 * A side-hinged door swung open about 70° toward the viewer, the way a product photo shows an
 * open door: its face narrowed toward the hinge and turned from the light, its 2″ edge facing
 * out with the gasket behind it, and its nearer free edge a touch taller. `inside` is what
 * the opening shows; the door is drawn over it.
 */
function swungDoor(
  d: Defs,
  x: number,
  y: number,
  w: number,
  h: number,
  hinge: "left" | "right",
  handle: HandleKind,
  inside: SVGTemplateResult,
  glass = false,
): SVGTemplateResult {
  const cos = 0.34;
  const sin = 0.94;
  const face = w * cos;
  const edge = Math.min(18, w * 0.08);
  const rise = Math.min(h * 0.015, HEADROOM - 1);
  const dir = hinge === "left" ? 1 : -1;
  const hx = hinge === "left" ? x : x + w;
  const fx = hx + dir * face;
  const ex = fx + dir * edge;
  // Height at a point on the face, a fraction t of the way from the hinge to the free edge.
  const top = (t: number) => y - rise * t;
  const bottom = (t: number) => y + h + rise * t;
  const facePath = polyPath([[hx, top(0)], [fx, top(1)], [fx, bottom(1)], [hx, bottom(0)]]);
  const edgePath = polyPath([[fx, top(1)], [ex, top(1)], [ex, bottom(1)], [fx, bottom(1)]]);
  const gasket = polyPath([[ex - dir * 3, top(1)], [ex, top(1)], [ex, bottom(1)], [ex - dir * 3, bottom(1)]]);
  // A handle stands about 2″ off the face; turned with the door, it shifts toward the hinge.
  let grip: SVGTemplateResult | typeof nothing = nothing;
  if (handle === "v") {
    const t = 1 - 14 / w;
    const atFace = hx + dir * face * t;
    const bar = atFace - dir * sin * 22;
    const y1 = y + h * 0.2;
    const y2 = y1 + Math.min(420, h * 0.5);
    grip = svg`
      <path d=${`M${n(atFace)} ${n(y1 + 6)}H${n(bar)}M${n(atFace)} ${n(y2 - 6)}H${n(bar)}`} stroke="#b9b9b7"
        stroke-width="4" />
      ${vBarHandle(d, bar, y1, y2, 8)}`;
  } else if (handle === "h") {
    // Seen nearly end-on, a short bar across the face.
    const x1 = hx + dir * face * (16 / w);
    const x2 = hx + dir * face * (1 - 16 / w);
    grip = svg`<rect x=${n(Math.min(x1, x2))} y=${n(top(0.6) + 15)} width=${n(Math.abs(x2 - x1))} height="6.4"
      rx="3.2" fill=${d.url("chrome")} />`;
  }
  const pane = glass
    ? polyPath([
        [hx + dir * face * 0.1, top(0.1) + 22],
        [hx + dir * face * 0.88, top(0.88) + 22],
        [hx + dir * face * 0.88, bottom(0.88) - 30],
        [hx + dir * face * 0.1, bottom(0.1) - 30],
      ])
    : null;
  return svg`
    ${inside}
    <path d=${polyPath([[ex, y], [ex + dir * 10, y], [ex + dir * 10, y + h], [ex, y + h]])} fill="#000" opacity="0.18"
      filter=${d.url("blur-s")} />
    ${stainless(d, facePath, { dim: 0.14 })}
    ${pane ? svg`<path d=${pane} fill=${d.url("glass")} /><path d=${pane} fill="#16130f" opacity="0.5" />` : nothing}
    <path d=${polyPath([[fx - dir * 1, top(1)], [fx, top(1)], [fx, bottom(1)], [fx - dir * 1, bottom(1)]])}
      fill="#ffffff" opacity="0.5" />
    <path d=${edgePath} fill="#a9abac" />
    <path d=${edgePath} fill=${d.url("ss-falloff")} />
    <path d=${gasket} fill="#2e3032" />
    ${outline(facePath, 0.35, 0.5)}
    ${grip}
  `;
}

function readouts(
  d: Defs,
  state: DrawingState,
  anchors: Array<{ zone: string; cx: number; cy: number }>,
  reducedMotion: boolean,
  scale: number,
): Array<SVGTemplateResult | typeof nothing> {
  if (!state.available || !anchors.length) return [];
  const used = new Set<string>();
  const parts: Array<SVGTemplateResult | typeof nothing> = [];
  let extra = 0;
  for (const [zone, text] of Object.entries(state.readouts)) {
    if (!text) continue;
    let anchor = anchors.find((a) => a.zone === zone && !used.has(a.zone));
    // A zone this form has no place for stacks under the first label.
    if (!anchor) anchor = { ...anchors[0], cy: anchors[0].cy + (LABEL_H + 6) * scale * ++extra };
    used.add(anchor.zone);
    parts.push(statusRow(d, anchor.cx, anchor.cy, { text }, [], reducedMotion, scale));
  }
  return parts;
}

// ---------------------------------------------------------------------------------------------
// Refrigeration

export type FridgeLayout = "column" | "over_under" | "french_door" | "side_by_side" | "undercounter" | "drawers";

/** A built-in refrigerator: flush stainless doors, tubular handles, a louvered toe-kick grille. */
export function refrigerator(c: FormContext, widthIn: number, layout: FridgeLayout): Drawn {
  const { d, state } = c;
  const W = widthIn * 10;
  const short = layout === "undercounter" || layout === "drawers";
  const H = short ? 345 : 840;
  const kick = short ? 40 : 45;
  const doorH = H - kick;
  // An offline appliance's door state is stale: draw its doors closed.
  const open = (...keys: string[]) => state.available && keys.some((key) => state.doors[key]);
  const anyOpen = state.available && Object.values(state.doors).some(Boolean);
  const parts: SVGTemplateResult[] = [kickGrille(d, 5, doorH, W - 10, kick)];
  const anchors: Array<{ zone: string; cx: number; cy: number }> = [];
  const handleLen = Math.min(420, doorH * 0.5);
  const tallShelves = [0.3, 0.52, 0.74];

  if (layout === "column" || layout === "undercounter") {
    if (anyOpen) {
      const shelves = short ? [0.4, 0.7] : tallShelves;
      parts.push(swungDoor(d, 0, 0, W, doorH, "right", short ? "h" : "v", cabinet(d, "door", 0, 0, W, doorH, shelves)));
    } else {
      parts.push(slab(d, 0, 0, W, doorH));
      if (short) parts.push(barHandle(d, 16, W - 16, 18, "tubular"));
      else parts.push(vBarHandle(d, 14, doorH * 0.2, doorH * 0.2 + handleLen));
    }
    anchors.push({ zone: "ref", cx: W / 2, cy: short ? 70 : 150 }, { zone: "frz", cx: W / 2, cy: short ? 70 : 150 });
  } else if (layout === "drawers") {
    const split = doorH / 2;
    const upperH = split - 0.9;
    const lowerY = split + 0.9;
    const lowerH = doorH - lowerY;
    // The lower drawer holds the second zone (ref2, or the freezer of a combination unit).
    const lowerOpen = open("ref2_door_ajar", "frz_door_ajar");
    const upper = drawerFront(d, 0, 0, W, upperH, 18);
    const lower = drawerFront(d, 0, lowerY, W, lowerH, 19);
    const top = anyOpen && (!lowerOpen || open("ref_door_ajar", "door_ajar"))
      ? pulledDrawer(d, "upper", 0, 0, W, upperH, upper, "produce")
      : null;
    const lowerKind = open("frz_door_ajar") || state.readouts.frz ? "freezer" : "produce";
    const bottom = lowerOpen ? pulledDrawer(d, "lower", 0, lowerY, W, lowerH, lower, lowerKind) : null;
    // A pulled upper front comes forward over the lower drawer, so that one goes first.
    parts.push(gapH(0, split, W), bottom ? bottom.body : lower, top ? top.body : upper);
    const cy = (pulled: Pulled | null, y: number) => (pulled ? pulled.at(W / 2, y)[1] : y);
    anchors.push({ zone: "ref", cx: W / 2, cy: cy(top, 70) }, { zone: "ref2", cx: W / 2, cy: cy(bottom, split + 70) });
    anchors.push({ zone: "frz", cx: W / 2, cy: cy(bottom, split + 70) });
  } else if (layout === "side_by_side") {
    const split = Math.round(W * 0.42);
    const frzOpen = open("frz_door_ajar");
    const refOpen = open("ref_door_ajar", "door_ajar");
    const leftW = split - 0.9;
    const rightX = split + 0.9;
    const rightW = W - split - 0.9;
    if (frzOpen) {
      const inside = cabinet(d, "frz", 0, 0, leftW, doorH, [0.22, 0.42, 0.62, 0.8]);
      parts.push(swungDoor(d, 0, 0, leftW, doorH, "left", "v", inside));
    } else {
      parts.push(slab(d, 0, 0, leftW, doorH), vBarHandle(d, split - 14, doorH * 0.22, doorH * 0.22 + handleLen));
    }
    if (refOpen) {
      const inside = cabinet(d, "ref", rightX, 0, rightW, doorH, tallShelves);
      parts.push(swungDoor(d, rightX, 0, rightW, doorH, "right", "v", inside));
    } else {
      parts.push(slab(d, rightX, 0, rightW, doorH), vBarHandle(d, split + 14, doorH * 0.22, doorH * 0.22 + handleLen));
    }
    parts.push(gapV(split, 0, doorH));
    anchors.push({ zone: "frz", cx: split / 2, cy: 150 }, { zone: "ref", cx: split + (W - split) / 2, cy: 150 });
  } else {
    // Over-and-under, or French doors over a freezer drawer.
    const split = Math.round(doorH * 0.64);
    const french = layout === "french_door";
    const refOpen = open("ref_door_ajar", "door_ajar");
    const frzY = split + 0.9;
    const frzH = doorH - frzY;
    const freezer = drawerFront(d, 0, frzY, W, frzH, 24);
    const pulled = open("frz_door_ajar") ? pulledDrawer(d, "frz", 0, frzY, W, frzH, freezer, "freezer") : null;
    parts.push(gapH(0, split, W), pulled ? pulled.body : freezer);
    if (french) {
      const half = W / 2 - 0.9;
      if (refOpen) {
        // Both French doors swing out together, onto one cabinet.
        parts.push(cabinet(d, "ref", 0, 0, W, split - 0.9, [0.3, 0.6]));
        parts.push(swungDoor(d, 0, 0, half, split - 0.9, "left", "v", svg``));
        parts.push(swungDoor(d, W / 2 + 0.9, 0, half, split - 0.9, "right", "v", svg``));
      } else {
        parts.push(slab(d, 0, 0, half, split - 0.9), slab(d, W / 2 + 0.9, 0, half, split - 0.9));
        parts.push(gapV(W / 2, 0, split));
        parts.push(vBarHandle(d, W / 2 - 13, split * 0.3, split * 0.3 + split * 0.45));
        parts.push(vBarHandle(d, W / 2 + 13, split * 0.3, split * 0.3 + split * 0.45));
      }
    } else if (refOpen) {
      parts.push(swungDoor(d, 0, 0, W, split - 0.9, "right", "v", cabinet(d, "ref", 0, 0, W, split - 0.9, [0.3, 0.6])));
    } else {
      parts.push(slab(d, 0, 0, W, split - 0.9));
      parts.push(vBarHandle(d, 15, split * 0.3, split * 0.3 + split * 0.48));
    }
    const frzCy = pulled ? pulled.at(W / 2, split + 80)[1] : split + 80;
    anchors.push({ zone: "ref", cx: W / 2, cy: 150 }, { zone: "frz", cx: W / 2, cy: frzCy });
  }

  const label = [short ? "Undercounter refrigerator" : "Refrigerator"];
  if (anyOpen) label.push("door open");
  return {
    width: W,
    height: H,
    below: 0,
    floor: true,
    body: svg`${parts}`,
    over: svg`${readouts(d, state, anchors, c.reducedMotion, uiScale(c, H, 0, true))}`,
    label,
  };
}

/**
 * Wine storage: a glass door in a stainless frame, bottles resting on lit shelves behind it,
 * a mix of green, amber and near-black glass with a few foil capsules turned out.
 */
export function wine(c: FormContext, widthIn: number, tall: boolean): Drawn {
  const { d, state } = c;
  const W = widthIn * 10;
  const H = tall ? 840 : 345;
  const kick = tall ? 45 : 40;
  const doorH = H - kick;
  const frame = tall ? 26 : 20;
  const gx = frame;
  const gy = frame;
  const gw = W - 2 * frame;
  const gh = doorH - frame - (tall ? 36 : 28);
  const twoZones = !!state.readouts.wine2;
  const anyOpen = state.available && Object.values(state.doors).some(Boolean);
  const glass = rectPath(gx, gy, gw, gh, 3);
  // The rack repeats every 5 bottles across and 4 rows down; shelves sit 27.5 into each row.
  const rowTop = gy + 6;
  const shelfAt = (k: number) => rowTop + 35 * k + 27.5;
  const divider = shelfAt(Math.max(0, Math.round((gh / 2 - 6 - 27.5) / 35)));
  const fills = ["bottle", "bottle-amber", "bottle-dark"];
  const cells: SVGTemplateResult[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      const pick = (row * 7 + col * 3 + (row * col) % 4) % 10;
      const cx = col * 29 + 14.5;
      const cy = row * 35 + 14;
      const foil = pick === 1 || pick === 5 || pick === 8;
      cells.push(svg`
        <circle cx=${cx} cy=${cy} r="12.2" fill=${d.url(fills[pick % 3])} />
        ${foil
          ? svg`<circle cx=${cx} cy=${cy} r="5.2" fill=${pick === 5 ? "#c9a24e" : "#6e1b2b"} />
              <circle cx=${cx - 1.5} cy=${cy - 1.7} r="1.5" fill="#fff" opacity="0.35" />`
          : svg`<path d=${`M${cx - 8} ${cy - 6.5}A11 11 0 0 1 ${cx - 0.5} ${cy - 10.7}`} fill="none" stroke="#e8f0e8"
              stroke-opacity="0.2" stroke-width="1.1" stroke-linecap="round" />`}
      `);
    }
  }
  const shelves = [0, 1, 2, 3].map(
    (row) => svg`
      <rect x="0" y=${row * 35 + 27.5} width="145" height="4.2" fill="#9a774f" />
      <rect x="0" y=${row * 35 + 27.5} width="145" height="1" fill="#e2c49a" opacity="0.7" />
      <rect x="0" y=${row * 35 + 31.2} width="145" height="0.8" fill="#000" opacity="0.35" />`,
  );
  const bottles = svg`
    <rect x=${gx} y=${gy} width=${gw} height=${gh} fill="#16130f" />
    <rect x=${gx} y=${gy} width=${gw} height=${gh} fill=${d.url("rack")} />
    ${twoZones
      ? svg`<rect x=${gx} y=${divider - 1} width=${gw} height="6" fill="#0b0b0c" />
          <rect x=${gx} y=${divider - 1} width=${gw} height="0.6" fill="#fff" opacity="0.3" />`
      : nothing}
    <rect x=${gx} y=${gy} width=${gw} height=${gh} fill=${d.url("wine-light")} />`;
  const label = ["Wine storage"];
  if (anyOpen) label.push("door open");
  const defs = svg`
    <defs>
      <clipPath id=${d.id("wine-glass")}><path d=${glass} /></clipPath>
      ${[
        ["bottle", "#050706", "#101712", "#26332a", "#4a5a4d", "#151a16"],
        ["bottle-amber", "#0a0503", "#22120a", "#3a2312", "#553a22", "#160c06"],
        ["bottle-dark", "#030303", "#0c0c0d", "#1e1f21", "#3c3e41", "#111213"],
      ].map(
        ([id, a, b, c2, e, f]) => svg`<radialGradient id=${d.id(id)} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color=${a} />
          <stop offset="0.42" stop-color=${b} />
          <stop offset="0.8" stop-color=${c2} />
          <stop offset="0.93" stop-color=${e} />
          <stop offset="1" stop-color=${f} />
        </radialGradient>`,
      )}
      <pattern id=${d.id("rack")} width="145" height="140" patternUnits="userSpaceOnUse" x=${gx + 1} y=${rowTop}>
        ${cells}${shelves}
      </pattern>
      <linearGradient id=${d.id("wine-light")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff1d8" stop-opacity="0.55" />
        <stop offset="0.25" stop-color="#ffe9c4" stop-opacity="0.12" />
        <stop offset="1" stop-color="#000" stop-opacity="0.35" />
      </linearGradient>
    </defs>`;
  const closed = svg`
    ${slab(d, 0, 0, W, doorH)}
    <g clip-path=${d.url("wine-glass")}>
      ${bottles}
      <rect x=${gx} y=${gy} width=${gw} height=${gh} fill=${d.url("glass-env")} />
      <rect x=${gx} y=${gy} width=${gw} height=${gh} fill="#7a8a92" opacity="0.1" />
    </g>
    <path d=${glass} fill="none" stroke="#0d0e0f" stroke-width="2" />
    <path d=${glass} fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="0.6"
      transform="translate(0.8 0.8)" />
    ${vBarHandle(d, W - 11, doorH * 0.16, doorH * 0.16 + Math.min(420, doorH * 0.6), 7)}`;
  // Open, the glass door swings away and the racks show in the lit cabinet.
  const opened = swungDoor(
    d,
    0,
    0,
    W,
    doorH,
    "left",
    "v",
    svg`<rect x="0" y="0" width=${W} height=${doorH} fill="#2a2520" />
      <g clip-path=${d.url("wine-glass")}>${bottles}</g>
      <rect x="0" y="0" width=${W} height="18" fill=${d.url("ao-down")} opacity="0.6" />`,
    true,
  );
  const top = gy + gh * (twoZones ? 0.12 : 0.18);
  return {
    width: W,
    height: H,
    below: 0,
    floor: true,
    body: svg`
      ${defs}
      ${kickGrille(d, 5, doorH, W - 10, kick)}
      ${anyOpen ? opened : closed}
    `,
    over: svg`
      ${readouts(
        d,
        state,
        [
          { zone: "wine", cx: W / 2, cy: top },
          { zone: "wine2", cx: W / 2, cy: divider + 5 + gh * 0.12 },
        ],
        c.reducedMotion,
        uiScale(c, H, 0, true),
      )}
    `,
    label,
  };
}

/** A 15″ undercounter ice maker: a solid stainless door and a louvered front vent. */
export function iceMaker(c: FormContext, widthIn: number): Drawn {
  const { d, state } = c;
  const W = widthIn * 10;
  const anyOpen = state.available && Object.values(state.doors).some(Boolean);
  const label = ["Ice maker"];
  if (anyOpen) label.push("door open");
  if (state.available && state.ice_maker?.cleaning) label.push("cleaning");
  // Open, the door shows the bin heaped with ice, in the part of the opening the door leaves.
  const cubes: string[] = [];
  const heapX = W * 0.42;
  // A fixed jitter, so the heap looks loose but draws the same every time.
  const jitter = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;
  let i = 0;
  for (let row = 0; row < 7; row++) {
    for (let col = 0; heapX + col * 11 < W - 16; col++, i++) {
      const size = 7.5 + 3.5 * jitter(i);
      const x = heapX - 4 + col * 11 + (row % 2) * 5 + 4 * jitter(i + 7);
      const y = 158 + row * 11 + 5 * jitter(i + 13) - (row === 0 ? 4 * jitter(i + 3) : 0);
      cubes.push(rectPath(x, y, size, size * 0.85, 2.2));
    }
  }
  const bin = svg`
    ${cabinet(d, "ice", 0, 0, W, 305, [0.4])}
    <rect x="8" y="145" width=${W - 16} height="150" rx="6" fill="#9fb0bd" />
    <path d=${cubes.join("")} fill="#f4f8fb" opacity="0.9" />
    <path d=${cubes.join("")} fill="none" stroke="#6f8494" stroke-width="0.7" />
    <rect x="8" y="145" width=${W - 16} height="3" rx="1.5" fill="#ffffff" opacity="0.9" />`;
  return {
    width: W,
    height: 345,
    below: 0,
    floor: true,
    body: svg`
      ${kickGrille(d, 5, 305, W - 10, 40)}
      ${anyOpen
        ? swungDoor(d, 0, 0, W, 305, "left", "h", bin)
        : svg`${slab(d, 0, 0, W, 305)}${barHandle(d, 14, W - 14, 19, "tubular")}`}
    `,
    label,
  };
}

// ---------------------------------------------------------------------------------------------
// Cooking

/**
 * An oven window: black glass with a printed black border. A heating cavity shows the way the
 * Wolf drawings show it, as a dim, warm glow from the top of a dark cavity with its racks;
 * the light shows the cavity itself. Off, the window keeps its plain look.
 */
function ovenWindow(
  d: Defs,
  key: string,
  x: number,
  y: number,
  w: number,
  h: number,
  oven: OvenState | undefined,
  available: boolean,
): SVGTemplateResult {
  const path = rectPath(x, y, w, h, 7);
  const frit = 6;
  const view = rectPath(x + frit, y + frit, w - 2 * frit, h - 2 * frit, 3);
  const on = available && !!oven?.on;
  const light = available && !!oven?.light;
  const heat = !on ? 0 : oven?.preheated ? 0.5 : oven?.progress != null ? 0.16 + 0.64 * oven.progress : 0.35;
  const racks = [0.42, 0.7].map((f) => `M${n(x + frit + 4)} ${n(y + h * f)}H${n(x + w - frit - 4)}`).join("");
  return svg`
    <defs>
      <clipPath id=${d.id(`win-${key}`)}><path d=${view} /></clipPath>
    </defs>
    ${blackGlass(d, path)}
    <g clip-path=${d.url(`win-${key}`)}>
      ${light || on
        ? svg`
          <rect x=${x} y=${y} width=${w} height=${h} fill="#21180f" opacity=${light ? 0.95 : 0.7} />
          <path d=${racks} stroke="#8f7a62" stroke-width="1.2" opacity=${light ? 0.75 : 0.3} />`
        : nothing}
      ${on ? svg`<rect x=${x} y=${y} width=${w} height=${h} fill=${d.url("heat")} opacity=${n(heat)} />` : nothing}
      ${light ? svg`<rect x=${x} y=${y} width=${w} height=${h} fill=${d.url("cavity-light")} />` : nothing}
      ${light || on ? svg`<rect x=${x} y=${y} width=${w} height=${h} fill="#000" opacity="0.25" />` : nothing}
    </g>
    <path d=${`${path}${view}`} fill-rule="evenodd" fill="#050506" opacity="0.88" />
    <rect x=${x} y=${y} width=${w} height=${h} fill=${d.url("glass-env")} clip-path=${d.url(`win-${key}`)} />
    <path d=${path} fill="none" stroke="#000" stroke-opacity="0.6" stroke-width="1" />
  `;
}

function cookingDefs(d: Defs, knobs: KnobColor): SVGTemplateResult {
  const knob = KNOB_PALETTE[knobs] ?? KNOB_PALETTE.red;
  return svg`
    <radialGradient id=${d.id("heat")} cx="0.5" cy="-0.05" r="1">
      <stop offset="0" stop-color="#c87a3e" stop-opacity="0.6" />
      <stop offset="0.3" stop-color="#8a4a1c" stop-opacity="0.42" />
      <stop offset="0.65" stop-color="#4a2510" stop-opacity="0.2" />
      <stop offset="1" stop-color="#1a0d06" stop-opacity="0" />
    </radialGradient>
    <linearGradient id=${d.id("cavity-light")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffd9a0" stop-opacity="0.25" />
      <stop offset="0.6" stop-color="#ffd9a0" stop-opacity="0.08" />
      <stop offset="1" stop-color="#ffd9a0" stop-opacity="0" />
    </linearGradient>
    <radialGradient id=${d.id("knob")} cx="0.4" cy="0.32" r="0.75">
      <stop offset="0" stop-color=${knob.light} />
      <stop offset="0.55" stop-color=${knob.base} />
      <stop offset="1" stop-color=${knob.dark} />
    </radialGradient>
  `;
}

/** Where an oven's readout sits: in the window's upper part, clear of its top edge. */
function windowLabelY(top: number, winH: number, scale: number): number {
  return top + Math.max(winH * 0.28, (LABEL_H * scale) / 2 + 8);
}

function ovenWords(name: string, oven: OvenState | undefined): string[] {
  if (!oven) return [];
  if (oven.on) return [`${name} on${oven.temp ? ` ${oven.temp}` : ""}`];
  return oven.light ? [`${name} light on`] : [];
}

/** A wall oven: a black-glass control strip over one or two stainless doors with windows. */
export function wallOven(c: FormContext, widthIn: number, double: boolean, slots: OvenSlot[]): Drawn {
  const { d, state } = c;
  const W = widthIn * 10;
  const H = double ? 511 : 285;
  const strip = 46;
  const doors = double ? 2 : 1;
  const doorH = (H - strip - 2 * doors) / doors;
  const parts: SVGTemplateResult[] = [];
  const labels: Array<SVGTemplateResult | typeof nothing> = [];
  const words = [double ? "Double wall oven" : "Wall oven"];
  const keys = [0, 1].slice(0, doors);
  const scale = uiScale(c, H, 0, false);
  const touch: string[] = [];
  for (let i = 0; i < 5; i++) {
    touch.push(rectPath(28 + i * 15, 21, 7, 1.6, 0.8), rectPath(W - 98 + i * 15, 21, 7, 1.6, 0.8));
  }
  parts.push(svg`
    ${blackGlass(d, rectPath(0, 0, W, strip))}
    ${bevel(0, 0, W, strip, 0.6)}
    <rect x=${W / 2 - 34} y="11" width="68" height="22" rx="2.5" fill="#06090b" />
    <rect x=${W / 2 - 34} y="11" width="68" height="22" rx="2.5" fill="none" stroke="#ffffff" stroke-opacity="0.12"
      stroke-width="0.6" />
    <path d=${touch.join("")} fill="#ffffff" opacity="0.45" />
  `);
  for (const index of keys) {
    const y = strip + 2 + index * (doorH + 2);
    const slot = slots[index] ?? { prefix: index === 0 ? "cav" : "cav2", position: "single", width: null };
    const oven = state.ovens?.[slot.prefix];
    const name = double ? (index === 0 ? "upper oven" : "lower oven") : "oven";
    const winH = doorH - 66;
    parts.push(svg`
      ${slab(d, 0, y, W, doorH, { brush: "h" })}
      ${barHandle(d, 24, W - 24, y + 20, "tubular")}
      ${ovenWindow(d, String(index), 32, y + 44, W - 64, winH, oven, state.available)}
    `);
    if (state.available && oven?.on && oven.temp) {
      const cy = windowLabelY(y + 44, winH, scale);
      labels.push(statusRow(d, W / 2, cy, { text: oven.temp }, [], c.reducedMotion, scale));
    }
    if (state.available) words.push(...ovenWords(name, oven));
  }
  return {
    width: W,
    height: H,
    below: 0,
    floor: false,
    body: svg`<defs>${cookingDefs(d, c.knobs)}</defs>${parts}`,
    over: svg`${labels}`,
    label: words,
  };
}

/** A knob in the Appearance color, Wolf-style: a domed face with a fin across it, in a bezel. */
function knob(d: Defs, cx: number, cy: number, color: KnobColor): SVGTemplateResult {
  const palette = KNOB_PALETTE[color] ?? KNOB_PALETTE.red;
  return svg`
    <circle cx=${cx + 1.2} cy=${cy + 2.6} r="13.5" fill="#000" opacity="0.25" filter=${d.url("blur-s")} />
    <circle cx=${cx} cy=${cy} r="13.5" fill=${d.url("chrome")} />
    <circle cx=${cx} cy=${cy} r="11" fill="#1b1617" />
    <circle cx=${cx} cy=${cy} r="10.4" fill=${d.url("knob")} />
    <rect x=${cx - 1.9} y=${cy - 8.6} width="3.8" height="17.2" rx="1.6" fill=${palette.edge} opacity="0.85" />
    <rect x=${cx - 1.9} y=${cy - 8.2} width="1" height="16.4" rx="0.5" fill=${palette.light} opacity="0.7" />
    <ellipse cx=${cx - 3.6} cy=${cy - 4.6} rx="3.8" ry="1.9" transform=${`rotate(-30 ${cx - 3.6} ${cy - 4.6})`}
      fill="#fff" opacity=${palette.sheen * 2} />
  `;
}

/** A freestanding range: grates on top, a knob panel, oven doors, a toe kick. */
export function range(c: FormContext, widthIn: number, burners: number, slots: OvenSlot[]): Drawn {
  const { d, state } = c;
  const W = widthIn * 10;
  const H = 360;
  const panelY = 20;
  const panelH = 66;
  const doorY = panelY + panelH + 2;
  const kick = 42;
  const doorH = H - kick - doorY;
  const ovens = slots.length ? slots : [{ prefix: "cav" as const, position: "single" as const, width: null }];
  const totalNominal = ovens.reduce((sum, slot) => sum + (slot.width ?? widthIn / ovens.length), 0);
  const knobCount = Math.max(4, burners) + ovens.length;
  const words = ["Range"];
  const caps: string[] = [];
  const count = Math.max(4, burners);
  const scale = uiScale(c, H, 0, true);
  for (let i = 0; i < count; i++) {
    const x = (W / count) * (i + 0.5);
    caps.push(`M${n(x - 16)} 9q16 -9 32 0`);
  }
  const parts: SVGTemplateResult[] = [
    svg`
      <rect x="2" y="5" width=${W - 4} height="9" rx="1.5" fill="#1f2021" />
      <path d=${caps.join("")} fill="none" stroke="#2c2d2f" stroke-width="5" stroke-linecap="round" />
      <path d=${caps.join("")} fill="none" stroke="#5a5c5f" stroke-width="0.8" transform="translate(0 -2)" />
      ${stainless(d, rectPath(0, 13, W, 7), { grain: 0 })}
      ${bevel(0, 13, W, 7, 1)}
      ${slab(d, 0, panelY, W, panelH, { brush: "h" })}
    `,
  ];
  for (let i = 0; i < knobCount; i++) {
    parts.push(knob(d, (W / knobCount) * (i + 0.5), panelY + panelH / 2, c.knobs));
  }
  let x = 0;
  const labels: Array<SVGTemplateResult | typeof nothing> = [];
  ovens.forEach((slot, index) => {
    const w = (W * (slot.width ?? widthIn / ovens.length)) / totalNominal - (index < ovens.length - 1 ? 1 : 0);
    const oven = state.ovens?.[slot.prefix];
    const winH = doorH - 82;
    parts.push(svg`
      ${slab(d, x, doorY, w, doorH, { brush: "h" })}
      ${barHandle(d, x + 18, x + w - 18, doorY + 22, "pro")}
      ${ovenWindow(d, String(index), x + 26, doorY + 52, w - 52, winH, oven, state.available)}
    `);
    if (state.available && oven?.on && oven.temp) {
      labels.push(
        statusRow(d, x + w / 2, windowLabelY(doorY + 52, winH, scale), { text: oven.temp }, [], c.reducedMotion, scale),
      );
    }
    if (state.available) words.push(...ovenWords(ovens.length > 1 ? `${slot.position} oven` : "oven", oven));
    x += w + 2;
  });
  parts.unshift(svg`
    ${stainless(d, rectPath(6, H - kick, W - 12, kick), { dim: 0.12, grain: 0.08, brush: "h" })}
    <rect x="6" y=${H - kick} width=${W - 12} height="14" fill=${d.url("ao-down")} />
  `);
  return {
    width: W,
    height: H,
    below: 0,
    floor: true,
    body: svg`<defs>${cookingDefs(d, c.knobs)}</defs>${parts}`,
    over: svg`${labels}`,
    label: words,
  };
}

// ---------------------------------------------------------------------------------------------
// Ventilation

function kelvinColor(kelvin: number | null): string {
  if (kelvin == null) return "#fff1d6";
  const t = Math.min(1, Math.max(0, (kelvin - 2700) / 2300));
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
  return `rgb(${mix(255, 238)}, ${mix(214, 244)}, ${mix(160, 255)})`;
}

/** A chimney hood: the sloped canopy, its front band with controls, the duct cover above. */
export function hood(c: FormContext, widthIn: number, form: "wall" | "island" | "insert" | "hood"): Drawn {
  const { d, state } = c;
  const W = widthIn * 10;
  const chimney = form !== "insert";
  const H = chimney ? 350 : 130;
  const top = chimney ? 175 : 0;
  const bandY = H - 50;
  const cw = form === "island" ? 140 : 112;
  const hoodState = state.available ? state.hood : undefined;
  const light = hoodState?.light ?? false;
  const strength = light ? 0.35 + 0.65 * ((hoodState?.brightness ?? 100) / 100) : 0;
  const color = kelvinColor(hoodState?.kelvin ?? null);
  const canopy: Array<[number, number]> = [
    [W / 2 - W * 0.3, top],
    [W / 2 + W * 0.3, top],
    [W, bandY],
    [0, bandY],
  ];
  const words = ["Ventilation hood"];
  if (light) words.push("light on");
  if (hoodState && hoodState.fan > 0) words.push(`fan speed ${hoodState.fan}`);
  return {
    width: W,
    height: H,
    below: 110,
    floor: false,
    body: svg`
      <defs>
        <linearGradient id=${d.id("canopy-shade")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.16" />
          <stop offset="1" stop-color="#000000" stop-opacity="0.12" />
        </linearGradient>
      </defs>
      ${chimney
        ? svg`
          ${stainless(d, rectPath(W / 2 - cw / 2, 0, cw, top + 2), { brush: "h" })}
          ${bevel(W / 2 - cw / 2, 0, cw, top + 2, 0.6)}
          <rect x=${W / 2 - cw / 2} y=${top * 0.48} width=${cw} height="1.2" fill="#000" opacity="0.25" />
          <rect x=${W / 2 - cw / 2} y=${top * 0.48 + 1.2} width=${cw} height="0.7" fill="#fff" opacity="0.5" />
          <rect x=${W / 2 - cw / 2} y=${top - 6} width=${cw} height="8" fill=${d.url("ao-up")} />`
        : nothing}
      ${chimney
        ? svg`
          ${stainless(d, polyPath(canopy), { brush: "h" })}
          <path d=${polyPath(canopy)} fill=${d.url("canopy-shade")} />
          <path d=${`M${n(canopy[0][0])} ${top}L${n(canopy[1][0])} ${top}`} stroke="#fff" stroke-opacity="0.7"
            stroke-width="0.8" />`
        : nothing}
      ${slab(d, 0, bandY, W, 46, { brush: "h" })}
      ${[0, 1, 2, 3].map((i) => {
        const bx = W - 90 + i * 19;
        const by = bandY + 23;
        return svg`
          <circle cx=${bx + 0.5} cy=${by + 1.2} r="3.4" fill="#000" opacity="0.25" filter=${d.url("blur-s")} />
          <circle cx=${bx} cy=${by} r="3.2" fill=${d.url("chrome")} />
          <circle cx=${bx} cy=${by} r="3.2" fill="none" stroke="#3b3a37" stroke-opacity="0.55" stroke-width="0.5" />
          <circle cx=${bx - 0.8} cy=${by - 1} r="1.1" fill="#fff" opacity="0.5" />`;
      })}
      <rect x="2" y=${bandY + 46} width=${W - 4} height="4" fill="#3a3c3e" />
      <rect x="2" y=${bandY + 49} width=${W - 4} height="1" fill="#000" opacity="0.5" />
    `,
    over: light
      ? svg`
        <defs>
          <radialGradient id=${d.id("hood-light")} gradientUnits="userSpaceOnUse" cx=${W / 2} cy=${H}
            r=${n(W * 0.6)} gradientTransform=${`translate(${W / 2} ${H}) scale(1 0.32) translate(${-W / 2} ${-H})`}>
            <stop offset="0" stop-color=${color} stop-opacity=${n(0.8 * strength)} />
            <stop offset="0.5" stop-color=${color} stop-opacity=${n(0.3 * strength)} />
            <stop offset="1" stop-color=${color} stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect x=${n(-W * 0.12)} y=${H} width=${n(W * 1.24)} height="106" fill=${d.url("hood-light")} />
        <rect x="20" y=${H - 1} width=${W - 40} height="2" rx="1" fill=${color} opacity=${n(0.9 * strength)} />`
      : nothing,
    label: words,
  };
}

// ---------------------------------------------------------------------------------------------
// Dishwasher and anything else

/** A dishwasher with nothing known about it: stainless door, tubular handle, toe kick. */
export function dishwasher(c: FormContext, widthIn: number): Drawn {
  const { d, state } = c;
  const W = widthIn * 10;
  const open = doorOpen(state);
  const scale = uiScale(c, DW_HEIGHT, 0, true);
  const front = { kind: "stainless", handle: "tubular" } as const;
  const { body, statusY } = dishwasherBody(d, W, front, open, false, LABEL_H * scale);
  const { label, chips } = dishwasherOverlay(state);
  const dw = state.dishwasher;
  const lightColor = state.available && !open && dw ? FLOOR_LIGHT[dw.status] : undefined;
  return {
    width: W,
    height: DW_HEIGHT,
    below: 0,
    floor: true,
    body,
    over: svg`
      ${lightColor ? floorLight(d, W, lightColor) : nothing}
      ${statusRow(d, W / 2, statusY, label, chips, c.reducedMotion, scale)}
    `,
    label: ["Dishwasher", ...dishwasherWords(state).filter((word) => word !== "offline")],
  };
}

/** An appliance of unknown type: a built-in stainless unit with a glass control strip. */
export function appliance(c: FormContext, widthIn: number): Drawn {
  const { d } = c;
  const W = widthIn * 10;
  return {
    width: W,
    height: 345,
    below: 0,
    floor: true,
    body: svg`
      ${stainless(d, rectPath(6, 305, W - 12, 40), { dim: 0.12, grain: 0.08 })}
      <rect x="6" y="305" width=${W - 12} height="14" fill=${d.url("ao-down")} />
      ${blackGlass(d, rectPath(0, 0, W, 38))}
      ${bevel(0, 0, W, 38, 0.6)}
      <rect x=${W / 2 - 26} y="12" width="52" height="14" rx="2" fill="#06090b" />
      <rect x=${W / 2 - 26} y="12" width="52" height="14" rx="2" fill="none" stroke="#fff" stroke-opacity="0.12"
        stroke-width="0.6" />
      ${slab(d, 0, 40, W, 265)}
      ${barHandle(d, 20, W - 20, 60, "tubular")}
    `,
    label: ["Appliance"],
  };
}
