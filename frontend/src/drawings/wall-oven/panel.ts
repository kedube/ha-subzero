import { nothing, svg, type SVGTemplateResult } from "lit";
import type { OvenState } from "../types";
import {
  BEZEL_RADIUS,
  DOUBLE_KNOBS,
  KNOB_RADIUS,
  KNOB_Y,
  PANEL_HEIGHT,
  SCREEN,
  SINGLE_KNOBS,
  TM_PANEL_GLASS,
  WIDTH,
  type OvenSeries,
  type OvenStyle,
} from "./layout";
import { round, url, type Materials } from "./materials";

/** One cavity as the screen shows it. */
export interface ScreenCavity {
  position: "single" | "upper" | "lower";
  oven: OvenState;
}

export interface PanelOptions {
  m: Materials;
  /** Legends print dark on stainless and light on the black and carbon finishes. */
  darkFinish: boolean;
  style: OvenStyle;
  series: OvenSeries;
  double: boolean;
  knobs: boolean;
  cavities: ScreenCavity[];
  /** A kitchen timer or similar, already formatted. */
  display: string | null;
  reducedMotion: boolean;
  /** Drawing units per CSS pixel when the caller knows the drawing's size on screen. */
  unitsPerPixel: number | null;
}

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
/** Screen numerals keep their width, so a temperature doesn't shift as it changes. */
const NUMERALS = "font-variant-numeric: tabular-nums";
/** Below this on-screen size, the screen's small text and icons are dropped as illegible. */
const SMALLEST_TEXT_PX = 6;

/** The control panel's details over its brushed base: glass, screen, knobs and legends. */
export function panelDetails(o: PanelOptions): SVGTemplateResult {
  const { m } = o;
  if (o.style === "contemporary") {
    return svg`
      <rect x="0" y="0" width=${WIDTH} height=${PANEL_HEIGHT} fill=${url(m.blackGlass)} />
      <line x1="0" y1="0.4" x2=${WIDTH} y2="0.4" stroke="#fff" stroke-width="0.8" opacity="0.18" />
      ${screenContent(o, false)}
    `;
  }
  if (o.style === "transitional" && o.series === "m") {
    const g = TM_PANEL_GLASS;
    const frame0 = g.u0 - 6.6;
    const frame1 = g.u1 + 6.6;
    return svg`
      <line x1="0" y1="0.4" x2=${WIDTH} y2="0.4" stroke="#fff" stroke-width="0.8" opacity="0.5" />
      <line x1=${round(frame0)} y1="8.1" x2=${round(frame1)} y2="8.1" stroke="#fff" stroke-width="0.45" opacity="0.45" />
      <line x1=${round(frame0)} y1="8.7" x2=${round(frame1)} y2="8.7" stroke="#000" stroke-width="0.4" opacity="0.12" />
      <line x1=${round(frame0)} y1="8.1" x2=${round(frame0)} y2=${PANEL_HEIGHT} stroke="#fff" stroke-width="0.45" opacity="0.45" />
      <line x1=${round(frame1)} y1="8.1" x2=${round(frame1)} y2=${PANEL_HEIGHT} stroke="#fff" stroke-width="0.45" opacity="0.35" />
      <rect x=${round(g.u0)} y=${g.top} width=${round(g.u1 - g.u0)} height=${round(PANEL_HEIGHT - g.top)}
        fill=${url(m.blackGlass)} />
      <line x1=${round(g.u0)} y1=${g.top + 0.4} x2=${round(g.u1)} y2=${g.top + 0.4} stroke="#000" stroke-width="0.8" opacity="0.5" />
      ${screenContent(o, false)}
    `;
  }
  const knobs = o.knobs && o.style === "professional";
  return svg`
    <line x1="0" y1="0.4" x2=${WIDTH} y2="0.4" stroke="#fff" stroke-width="0.8" opacity="0.5" />
    ${knobs ? knobRow(o) : touchLegends(o.double, o.darkFinish)}
    ${screenFrame(m)}
    ${screenContent(o, true)}
  `;
}

