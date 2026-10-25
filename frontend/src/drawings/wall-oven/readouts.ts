import { nothing, svg, type SVGTemplateResult } from "lit";
import type { OvenState } from "../types";
import { round, url, type Materials } from "./materials";

/*
 * Readouts drawn over the oven, as on the range: a frosted pill in the upper part of each active
 * cavity's window (or its opening, with the door down) with the temperature and a ring while it
 * preheats, and chips for the probe, Remote Ready and the self-clean lock, which the touchscreen
 * shows too small to read at card size. They're interface, not appliance, so they look the same
 * on every finish and in both themes. They're laid out in CSS pixels (a 20 px pill, 12 px text)
 * and scaled into the drawing, so they're the same size on a small card and in the full view.
 */

const FROST = "rgba(20, 22, 25, 0.6)";
const EDGE = "rgba(255, 255, 255, 0.22)";
const TEXT_STYLE = "font-family: var(--ha-font-family-body, Roboto, system-ui); font-variant-numeric: tabular-nums";
/** Pill height and text size, in CSS pixels. */
const PILL_H = 20;
const TEXT_SIZE = 12;
/** Room for the ring or an icon before the text. */
const LEAD = 16;
const PAD_L = 7;
const PAD_R = 9;
const GAP = 4;
const RING_R = 5.6;

type Icon = "probe" | "remote" | "lock";

interface Label {
  text: string | null;
  /** 0–1 draws a preheat ring before the text. */
  progress: number | null;
  icon: Icon | null;
}

export interface Readout {
  label: Label | null;
  chips: Icon[];
}

