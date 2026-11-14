import { nothing, svg, type SVGTemplateResult } from "lit";
import type { KnobColor } from "../../types";
import { floorShadowStrength, KNOB_PALETTE, knobFace, mix, offlineFilter, satinTube, type Ids } from "../materials-core";

/**
 * Materials for Wolf's stainless cooking and ventilation drawings (wall ovens and hoods), matched
 * to Wolf's studio photos: brushed steel lit brightest in the middle and falling off to the sides,
 * near-black glass with a soft center sheen, satin-bright handles, and crimson knobs.
 *
 * Every id is prefixed with the drawing's uid, since several drawings share one shadow root.
 */

export type MetalFinish = "stainless" | "black" | "carbon";

interface MetalTones {
  /** The tone at the middle of the appliance, where the studio light is brightest. */
  mid: string;
  /** Strength of the brushed grain, 0 to 1. */
  grain: number;
}

const METALS: Record<MetalFinish, MetalTones> = {
  stainless: { mid: "#d1d0ce", grain: 1 },
  black: { mid: "#505256", grain: 0.7 },
  carbon: { mid: "#84878b", grain: 0.85 },
};

/** How the studio light falls across an appliance: factors of the middle tone, by offset. */
export type Falloff = ReadonlyArray<readonly [number, number]>;

/**
 * The approved range drawing's light (measured on Wolf's DF48850 photo), so the ovens and the
 * range read as lit from the same place: nearly symmetric, peaking a little right of center.
 */
export const OVEN_LIGHT: Falloff = [
  [0, 0.561],
  [0.05, 0.575],
  [0.12, 0.624],
  [0.2, 0.724],
  [0.3, 0.86],
  [0.4, 0.937],
  [0.5, 0.991],
  [0.58, 1],
  [0.66, 0.955],
  [0.75, 0.86],
  [0.85, 0.706],
  [0.95, 0.588],
  [1, 0.566],
];

/**
 * The light across the VWC3650P photo's band, measured in sixteen bins: a broad plateau over the
 * middle, a touch brighter right of center, falling off evenly toward both ends.
 */
export const HOOD_LIGHT: Falloff = [
  [0, 0.64],
  [0.06, 0.69],
  [0.15, 0.77],
  [0.25, 0.89],
  [0.35, 0.955],
  [0.45, 0.96],
  [0.55, 0.975],
  [0.62, 1],
  [0.7, 0.95],
  [0.8, 0.885],
  [0.9, 0.785],
  [1, 0.7],
];

/** Black glass across the Contemporary's front: near black at the sides, a soft sheen between. */
const BLACK_GLASS: Array<[number, string]> = [
  [0, "#070707"],
  [0.1, "#0c0c0c"],
  [0.2, "#141414"],
  [0.3, "#1f1f1f"],
  [0.4, "#2a2a2a"],
  [0.5, "#333333"],
  [0.6, "#2b2b2b"],
  [0.7, "#1f1f1f"],
  [0.8, "#141414"],
  [0.9, "#0c0c0c"],
  [1, "#070707"],
];

/** The Professional's window glass: dark charcoal, lighter than the black glass fronts. */
const WINDOW_GLASS: Array<[number, string]> = [
  [0, "#1a1a1a"],
  [0.17, "#262626"],
  [0.27, "#2e2e2e"],
  [0.4, "#393939"],
  [0.5, "#3a3a3a"],
  [0.6, "#363636"],
  [0.7, "#2b2b2b"],
  [0.8, "#222222"],
  [1, "#161616"],
];

/**
 * The approved range drawing's knob colors, so every Wolf knob in the panel reads alike. The
 * brushed stainless knob is a lighter satin here than on the range.
 */
const KNOBS: Record<KnobColor, { light: string; base: string; dark: string; rim: string }> = {
  ...KNOB_PALETTE,
  stainless: { light: "#dfe0e1", base: "#b4b6b8", dark: "#7f8285", rim: "#eff0f0" },
};

/** How an oven or hood looks while it can't be reached. */
const OFFLINE = { saturation: 0.08, slope: 0.62, lift: 0.2 };