/** The touchscreen: a slim brushed bezel, a touch lighter than the panel, around dark glass. */
function screenFrame(m: Materials): SVGTemplateResult {
  const { x, y, width, height } = SCREEN;
  const b = 2.3;
  return svg`
    <rect x=${x - b} y=${y - b} width=${width + b * 2} height=${height + b * 2} rx="0.8" fill="#fff" opacity="0.13" />
    <line x1=${x - b} y1=${y - b + 0.3} x2=${x + width + b} y2=${y - b + 0.3} stroke="#000" stroke-width="0.5" opacity="0.12" />
    <line x1=${x - b} y1=${y + height + b - 0.3} x2=${x + width + b} y2=${y + height + b - 0.3} stroke="#fff"
      stroke-width="0.6" opacity="0.5" />
    <rect x=${x} y=${y} width=${width} height=${height} fill="#2c2c2c" />
    <rect x=${x} y=${y} width=${width} height=${height} fill=${url(m.glass)} opacity="0.35" />
    <line x1=${x} y1=${y + 0.4} x2=${x + width} y2=${y + 0.4} stroke="#000" stroke-width="0.8" opacity="0.5" />
    <line x1=${x} y1=${y + height - 0.3} x2=${x + width} y2=${y + height - 0.3} stroke="#fff" stroke-width="0.4" opacity="0.12" />
  `;
}

type Icon = (x: number, y: number) => SVGTemplateResult;

/**
 * What the screen shows: each cavity that's on with its temperature and mode (and a preheat bar),
 * the timer, and probe, Remote Ready and self-clean lock icons. Dark when there's nothing to show,
 * as a real touchscreen sleeps (the drawing has no clock to show).
 */
function screenContent(o: PanelOptions, framed: boolean): SVGTemplateResult {
  const { x, y, width, height } = SCREEN;
  const on = o.cavities.filter((c) => c.oven.on && c.oven.temp);
  // Where the screen's small text and icons would be too small to read (a double oven on a small
  // card), it shows only what still reads: the temperatures and the preheat bars.
  const smallText = on.length === 1 && on[0].position === "single" ? 4.6 : 3.6;
  const detail = o.unitsPerPixel === null || smallText / o.unitsPerPixel >= SMALLEST_TEXT_PX;
  const probe = detail && o.cavities.some((c) => c.oven.probe);
  const remote = detail && o.cavities.some((c) => c.oven.remote_ready);
  const locked = detail && o.cavities.some((c) => c.oven.on && c.oven.self_clean);
  const icons = [probe ? probeIcon : null, remote ? remoteIcon : null, locked ? lockIcon : null].filter(
    (icon): icon is Icon => icon !== null,
  );
  if (!on.length && !o.display && !icons.length) return svg``;
  // On black glass the screen shows through without a visible edge, so it gets a little more room.
  const pad = framed ? 3 : 1;
  const left = x + pad;
  const right = x + width - pad;
  const parts: SVGTemplateResult[] = [];
  const iconRow = (iy: number) => icons.map((icon, index) => icon(right - 3.2 - index * 7.2, iy));
  if (!on.length) {
    if (o.display) {
      parts.push(svg`<text x=${x + width / 2} y=${y + height * 0.62} text-anchor="middle" font-size="10.5"
        font-weight="300" fill="#f2f2f2" font-family=${FONT} style=${NUMERALS}>${o.display}</text>`);
    }
    parts.push(...iconRow(y + height - 4.6));
  } else if (on.length === 1 && on[0].position === "single") {
    const oven = on[0].oven;
    const preheating = !oven.preheated && oven.progress !== null && oven.progress < 1;
    const modeWidth = right - left - 0.4 - (icons.length ? 8 : 0);
    parts.push(svg`
      <text x=${left} y=${y + height * 0.58} font-size="11.5" font-weight="300" fill="#f4f4f4"
        font-family=${FONT} style=${NUMERALS}>${oven.temp}</text>
      ${oven.mode && detail ? label(left + 0.4, y + height * 0.84, oven.mode, 4.6, modeWidth, "#c9c9c9") : nothing}
      ${preheating ? progressBar(left, y + height - 2.6, right - left, oven.progress ?? 0) : nothing}`);
    if (o.display && detail) {
      parts.push(svg`<text x=${right} y=${y + 6.6} text-anchor="end" font-size="4.8" fill="#e6e6e6"
        font-family=${FONT} style=${NUMERALS}>${o.display}</text>`);
    }
    parts.push(...iconRow(y + height * 0.55));
  } else {
    // A double oven lists each cavity on its own row, marked by which of two stacked boxes is lit;
    // the icons stand in their own column at the right.
    const rows = on.slice(0, 2);
    const rowHeight = (height - 2) / 2;
    const textRight = right - (icons.length ? 6.5 : 0);
    rows.forEach((cavity, index) => {
      const top = y + 1 + rowHeight * index;
      const oven = cavity.oven;
      const preheating = !oven.preheated && oven.progress !== null && oven.progress < 1;
      parts.push(svg`
        ${positionGlyph(left + 0.3, top + 3, cavity.position === "lower")}
        <text x=${left + 6} y=${top + rowHeight * 0.66} font-size="7" font-weight="300" fill="#f4f4f4"
          font-family=${FONT} style=${NUMERALS}>${oven.temp}</text>
        ${oven.mode && detail ? label(left + 27, top + rowHeight * 0.64, oven.mode, 3.6, textRight - left - 27, "#c9c9c9") : nothing}
        ${preheating ? progressBar(left + 6, top + rowHeight - 1.2, textRight - left - 6, oven.progress ?? 0) : nothing}`);
    });
    if (o.display && detail) {
      parts.push(svg`<text x=${textRight} y=${y + height - 1.6} text-anchor="end" font-size="3.6" fill="#e6e6e6"
        font-family=${FONT} style=${NUMERALS}>${o.display}</text>`);
    }
    icons.forEach((icon, index) => parts.push(icon(right - 2.6, y + 5 + index * 7.6)));
  }
  return svg`<g>${parts}</g>`;
}

