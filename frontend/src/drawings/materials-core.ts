import { nothing, svg, type SVGTemplateResult } from "lit";
import type { KnobColor } from "../types";

/*
 * What the drawing modules' materials share: a drawing's ids, rounding and path helpers, color
 * math, and the few definitions that are the same in every family (the offline filter, Wolf's
 * satin tube, the knob face, the floor shadow's strength). Where a family's photos call for
 * different numbers, it keeps them and passes them in.
 */

/**
 * One drawing's SVG ids. Several drawings share one shadow root, so every id starts with the
 * drawing's uid, and a duplicate would resolve to another drawing's definition. The uid is kept
 * to letters, digits, "_" and "-": ids end up inside url(#…) and, in a <style>, as CSS names,
 * where a space, quote or bracket would break the reference.
 */
export class Ids {
  /** The uid as the ids carry it. */
  readonly uid: string;

  constructor(uid: string) {
    const safe = uid.replace(/[^A-Za-z0-9_-]/g, "_");
    // A CSS name can't start with a digit or a hyphen (or be empty).
    this.uid = /^[A-Za-z]/.test(safe) ? safe : `d${safe}`;
  }

  id(name: string): string {
    return `${this.uid}-${name}`;
  }

  url(name: string): string {
    return `url(#${this.uid}-${name})`;
  }
}

// ---------------------------------------------------------------------------------------------
// Numbers and paths

/** Rounds to 0.01 drawing unit, which keeps the markup short without visible error. */
export function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function clamp(value: number, low = 0, high = 1): number {
  return Math.min(high, Math.max(low, value));
}

/** A point in drawing units (0.1 inch). */
export type Point = readonly [number, number];

/** A closed outline through the points, as path data. `fix` rounds each coordinate. */
export function polyPath(points: readonly Point[], fix: (value: number) => number = round): string {
  return `M${points.map(([x, y]) => `${fix(x)} ${fix(y)}`).join("L")}Z`;
}

/** The points as a `<polygon>` or `<polyline>` lists them. */
export function pointList(points: readonly Point[]): string {
  return points.map(([x, y]) => `${round(x)},${round(y)}`).join(" ");
}

// ---------------------------------------------------------------------------------------------
// Colors

export type Rgb = [number, number, number];