/** The ids of the shared definitions for one drawing. */
export interface Materials {
  /** The drawing's ids, for the definitions a part makes for itself (clip paths, per-door gradients). */
  ids: Ids;
  /** Brushed metal across the whole appliance, so every panel shares the studio lighting. */
  metal: string;
  /** Soft vertical light: a touch brighter at the top, darker at the bottom. */
  sheen: string;
  /** The window's dark charcoal glass, with the photos' soft vertical sheen in the middle. */
  glass: string;
  /** Black glass fronts (Transitional, Contemporary), darker toward the sides. */
  blackGlass: string;
  /** A satin tube lying horizontally (handles, trims), the same as the range's handle. */
  chrome: string;
  /** A Professional handle cap's convex outer end turning away from the light, left and right. */
  capEndLeft: string;
  capEndRight: string;
  /** The knob face, the light catching its top rim, and the brushed bezel ring around it. */
  knob: string;
  knobRim: string;
  /**
   * Over the bezel ring's brushed metal: a satin sheen, brightest on the side facing the oven's
   * middle (the right side for the left knobs, the left side for the right ones).
   */
  bezelRight: string;
  bezelLeft: string;
  /** The M Series window bevel's four faces, each lighter toward the glass. */
  bevelTop: string;
  bevelLeft: string;
  bevelRight: string;
  bevelBottom: string;
  /** The E Series window recess: light on its right and bottom sides, fading outward. */
  recessRight: string;
  recessBottom: string;
  /** A soft shadow that fades downward, for under handles and ledges. */
  dropShadow: string;
  /** The brushed grain, applied once to a group of metal panels. */
  grain: string;
  /** Desaturates and flattens the drawing while the appliance is offline. */
  offline: string;
  /** A Gaussian blur for glows. */
  blur: string;
  /** A wider blur, for light falling on surfaces. */
  blurWide: string;
  /** A slight blur, for crisp contact shadows. */
  blurFine: string;
  /** The soft shadow under a readout pill, in the pill's CSS-pixel space. */
  pillShadow: string;
}

export function materialIds(ids: Ids): Materials {
  return {
    ids,
    metal: ids.id("metal"),
    sheen: ids.id("sheen"),
    glass: ids.id("glass"),
    blackGlass: ids.id("black-glass"),
    chrome: ids.id("chrome"),
    capEndLeft: ids.id("cap-l"),
    capEndRight: ids.id("cap-r"),
    knob: ids.id("knob"),
    knobRim: ids.id("knob-rim"),
    bezelRight: ids.id("bezel-r"),
    bezelLeft: ids.id("bezel-l"),
    bevelTop: ids.id("bevel-t"),
    bevelLeft: ids.id("bevel-l"),
    bevelRight: ids.id("bevel-r"),
    bevelBottom: ids.id("bevel-b"),
    recessRight: ids.id("recess-r"),
    recessBottom: ids.id("recess-b"),
    dropShadow: ids.id("drop"),
    grain: ids.id("grain"),
    offline: ids.id("offline"),
    blur: ids.id("blur"),
    blurWide: ids.id("blur-wide"),
    blurFine: ids.id("blur-fine"),
    pillShadow: ids.id("pill-shadow"),
  };
}

export const url = (id: string): string => `url(#${id})`;

/**
 * Brushed metal lit as in Wolf's photos, across [x, x + width]. `strength` scales the falloff
 * toward the sides: 1 for vertical faces, less for faces tipped up into the light (a hood's canopy).
 */
export function metalGradient(
  id: string,
  finish: MetalFinish,
  x: number,
  width: number,
  strength = 1,
  light: Falloff = OVEN_LIGHT,
): SVGTemplateResult {
  const mid = METALS[finish].mid;
  return svg`<linearGradient id=${id} gradientUnits="userSpaceOnUse" x1=${x} y1="0" x2=${x + width} y2="0">
    ${light.map(
      ([offset, factor]) =>
        svg`<stop offset=${offset} stop-color=${shade(mid, 1 - (1 - factor) * strength)} />`,
    )}
  </linearGradient>`;
}

/**
 * Definitions only some drawings use. Each is emitted only for a drawing that asks for it, which
 * keeps every drawing's markup to what it draws.
 */