/** Screen text, squeezed to fit when a translated word runs long. */
function label(x: number, y: number, text: string, size: number, width: number, fill: string): SVGTemplateResult {
  // A rough measure of system-ui at this size; only long words are squeezed.
  const estimate = text.length * size * 0.56;
  const fit = estimate > width ? round(width) : null;
  return svg`<text x=${round(x)} y=${round(y)} font-size=${size} fill=${fill} font-family=${FONT}
    textLength=${fit ?? nothing} lengthAdjust=${fit ? "spacingAndGlyphs" : nothing}>${text}</text>`;
}

function progressBar(x: number, y: number, width: number, progress: number): SVGTemplateResult {
  const filled = Math.max(0.8, width * Math.min(1, Math.max(0, progress)));
  return svg`
    <rect x=${round(x)} y=${round(y)} width=${round(width)} height="0.9" rx="0.45" fill="#fff" opacity="0.18" />
    <rect x=${round(x)} y=${round(y)} width=${round(filled)} height="0.9" rx="0.45" fill="#c8333c" />
  `;
}

/** Two stacked boxes, the upper or lower one lit: which cavity a row belongs to. */
function positionGlyph(x: number, y: number, lower: boolean): SVGTemplateResult {
  return svg`
    <rect x=${round(x)} y=${round(y)} width="3.6" height="2.2" rx="0.4" fill=${lower ? "none" : "#f0f0f0"}
      stroke="#f0f0f0" stroke-width="0.45" />
    <rect x=${round(x)} y=${round(y + 2.9)} width="3.6" height="2.2" rx="0.4" fill=${lower ? "#f0f0f0" : "none"}
      stroke="#f0f0f0" stroke-width="0.45" />
  `;
}

/** The temperature probe: a needle with a round grip. */
function probeIcon(x: number, y: number): SVGTemplateResult {
  return svg`<g fill="none" stroke="#f0f0f0" stroke-width="0.6" stroke-linecap="round">
    <line x1=${round(x - 3)} y1=${round(y + 2)} x2=${round(x + 1.2)} y2=${round(y - 2.2)} />
    <circle cx=${round(x + 2)} cy=${round(y - 3)} r="1.2" fill="#f0f0f0" />
  </g>`;
}

/** Remote Ready: the wireless arcs. */
function remoteIcon(x: number, y: number): SVGTemplateResult {
  return svg`<g fill="none" stroke="#f0f0f0" stroke-width="0.6" stroke-linecap="round">
    <path d=${`M ${round(x - 3.2)} ${round(y - 1.2)} A 4.6 4.6 0 0 1 ${round(x + 3.2)} ${round(y - 1.2)}`} />
    <path d=${`M ${round(x - 1.9)} ${round(y + 0.2)} A 2.7 2.7 0 0 1 ${round(x + 1.9)} ${round(y + 0.2)}`} />
    <circle cx=${round(x)} cy=${round(y + 1.8)} r="0.6" fill="#f0f0f0" stroke="none" />
  </g>`;
}

/** Self-clean: the door lock. */
function lockIcon(x: number, y: number): SVGTemplateResult {
  return svg`<g fill="none" stroke="#f0f0f0" stroke-width="0.6">
    <rect x=${round(x - 2.1)} y=${round(y - 0.6)} width="4.2" height="3.2" rx="0.5" fill="#f0f0f0" />
    <path d=${`M ${round(x - 1.3)} ${round(y - 0.6)} V ${round(y - 1.9)} A 1.3 1.3 0 0 1 ${round(x + 1.3)} ${round(y - 1.9)} V ${round(y - 0.6)}`} />
  </g>`;
}