/** Where a readout goes: a window, or the opening of a dropped door, in drawing units. */
export interface Zone {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/**
 * Drawing units per CSS pixel, for a drawing `viewHeight` units tall shown `pixelHeight` CSS
 * pixels tall. Without the pixel height, text is about 3% of the drawing's height. A pill never
 * takes more than an eighth of a tiny drawing (a thumbnail).
 */
export function labelScale(viewHeight: number, pixelHeight?: number): number {
  const most = (0.125 * viewHeight) / PILL_H;
  if (pixelHeight && pixelHeight > 0) return Math.min(viewHeight / pixelHeight, most);
  return (0.03 * viewHeight) / TEXT_SIZE;
}

/** What a cavity's readout shows; null when there's nothing to show. */
export function ovenReadout(state: OvenState): Readout | null {
  const chips: Icon[] = [];
  if (state.probe) chips.push("probe");
  if (state.remote_ready) chips.push("remote");
  let label: Label | null = null;
  if (state.on && state.self_clean) label = { text: state.temp, progress: null, icon: "lock" };
  else if (state.on) {
    const preheating = !state.preheated && state.progress !== null;
    const progress = preheating ? Math.min(1, Math.max(0, state.progress ?? 0)) : null;
    if (state.temp || progress !== null) label = { text: state.temp, progress, icon: null };
  }
  return label || chips.length ? { label, chips } : null;
}

/** Rough text width: the panel's own font draws it, so leave room for a wide one. */
function textWidth(text: string): number {
  let em = 0;
  for (const char of text) em += /[:.,'° ]/.test(char) ? 0.34 : /[0-9]/.test(char) ? 0.6 : 0.64;
  return em * TEXT_SIZE;
}

function labelWidth(label: Label): number {
  if (!label.text) return PILL_H;
  const lead = label.progress !== null || label.icon ? LEAD : 0;
  return Math.max(PILL_H, PAD_L + lead + textWidth(label.text) + PAD_R);
}

/** A monochrome white icon on a 20-unit grid, drawn `size` pixels across. */
function icon(kind: Icon, cx: number, cy: number, size = 13): SVGTemplateResult {
  const shape =
    kind === "remote"
      ? svg`<g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">
          <path d="M-7.2 -1.6A10 10 0 0 1 7.2 -1.6" />
          <path d="M-4.4 1.4A6 6 0 0 1 4.4 1.4" />
          <circle cx="0" cy="5" r="1.3" fill="#fff" stroke="none" />
        </g>`
      : kind === "probe"
        ? svg`<g fill="none" stroke="#fff" stroke-linecap="round">
            <path d="M-2.4 2.4L6.4 -6.4" stroke-width="1.8" />
            <path d="M-6.6 6.6L-2.8 2.8" stroke-width="4.4" />
          </g>`
        : svg`<path d="M-4 -1.5V-3.8A4 4 0 0 1 4 -3.8V-1.5" fill="none" stroke="#fff" stroke-width="2" />
            <rect x="-6" y="-1.5" width="12" height="9" rx="1.8" fill="#fff" />`;
  return svg`<g transform=${`translate(${cx} ${cy}) scale(${size / 20})`} opacity="0.85">${shape}</g>`;
}

function frost(m: Materials, x: number, y: number, w: number): SVGTemplateResult {
  const r = PILL_H / 2;
  return svg`
    <rect x=${x + 0.5} y=${y + 1.2} width=${w - 1} height=${PILL_H} rx=${r} fill="#000" opacity="0.28"
      filter=${url(m.pillShadow)} />
    <rect x=${x} y=${y} width=${w} height=${PILL_H} rx=${r} fill=${FROST} stroke=${EDGE} stroke-width="1" />
  `;
}

function label(m: Materials, x: number, cy: number, spec: Label, reducedMotion: boolean): SVGTemplateResult {
  const w = labelWidth(spec);
  const lead = spec.progress !== null || !!spec.icon;
  const leadCx = spec.text ? x + PAD_L + LEAD / 2 : x + w / 2;
  const circumference = 2 * Math.PI * RING_R;
  return svg`
    ${frost(m, x, cy - PILL_H / 2, w)}
    ${
      spec.progress !== null
        ? svg`
          <circle cx=${leadCx} cy=${cy} r=${RING_R} fill="none" stroke="#fff" stroke-opacity="0.24" stroke-width="1.9" />
          <circle cx=${leadCx} cy=${cy} r=${RING_R} fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round"
            stroke-dasharray=${round(circumference)} stroke-dashoffset=${round(circumference * (1 - spec.progress))}
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

function chip(m: Materials, x: number, cy: number, kind: Icon): SVGTemplateResult {
  return svg`${frost(m, x, cy - PILL_H / 2, PILL_H)}${icon(kind, x + PILL_H / 2, cy)}`;
}

/**
 * A cavity's readout centered in its zone, in the zone's upper part, clear of the handle above
 * the window and the screen. Rows wrap to the zone's width; `scale` is drawing units per CSS pixel.
 */
export function readout(m: Materials, zone: Zone, content: Readout, scale: number, reducedMotion: boolean): SVGTemplateResult {
  const items = [
    ...(content.label
      ? [{ w: labelWidth(content.label), draw: (x: number, cy: number) => label(m, x, cy, content.label as Label, reducedMotion) }]
      : []),
    ...content.chips.map((kind) => ({ w: PILL_H, draw: (x: number, cy: number) => chip(m, x, cy, kind) })),
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
  const top = Math.max(0.3 * zoneH - PILL_H / 2, 0.06 * zoneH);
  const cx = (zone.x0 + zone.x1) / 2;
  return svg`<g transform=${`translate(${round(cx)} ${round(zone.y0)}) scale(${Math.round(scale * 1000) / 1000})`}>
    ${rows.map((row, index) => {
      const total = row.reduce((sum, item) => sum + item.w, 0) + GAP * (row.length - 1);
      const cy = top + PILL_H / 2 + index * (PILL_H + GAP);
      let x = -total / 2;
      return row.map((item) => {
        const part = item.draw(round(x), round(cy));
        x += item.w + GAP;
        return part;
      });
    })}
  </g>`;
}
