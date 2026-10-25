import { nothing, svg, type SVGTemplateResult } from "lit";
import {
  HOOD_LIGHT,
  clamp,
  metalGradient,
  mix,
  points,
  round,
  url,
  type Materials,
  type Pt,
} from "../wall-oven/materials";

/**
 * Wolf's Pro Ventilation hoods (the 2026 50-generation: VWC wall chimney, VI island, VL liner),
 * measured from Wolf's front renderings and the Pro Ventilation Hoods design guide: an 18″ tall
 * canopy and front band, the canopy's top 18″ narrower than the hood, and below the band's rolled
 * edge the underside as the renderings show it from just below: a stainless flange around the
 * baffle filters, LED task lights, and two red paddle knobs (the light on the left, the fan on
 * the right).
 *
 * Drawing units are 0.1 inch; x runs from the hood's left edge, y down from the canopy's top.
 */

export const CANOPY = 122;
export const BAND = 30;
export const LIP = 9.5;
export const EDGE = 2.5;
export const UNDER = 16;

/** The band's lower strip is cut back this far at each end, down to the rolled edge. */
const CHAMFER = 3.5;
/** The underside's angled returns: their inset at the rolled edge and at the wall. */
const RETURN_FRONT = 1.5;
const RETURN_BACK = 18.5;
/** How far inside the returns the opening for the filters begins. */
const FLANGE = 13;
/** The underside, front to back: the flange's front strip, the baffles, the plain back strip. */
const FRONT_STRIP = 2.2;
const BAFFLE_ROW = 6.5;
const BACK_EDGE = 0.8;

/** Knobs sit 5.9″ either side of the middle; the outer lights 9.2″ in, as on the VWC3650P. */
const KNOB_OFFSET = 59;
const LIGHT_MARGIN = 92;
/** How close a light may come to a knob's center. */
const CLEARANCE = 24;
/** Baffle channels repeat every 1.77″, as in the renderings. */
const BAFFLE_PITCH = 17.7;
/**
 * How far the fan's paddle has turned at each speed, off to 4. It stops short of edge-on, where a
 * paddle seen from below would all but vanish; the light's knob turns the same way with brightness.
 */
const FAN_ANGLES = [0, 18, 32, 46, 60];

export interface HoodLook {
  /** Task light brightness 0–1, 0 when off. */
  light: number;
  /** The light's color as a display shows it. */
  lightColor: string;
  halo: boolean;
  /** Fan speed 0–4. */
  fan: number;
}

export interface HoodIds {
  baffles: string;
  /** The canopy's metal: it faces up into the light, so it falls off less than the band. */
  canopy: string;
  /** The flange under the hood, a touch darker toward the wall. */
  flange: string;
  /** An LED's frosted lens while it's off. */
  lens: string;
  /** A lamp's light washing the baffles around it. */
  lampGlow: string;
  wood: string;
  lightCone: string;
  fade: string;
  fadeMask: string;
  /** The soft blur of the vapor the fan draws up. */
  vapor: string;
}

export function hoodIds(uid: string): HoodIds {
  return {
    baffles: `${uid}-baffles`,
    canopy: `${uid}-canopy`,
    flange: `${uid}-flange`,
    lens: `${uid}-lens`,
    lampGlow: `${uid}-lamp-glow`,
    wood: `${uid}-wood`,
    lightCone: `${uid}-cone`,
    fade: `${uid}-fade`,
    fadeMask: `${uid}-fade-mask`,
    vapor: `${uid}-vapor`,
  };
}

/** White light as a product rendering shows it: creamy at 2700 K, neutral, faintly cool at 5000 K. */
const WHITES: Array<[number, string]> = [
  [2700, "#ffd29a"],
  [3500, "#ffe8c8"],
  [4000, "#fff4e6"],
  [5000, "#eef4ff"],
];

/** The display color of the task light's white, warm to cool, as the control sets it. */
export function whiteLight(kelvin: number | null): string {
  const k = clamp(kelvin ?? 3800, WHITES[0][0], WHITES[WHITES.length - 1][0]);
  for (let index = 1; index < WHITES.length; index++) {
    const [k1, c1] = WHITES[index];
    if (k <= k1) {
      const [k0, c0] = WHITES[index - 1];
      return mix(c0, c1, (k - k0) / (k1 - k0));
    }
  }
  return WHITES[WHITES.length - 1][1];
}