/* ---------------------------------------------------------------------------------------------
 * M Series Professional knobs: a crimson (or black, or brushed) knob with a grip fin, in a brushed
 * bezel ring, its legends printed around it.
 */

/** The mode knob's legends, clockwise from lower left; off is at the top. */
const MODE_WORDS: Array<[number, string]> = [
  [-120, "MORE"],
  [-90, "ROAST"],
  [-60, "BROIL"],
  [-30, "BAKE"],
  [0, "OFF"],
  [30, "CONV"],
  [60, "C ROAST"],
  [90, "WARM"],
  [120, "GOURMET"],
];

/** The temperature knob's "LO · · TEMP · · HI" across its top. */
const TEMP_WORDS: Array<[number, string]> = [
  [-52, "LO"],
  [-36, "·"],
  [-22, "·"],
  [0, "TEMP"],
  [22, "·"],
  [36, "·"],
  [52, "HI"],
];

function knobRow(o: PanelOptions): SVGTemplateResult {
  const xs = o.double ? DOUBLE_KNOBS : SINGLE_KNOBS;
  const radius = o.double ? KNOB_RADIUS * 0.975 : KNOB_RADIUS;
  const legend = radius * (BEZEL_RADIUS / KNOB_RADIUS) + 1.5;
  // The left knob of each pair picks the mode: off points up, and the photos' Bake sits one stop
  // to the left. The right knob sets the temperature and rests upright.
  const modeAngle = (position: "single" | "upper" | "lower") => {
    const cavity = o.cavities.find((c) => c.position === position);
    return cavity?.oven.on ? -30 : 0;
  };
  const pairs = o.double
    ? [
        { mode: xs[0], temp: xs[1], angle: modeAngle("upper"), caption: "UPPER OVEN" },
        { mode: xs[2], temp: xs[3], angle: modeAngle("lower"), caption: "LOWER OVEN" },
      ]
    : [{ mode: xs[0], temp: xs[1], angle: modeAngle("single"), caption: null }];
  return svg`${pairs.map(
    (pair) => svg`
      ${arcWords(pair.mode, KNOB_Y, legend, MODE_WORDS, o.darkFinish)}
      ${arcWords(pair.temp, KNOB_Y, legend, TEMP_WORDS, o.darkFinish)}
      ${pair.caption ? printed((pair.mode + pair.temp) / 2, 40.2, pair.caption, o.darkFinish) : nothing}
      ${knob(o.m, pair.mode, KNOB_Y, radius, pair.angle, o.reducedMotion)}
      ${knob(o.m, pair.temp, KNOB_Y, radius, 0, o.reducedMotion)}`,
  )}`;
}

function knob(m: Materials, cx: number, cy: number, r: number, angle: number, reducedMotion: boolean): SVGTemplateResult {
  const bezel = r * (BEZEL_RADIUS / KNOB_RADIUS);
  const ring = (bezel + r) / 2;
  // A CSS transform, so the knob turns smoothly when it changes (unless motion is reduced).
  const turn = `transform-origin: ${cx}px ${cy}px; transform: rotate(${angle}deg);${
    reducedMotion ? "" : " transition: transform 400ms ease;"
  }`;
  const fin = r * 0.335;
  // The knob's flat top catches the light along its upper rim, as a short cylinder's chamfer does.
  const arc = (from: number, to: number, radius: number) => {
    const at = (deg: number): string => {
      const rad = (deg * Math.PI) / 180;
      return `${round(cx + radius * Math.cos(rad))} ${round(cy + radius * Math.sin(rad))}`;
    };
    return `M ${at(from)} A ${radius} ${radius} 0 0 1 ${at(to)}`;
  };
  // The ring is the panel's own brushed metal, so it carries the studio light across it as the
  // photos' does; a satin sheen, the knob's dark edge and the ring's bright inner lip finish it.
  return svg`
    <circle cx=${cx} cy=${cy + 0.9} r=${bezel + 0.5} fill="#000" opacity="0.06" />
    <circle cx=${cx} cy=${cy} r=${ring} fill="none" stroke=${url(m.metal)} stroke-width=${round(bezel - r)} />
    <circle cx=${cx} cy=${cy} r=${ring} fill="none" stroke=${url(cx < WIDTH / 2 ? m.bezelRight : m.bezelLeft)}
      stroke-width=${round(bezel - r)} />
    <circle cx=${cx} cy=${cy} r=${round(bezel + 0.4)} fill="none" stroke="#000" stroke-width="0.5" opacity="0.22" />
    <circle cx=${cx} cy=${cy} r=${round(r + 0.95)} fill="none" stroke="#fff" stroke-width="1" opacity="0.18" />
    <path d=${arc(195, 345, r + 0.9)} fill="none" stroke="#fff" stroke-width="0.6" stroke-linecap="round" opacity="0.4" />
    <circle cx=${cx} cy=${cy} r=${r} fill=${url(m.knob)} />
    <circle cx=${cx} cy=${cy} r=${round(r + 0.15)} fill="none" stroke="#000" stroke-width="0.7" opacity="0.5" />
    <path d=${arc(200, 340, r - 0.4)} fill="none" stroke=${url(m.knobRim)} stroke-width="0.8" stroke-linecap="round"
      opacity="0.6" />
    <g style=${turn}>
      <rect x=${round(cx - fin)} y=${round(cy - r * 0.94)} width=${round(fin * 2)} height=${round(r * 1.88)}
        rx=${round(r * 0.2)} fill=${url(m.knob)} />
      <line x1=${round(cx + fin - 0.4)} y1=${round(cy - r * 0.84)} x2=${round(cx + fin - 0.4)} y2=${round(cy + r * 0.84)}
        stroke="#000" stroke-width="0.8" opacity="0.18" />
      <line x1=${round(cx - fin + 0.35)} y1=${round(cy - r * 0.84)} x2=${round(cx - fin + 0.35)} y2=${round(cy + r * 0.84)}
        stroke="#fff" stroke-width="0.6" opacity="0.12" />
    </g>
  `;
}

