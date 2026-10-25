import { nothing, svg, type SVGTemplateResult } from "lit";
import type { Appearance, HandleStyle } from "../../types";
import { n, type Camera, type Rect } from "./geometry";
import type { Layout } from "./layout";

export type FinishKind = "stainless" | "panel" | "black";

export interface Finish {
  kind: FinishKind;
  /** The panel color for panel-ready fronts, "#rrggbb". */
  color: string;
  /** The panel color reads as wood, so it gets a grain. */
  wood: boolean;
}

/** Everything the parts share while drawing one appliance. */
export interface Scene {
  /** `${uid}-${name}`: every SVG id carries the drawing's uid. */
  id(name: string): string;
  /** `url(#${uid}-${name})`. */
  ref(name: string): string;
  layout: Layout;
  finish: Finish;
  handle: HandleStyle;
  /** Doors and drawers swing or slide toward this camera. */
  camera: Camera;
  /**
   * Interiors use a nearer camera than the doors: it shows the cabinet's depth the way a
   * product photo does, without stretching an open door's nearer edge.
   */
  inside: Camera;
  theme: "light" | "dark";
}

export function finishOf(appearance: Appearance): Finish {
  switch (appearance.finish) {
    case "panel": {
      const color = /^#[0-9a-f]{6}$/i.test(appearance.panel_color ?? "") ? appearance.panel_color! : "#d9d4ca";
      return { kind: "panel", color, wood: isWood(color) };
    }
    case "white":
      return { kind: "panel", color: "#f0efea", wood: false };
    case "black":
    case "carbon":
      return { kind: "black", color: "#2b2d2f", wood: false };
    default:
      return { kind: "stainless", color: "#c8c9ca", wood: false };
  }
}

function rgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function hex([r, g, b]: [number, number, number]): string {
  const c = (v: number) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Lightens toward white (amount > 0) or darkens toward black (amount < 0). */
export function shade(color: string, amount: number): string {
  const [r, g, b] = rgb(color);
  const t = amount >= 0 ? 255 : 0;
  const k = Math.abs(amount);
  return hex([r + (t - r) * k, g + (t - g) * k, b + (t - b) * k]);
}

function isWood(color: string): boolean {
  const [r, g, b] = rgb(color).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const light = (max + min) / 2;
  if (max === min) return false;
  const sat = (max - min) / (1 - Math.abs(2 * light - 1));
  let hue = max === r ? ((g - b) / (max - min)) % 6 : max === g ? (b - r) / (max - min) + 2 : (r - g) / (max - min) + 4;
  hue = (hue * 60 + 360) % 360;
  return hue >= 12 && hue <= 48 && sat >= 0.18 && light >= 0.12 && light <= 0.78;
}

/**
 * Light falloff down a stainless front, sampled from the CL4850SID product photo: a soft
 * highlight near the top, a darker band a third of the way down, the broad reflection of
 * the studio light below the middle, and a darker foot. Slightly expanded around mid-gray
 * because the grain overlay pulls the tones together a little.
 */
const STEEL: Array<[number, string]> = [
  [0, "#b9b9b9"],
  [0.07, "#c1c1c1"],
  [0.19, "#bfbfbf"],
  [0.33, "#b8b8b8"],
  [0.45, "#c5c5c5"],
  [0.57, "#d7d7d7"],
  [0.69, "#dedede"],
  [0.78, "#d3d3d3"],
  [0.89, "#bababa"],
  [1, "#a8a8a8"],
];

/**
 * Undercounter stainless, from the DEU2450BG photo: an even, top-lit falloff. The tall units'
 * studio reflection doesn't fit a 30" door.
 */
const STEEL_UNDERCOUNTER: Array<[number, string]> = [
  [0, "#c6c6c6"],
  [0.35, "#c0c0c0"],
  [0.7, "#b8b8b8"],
  [1, "#b0b0b0"],
];

/** PRO 48, from the PRO4850G photo: a darker, more contrasty upper door than the Classic. */
const STEEL_PRO: Array<[number, string]> = [
  [0, "#a3a3a3"],
  [0.3, "#979797"],
  [0.45, "#a9a9a9"],
  [0.6, "#c8c8c8"],
  [0.75, "#d0d0d0"],
  [0.9, "#b4b4b4"],
  [1, "#9f9f9f"],
];

function steelStops(layout: Layout): Array<[number, string]> {
  return layout.undercounter ? STEEL_UNDERCOUNTER : layout.line === "pro" ? STEEL_PRO : STEEL;
}

const BLACK: Array<[number, string]> = [
  [0, "#3b3d40"],
  [0.08, "#424447"],
  [0.33, "#333538"],
  [0.57, "#47494c"],
  [0.69, "#4c4e51"],
  [0.85, "#37393c"],
  [1, "#2a2c2e"],
];

function faceStops(finish: Finish, layout: Layout): Array<[number, string]> {
  if (finish.kind === "stainless") return steelStops(layout);
  if (finish.kind === "black") return BLACK;
  // A painted or wood panel: flat color with a soft sheen, lighter near the top. Wood gets
  // lifted a little because its grain lines are multiplied over it.
  const base = finish.wood ? shade(finish.color, 0.05) : finish.color;
  return [
    [0, shade(base, 0.07)],
    [0.3, shade(base, 0.02)],
    [0.62, shade(base, 0.05)],
    [1, shade(base, -0.1)],
  ];
}

const stops = (list: Array<[number, string]>) => list.map(([o, c]) => svg`<stop offset=${o} stop-color=${c} />`);
const alphaStops = (list: Array<[number, string, number]>) =>
  list.map(([o, c, a]) => svg`<stop offset=${o} stop-color=${c} stop-opacity=${a} />`);

/** Polished tube across its width: dark rims, a broad lit body and a crisp specular line. */
const TUBE: Array<[number, string]> = [
  [0, "#5d6063"],
  [0.09, "#9fa2a5"],
  [0.2, "#d6d8d9"],
  [0.44, "#e4e5e6"],
  [0.58, "#f7f8f8"],
  [0.64, "#e6e7e8"],
  [0.72, "#bfc1c3"],
  [0.86, "#a3a6a8"],
  [0.95, "#76797c"],
  [1, "#55585b"],
];

/**
 * The shared definitions: gradients, the brushed-grain pattern (one turbulence filter), soft
 * shadow blurs and the offline filter. Every id is prefixed with the drawing's uid.
 */
export function defs(s: Scene): SVGTemplateResult {
  const { layout, finish } = s;
  const { y0, y1 } = layout.span;
  const dark = s.theme === "dark";
  // The photos' stainless reads flat across a door; panels keep a soft sideways falloff.
  const side = finish.kind === "stainless" ? 0.025 : finish.kind === "black" ? 0.05 : 0.07;
  // UV-tinted glass darkens a beverage center's bright cans more than a wine unit's racks.
  const beverage = layout.fronts.some((front) => front.window && front.contents === "beverage");
  const tint: Array<[number, string, number]> = beverage
    ? [
        [0, "#2a2018", 0.52],
        [0.5, "#120d0a", 0.66],
        [1, "#1a130e", 0.6],
      ]
    : [
        [0, "#2a2018", 0.42],
        [0.5, "#120d0a", 0.58],
        [1, "#1a130e", 0.5],
      ];
  const louverTop: Array<[number, string]> =
    finish.kind === "black"
      ? [
          [0, "#55575a"],
          [0.15, "#47494c"],
          [1, "#36383a"],
        ]
      : [
          [0, "#d6d6d6"],
          [0.12, "#c4c4c4"],
          [1, "#b2b2b2"],
        ];
  const louverFace: Array<[number, string]> =
    finish.kind === "black"
      ? [
          [0, "#2a2b2d"],
          [1, "#1b1c1d"],
        ]
      : [
          [0, "#767676"],
          [0.7, "#666666"],
          [1, "#585858"],
        ];
  return svg`<defs>
    <linearGradient id=${s.id("face")} gradientUnits="userSpaceOnUse" x1="0" y1=${y0} x2="0" y2=${y1}>
      ${stops(faceStops(finish, layout))}
    </linearGradient>
    <linearGradient id=${s.id("steel")} gradientUnits="userSpaceOnUse" x1="0" y1=${y0} x2="0" y2=${y1}>
      ${stops(steelStops(layout))}
    </linearGradient>
    <linearGradient id=${s.id("faceX")} x1="0" y1="0" x2="1" y2="0">
      ${alphaStops([
        [0, "#ffffff", side],
        [0.3, "#ffffff", 0],
        [0.7, "#000000", 0],
        [1, "#000000", side],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("endShade")} x1="0" y1="0" x2="1" y2="0">
      ${alphaStops([
        [0, "#000000", 0],
        [1, "#000000", 1],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("tubeV")} x1="0" y1="0" x2="1" y2="0">${stops(TUBE)}</linearGradient>
    <linearGradient id=${s.id("tubeH")} x1="0" y1="1" x2="0" y2="0">${stops(TUBE)}</linearGradient>
    <linearGradient id=${s.id("capV")} x1="0" y1="0" x2="1" y2="0">
      ${stops([
        [0, "#6f7275"],
        [0.18, "#b6b9bb"],
        [0.5, "#d3d5d6"],
        [0.8, "#a9acae"],
        [1, "#6b6e71"],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("capH")} x1="0" y1="1" x2="0" y2="0">
      ${stops([
        [0, "#6f7275"],
        [0.18, "#b6b9bb"],
        [0.5, "#d3d5d6"],
        [0.8, "#a9acae"],
        [1, "#6b6e71"],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("louverTop")} x1="0" y1="0" x2="0" y2="1">${stops(louverTop)}</linearGradient>
    <linearGradient id=${s.id("louverFace")} x1="0" y1="0" x2="0" y2="1">${stops(louverFace)}</linearGradient>
    <linearGradient id=${s.id("band")} x1="0" y1="0" x2="0" y2="1">
      ${stops([
        [0, "#1d1d1e"],
        [0.6, "#2b2b2c"],
        [1, "#3a3a3b"],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("kick")} x1="0" y1="0" x2="0" y2="1">
      ${stops([
        [0, "#8d8e8f"],
        [0.16, "#9c9d9e"],
        [0.7, "#a1a2a3"],
        [1, "#959697"],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("kickBlack")} x1="0" y1="0" x2="0" y2="1">
      ${stops([
        [0, "#0f1011"],
        [0.25, "#1e1f20"],
        [1, "#18191a"],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("tint")} x1="0" y1="0" x2="0" y2="1">${alphaStops(tint)}</linearGradient>
    <linearGradient id=${s.id("sheen")} x1="0" y1="0" x2="0" y2="1">
      ${alphaStops([
        [0, "#ffffff", 0.08],
        [0.3, "#ffffff", 0],
        [0.7, "#000000", 0],
        [1, "#000000", 0.06],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("niche")} x1="0" y1="0" x2="0" y2="1">
      ${stops([
        [0, "#0e0f10"],
        [0.3, "#1f2123"],
        [1, "#2c2e31"],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("wood")} x1="0" y1="0" x2="0" y2="1">
      ${stops([
        [0, "#e2bf98"],
        [0.45, "#cfa077"],
        [1, "#a8774f"],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("cyl")} x1="0" y1="0" x2="1" y2="0">
      ${alphaStops([
        [0, "#000000", 0.45],
        [0.22, "#000000", 0.05],
        [0.34, "#ffffff", 0.35],
        [0.46, "#ffffff", 0.05],
        [0.8, "#000000", 0.12],
        [1, "#000000", 0.5],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("ice")} x1="0" y1="0" x2="0" y2="1">
      ${stops([
        [0, "#fbfdfe"],
        [0.3, "#e9f0f3"],
        [0.6, "#d7e2e8"],
        [1, "#a7bac5"],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("shadeDown")} x1="0" y1="0" x2="0" y2="1">
      ${alphaStops([
        [0, "#000000", 0],
        [1, "#000000", 0.2],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("binLight")} x1="0" y1="0" x2="0" y2="1">
      ${alphaStops([
        [0, "#ffffff", 0.14],
        [0.45, "#ffffff", 0],
        [1, "#000000", 0.14],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("depthL")} x1="0" y1="0" x2="1" y2="0">
      ${alphaStops([
        [0, "#000000", 0],
        [1, "#000000", 0.2],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("depthR")} x1="0" y1="0" x2="1" y2="0">
      ${alphaStops([
        [0, "#000000", 0.2],
        [1, "#000000", 0],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("depthT")} x1="0" y1="0" x2="0" y2="1">
      ${alphaStops([
        [0, "#000000", 0.04],
        [1, "#000000", 0.22],
      ])}
    </linearGradient>
    <linearGradient id=${s.id("depthB")} x1="0" y1="0" x2="0" y2="1">
      ${alphaStops([
        [0, "#000000", 0.16],
        [1, "#000000", 0],
      ])}
    </linearGradient>
    <radialGradient id=${s.id("floor")} cx="0.5" cy="0.5" r="0.5">
      ${alphaStops([
        [0, "#000000", dark ? 0.62 : 0.3],
        [0.55, "#000000", dark ? 0.32 : 0.13],
        [1, "#000000", 0],
      ])}
    </radialGradient>
    <radialGradient id=${s.id("pool")} cx="0.5" cy="0.5" r="0.5">
      ${alphaStops([
        [0, "#fff6e4", dark ? 0.32 : 0.18],
        [1, "#fff6e4", 0],
      ])}
    </radialGradient>
    <radialGradient id=${s.id("glare")} cx="0.5" cy="0" r="0.75">
      ${alphaStops([
        [0, "#ffffff", 0.55],
        [1, "#ffffff", 0],
      ])}
    </radialGradient>
    <filter id=${s.id("grainF")} x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="1.1 0.016" numOctaves="2" seed="11" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="1.6 0 0 0 -0.3  1.6 0 0 0 -0.3  1.6 0 0 0 -0.3  0 0 0 0 1" />
    </filter>
    <pattern id=${s.id("grainV")} patternUnits="userSpaceOnUse" width="160" height="640">
      <rect width="160" height="640" filter=${s.ref("grainF")} />
    </pattern>
    <pattern id=${s.id("grainH")} patternUnits="userSpaceOnUse" width="160" height="640" patternTransform="rotate(90)">
      <rect width="160" height="640" filter=${s.ref("grainF")} />
    </pattern>
    ${finish.wood ? woodGrain(s) : nothing}
    <filter id=${s.id("blur")} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.2" />
    </filter>
    <filter id=${s.id("blurL")} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="7" />
    </filter>
    <filter id=${s.id("pill")} x="-30%" y="-60%" width="160%" height="220%">
      <feGaussianBlur stdDeviation="1.4" />
    </filter>
    <filter id=${s.id("mute")} color-interpolation-filters="sRGB">
      <feColorMatrix type="saturate" values="0.78" />
    </filter>
    <filter id=${s.id("offline")} color-interpolation-filters="sRGB">
      <feColorMatrix type="saturate" values="0.06" />
      <feComponentTransfer>
        <feFuncR type="linear" slope="0.62" intercept="0.17" />
        <feFuncG type="linear" slope="0.62" intercept="0.17" />
        <feFuncB type="linear" slope="0.62" intercept="0.18" />
      </feComponentTransfer>
    </filter>
  </defs>`;
}

/**
 * Wood veneer: fine, crisp grain lines bent into a soft cathedral figure, with a faint
 * lengthwise color drift. One wide tile covers the widest front, so no seam lands on a door.
 */
function woodGrain(s: Scene): SVGTemplateResult {
  return svg`<filter id=${s.id("woodF")} x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.7 0.008" numOctaves="4" seed="7" stitchTiles="stitch" result="fine" />
      <feColorMatrix in="fine" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="gray" />
      <feComponentTransfer in="gray" result="lines">
        <feFuncR type="table" tableValues="0.2 0.62 0.92 1 1 1" />
        <feFuncG type="table" tableValues="0.2 0.62 0.92 1 1 1" />
        <feFuncB type="table" tableValues="0.2 0.62 0.92 1 1 1" />
      </feComponentTransfer>
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.0025" numOctaves="2" seed="3" result="figure" />
      <feColorMatrix in="figure" type="matrix" values="1 0 0 0 0  0 0 0 0 0.5  0 0 0 0 0  0 0 0 0 1" result="shift" />
      <feDisplacementMap in="lines" in2="shift" scale="16" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <linearGradient id=${s.id("woodDrift")} x1="0" y1="0" x2="1" y2="0">
      ${alphaStops([
        [0, "#000000", 0],
        [0.3, "#000000", 0.08],
        [0.5, "#000000", 0],
        [0.8, "#000000", 0.08],
        [1, "#000000", 0],
      ])}
    </linearGradient>
    <pattern id=${s.id("grainW")} patternUnits="userSpaceOnUse" x="-120" width="900" height="640" patternTransform="scale(1 1.4)">
      <rect width="900" height="640" fill="#ffffff" />
      <rect width="900" height="640" filter=${s.ref("woodF")} />
    </pattern>`;
}

/** Thin edge lines: light from above, so a bright top, a softer left, darker right and bottom. */
export function edges(r: Rect, strength = 1): SVGTemplateResult {
  const x0 = n(r.x);
  const y0 = n(r.y);
  const x1 = n(r.x + r.w);
  const y1 = n(r.y + r.h);
  return svg`<path d=${`M${x0 + 1.2} ${y0 + 0.6}H${x1 - 1.2}`} stroke="#fff" stroke-opacity=${0.62 * strength} stroke-width="1.1" />
    <path d=${`M${x0 + 0.5} ${y0 + 1.2}V${y1 - 1.2}`} stroke="#fff" stroke-opacity=${0.14 * strength} stroke-width="0.9" />
    <path d=${`M${x1 - 0.5} ${y0 + 1.2}V${y1 - 1.2}`} stroke="#000" stroke-opacity=${0.2 * strength} stroke-width="1" />
    <path d=${`M${x0 + 1.2} ${y1 - 0.7}H${x1 - 1.2}`} stroke="#000" stroke-opacity=${0.32 * strength} stroke-width="1.3" />`;
}

/**
 * A front's face in the appliance's finish: the falloff gradient, the brushed grain (or a
 * wood grain on wood panels), a faint sideways falloff and the edge lines.
 */
export function surface(s: Scene, r: Rect, options: { grain?: "v" | "h"; radius?: number; edgeStrength?: number } = {}): SVGTemplateResult {
  const { kind, wood } = s.finish;
  const rx = options.radius ?? 1.4;
  const box = { x: n(r.x), y: n(r.y), w: n(r.w), h: n(r.h) };
  const grain = s.ref(options.grain === "h" ? "grainH" : "grainV");
  // Tall doors are near-flawless in the photos; the undercounter fronts show their brushing.
  const brushed = s.layout.undercounter ? 0.04 : 0.015;
  const layer =
    kind === "stainless"
      ? svg`<rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} rx=${rx} fill=${grain} opacity=${brushed} />`
      : kind === "black"
        ? svg`<rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} rx=${rx} fill=${grain} opacity="0.05" />`
        : wood
          ? svg`<rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} rx=${rx} fill=${s.ref("grainW")} opacity="0.5" style="mix-blend-mode:multiply" />
              <rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} rx=${rx} fill=${s.ref("woodDrift")} />`
          : nothing;
  return svg`<rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} rx=${rx} fill=${s.ref("face")} />
    ${layer}
    <rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} rx=${rx} fill=${s.ref("faceX")} />
    ${edges(r, options.edgeStrength ?? (kind === "panel" ? 0.6 : 1))}`;
}
