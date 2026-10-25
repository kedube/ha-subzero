import { svg, type SVGTemplateResult } from "lit";
import type { KnobColor } from "../../types";

/** SVG ids for one drawing: every id carries the drawing's uid. */
export interface Ids {
  id(name: string): string;
  url(name: string): string;
}

export function makeIds(uid: string): Ids {
  return {
    id: (name) => `${uid}-${name}`,
    url: (name) => `url(#${uid}-${name})`,
  };
}

/**
 * Brushed stainless brightness across Wolf's DF48850/S/P photo, lit by one broad studio light in
 * front of the middle, as a fraction of `SPAN`. The light falls off with inches from the
 * center, so a narrower range samples only the middle of this table and stays bright to its
 * edges, and a 60″ range runs past both ends.
 */
const STAINLESS: ReadonlyArray<readonly [number, number]> = [
  [0, 133],
  [0.05, 135],
  [0.12, 138],
  [0.2, 160],
  [0.3, 190],
  [0.4, 207],
  [0.5, 219],
  [0.58, 221],
  [0.66, 211],
  [0.75, 190],
  [0.85, 156],
  [0.95, 136],
  [1, 133],
];

/** The width the table spans, centered on the range: the 48″ body. */
const SPAN = 478.75;

/** Fades for lights and glows, unless the viewer asked for reduced motion. */
export function fade(opacity: number, reducedMotion: boolean): string {
  const value = Math.round(opacity * 100) / 100;
  return `opacity:${value}${reducedMotion ? "" : ";transition:opacity .6s ease"}`;
}

/** The photos' stainless is a touch warm; kept close to neutral so it sits with the refrigerators. */
export function gray(level: number): string {
  const l = Math.round(Math.min(255, Math.max(0, level)));
  return `rgb(${l},${l},${Math.max(0, l - 1)})`;
}

function stainlessLevel(fraction: number): number {
  const f = Math.min(1, Math.max(0, fraction));
  for (let index = 1; index < STAINLESS.length; index++) {
    const [o1, l1] = STAINLESS[index];
    if (f <= o1) {
      const [o0, l0] = STAINLESS[index - 1];
      return l0 + ((l1 - l0) * (f - o0)) / (o1 - o0);
    }
  }
  return STAINLESS[STAINLESS.length - 1][1];
}

/** The stainless brightness at `x` on a range `width` wide. */
export function stainlessAt(x: number, width: number): number {
  return stainlessLevel(0.5 + (x - width / 2) / SPAN);
}