export interface MaterialParts {
  /** The window's charcoal glass, also behind the touchscreen. */
  glass?: boolean;
  /** The black glass of the Transitional and Contemporary fronts. */
  blackGlass?: boolean;
  /** The shading of a Professional handle's end caps. */
  caps?: boolean;
  /** A knob's face. */
  knob?: boolean;
  /** The bezel ring around an oven knob, and the light along the knob's rim. */
  bezel?: boolean;
  bevel?: boolean;
  recess?: boolean;
  /** The soft shadow under handles and ledges. */
  dropShadow?: boolean;
  /** The slight blur, for crisp contact shadows. */
  fineBlur?: boolean;
  /** The wide blur, for light falling on surfaces. */
  wideBlur?: boolean;
  /** The shadow under readout pills. */
  pills?: boolean;
  /** The filter that flattens an appliance that's offline. */
  offline?: boolean;
}

export interface MaterialOptions {
  finish: MetalFinish;
  knobs: KnobColor;
  /** The appliance's extent in drawing units: gradients span it so all panels light alike. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** The studio light across the metal; the ovens' by default. */
  light?: Falloff;
  parts?: MaterialParts;
}

/** A white ramp over a face, from `from` to `to` opacity along the given direction. */
function ramp(
  id: string,
  [x1, y1, x2, y2]: readonly [number, number, number, number],
  from: number,
  to: number,
): SVGTemplateResult {
  return svg`<linearGradient id=${id} x1=${x1} y1=${y1} x2=${x2} y2=${y2}>
    <stop offset="0" stop-color="#fff" stop-opacity=${from} />
    <stop offset="1" stop-color="#fff" stop-opacity=${to} />
  </linearGradient>`;
}