/**
 * The x positions of the task lights across a hood of this width. Where the even spacing would
 * put a light on a knob, that side's lights spread evenly from the outer light to the knob
 * instead, so no light crowds a knob and the spacing stays even.
 */
export function lightPositions(width: number): number[] {
  const count = width <= 300 ? 2 : width <= 420 ? 3 : width <= 540 ? 4 : 5;
  const mid = width / 2;
  const xs = Array.from({ length: count }, (_, i) => LIGHT_MARGIN + ((width - LIGHT_MARGIN * 2) * i) / (count - 1));
  const side = (sign: -1 | 1): number[] => {
    const knob = mid + sign * KNOB_OFFSET;
    const lights = xs.filter((x) => sign * (x - mid) > 1).sort((a, b) => sign * (b - a));
    if (!lights.some((x) => Math.abs(x - knob) < CLEARANCE)) return lights;
    const outer = sign < 0 ? Math.min(lights[0], knob - CLEARANCE) : Math.max(lights[0], knob + CLEARANCE);
    return lights.map((_, j) => outer + ((knob - outer) * j) / lights.length);
  };
  const center = xs.filter((x) => Math.abs(x - mid) <= 1);
  return [...side(-1), ...center, ...side(1)].sort((a, b) => a - b);
}

/** The underside's outline: the angled returns from the rolled edge back to the wall. */
function undersideOutline(x0: number, x1: number, under: number, band: boolean): Pt[] {
  const front = (band ? CHAMFER : 0) + RETURN_FRONT;
  return [
    [x0 + front, under],
    [x1 - front, under],
    [x1 - RETURN_BACK, under + UNDER],
    [x0 + RETURN_BACK, under + UNDER],
  ];
}

/** Pattern and gradient definitions the hood parts share. */
export function hoodDefs(ids: HoodIds, look: HoodLook, theme: "light" | "dark"): SVGTemplateResult {
  // On a white page the light falling below reads as a soft brightening, not colored smoke.
  const spill = theme === "light" ? mix(look.lightColor, "#ffffff", 0.5) : look.lightColor;
  return svg`
    <linearGradient id=${ids.flange} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c6c8ca" />
      <stop offset="1" stop-color="#b3b5b7" />
    </linearGradient>
    <linearGradient id=${ids.lens} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#d6d7d9" />
      <stop offset="0.3" stop-color="#e6e7e8" />
      <stop offset="0.62" stop-color="#cfd0d2" />
      <stop offset="0.85" stop-color="#a7a9ab" />
      <stop offset="1" stop-color="#b9bbbd" />
    </linearGradient>
    <linearGradient id=${ids.lightCone} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color=${spill} stop-opacity="0.85" />
      <stop offset="0.4" stop-color=${spill} stop-opacity="0.32" />
      <stop offset="1" stop-color=${spill} stop-opacity="0" />
    </linearGradient>
    <radialGradient id=${ids.lampGlow}>
      <stop offset="0" stop-color=${look.lightColor} stop-opacity="0.8" />
      <stop offset="0.45" stop-color=${look.lightColor} stop-opacity="0.32" />
      <stop offset="1" stop-color=${look.lightColor} stop-opacity="0" />
    </radialGradient>
    <linearGradient id=${ids.fade} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0" />
      <stop offset="0.6" stop-color="#fff" stop-opacity="1" />
    </linearGradient>
    <filter id=${ids.vapor} x="-200%" y="-30%" width="500%" height="160%">
      <feGaussianBlur stdDeviation="4" />
    </filter>
  `;
}

/**
 * The canopy: a sloped front narrowing from the hood's width to 18″ less at the top. It faces up
 * into the studio light, so it reads a touch brighter and more even than the vertical band below.
 */
export function canopyBase(m: Materials, ids: HoodIds, width: number, top: number): SVGTemplateResult {
  const inset = Math.min(90, width * 0.3);
  const face: Pt[] = [
    [inset, top],
    [width - inset, top],
    [width, top + CANOPY],
    [0, top + CANOPY],
  ];
  return svg`
    ${metalGradient(ids.canopy, "stainless", 0, width, 0.35, HOOD_LIGHT)}
    <polygon points=${points(face)} fill=${url(ids.canopy)} />
    <polygon points=${points(face)} fill=${url(m.sheen)} />
  `;
}