interface KnobPalette {
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

const opacity = (value: number) => Math.round(Math.min(1, Math.max(0, value)) * 1000) / 1000;

/** A gradient across the body that follows the light: a color and opacity for each level. */
function acrossBody(
  ids: Ids,
  name: string,
  width: number,
  stop: (level: number) => readonly [string, number],
): SVGTemplateResult {
  return svg`<linearGradient id=${ids.id(name)} gradientUnits="userSpaceOnUse"
    x1=${width / 2 - SPAN / 2} y1="0" x2=${width / 2 + SPAN / 2} y2="0">
    ${STAINLESS.map(([offset, level]) => {
      const [color, alpha] = stop(level);
      return svg`<stop offset=${offset} stop-color=${color} stop-opacity=${alpha} />`;
    })}
  </linearGradient>`;
}

const stainlessGradient = (ids: Ids, name: string, width: number, delta: number) =>
  acrossBody(ids, name, width, (level) => [gray(level + delta), 1]);

/**
 * Black, strongest where the light is weakest: polished parts (handles, knobs) keep their
 * specular highlights at the sides, but their mid-tones fall off with the light.
 */
const falloff = (ids: Ids, name: string, width: number, strength: number) =>
  acrossBody(ids, name, width, (level) => ["#000", opacity((1 - level / 221) * strength)]);

/** A vertical overlay of white at the top and black at the bottom, by opacity. */
function shade(ids: Ids, name: string, top: number, bottom: number, mid = 0.4): SVGTemplateResult {
  return svg`<linearGradient id=${ids.id(name)} x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color=${top >= 0 ? "#fff" : "#000"} stop-opacity=${Math.abs(top)} />
    <stop offset=${mid} stop-color="#fff" stop-opacity="0" />
    <stop offset="1" stop-color=${bottom >= 0 ? "#fff" : "#000"} stop-opacity=${Math.abs(bottom)} />
  </linearGradient>`;
}

export function rangeDefs(ids: Ids, width: number, knobs: KnobColor): SVGTemplateResult {
  const knob = KNOB_PALETTE[knobs] ?? KNOB_PALETTE.red;
  return svg`<defs>
    ${stainlessGradient(ids, "ss", width, 0)}
    ${stainlessGradient(ids, "ss-rail", width, 18)}
    ${stainlessGradient(ids, "ss-panel", width, -10)}
    ${stainlessGradient(ids, "ss-cover", width, -4)}
    ${stainlessGradient(ids, "ss-deck", width, 8)}
    ${stainlessGradient(ids, "ss-dim", width, -26)}
    ${stainlessGradient(ids, "ss-toe", width, -32)}
    ${falloff(ids, "falloff", width, 0.78)}
    ${falloff(ids, "falloff-knob", width, 0.1)}
    ${
      // The strip of door above a pro handle is in its shadow: the photos show it a steady gray
      // (about 130) whatever the door's brightness, so each part of the door comes down to that.
      acrossBody(ids, "handle-shadow", width, (level) => ["#000", opacity(1 - 132 / level)])
    }
    ${
      // Low on the range the light is flatter: both photos level the hot spot off at about 205
      // below the windows and on the kick plate, and the sides read a few levels lighter.
      acrossBody(ids, "lower", width, (level) =>
        level >= 185 ? ["#000", opacity((level - 205) / level)] : ["#fff", opacity((165 - level) * 0.0013)],
      )
    }
    ${
      // The oven glass mirrors the studio light: lighter toward the middle of the range.
      acrossBody(ids, "glass-reflect", width, (level) => ["#fff", opacity((level - 133) * 0.00135)])
    }
    <linearGradient id=${ids.id("lower-fade")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.3" stop-color="#000" />
      <stop offset="0.78" stop-color="#fff" />
    </linearGradient>
    <mask id=${ids.id("lower-mask")} maskContentUnits="objectBoundingBox">
      <rect width="1" height="1" fill=${ids.url("lower-fade")} />
    </mask>
    ${(["l", "r"] as const).map(
      // The range's outer door corners just below the handles fall off sharply in both photos.
      (side) => svg`<radialGradient id=${ids.id(`corner-${side}`)} cx=${side === "l" ? 0 : 1} cy="0" r="1">
        <stop offset="0" stop-color="#000" stop-opacity="0.16" />
        <stop offset="0.5" stop-color="#000" stop-opacity="0.06" />
        <stop offset="1" stop-color="#000" stop-opacity="0" />
      </radialGradient>`,
    )}
    ${shade(ids, "shade-door", 0.05, 0)}
    ${shade(ids, "shade-panel", -0.17, 0.05, 0.3)}
    ${shade(ids, "shade-rail", 0.4, -0.06, 0.35)}
    ${shade(ids, "shade-plinth", 0.06, -0.03, 0.5)}
    ${shade(ids, "shade-open", -0.16, -0.3, 0.5)}

    <linearGradient id=${ids.id("rise")} x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#fff" />
      <stop offset="1" stop-color="#000" />
    </linearGradient>
    <mask id=${ids.id("rise-mask")} maskContentUnits="objectBoundingBox">
      <rect width="1" height="1" fill=${ids.url("rise")} />
    </mask>

    <linearGradient id=${ids.id("tube")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8a8988" />
      <stop offset="0.07" stop-color="#a09f9d" />
      <stop offset="0.11" stop-color="#cac9c7" />
      <stop offset="0.15" stop-color="#fbfbfa" />
      <stop offset="0.3" stop-color="#ffffff" />
      <stop offset="0.35" stop-color="#f7f7f6" />
      <stop offset="0.4" stop-color="#dfdedc" />
      <stop offset="0.45" stop-color="#d6d5d3" />
      <stop offset="0.53" stop-color="#e2e1df" />
      <stop offset="0.62" stop-color="#d8d7d5" />
      <stop offset="0.73" stop-color="#cdccca" />
      <stop offset="0.79" stop-color="#dad9d7" />
      <stop offset="0.85" stop-color="#f9f9f8" />
      <stop offset="0.9" stop-color="#f0efee" />
      <stop offset="0.95" stop-color="#bebdbb" />
      <stop offset="1" stop-color="#8c8b89" />
    </linearGradient>
    <linearGradient id=${ids.id("tube-glint")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0" />
      <stop offset="0.25" stop-color="#fff" stop-opacity="0.95" />
      <stop offset="0.7" stop-color="#fff" stop-opacity="0.95" />
      <stop offset="1" stop-color="#fff" stop-opacity="0" />
    </linearGradient>
    <linearGradient id=${ids.id("post-top")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c4c3c1" />
      <stop offset="1" stop-color="#ecebea" />
    </linearGradient>
    <linearGradient id=${ids.id("tube-side")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="0.2" />
      <stop offset="0.25" stop-color="#000" stop-opacity="0" />
      <stop offset="0.75" stop-color="#000" stop-opacity="0" />
      <stop offset="1" stop-color="#000" stop-opacity="0.2" />
    </linearGradient>
    <linearGradient id=${ids.id("post-end")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7a7977" />
      <stop offset="0.6" stop-color="#6b6a68" />
      <stop offset="1" stop-color="#555452" />
    </linearGradient>
    <linearGradient id=${ids.id("post-end-l")} x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stop-color="#7a7977" />
      <stop offset="0.6" stop-color="#6b6a68" />
      <stop offset="1" stop-color="#555452" />
    </linearGradient>

    <linearGradient id=${ids.id("bezel")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c4c6c7" />
      <stop offset="0.5" stop-color="#929496" />
      <stop offset="1" stop-color="#a2a4a6" />
    </linearGradient>
    <linearGradient id=${ids.id("bezel-in")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6c6e70" />
      <stop offset="1" stop-color="#5c5e60" />
    </linearGradient>
    <radialGradient id=${ids.id("knob")} cx="0.45" cy="0.32" r="0.8">
      <stop offset="0" stop-color=${knob.light} />
      <stop offset="0.45" stop-color=${knob.base} />
      <stop offset="0.85" stop-color=${knob.base} />
      <stop offset="1" stop-color=${knob.dark} />
    </radialGradient>

    <linearGradient id=${ids.id("glass")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#141516" />
      <stop offset="1" stop-color="#0f1011" />
    </linearGradient>
    <linearGradient id=${ids.id("sheen")} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0.15" stop-color="#fff" stop-opacity="0" />
      <stop offset="0.3" stop-color="#fff" stop-opacity="0.028" />
      <stop offset="0.42" stop-color="#fff" stop-opacity="0.008" />
      <stop offset="0.55" stop-color="#fff" stop-opacity="0" />
    </linearGradient>

    <linearGradient id=${ids.id("cavity")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#14161c" />
      <stop offset="1" stop-color="#0b0c10" />
    </linearGradient>
    <linearGradient id=${ids.id("porcelain")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#232637" />
      <stop offset="0.55" stop-color="#1b1d2a" />
      <stop offset="1" stop-color="#131420" />
    </linearGradient>
    <radialGradient id=${ids.id("lamp")} cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#fffaf0" />
      <stop offset="0.3" stop-color="#ffe6bd" stop-opacity="0.75" />
      <stop offset="1" stop-color="#ffd9a0" stop-opacity="0" />
    </radialGradient>
    <radialGradient id=${ids.id("pool")} cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffdcae" stop-opacity="0.3" />
      <stop offset="0.5" stop-color="#ffd6a0" stop-opacity="0.1" />
      <stop offset="1" stop-color="#ffd6a0" stop-opacity="0" />
    </radialGradient>
    <radialGradient id=${ids.id("heat")} cx="0.5" cy="-0.04" r="1">
      <stop offset="0" stop-color="#ff7a2a" stop-opacity="0.88" />
      <stop offset="0.18" stop-color="#ff5c16" stop-opacity="0.58" />
      <stop offset="0.42" stop-color="#c8340a" stop-opacity="0.26" />
      <stop offset="0.72" stop-color="#701606" stop-opacity="0.08" />
      <stop offset="1" stop-color="#3a0802" stop-opacity="0" />
    </radialGradient>
    <radialGradient id=${ids.id("heat-clean")} cx="0.5" cy="-0.06" r="1.1">
      <stop offset="0" stop-color="#ff8a3a" stop-opacity="0.95" />
      <stop offset="0.25" stop-color="#ff4c14" stop-opacity="0.68" />
      <stop offset="0.6" stop-color="#b3200a" stop-opacity="0.36" />
      <stop offset="1" stop-color="#5a0c02" stop-opacity="0.1" />
    </radialGradient>
    <linearGradient id=${ids.id("element")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ff5a1f" />
      <stop offset="0.5" stop-color="#ffb066" />
      <stop offset="1" stop-color="#ff5a1f" />
    </linearGradient>

    <linearGradient id=${ids.id("iron")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#434343" />
      <stop offset="0.3" stop-color="#383838" />
      <stop offset="1" stop-color="#2d2d2d" />
    </linearGradient>
    <linearGradient id=${ids.id("pan")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#262626" />
      <stop offset="0.7" stop-color="#1c1c1c" />
      <stop offset="1" stop-color="#151515" />
    </linearGradient>
    <linearGradient id=${ids.id("steel")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e3e4e5" />
      <stop offset="0.45" stop-color="#b7b9bb" />
      <stop offset="1" stop-color="#8f9295" />
    </linearGradient>
    <linearGradient id=${ids.id("ftop")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9d9fa1" />
      <stop offset="1" stop-color="#898b8d" />
    </linearGradient>
    <linearGradient id=${ids.id("ceramic")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3a3b3d" />
      <stop offset="0.35" stop-color="#232425" />
      <stop offset="1" stop-color="#121314" />
    </linearGradient>

    ${
      // The feet stand back under the kick plate, out of the light: both photos show them about
      // a fifth darker than the body above, a little lighter toward the floor.
      svg`<linearGradient id=${ids.id("foot")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000" stop-opacity="0.28" />
        <stop offset="0.25" stop-color="#000" stop-opacity="0.22" />
        <stop offset="1" stop-color="#000" stop-opacity="0.15" />
      </linearGradient>`
    }
    <linearGradient id=${ids.id("toe-shade")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0.35" />
      <stop offset="0.45" stop-color="#000" stop-opacity="0" />
    </linearGradient>
    <linearGradient id=${ids.id("reveal")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0.75" />
      <stop offset="0.22" stop-color="#000" stop-opacity="0.5" />
      <stop offset="0.3" stop-color="#000" stop-opacity="0.05" />
      <stop offset="0.85" stop-color="#000" stop-opacity="0.1" />
      <stop offset="1" stop-color="#000" stop-opacity="0.35" />
    </linearGradient>
    <linearGradient id=${ids.id("screen")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#15181c" />
      <stop offset="1" stop-color="#0a0b0d" />
    </linearGradient>
    <linearGradient id=${ids.id("band")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#b3121f" stop-opacity="0" />
      <stop offset="0.25" stop-color="#c0141f" stop-opacity="0.9" />
      <stop offset="0.75" stop-color="#c0141f" stop-opacity="0.9" />
      <stop offset="1" stop-color="#b3121f" stop-opacity="0" />
    </linearGradient>

    <filter id=${ids.id("noise")} x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.05 2" numOctaves="2" seed="7" stitchTiles="stitch" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.13 0 0 0 -0.078" result="light" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.13 0 0 0 0.052" result="dark" />
      <feMerge><feMergeNode in="dark" /><feMergeNode in="light" /></feMerge>
    </filter>
    <pattern id=${ids.id("grain")} patternUnits="userSpaceOnUse" width="320" height="160">
      <rect width="320" height="160" fill="#fff" filter=${ids.url("noise")} />
    </pattern>
    <filter id=${ids.id("soft")} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="1.1" />
    </filter>
    <filter id=${ids.id("softer")} x="-30%" y="-60%" width="160%" height="220%">
      <feGaussianBlur stdDeviation="2.4" />
    </filter>
    <filter id=${ids.id("floor")} x="-10%" y="-200%" width="120%" height="500%">
      <feGaussianBlur stdDeviation="3.2" />
    </filter>
    <filter id=${ids.id("halo")} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="0.9" />
    </filter>
    <filter id=${ids.id("glow")} x="-20%" y="-60%" width="140%" height="220%">
      <feGaussianBlur stdDeviation="2.2" />
    </filter>
    <filter id=${ids.id("pill-shadow")} x="-30%" y="-60%" width="160%" height="220%">
      <feGaussianBlur stdDeviation="1.4" />
    </filter>
    <filter id=${ids.id("offline")} color-interpolation-filters="sRGB">
      <feColorMatrix type="saturate" values="0.06" />
      <feComponentTransfer>
        <feFuncR type="linear" slope="0.6" intercept="0.24" />
        <feFuncG type="linear" slope="0.6" intercept="0.24" />
        <feFuncB type="linear" slope="0.6" intercept="0.24" />
      </feComponentTransfer>
    </filter>
  </defs>`;
}

/** The floor shadow's strength for the page theme: the one thing that adapts to it. */
export function floorShadow(theme: "light" | "dark"): number {
  return theme === "dark" ? 0.62 : 0.3;
}