/** Printing ink: dark gray on stainless, light gray on the dark finishes. */
const ink = (dark: boolean) => (dark ? "#d4d5d6" : "#2a2c2f");

/** Legends printed around a knob, each word set tangent to the circle as on the panel. */
function arcWords(cx: number, cy: number, radius: number, words: Array<[number, string]>, dark: boolean): SVGTemplateResult {
  return svg`${words.map(
    ([angle, word]) => svg`<text x=${cx} y=${round(cy - radius)} transform=${`rotate(${angle} ${cx} ${cy})`}
      text-anchor="middle" font-size=${word === "·" ? 2.6 : 1.85} font-weight="600" letter-spacing="0.03"
      fill=${ink(dark)} opacity=${dark ? 0.6 : 0.92} font-family=${FONT}>${word}</text>`,
  )}`;
}

/** A small legend printed on the panel. */
function printed(x: number, y: number, word: string, dark: boolean, size = 1.85): SVGTemplateResult {
  return svg`<text x=${round(x)} y=${round(y)} text-anchor="middle" font-size=${size} font-weight="600"
    letter-spacing="0.03" fill=${ink(dark)} opacity=${dark ? 0.6 : 0.92} font-family=${FONT}>${word}</text>`;
}

/**
 * E Series touch legends, printed on the stainless: the modes in two rows of five on the left,
 * Clear and Start beside the screen, and the number keys on the right.
 */
function touchLegends(double: boolean, dark: boolean): SVGTemplateResult {
  const top = ["BAKE", "ROAST", "BROIL", "WARM", "CLEAN"];
  const bottom = ["CONV", "C ROAST", "PROOF", "GOURMET", "MORE"];
  const words: SVGTemplateResult[] = [];
  const word = (x: number, y: number, text: string, size?: number) => words.push(printed(x, y, text, dark, size));
  top.forEach((text, i) => word(19.3 + i * 13.4, 20.3, text));
  bottom.forEach((text, i) => word(19.3 + i * 13.4, 30.2, text));
  if (double) {
    for (const [x, upper] of [
      [84.5, true],
      [97.5, false],
    ] as const) {
      word(x, 19.4, upper ? "UPPER" : "LOWER", 1.6);
      word(x, 21.3, "ON", 1.6);
      word(x, 29.3, upper ? "UPPER" : "LOWER", 1.6);
      word(x, 31.2, "OFF", 1.6);
    }
  } else {
    word(94.9, 30.2, "OFF");
  }
  word(203.4, 20.3, "CLEAR");
  word(203.4, 29.3, "START", 1.6);
  word(203.4, 31.2, "ENTER", 1.6);
  for (let i = 0; i < 5; i++) {
    word(228.3 + i * 12.7, 20.4, String(i + 1), 2.2);
    word(228.3 + i * 12.7, 30.3, String((i + 6) % 10), 2.2);
  }
  return svg`${words}`;
}