/** "#rrggbb" as its three channels. */
export function parseHex(hex: string): Rgb {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export function toHex([r, g, b]: Readonly<Rgb>): string {
  const part = (v: number) =>
    Math.round(Math.min(255, Math.max(0, v)))
      .toString(16)
      .padStart(2, "0");
  return `#${part(r)}${part(g)}${part(b)}`;
}

/** Mixes a color toward white (amount > 0) or black (amount < 0), all the way at 1 or -1. */
export function tint(color: Readonly<Rgb>, amount: number): string {
  const target = amount > 0 ? 255 : 0;
  const k = Math.abs(amount);
  return toHex([color[0] + (target - color[0]) * k, color[1] + (target - color[1]) * k, color[2] + (target - color[2]) * k]);
}

/** Linear interpolation between two "#rrggbb" colors. */
export function mix(from: string, to: string, t: number): string {
  const a = parseHex(from);
  const b = parseHex(to);
  const k = clamp(t);
  return toHex([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]);
}

/**
 * Whether a panel color reads as wood (walnut, oak): a muted orange-brown that isn't too pale.
 * Wood is drawn with a grain, paint flat, and every panel-ready front decides it here, so one
 * color is the same material on a refrigerator and on the dishwasher beside it.
 */
export function isWood(color: Readonly<Rgb>): boolean {
  const [r, g, b] = color.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const light = (max + min) / 2;
  if (max === min) return false;
  const sat = (max - min) / (1 - Math.abs(2 * light - 1));
  let hue = max === r ? ((g - b) / (max - min)) % 6 : max === g ? (b - r) / (max - min) + 2 : (r - g) / (max - min) + 4;
  hue = (hue * 60 + 360) % 360;
  return hue >= 12 && hue <= 48 && sat >= 0.18 && light >= 0.12 && light <= 0.78;
}

// ---------------------------------------------------------------------------------------------
// Definitions

/** How a family's drawing looks while the appliance can't be reached. */
export interface OfflineLook {
  /** The color that's left, 0 to 1. */
  saturation: number;
  /** The tones are flattened to this contrast… */
  slope: number;
  /** …and lifted by this much: one value, or red, green and blue apart. */
  lift: number | readonly [number, number, number];
  /** Percent added around the filter's region, where a drawing's parts reach past its box. */
  margin?: number;
}

/** The filter over an offline appliance: desaturated, flattened and lifted toward gray. */
export function offlineFilter(id: string, look: OfflineLook): SVGTemplateResult {
  const [r, g, b] = typeof look.lift === "number" ? [look.lift, look.lift, look.lift] : look.lift;
  const m = look.margin;
  const from = m ? `-${m}%` : nothing;
  const size = m ? `${100 + 2 * m}%` : nothing;
  return svg`<filter id=${id} x=${from} y=${from} width=${size} height=${size} color-interpolation-filters="sRGB">
    <feColorMatrix type="saturate" values=${look.saturation} />
    <feComponentTransfer>
      <feFuncR type="linear" slope=${look.slope} intercept=${r} />
      <feFuncG type="linear" slope=${look.slope} intercept=${g} />
      <feFuncB type="linear" slope=${look.slope} intercept=${b} />
    </feComponentTransfer>
  </filter>`;
}

/**
 * Wolf's satin tube across its height (handles, trims), sampled from the DF48850's handle: a
 * broad highlight along the top, a narrower one near the bottom, dark rims.
 */
const SATIN_TUBE: ReadonlyArray<readonly [number, string]> = [
  [0, "#8a8988"],
  [0.07, "#a09f9d"],
  [0.11, "#cac9c7"],
  [0.15, "#fbfbfa"],
  [0.3, "#ffffff"],
  [0.35, "#f7f7f6"],
  [0.4, "#dfdedc"],
  [0.45, "#d6d5d3"],
  [0.53, "#e2e1df"],
  [0.62, "#d8d7d5"],
  [0.73, "#cdccca"],
  [0.79, "#dad9d7"],
  [0.85, "#f9f9f8"],
  [0.9, "#f0efee"],
  [0.95, "#bebdbb"],
  [1, "#8c8b89"],
];

/** The satin tube's gradient, lying horizontally: the range's handles and the wall ovens' alike. */
export function satinTube(id: string): SVGTemplateResult {
  return svg`<linearGradient id=${id} x1="0" y1="0" x2="0" y2="1">
    ${SATIN_TUBE.map(([offset, color]) => svg`<stop offset=${offset} stop-color=${color} />`)}
  </linearGradient>`;
}

export interface KnobPalette {
  light: string;
  base: string;
  dark: string;
  /** The fin's shaded side. */
  edge: string;
  /** The knob's top edge, seen from a little above. */
  rim: string;
  rimOpacity: number;
  /** Strength of the soft specular highlight. */
  sheen: number;
}

/** Knob colors sampled from Wolf's photos and swatches (signature red #8e292f). */
export const KNOB_PALETTE: Record<KnobColor, KnobPalette> = {
  red: { light: "#953c42", base: "#843236", dark: "#62191e", edge: "#4c1418", rim: "#a5676a", rimOpacity: 0.6, sheen: 0.05 },
  black: { light: "#3c3c3f", base: "#262628", dark: "#141415", edge: "#060606", rim: "#58585c", rimOpacity: 0.6, sheen: 0.08 },
  stainless: { light: "#d2d4d5", base: "#a9abad", dark: "#6a6d70", edge: "#45484b", rim: "#e6e7e8", rimOpacity: 0.4, sheen: 0.12 },
};

/** A Wolf knob's domed face, lit from the upper left. */
export function knobFace(id: string, knob: Pick<KnobPalette, "light" | "base" | "dark">): SVGTemplateResult {
  return svg`<radialGradient id=${id} cx="0.45" cy="0.32" r="0.8">
    <stop offset="0" stop-color=${knob.light} />
    <stop offset="0.45" stop-color=${knob.base} />
    <stop offset="0.85" stop-color=${knob.base} />
    <stop offset="1" stop-color=${knob.dark} />
  </radialGradient>`;
}

/**
 * How dark the shadow under an appliance is at its darkest. It's the one thing a drawing adapts
 * to the page theme: a dark page swallows a light shadow, so there it's deeper.
 */
export function floorShadowStrength(theme: "light" | "dark"): number {
  return theme === "dark" ? 0.62 : 0.3;
}