export function canopyDetails(width: number, top: number): SVGTemplateResult {
  const inset = Math.min(90, width * 0.3);
  return svg`
    <line x1=${inset} y1=${top + 0.4} x2=${width - inset} y2=${top + 0.4} stroke="#000" stroke-width="0.8"
      opacity="0.35" />
    <line x1=${inset + 0.3} y1=${top + 1.2} x2=${width - inset - 0.3} y2=${top + 1.2} stroke="#fff"
      stroke-width="0.6" opacity="0.35" />
    <line x1=${inset} y1=${top} x2="0" y2=${top + CANOPY} stroke="#fff" stroke-width="0.8" opacity="0.4" />
    <line x1=${width - inset} y1=${top} x2=${width} y2=${top + CANOPY} stroke="#000" stroke-width="0.8"
      opacity="0.2" />
  `;
}

/**
 * The front band and its darker lower strip, whose ends are cut back toward the rolled edge so
 * the band tapers into the underside's returns. The badge's spot is left plain.
 */
export function bandBase(m: Materials, x0: number, x1: number, top: number): SVGTemplateResult {
  const lip = top + BAND;
  const strip: Pt[] = [
    [x0, lip],
    [x1, lip],
    [x1 - CHAMFER, lip + LIP],
    [x0 + CHAMFER, lip + LIP],
  ];
  return svg`
    <rect x=${x0} y=${top} width=${round(x1 - x0)} height=${BAND} fill=${url(m.metal)} />
    <polygon points=${points(strip)} fill=${url(m.metal)} />
    <polygon points=${points(strip)} fill="#000" opacity="0.07" />
  `;
}

/**
 * The band's edges, its rolled lower edge, and the underside seen from just below: the stainless
 * flange with its angled returns, and in the opening the row of baffles, the plain strip behind
 * them, the filters' seams, the LED lights and the two knobs.
 */