/** The `<defs>` every Wolf stainless drawing shares, and the optional parts it asks for. */
export function materialDefs(m: Materials, options: MaterialOptions): SVGTemplateResult {
  const tones = METALS[options.finish];
  const knob = KNOBS[options.knobs] ?? KNOBS.red;
  const parts = options.parts ?? {};
  const { x, y, width, height } = options;
  const x2 = x + width;
  const y2 = y + height;
  // The grain is fine horizontal brushing, as fine as the range's: long in x, tight in y, and
  // barely there. Its contrast is the transfer slope, so darker finishes get a gentler grain.
  const slope = (0.1 * tones.grain).toFixed(3);
  const intercept = (0.5 - 0.05 * tones.grain).toFixed(3);
  const stops = (list: Array<[number, string]>) =>
    list.map(([offset, color]) => svg`<stop offset=${offset} stop-color=${color} />`);
  // Brushed satin over the ring's metal, which already falls off with the studio light: as in the
  // photos, only a little brighter on the side facing the oven's middle and about the panel's tone.
  const satin = svg`
    <stop offset="0" stop-color="#fff" stop-opacity="0.08" />
    <stop offset="0.5" stop-color="#fff" stop-opacity="0.02" />
    <stop offset="1" stop-color="#000" stop-opacity="0.05" />`;
  return svg`
    ${metalGradient(m.metal, options.finish, x, width, 1, options.light ?? OVEN_LIGHT)}
    <linearGradient id=${m.sheen} gradientUnits="userSpaceOnUse" x1="0" y1=${y} x2="0" y2=${y2}>
      <stop offset="0" stop-color="#fff" stop-opacity="0.06" />
      <stop offset="0.35" stop-color="#fff" stop-opacity="0" />
      <stop offset="0.7" stop-color="#000" stop-opacity="0" />
      <stop offset="1" stop-color="#000" stop-opacity="0.05" />
    </linearGradient>
    ${parts.glass
      ? svg`<linearGradient id=${m.glass} gradientUnits="userSpaceOnUse" x1=${x} y1="0" x2=${x2} y2="0">
          ${stops(WINDOW_GLASS)}
        </linearGradient>`
      : nothing}
    ${parts.blackGlass
      ? svg`<linearGradient id=${m.blackGlass} gradientUnits="userSpaceOnUse" x1=${x} y1="0" x2=${x2} y2="0">
          ${stops(BLACK_GLASS)}
        </linearGradient>`
      : nothing}
    ${satinTube(m.chrome)}
    ${parts.caps
      ? svg`
        <linearGradient id=${m.capEndLeft} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#000" stop-opacity="0.3" />
          <stop offset="0.25" stop-color="#000" stop-opacity="0.04" />
          <stop offset="0.4" stop-color="#fff" stop-opacity="0.1" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
        <linearGradient id=${m.capEndRight} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stop-color="#000" stop-opacity="0.34" />
          <stop offset="0.25" stop-color="#000" stop-opacity="0.06" />
          <stop offset="0.4" stop-color="#fff" stop-opacity="0.06" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>`
      : nothing}
    ${parts.knob ? knobFace(m.knob, knob) : nothing}
    ${parts.bezel
      ? svg`
        <linearGradient id=${m.knobRim}><stop offset="0" stop-color=${knob.rim} /></linearGradient>
        <linearGradient id=${m.bezelRight} x1="1" y1="0.65" x2="0" y2="0.35">${satin}</linearGradient>
        <linearGradient id=${m.bezelLeft} x1="0" y1="0.65" x2="1" y2="0.35">${satin}</linearGradient>`
      : nothing}
    ${parts.bevel
      ? svg`
        ${ramp(m.bevelTop, [0, 0, 0, 1], 0.03, 0.1)}
        ${ramp(m.bevelLeft, [0, 0, 1, 0], 0.1, 0.3)}
        ${ramp(m.bevelRight, [1, 0, 0, 0], 0.05, 0.19)}
        ${ramp(m.bevelBottom, [0, 1, 0, 0], 0.08, 0.24)}`
      : nothing}
    ${parts.recess
      ? svg`
        ${ramp(m.recessRight, [0, 0, 1, 0], 0.3, 0)}
        ${ramp(m.recessBottom, [0, 0, 0, 1], 0.3, 0)}`
      : nothing}
    ${parts.dropShadow
      ? svg`
        <linearGradient id=${m.dropShadow} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#000" stop-opacity="0.34" />
          <stop offset="0.45" stop-color="#000" stop-opacity="0.12" />
          <stop offset="1" stop-color="#000" stop-opacity="0" />
        </linearGradient>`
      : nothing}
    <filter id=${m.grain} x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.006 0.85" numOctaves="2" seed="11" result="noise" />
      <feColorMatrix in="noise" type="matrix"
        values="0.5 0.5 0 0 0  0.5 0.5 0 0 0  0.5 0.5 0 0 0  0 0 0 0 1" result="gray" />
      <feComponentTransfer in="gray" result="grain">
        <feFuncR type="linear" slope=${slope} intercept=${intercept} />
        <feFuncG type="linear" slope=${slope} intercept=${intercept} />
        <feFuncB type="linear" slope=${slope} intercept=${intercept} />
      </feComponentTransfer>
      <feBlend in="grain" in2="SourceGraphic" mode="overlay" result="brushed" />
      <feComposite in="brushed" in2="SourceAlpha" operator="in" />
    </filter>
    ${parts.offline ? offlineFilter(m.offline, OFFLINE) : nothing}
    <filter id=${m.blur} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.4" />
    </filter>
    ${parts.wideBlur
      ? svg`<filter id=${m.blurWide} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>`
      : nothing}
    ${parts.fineBlur
      ? svg`<filter id=${m.blurFine} x="-10%" y="-200%" width="120%" height="500%">
          <feGaussianBlur stdDeviation="0.6" />
        </filter>`
      : nothing}
    ${parts.pills
      ? svg`<filter id=${m.pillShadow} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>`
      : nothing}
  `;
}

/** A soft contact shadow under the appliance; darker on a dark page so it still reads. */
export function contactShadow(
  m: Materials,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  theme: "light" | "dark",
): SVGTemplateResult {
  const id = m.ids.id("contact");
  const strength = floorShadowStrength(theme);
  return svg`
    <radialGradient id=${id}>
      <stop offset="0" stop-color="#000" stop-opacity=${strength} />
      <stop offset="0.6" stop-color="#000" stop-opacity=${strength * 0.45} />
      <stop offset="1" stop-color="#000" stop-opacity="0" />
    </radialGradient>
    <ellipse cx=${cx} cy=${cy} rx=${rx} ry=${ry} fill=${url(id)} />
  `;
}

/** A metal tone scaled toward black (factor below 1) or white (above 1), as the light falls off. */
function shade(color: string, factor: number): string {
  return factor <= 1 ? mix("#000000", color, factor) : mix(color, "#ffffff", factor - 1);
}
