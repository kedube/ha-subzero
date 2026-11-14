import { nothing, svg, type SVGTemplateResult } from "lit";
import { clamp } from "./materials-core";

/*
 * UI drawn over an appliance: small dark frosted labels and chips that read as interface, not as
 * part of the appliance, so they look the same on every finish and in both themes. They're laid
 * out in CSS pixels (a 20 px pill with 12 px text) and scaled into the drawing by `labelScale`,
 * so they show at the same size on a small card and in the large full view.
 *
 * Every drawing module draws its readouts from here. What differs between them is passed in:
 * the blur under a pill is each drawing's own filter, and a drawing that rounds its numbers
 * hands over its rounding.
 */

/** Height of a label or chip, in CSS pixels. */
export const LABEL_H = 20;
export const TEXT_SIZE = 12;
/** An icon's size in a label or chip. */
export const ICON = 13;
/** The gap between the pills of a row, and between rows. */
const GAP = 4;
/** Room for a progress ring or an icon before the text. */
const LEAD = 16;
const PAD_L = 7;
const PAD_R = 9;
const RING_R = 5.6;

/**
 * How a pill's backing is painted. The frost is one paint everywhere, but a renderer can round a
 * color's own alpha and a separate opacity a level apart, so a drawing that writes its alpha as
 * opacity attributes keeps doing so.
 */
export interface FrostPaint {
  fill: string;
  stroke: string;
  fillOpacity?: number;
  strokeOpacity?: number;
}

const FROST: FrostPaint = { fill: "rgba(20, 22, 25, 0.6)", stroke: "rgba(255, 255, 255, 0.22)" };
export const TEXT_STYLE = "font-family: var(--ha-font-family-body, Roboto, system-ui); font-variant-numeric: tabular-nums";

const same = (value: number) => value;

/**
 * Drawing units per CSS pixel of label, for a drawing whose viewBox is `viewHeight` tall and
 * that's shown `pixelHeight` CSS pixels tall. Without the pixel height, text is about 3% of the
 * drawing's height. A pill never takes more than an eighth of a tiny drawing (a thumbnail).
 */
export function labelScale(viewHeight: number, pixelHeight?: number): number {
  const most = (0.125 * viewHeight) / LABEL_H;
  if (pixelHeight && pixelHeight > 0) return Math.min(viewHeight / pixelHeight, most);
  return (0.03 * viewHeight) / TEXT_SIZE;
}

/** A scale as a transform writes it: three decimals are plenty. */
export function scaleFactor(scale: number): number {
  return Math.round(scale * 1000) / 1000;
}

/** Which characters are set narrow, and how wide (in em), when a label's text is measured. */
export interface TextMetrics {
  narrow: RegExp;
  narrowEm: number;
}