export function frontDetails(
  m: Materials,
  ids: HoodIds,
  x0: number,
  x1: number,
  top: number,
  look: HoodLook,
  band = true,
): SVGTemplateResult {
  const w = x1 - x0;
  const mid = (x0 + x1) / 2;
  const lip = top + BAND;
  // A liner's front band hides inside its surround: its rolled edge sits right under the wood.
  const edge = band ? lip + LIP : top;
  const under = edge + EDGE;
  const bottom = under + UNDER;
  const cut = band ? CHAMFER : 0;
  const front = cut + RETURN_FRONT;
  const inset = (y: number) => front + ((RETURN_BACK - front) * (y - under)) / UNDER;
  const outline = undersideOutline(x0, x1, under, band);
  const baffleTop = under + FRONT_STRIP;
  const baffleBottom = baffleTop + BAFFLE_ROW;
  const backEdge = bottom - BACK_EDGE;
  const open = (y: number) => inset(y) + FLANGE;
  const opening: Pt[] = [
    [x0 + open(baffleTop), baffleTop],
    [x1 - open(baffleTop), baffleTop],
    [x1 - open(backEdge), backEdge],
    [x0 + open(backEdge), backEdge],
  ];
  const lights = lightPositions(w).map((x) => x0 + x);
  // Filter seams: a narrow middle filter between the knobs, as in the renderings.
  const seams = w >= 420 ? [mid - 41, mid + 41, x0 + w * 0.2, x1 - w * 0.2] : [mid - 41, mid + 41];
  // The baffles and the strip behind them end square; the opening's angled ends show the recess's
  // side walls, in shadow.
  const end0 = x0 + open(backEdge);
  const end1 = x1 - open(backEdge);
  const clipId = `${m.uid}-opening`;
  const undersideId = `${m.uid}-underside`;
  return svg`
    ${band
      ? svg`
        <line x1=${x0} y1=${top + 0.3} x2=${x1} y2=${top + 0.3} stroke="#000" stroke-width="0.6" opacity="0.22" />
        <line x1=${x0} y1=${top + 1.3} x2=${x1} y2=${top + 1.3} stroke="#fff" stroke-width="0.5" opacity="0.25" />
        <line x1=${x0} y1=${lip} x2=${x1} y2=${lip} stroke="#000" stroke-width="0.5" opacity="0.16" />
        <line x1=${x0} y1=${lip + 0.6} x2=${x1} y2=${lip + 0.6} stroke="#fff" stroke-width="0.5"
          opacity="0.3" />`
      : nothing}
    <polygon points=${points([[x0 + cut, edge], [x1 - cut, edge], [x1 - front, under], [x0 + front, under]])}
      fill=${url(m.chrome)} />
    <line x1=${x0 + cut} y1=${edge + 0.2} x2=${x1 - cut} y2=${edge + 0.2} stroke="#000" stroke-width="0.6"
      opacity="0.4" />
    <clipPath id=${undersideId}><polygon points=${points(outline)} /></clipPath>
    <clipPath id=${clipId}><polygon points=${points(opening)} /></clipPath>
    <polygon points=${points(outline)} fill=${url(ids.flange)} />
    <g clip-path=${url(clipId)}>
      <rect x=${x0} y=${round(baffleTop)} width=${round(w)} height=${round(backEdge - baffleTop)} fill="#57595b" />
      ${baffleRow(ids, end0, end1, mid, baffleTop, seams)}
      <rect x=${round(end0)} y=${round(baffleBottom)} width=${round(end1 - end0)} height=${round(backEdge - baffleBottom)}
        fill="#828486" />
      <line x1=${round(end0)} y1=${round(baffleBottom + 2.2)} x2=${round(end1)} y2=${round(baffleBottom + 2.2)} stroke="#fff"
        stroke-width="0.4" opacity="0.1" />
      <line x1=${round(end0)} y1=${round(baffleBottom + 4.4)} x2=${round(end1)} y2=${round(baffleBottom + 4.4)} stroke="#000"
        stroke-width="0.4" opacity="0.08" />
      <line x1=${round(end0)} y1=${round(baffleBottom + 0.2)} x2=${round(end1)} y2=${round(baffleBottom + 0.2)} stroke="#000"
        stroke-width="0.5" opacity="0.3" />
      ${[end0, end1].map(
        (x) => svg`<line x1=${round(x)} y1=${round(baffleTop)} x2=${round(x)} y2=${round(backEdge)} stroke="#000"
          stroke-width="0.4" opacity="0.3" />`,
      )}
      <rect x=${x0} y=${round(baffleTop)} width=${round(w)} height="1.6" fill="#000" opacity="0.18" />
    </g>
    <polygon points=${points(opening)} fill="none" stroke="#000" stroke-width="0.5" opacity="0.35" />
    <rect x=${round(end0)} y=${round(backEdge)} width=${round(end1 - end0)} height=${round(bottom - backEdge)} fill="#e4e5e6" />
    ${look.light > 0
      ? svg`<g clip-path=${url(undersideId)}>${lights.map(
          (x) => svg`<ellipse cx=${round(x)} cy=${round(under + 4)} rx="30" ry=${UNDER}
            fill=${url(ids.lampGlow)} opacity=${round(0.5 + 0.5 * look.light)} />`,
        )}</g>`
      : nothing}
    <clipPath id=${`${m.uid}-below-edge`}>
      <rect x=${round(x0 - 20)} y=${round(edge)} width=${round(w + 40)} height=${round(UNDER + EDGE + 20)} />
    </clipPath>
    <g clip-path=${url(`${m.uid}-below-edge`)}>${lights.map((x) => lamp(m, ids, x, under, look))}</g>
    ${knob(m, mid - KNOB_OFFSET, under, "light", look.light > 0 ? 18 + look.light * 42 : 0)}
    ${knob(m, mid + KNOB_OFFSET, under, "fan", FAN_ANGLES[Math.round(clamp(look.fan, 0, 4))])}
  `;
}

/**
 * The baffle filters seen from below, as the renderings show them: flat faces alternating with
 * deeper channels, each channel's side walls catching a little light and flaring into shadow at
 * their feet, and a latch in every other channel. Where two filters meet, their half faces make
 * one wide face split by the dark seam.
 */
