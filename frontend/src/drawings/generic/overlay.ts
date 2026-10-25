import { nothing, svg, type SVGTemplateResult } from "lit";
import type { Defs } from "./materials";

/**
 * UI drawn over an appliance: small dark frosted labels and chips that read as interface, not
 * as part of the appliance. They look the same on every finish and in both themes. They're
 * laid out in CSS pixels (a 20 px pill with 12 px text) and scaled into the drawing by
 * `labelScale`, so they show at the same size on a small card and in the large full view.
 */

export type ChipIcon = "check" | "remote" | "rinse" | "salt" | "error" | "clock" | "pause";

const FROST = "rgba(20, 22, 25, 0.6)";
const EDGE = "rgba(255, 255, 255, 0.22)";
const TEXT_STYLE = "font-family: var(--ha-font-family-body, Roboto, system-ui); font-variant-numeric: tabular-nums";

/** Height of a label or chip, in CSS pixels. */
export const LABEL_H = 20;
const TEXT_SIZE = 12;
/** Room for a progress ring or an icon before the text. */
const LEAD = 16;
const PAD_L = 7;
const PAD_R = 9;

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

/** Rough text width: the panel's own font draws it, so leave room for a wide one. */
function textWidth(text: string, size: number): number {
  let em = 0;
  for (const char of text) em += /[:.,'° ]/.test(char) ? 0.34 : /[0-9]/.test(char) ? 0.6 : 0.64;
  return em * size;
}

/** The frosted backing every label and chip shares: a hairline edge and a soft drop shadow. */
function frost(d: Defs, x: number, y: number, w: number, h: number): SVGTemplateResult {
  const r = h / 2;
  return svg`
    <rect x=${x + 0.5} y=${y + 1.2} width=${w - 1} height=${h} rx=${r} fill="#000" opacity="0.28"
      filter=${d.url("blur-s")} />
    <rect x=${x} y=${y} width=${w} height=${h} rx=${r} fill=${FROST} stroke=${EDGE} stroke-width="1" />
  `;
}

/** A monochrome white icon on a 20-unit grid centered on (cx, cy), scaled to `s`. */
function icon(kind: ChipIcon, cx: number, cy: number, s: number): SVGTemplateResult {
  const t = `translate(${cx} ${cy}) scale(${s / 20})`;
  const shape = (() => {
    switch (kind) {
      case "check":
        return svg`<path d="M-6 0.5 L-1.8 4.6 L6.4 -4.4" fill="none" stroke="#fff" stroke-width="2.6"
          stroke-linecap="round" stroke-linejoin="round" />`;
      case "remote":
        return svg`<g fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">
          <path d="M-7.2 -1.6 A10 10 0 0 1 7.2 -1.6" />
          <path d="M-4.4 1.4 A6 6 0 0 1 4.4 1.4" />
          <circle cx="0" cy="5" r="1.3" fill="#fff" stroke="none" />
        </g>`;
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
    }
  })();
  return svg`<g transform=${t} opacity="0.85">${shape}</g>`;
}

export interface LabelSpec {
  text?: string | null;
  /** 0–1 draws a progress ring before the text; null leaves it out. */
  progress?: number | null;
  /** An icon before the text, used when there is no progress ring. */
  icon?: ChipIcon | null;
}

/** The width a label takes in CSS pixels, so callers can lay labels and chips out in a row. */
export function labelWidth(spec: LabelSpec): number {
  const lead = spec.progress != null || spec.icon ? LEAD : 0;
  const text = spec.text ? textWidth(spec.text, TEXT_SIZE) : 0;
  if (!text) return LABEL_H;
  return Math.max(LABEL_H, PAD_L + lead + text + PAD_R);
}

/**
 * A frosted label: an optional progress ring or icon, then text (a reading). With no text it's
 * a round chip holding just the ring or icon.
 */
export function label(
  d: Defs,
  x: number,
  cy: number,
  spec: LabelSpec,
  reducedMotion = false,
): SVGTemplateResult {
  const w = labelWidth(spec);
  const y = cy - LABEL_H / 2;
  const hasLead = spec.progress != null || !!spec.icon;
  const leadCx = spec.text ? x + PAD_L + LEAD / 2 : x + w / 2;
  const ringR = 5.6;
  const circumference = 2 * Math.PI * ringR;
  const progress = Math.min(1, Math.max(0, spec.progress ?? 0));
  const ease = reducedMotion ? "" : "transition: stroke-dashoffset 0.6s ease";
  return svg`
    <g class="ui">
      ${frost(d, x, y, w, LABEL_H)}
      ${spec.progress != null
        ? svg`
          <circle cx=${leadCx} cy=${cy} r=${ringR} fill="none" stroke="#ffffff" stroke-opacity="0.24"
            stroke-width="1.9" />
          <circle cx=${leadCx} cy=${cy} r=${ringR} fill="none" stroke="#ffffff" stroke-width="1.9"
            stroke-linecap="round" stroke-dasharray=${circumference}
            stroke-dashoffset=${circumference * (1 - progress)}
            transform=${`rotate(-90 ${leadCx} ${cy})`} style=${ease} />`
        : spec.icon
          ? icon(spec.icon, leadCx, cy, 13)
          : nothing}
      ${spec.text
        ? svg`<text x=${hasLead ? x + PAD_L + LEAD : x + w / 2} y=${cy} fill="#fff" font-size=${TEXT_SIZE}
            font-weight="600" text-anchor=${hasLead ? "start" : "middle"} dominant-baseline="central"
            style=${TEXT_STYLE}>${spec.text}</text>`
        : nothing}
    </g>
  `;
}

/** A round frosted chip holding one icon: done, Remote Ready, rinse aid or salt low. */
export function chip(d: Defs, cx: number, cy: number, kind: ChipIcon): SVGTemplateResult {
  return svg`
    <g class="ui">
      ${frost(d, cx - LABEL_H / 2, cy - LABEL_H / 2, LABEL_H, LABEL_H)}
      ${icon(kind, cx, cy, 13)}
    </g>
  `;
}

/**
 * A centered row of an optional label followed by chips, the way each drawing shows its live
 * status, laid out in CSS pixels and enlarged by `scale` (from `labelScale`) about its center.
 * Returns nothing when there is nothing to show.
 */
export function statusRow(
  d: Defs,
  cx: number,
  cy: number,
  labelSpec: LabelSpec | null,
  chips: ChipIcon[],
  reducedMotion = false,
  scale = 1,
): SVGTemplateResult | typeof nothing {
  if (!labelSpec && !chips.length) return nothing;
  if (scale !== 1) {
    const k = Math.round(scale * 1000) / 1000;
    return svg`<g transform=${`translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`}>
      ${statusRow(d, cx, cy, labelSpec, chips, reducedMotion)}
    </g>`;
  }
  const gap = 4;
  const lw = labelSpec ? labelWidth(labelSpec) : 0;
  const total = lw + chips.length * LABEL_H + (labelSpec ? chips.length : chips.length - 1) * gap;
  let x = cx - total / 2;
  const parts: SVGTemplateResult[] = [];
  if (labelSpec) {
    parts.push(label(d, x, cy, labelSpec, reducedMotion));
    x += lw + gap;
  }
  for (const kind of chips) {
    parts.push(chip(d, x + LABEL_H / 2, cy, kind));
    x += LABEL_H + gap;
  }
  return svg`${parts}`;
}