const LABEL_TEXT: TextMetrics = { narrow: /[:.,'° ]/, narrowEm: 0.34 };

/** Rough text width: the panel's own font draws it, so leave room for a wide one. */
export function textWidth(text: string, metrics: TextMetrics = LABEL_TEXT): number {
  let em = 0;
  for (const char of text) em += metrics.narrow.test(char) ? metrics.narrowEm : /[0-9]/.test(char) ? 0.6 : 0.64;
  return em * TEXT_SIZE;
}

/**
 * The frosted backing every label and chip shares: a hairline edge and a soft drop shadow.
 * `shadow` is the drawing's blur filter, as url(#…); `fix` rounds the pill's sides.
 */
export function frost(
  shadow: string,
  x: number,
  y: number,
  w: number,
  fix: (value: number) => number = same,
  paint: FrostPaint = FROST,
): SVGTemplateResult {
  const r = LABEL_H / 2;
  return svg`
    <rect x=${fix(x + 0.5)} y=${y + 1.2} width=${fix(w - 1)} height=${LABEL_H} rx=${r} fill="#000" opacity="0.28"
      filter=${shadow} />
    <rect x=${fix(x)} y=${y} width=${fix(w)} height=${LABEL_H} rx=${r} fill=${paint.fill}
      fill-opacity=${paint.fillOpacity ?? nothing} stroke=${paint.stroke} stroke-opacity=${paint.strokeOpacity ?? nothing}
      stroke-width="1" />
  `;
}

export type OverlayIcon =
  | "probe"
  | "remote"
  | "lock"
  | "check"
  | "rinse"
  | "salt"
  | "error"
  | "clock"
  | "pause"
  | "ice"
  | "ice-max"
  | "ice-night"
  | "cleaning";

/** An ice cube: ice is being made. */
const CUBE = svg`<path d="M0 -8 7 -4V4L0 8-7 4V-4Z M-7 -4 0 0 7 -4M0 0V8" fill="#fff" fill-opacity="0.16" stroke="#fff" stroke-width="1.7" stroke-linejoin="round" />`;

function glyph(kind: OverlayIcon): SVGTemplateResult {
  switch (kind) {
    case "probe":
      return svg`<g fill="none" stroke="#fff" stroke-linecap="round">
        <path d="M-2.4 2.4L6.4 -6.4" stroke-width="1.8" />
        <path d="M-6.6 6.6L-2.8 2.8" stroke-width="4.4" />
      </g>`;
    case "remote":
      return svg`<g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">
        <path d="M-7.2 -1.6A10 10 0 0 1 7.2 -1.6" />
        <path d="M-4.4 1.4A6 6 0 0 1 4.4 1.4" />
        <circle cx="0" cy="5" r="1.3" fill="#fff" stroke="none" />
      </g>`;
    case "lock":
      return svg`<path d="M-4 -1.5V-3.8A4 4 0 0 1 4 -3.8V-1.5" fill="none" stroke="#fff" stroke-width="2" />
        <rect x="-6" y="-1.5" width="12" height="9" rx="1.8" fill="#fff" />`;
    case "check":
      return svg`<path d="M-6 0.5 L-1.8 4.6 L6.4 -4.4" fill="none" stroke="#fff" stroke-width="2.6"
        stroke-linecap="round" stroke-linejoin="round" />`;
    case "rinse":
      return svg`<path d="M0 -7.5 C3.2 -3.2 5.6 -0.4 5.6 2.6 A5.6 5.6 0 0 1 -5.6 2.6 C-5.6 -0.4 -3.2 -3.2 0 -7.5 Z"
          fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round" />
        <path d="M-4.3 3.6 A4.4 4.4 0 0 0 4.3 3.6 Z" fill="#fff" />`;
    case "salt":
      return svg`<g fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round">
        <path d="M0 -6.5 L6 -3.2 L6 3.6 L0 6.9 L-6 3.6 L-6 -3.2 Z" />
        <path d="M-6 -3.2 L0 0.2 L6 -3.2 M0 0.2 L0 6.9" />
      </g>`;
    case "error":
      return svg`<path d="M0 -6 V1.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round" />
        <circle cx="0" cy="5.6" r="1.6" fill="#fff" />`;
    case "clock":
      return svg`<g fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round">
        <circle cx="0" cy="0" r="7" />
        <path d="M0 -3.8 V0 L2.8 2" />
      </g>`;
    case "pause":
      return svg`<rect x="-4.6" y="-5.5" width="3.2" height="11" rx="1" fill="#fff" />
        <rect x="1.4" y="-5.5" width="3.2" height="11" rx="1" fill="#fff" />`;
    case "ice":
      return CUBE;
    case "ice-max":
      return svg`${CUBE}<path d="M11 -9V-3M8 -6H14" stroke="#fff" stroke-width="2" stroke-linecap="round" />`;
    case "ice-night":
      return svg`${CUBE}<path d="M12.6 -10.4A3.6 3.6 0 1 0 14.4 -4.2 2.9 2.9 0 1 1 12.6 -10.4Z" fill="#fff" />`;
    case "cleaning":
      return svg`<path d="M-1 -7.5C2.4 -2.8 4.6 0 4.6 2.8A5.6 5.6 0 0 1 -6.6 2.8C-6.6 0 -4.4 -2.8 -1 -7.5Z" fill="#fff" fill-opacity="0.2" stroke="#fff" stroke-width="1.7" stroke-linejoin="round" />
        <path d="M6.2 -8.6 6.9 -6.9 8.6 -6.2 6.9 -5.5 6.2 -3.8 5.5 -5.5 3.8 -6.2 5.5 -6.9Z" fill="#fff" />`;
  }
}

/** A monochrome white icon on a 20-unit grid centered on (cx, cy), drawn `size` pixels across. */
export function icon(kind: OverlayIcon, cx: number, cy: number, size = ICON): SVGTemplateResult {
  return svg`<g transform=${`translate(${cx} ${cy}) scale(${size / 20})`} opacity="0.85">${glyph(kind)}</g>`;
}

/** What a drawing brings to its readouts. */
export interface OverlayStyle {
  /** The drawing's soft blur under each pill, as url(#…). */
  shadow: string;
  /** Rounds what the layout works out, for a drawing that rounds its numbers. */
  fix?: (value: number) => number;
}

export interface LabelSpec {
  text?: string | null;
  /** 0–1 draws a progress ring before the text; null leaves it out. */
  progress?: number | null;
  /** An icon before the text, used when there is no progress ring. */
  icon?: OverlayIcon | null;
}

/** The width a label takes in CSS pixels, so callers can lay labels and chips out in a row. */
export function labelWidth(spec: LabelSpec): number {
  if (!spec.text) return LABEL_H;
  const lead = spec.progress != null || spec.icon ? LEAD : 0;
  return Math.max(LABEL_H, PAD_L + lead + textWidth(spec.text) + PAD_R);
}

/**
 * A frosted label with its left edge at x: an optional progress ring or icon, then text (a
 * reading). With no text it's a round chip holding just the ring or icon.
 */
export function label(style: OverlayStyle, x: number, cy: number, spec: LabelSpec, reducedMotion: boolean): SVGTemplateResult {
  const fix = style.fix ?? same;
  const w = labelWidth(spec);
  const lead = spec.progress != null || !!spec.icon;
  const leadCx = spec.text ? x + PAD_L + LEAD / 2 : x + w / 2;
  const circumference = 2 * Math.PI * RING_R;
  const progress = clamp(spec.progress ?? 0);
  return svg`
    ${frost(style.shadow, x, cy - LABEL_H / 2, w)}
    ${
      spec.progress != null
        ? svg`
          <circle cx=${leadCx} cy=${cy} r=${RING_R} fill="none" stroke="#fff" stroke-opacity="0.24" stroke-width="1.9" />
          <circle cx=${leadCx} cy=${cy} r=${RING_R} fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round"
            stroke-dasharray=${fix(circumference)} stroke-dashoffset=${fix(circumference * (1 - progress))}
            transform=${`rotate(-90 ${leadCx} ${cy})`}
            style=${reducedMotion ? "" : "transition: stroke-dashoffset 0.6s ease"} />`
        : spec.icon
          ? icon(spec.icon, leadCx, cy)
          : nothing
    }
    ${
      spec.text
        ? svg`<text x=${lead ? x + PAD_L + LEAD : x + w / 2} y=${cy} fill="#fff" font-size=${TEXT_SIZE} font-weight="600"
            text-anchor=${lead ? "start" : "middle"} dominant-baseline="central" style=${TEXT_STYLE}>${spec.text}</text>`
        : nothing
    }
  `;
}

/** A round frosted chip holding one icon, its left edge at x. */
export function chip(style: OverlayStyle, x: number, cy: number, kind: OverlayIcon): SVGTemplateResult {
  return svg`${frost(style.shadow, x, cy - LABEL_H / 2, LABEL_H)}${icon(kind, x + LABEL_H / 2, cy)}`;
}

/** Where a readout goes: an oven's window, or the opening of a dropped door, in drawing units. */
export interface Zone {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** A readout's content: a label, then chips. */
export interface Readout {
  label: LabelSpec | null;
  chips: OverlayIcon[];
}

/**
 * A readout centered in a zone, in the zone's upper part, clear of what's above it. Rows wrap to
 * the zone's width; `scale` is drawing units per CSS pixel.
 */
export function zoneReadout(
  style: OverlayStyle,
  zone: Zone,
  content: Readout,
  scale: number,
  reducedMotion: boolean,
): SVGTemplateResult {
  const fix = style.fix ?? same;
  const { label: spec, chips } = content;
  const items = [
    ...(spec ? [{ w: labelWidth(spec), draw: (x: number, cy: number) => label(style, x, cy, spec, reducedMotion) }] : []),
    ...chips.map((kind) => ({ w: LABEL_H, draw: (x: number, cy: number) => chip(style, x, cy, kind) })),
  ];
  const room = (zone.x1 - zone.x0) / scale - 8;
  const rows: (typeof items)[] = [];
  for (const item of items) {
    const row = rows[rows.length - 1];
    const used = row ? row.reduce((sum, other) => sum + other.w + GAP, 0) : 0;
    if (row && used + item.w <= room) row.push(item);
    else rows.push([item]);
  }
  // The first row sits about a third of the way down the zone, clear of its top edge.
  const zoneH = (zone.y1 - zone.y0) / scale;
  const top = Math.max(0.3 * zoneH - LABEL_H / 2, 0.06 * zoneH);
  const cx = (zone.x0 + zone.x1) / 2;
  return svg`<g transform=${`translate(${fix(cx)} ${fix(zone.y0)}) scale(${scaleFactor(scale)})`}>
    ${rows.map((row, index) => {
      const total = row.reduce((sum, item) => sum + item.w, 0) + GAP * (row.length - 1);
      const cy = top + LABEL_H / 2 + index * (LABEL_H + GAP);
      let x = -total / 2;
      return row.map((item) => {
        const part = item.draw(fix(x), fix(cy));
        x += item.w + GAP;
        return part;
      });
    })}
  </g>`;
}

/**
 * A centered row of an optional label followed by chips, the way the dishwasher and the generic
 * drawings show their live status, laid out in CSS pixels and enlarged by `scale` (from
 * `labelScale`) about its center. Returns nothing when there is nothing to show.
 */
export function statusRow(
  style: OverlayStyle,
  cx: number,
  cy: number,
  spec: LabelSpec | null,
  chips: OverlayIcon[],
  reducedMotion = false,
  scale = 1,
): SVGTemplateResult | typeof nothing {
  if (!spec && !chips.length) return nothing;
  if (scale !== 1) {
    return svg`<g transform=${`translate(${cx} ${cy}) scale(${scaleFactor(scale)}) translate(${-cx} ${-cy})`}>
      ${statusRow(style, cx, cy, spec, chips, reducedMotion)}
    </g>`;
  }
  const lw = spec ? labelWidth(spec) : 0;
  const total = lw + chips.length * LABEL_H + (spec ? chips.length : chips.length - 1) * GAP;
  let x = cx - total / 2;
  const parts: SVGTemplateResult[] = [];
  if (spec) {
    parts.push(svg`<g class="ui">${label(style, x, cy, spec, reducedMotion)}</g>`);
    x += lw + GAP;
  }
  for (const kind of chips) {
    parts.push(svg`<g class="ui">${chip(style, x, cy, kind)}</g>`);
    x += LABEL_H + GAP;
  }
  return svg`${parts}`;
}