function baffleRow(ids: HoodIds, x0: number, x1: number, mid: number, y: number, seams: number[]): SVGTemplateResult {
  const p = BAFFLE_PITCH;
  const face = 6.8;
  const half = 4.5;
  const h = BAFFLE_ROW;
  const wall = 2.5;
  const knee = h * 0.5;
  const channel = (c0: number, c1: number) => svg`
    <rect x=${round(c0)} y="0" width=${round(c1 - c0)} height=${h} fill=${url(`${ids.baffles}-back`)} />
    <path fill="#6a6c6e" d=${`M ${round(c0)} 0 H ${round(c0 + wall)} V ${round(knee)} Q ${round(c0 + wall)} ${round(h * 0.88)} ${round(c0)} ${h} Z`} />
    <path fill="#66686a" d=${`M ${round(c1)} 0 H ${round(c1 - wall)} V ${round(knee)} Q ${round(c1 - wall)} ${round(h * 0.88)} ${round(c1)} ${h} Z`} />
    <line x1=${round(c0 + 0.15)} y1="0" x2=${round(c0 + 0.15)} y2=${h} stroke="#000" stroke-width="0.3" opacity="0.3" />`;
  const cuts = [...seams].sort((a, b) => a - b);
  const bounds = [x0, ...cuts, x1];
  // Each filter's pattern has its own phase: the middle filter is centered, and the others start
  // from the seam nearer the middle with a half face, as in the renderings.
  const filters = bounds.slice(0, -1).map((s0, index) => {
    const s1 = bounds[index + 1];
    const anchor = s0 < mid && s1 > mid ? mid - face / 2 : s1 <= mid ? s1 - half - p : s0 + half + p - face;
    const id = `${ids.baffles}-${index}`;
    return svg`
      <pattern id=${id} patternUnits="userSpaceOnUse" x=${round(anchor)} y=${round(y)} width=${round(p * 2)} height=${h}>
        ${[0, p].map(
          (u) => svg`
            <rect x=${round(u)} y="0" width=${face} height=${h} fill="#9fa1a3" />
            ${channel(u + face, u + p)}`,
        )}
        <circle cx=${round(p + face + (p - face) / 2)} cy=${round(h * 0.36)} r="0.38" fill="#1c1e20" />
        <rect x=${round(p + face + (p - face) / 2 - 0.16)} y=${round(h * 0.44)} width="0.32" height=${round(h * 0.26)}
          rx="0.16" fill="#26282a" />
      </pattern>
      <rect x=${round(s0)} y=${round(y)} width=${round(s1 - s0)} height=${h} fill=${url(id)} />`;
  });
  return svg`
    <linearGradient id=${`${ids.baffles}-back`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#626466" />
      <stop offset="1" stop-color="#46484a" />
    </linearGradient>
    ${filters}
    ${cuts.map(
      (x) => svg`<rect x=${round(x - 2.4)} y=${round(y)} width="4.8" height=${h} fill="#9fa1a3" />
        <rect x=${round(x - 0.35)} y=${round(y)} width="0.7" height=${h} fill="#2c2e30" />`,
    )}
  `;
}

/**
 * An LED task light: a small frosted lens hanging from the front strip into the baffles, flat on
 * top and rounded below, as in the renderings. Off, it's a dim lens lit from the left; on, a
 * white core blooming in the light's color.
 */
function lamp(m: Materials, ids: HoodIds, x: number, under: number, look: HoodLook): SVGTemplateResult {
  const r = 2.05;
  const top = under + 0.3;
  const d = `M ${round(x - r)} ${round(top)} H ${round(x + r)} V ${round(top + 4.5 - r)} A ${r} ${r} 0 0 1 ${round(x - r)} ${round(top + 4.5 - r)} Z`;
  if (look.light <= 0) {
    return svg`<path d=${d} transform="translate(0 0.6)" fill="#000" opacity="0.16" /><path d=${d} fill=${url(ids.lens)} />`;
  }
  return svg`
    <circle cx=${round(x)} cy=${round(top + 2.4)} r="6" fill=${look.lightColor}
      opacity=${round(0.6 + 0.4 * look.light)} filter=${url(m.blur)} />
    <path d=${d} fill="#ffffff" />
  `;
}

/**
 * A paddle knob under the rolled edge: a polished disc seen edge-on, then the crimson knob, its
 * wide lip curving in to the paddle, printed "−  +" around its symbol. The paddle turns with the
 * setting (the fan's speed, the light's brightness).
 */
function knob(
  m: Materials,
  x: number,
  under: number,
  kind: "light" | "fan",
  angle: number,
): SVGTemplateResult {
  const top = under;
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const half = 3.45;
  const thick = 1.7;
  // The paddle's front and side faces, turned about its vertical axis and seen straight on.
  const front = Math.abs(half * 2 * cos);
  const side = Math.abs(thick * sin);
  const hw = Math.max(front + side, 0.6) / 2;
  const left = x - hw;
  const sideX = sin >= 0 ? left + front : left;
  const k = Math.min(0.8, hw);
  const y1 = top + 1.5;
  const y2 = top + 2.2;
  const y3 = top + 5.4;
  const shape = [
    `M ${round(x - 7.6)} ${round(y1)} L ${round(x + 7.6)} ${round(y1)}`,
    `Q ${round(x + hw)} ${round(y1)} ${round(x + hw)} ${round(y2)}`,
    `L ${round(x + hw)} ${round(y3 - k)} Q ${round(x + hw)} ${round(y3)} ${round(x + hw - k)} ${round(y3)}`,
    `L ${round(x - hw + k)} ${round(y3)} Q ${round(x - hw)} ${round(y3)} ${round(x - hw)} ${round(y3 - k)}`,
    `L ${round(x - hw)} ${round(y2)} Q ${round(x - hw)} ${round(y1)} ${round(x - 7.6)} ${round(y1)} Z`,
  ].join(" ");
  const showMarks = cos > 0.45;
  return svg`
    <ellipse cx=${x} cy=${round(top + 1.6)} rx="10.5" ry="1.6" fill="#000" opacity="0.2" />
    <path fill=${url(m.chrome)} d=${[
      `M ${round(x - 9.9)} ${round(top - 0.3)} Q ${x} ${round(top - 1.3)} ${round(x + 9.9)} ${round(top - 0.3)}`,
      `L ${round(x + 9.9)} ${round(top + 0.6)} Q ${x} ${round(top + 1.6)} ${round(x - 9.9)} ${round(top + 0.6)} Z`,
    ].join(" ")} />
    <path fill=${url(m.knob)} d=${shape} />
    ${side > 0.2
      ? svg`<rect x=${round(sideX)} y=${round(y2)} width=${round(side)} height=${round(y3 - y2 - 0.3)} fill="#000"
          opacity="0.3" />`
      : nothing}
    <line x1=${round(x - 7)} y1=${round(y1 + 0.15)} x2=${round(x + 7)} y2=${round(y1 + 0.15)} stroke="#fff"
      stroke-width="0.3" opacity="0.25" />
    ${showMarks
      ? svg`<g opacity=${round(cos * 0.85)} fill="#f4f4f4">
          <rect x=${round(x - 2.6 * cos - 0.45)} y=${round(top + 2.75)} width="0.9" height="0.28" />
          <rect x=${round(x + 2.6 * cos - 0.45)} y=${round(top + 2.75)} width="0.9" height="0.28" />
          <rect x=${round(x + 2.6 * cos - 0.14)} y=${round(top + 2.44)} width="0.28" height="0.9" />
          ${kind === "fan"
            ? svg`<circle cx=${round(x + sin * 1.2)} cy=${round(top + 4)} r="0.7" fill="none" stroke="#f4f4f4"
                stroke-width="0.28" />`
            : svg`<circle cx=${round(x + sin * 1.2)} cy=${round(top + 4)} r="0.5" />`}
        </g>`
      : nothing}
  `;
}

/**
 * Task light falling below the hood: a soft fan of light under each lamp, warm to cool. On a
 * light page it's gentler and paler, so it reads as light rather than as colored haze.
 */
export function lightSpill(
  m: Materials,
  ids: HoodIds,
  lights: number[],
  bottom: number,
  look: HoodLook,
  depth: number,
  theme: "light" | "dark",
): SVGTemplateResult {
  if (look.light <= 0) return svg``;
  const strength = round((0.3 + 0.6 * look.light) * (theme === "light" ? 0.4 : 1));
  return svg`
    <g opacity=${strength} filter=${url(m.blurWide)}>
      ${lights.map((x) => {
        // Starting a little inside the hood, so the blur leaves the light strongest just below it.
        const cone: Pt[] = [
          [x - 8, bottom - 10],
          [x + 8, bottom - 10],
          [x + 58, bottom + depth],
          [x - 58, bottom + depth],
        ];
        return svg`<polygon points=${points(cone)} fill=${url(ids.lightCone)} />`;
      })}
    </g>
  `;
}

/**
 * The vapor the fan draws up into the baffles: a few soft wisps between the lights, more and
 * quicker at higher speeds. Under reduced motion they hold still at the same density.
 */
export function fanVapor(
  m: Materials,
  ids: HoodIds,
  x0: number,
  x1: number,
  under: number,
  bottom: number,
  fan: number,
  theme: "light" | "dark",
  reducedMotion: boolean,
): SVGTemplateResult {
  if (fan <= 0) return svg``;
  const count = 2 + Math.round(clamp(fan, 0, 4));
  const span = x1 - x0;
  const duration = round(4.4 - 0.8 * fan);
  const name = `${m.uid}-vapor`;
  const clipId = `${m.uid}-vapor-clip`;
  const fadeId = `${m.uid}-vapor-fade`;
  const wisps = Array.from({ length: count }, (_, i) => {
    // Spread across the middle of the hood, nudged a little so no wisp sits squarely on a light.
    const x = x0 + span * (0.14 + (0.72 * (i + 0.5)) / count) + (i % 2 ? 4 : -4);
    const sway = i % 2 ? 6 : -6;
    const d = [
      `M ${round(x - sway * 0.3)} ${round(bottom + 42)}`,
      `C ${round(x + sway)} ${round(bottom + 31)} ${round(x - sway)} ${round(bottom + 17)}`,
      `${round(x + sway * 0.2)} ${round(bottom + 4)}`,
    ].join(" ");
    const style = reducedMotion
      ? `transform: translateY(${(i % 3) * 9 - 6}px)`
      : `animation: ${name} ${duration}s linear infinite; animation-delay: ${round((-duration * i) / count)}s`;
    return svg`<path d=${d} fill="none" stroke=${url(fadeId)} stroke-width="8" stroke-linecap="round" style=${style} />`;
  });
  const color = theme === "dark" ? "#ffffff" : "#9aa3ad";
  return svg`
    ${reducedMotion
      ? nothing
      : svg`<style>${
          `@keyframes ${name}{0%{transform:translateY(40px);opacity:0}35%{opacity:1}` +
          `75%{opacity:.7}100%{transform:translateY(-8px);opacity:0}}`
        }</style>`}
    <linearGradient id=${fadeId} gradientUnits="userSpaceOnUse" x1="0" y1=${round(bottom + 4)} x2="0" y2=${round(bottom + 42)}>
      <stop offset="0" stop-color=${color} stop-opacity="0" />
      <stop offset="0.3" stop-color=${color} stop-opacity="1" />
      <stop offset="0.6" stop-color=${color} stop-opacity="0.75" />
      <stop offset="1" stop-color=${color} stop-opacity="0" />
    </linearGradient>
    <clipPath id=${clipId}>
      <rect x=${round(x0 - 30)} y=${round(under)} width=${round(span + 60)} height=${round(bottom - under + 120)} />
    </clipPath>
    <g clip-path=${url(clipId)}>
      <g opacity=${theme === "dark" ? 0.15 : 0.2} filter=${url(ids.vapor)}>${wisps}</g>
    </g>
  `;
}

/** The halo: a soft ring of light along the underside's edges, and the light it sheds below. */
export function halo(m: Materials, x0: number, x1: number, edge: number, band = true): SVGTemplateResult {
  const color = "#ffeccc";
  const fall = `${m.uid}-halo-fall`;
  const clipId = `${m.uid}-halo-clip`;
  const under = edge + EDGE;
  const bottom = under + UNDER;
  const outline = undersideOutline(x0, x1, under, band);
  return svg`
    <linearGradient id=${fall} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color=${color} stop-opacity="0.6" />
      <stop offset="1" stop-color=${color} stop-opacity="0" />
    </linearGradient>
    <clipPath id=${clipId}><polygon points=${points(outline)} /></clipPath>
    <g clip-path=${url(clipId)}>
      <polygon points=${points(outline)} fill=${color} opacity="0.22" />
      <g filter=${url(m.blur)}>
        <line x1=${x0} y1=${under + 0.6} x2=${x1} y2=${under + 0.6} stroke=${color} stroke-width="3" />
        <line x1=${x0} y1=${bottom - 1.2} x2=${x1} y2=${bottom - 1.2} stroke=${color} stroke-width="2.4" />
      </g>
      <line x1=${x0} y1=${under + 0.3} x2=${x1} y2=${under + 0.3} stroke="#fffaf2" stroke-width="0.7" />
    </g>
    <rect x=${round(x0 + RETURN_BACK)} y=${bottom} width=${round(x1 - x0 - RETURN_BACK * 2)} height="16"
      fill=${url(fall)} filter=${url(m.blur)} />
  `;
}

/** The island hood's telescoping chimney, fading toward the ceiling it rises to. */
export function chimney(
  m: Materials,
  ids: HoodIds,
  width: number,
  top: number,
  height: number,
): SVGTemplateResult {
  const w = Math.min(150, width * 0.36);
  const x = round((width - w) / 2);
  const y = round(top - height);
  // The telescoping joint, where the upper section slides into the lower, below the fade.
  const joint = round(top - height * 0.3);
  return svg`
    <mask id=${ids.fadeMask} maskUnits="userSpaceOnUse" x=${x - 1} y=${y} width=${w + 2} height=${height + 1}>
      <rect x=${x - 1} y=${y} width=${w + 2} height=${height + 1} fill=${url(ids.fade)} />
    </mask>
    <g mask=${url(ids.fadeMask)}>
      <g filter=${url(m.grain)}>
        <rect x=${x} y=${y} width=${round(w)} height=${height} fill=${url(m.metal)} />
      </g>
      <line x1=${x + 0.4} y1=${y} x2=${x + 0.4} y2=${top} stroke="#fff" stroke-width="0.8" opacity="0.45" />
      <line x1=${round(x + w - 0.4)} y1=${y} x2=${round(x + w - 0.4)} y2=${top} stroke="#000" stroke-width="0.8"
        opacity="0.2" />
      <line x1=${x + 6} y1=${joint} x2=${round(x + w - 6)} y2=${joint} stroke="#000" stroke-width="0.6"
        opacity="0.18" />
    </g>
    <line x1=${x} y1=${top - 0.4} x2=${round(x + w)} y2=${top - 0.4} stroke="#000" stroke-width="0.8" opacity="0.3" />
  `;
}

/** Contour bands for the oak's cathedral figure: thin darker lines across a slowly varying field. */
const RINGS = Array.from({ length: 145 }, (_, i) => (i % 8 === 7 ? 0.2 : 0.62)).join(" ");
const OPAQUE = "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1";

/**
 * The custom hood a liner sits in: a gray-stained oak surround, as Wolf's VL rendering shows it,
 * with a fine, straight, low-contrast grain running down, the faint arches of the oak's cathedral
 * figure, and a shaded reveal where it meets the liner's front.
 */
export function surround(
  m: Materials,
  ids: HoodIds,
  width: number,
  height: number,
): SVGTemplateResult {
  return svg`
    <filter id=${ids.wood} x="-0.05" y="-0.05" width="1.1" height="1.1" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.9 0.004" numOctaves="2" seed="4" result="noise" />
      <feColorMatrix in="noise" type="matrix" values=${OPAQUE} result="lines" />
      <feTurbulence type="fractalNoise" baseFrequency="0.022 0.0026" numOctaves="1" seed="7" result="slow" />
      <feColorMatrix in="slow" type="matrix" values=${OPAQUE} result="field" />
      <feComponentTransfer in="field" result="rings">
        <feFuncR type="table" tableValues=${RINGS} />
        <feFuncG type="table" tableValues=${RINGS} />
      </feComponentTransfer>
      <feComposite in="rings" in2="lines" operator="arithmetic" k2="1" k3="0.5" k4="-0.37" result="figure" />
      <feColorMatrix in="figure" type="matrix" result="gray"
        values="0.6 0.4 0 0 0  0.6 0.4 0 0 0  0.6 0.4 0 0 0  0 0 0 0 1" />
      <feComponentTransfer in="gray" result="grain">
        <feFuncR type="linear" slope="0.1" intercept="0.455" />
        <feFuncG type="linear" slope="0.1" intercept="0.455" />
        <feFuncB type="linear" slope="0.1" intercept="0.455" />
      </feComponentTransfer>
      <feBlend in="grain" in2="SourceGraphic" mode="overlay" result="wood" />
      <feComposite in="wood" in2="SourceAlpha" operator="in" />
    </filter>
    <linearGradient id=${`${m.uid}-stain`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#4b4d4f" />
      <stop offset="0.5" stop-color="#5c5e60" />
      <stop offset="1" stop-color="#46484a" />
    </linearGradient>
    <rect x="0" y="0" width=${width} height=${height} fill=${url(`${m.uid}-stain`)}
      filter=${url(ids.wood)} />
    <rect x="0" y="0" width=${width} height=${height} fill=${url(m.sheen)} />
    <line x1="0" y1="0.4" x2=${width} y2="0.4" stroke="#fff" stroke-width="0.6" opacity="0.2" />
    <rect x="0" y=${height - 2} width=${width} height="2" fill="#000" opacity="0.3" />
  `;
}
