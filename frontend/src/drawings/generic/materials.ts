import { nothing, svg, type SVGTemplateResult } from "lit";

/**
 * Materials shared by the generic and dishwasher drawings: brushed stainless, polished
 * hardware, black glass, painted panels and shadows, defined once per drawing and used by
 * reference so a drawing stays a handful of gradients and filters.
 */

/**
 * One drawing's definition ids. Each starts with the drawing's uid, since several drawings
 * share one shadow root and a duplicate id would resolve to another drawing's definition.
 */
export class Defs {
  private readonly prefix: string;

  constructor(uid: string) {
    // The ids end up inside url(#…), where spaces or quotes would break the reference.
    this.prefix = uid.replace(/[^\w-]/g, "_");
  }

  id(name: string): string {
    return `${this.prefix}-${name}`;
  }

  url(name: string): string {
    return `url(#${this.prefix}-${name})`;
  }
}

// ---------------------------------------------------------------------------------------------
// Color helpers

type Rgb = [number, number, number];

export function parseColor(hex: string | null | undefined, fallback = "#e9e6df"): Rgb {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex ?? "").trim());
  const value = match ? match[1] : fallback.slice(1);
  const full = value.length === 3 ? [...value].map((c) => c + c).join("") : value;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as Rgb;
}

export function toHex([r, g, b]: Rgb): string {
  const part = (v: number) =>
    Math.round(Math.min(255, Math.max(0, v)))
      .toString(16)
      .padStart(2, "0");
  return `#${part(r)}${part(g)}${part(b)}`;
}

/** Mixes toward white (amount > 0) or black (amount < 0). */
export function shade(color: Rgb, amount: number): string {
  const target = amount > 0 ? 255 : 0;
  const t = Math.abs(amount);
  return toHex(color.map((v) => v + (target - v) * t) as Rgb);
}

/**
 * Whether a panel color reads as stained wood (walnut, oak): a muted orange-brown. Wood gets
 * a faint grain; paint stays flat.
 */
export function isWoodTone([r, g, b]: Rgb): boolean {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return false;
  const l = (max + min) / 510;
  const s = (max - min) / 255 / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (max === r) h = ((g - b) / (max - min)) % 6;
  else if (max === g) h = (b - r) / (max - min) + 2;
  else h = (r - g) / (max - min) + 4;
  h = (h * 60 + 360) % 360;
  return h >= 15 && h <= 45 && s >= 0.2 && s <= 0.75 && l >= 0.12 && l <= 0.62;
}

// ---------------------------------------------------------------------------------------------
// Geometry helpers

const n = (value: number) => Math.round(value * 100) / 100;

/** A rectangle (optionally rounded) as path data, so every face can be one <path>. */
export function rectPath(x: number, y: number, w: number, h: number, r = 0): string {
  if (r <= 0) return `M${n(x)} ${n(y)}h${n(w)}v${n(h)}h${n(-w)}Z`;
  const rr = Math.min(r, w / 2, h / 2);
  return (
    `M${n(x + rr)} ${n(y)}H${n(x + w - rr)}A${n(rr)} ${n(rr)} 0 0 1 ${n(x + w)} ${n(y + rr)}` +
    `V${n(y + h - rr)}A${n(rr)} ${n(rr)} 0 0 1 ${n(x + w - rr)} ${n(y + h)}H${n(x + rr)}` +
    `A${n(rr)} ${n(rr)} 0 0 1 ${n(x)} ${n(y + h - rr)}V${n(y + rr)}A${n(rr)} ${n(rr)} 0 0 1 ${n(x + rr)} ${n(y)}Z`
  );
}

export function polyPath(points: Array<[number, number]>): string {
  return `M${points.map(([x, y]) => `${n(x)} ${n(y)}`).join("L")}Z`;
}

// ---------------------------------------------------------------------------------------------
// Definitions

/** The shared gradients and filters every drawing using these materials needs, once. */
export function materialDefs(d: Defs): SVGTemplateResult {
  return svg`
    <linearGradient id=${d.id("ss")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#b4b3b1" />
      <stop offset="0.1" stop-color="#bfbebc" />
      <stop offset="0.48" stop-color="#cfcecc" />
      <stop offset="0.82" stop-color="#c8c7c5" />
      <stop offset="1" stop-color="#b3b2b0" />
    </linearGradient>
    <linearGradient id=${d.id("ss-falloff")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#34342f" stop-opacity="0.27" />
      <stop offset="0.06" stop-color="#34342f" stop-opacity="0.15" />
      <stop offset="0.24" stop-color="#ffffff" stop-opacity="0.04" />
      <stop offset="0.46" stop-color="#ffffff" stop-opacity="0.17" />
      <stop offset="0.7" stop-color="#ffffff" stop-opacity="0.05" />
      <stop offset="0.92" stop-color="#34342f" stop-opacity="0.16" />
      <stop offset="1" stop-color="#34342f" stop-opacity="0.3" />
    </linearGradient>
    <linearGradient id=${d.id("ss-env")} x1="0" y1="0" x2="1" y2="0.7">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="0.3" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="0.38" stop-color="#ffffff" stop-opacity="0.05" />
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.03" />
      <stop offset="0.62" stop-color="#000000" stop-opacity="0.035" />
      <stop offset="1" stop-color="#000000" stop-opacity="0" />
    </linearGradient>
    <radialGradient id=${d.id("ss-glow")} cx="0.5" cy="0.45" r="0.62">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.08" />
      <stop offset="0.55" stop-color="#ffffff" stop-opacity="0.04" />
      <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
    <linearGradient id=${d.id("chrome")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6e6d6b" />
      <stop offset="0.06" stop-color="#a7a7a5" />
      <stop offset="0.14" stop-color="#e2e2e1" />
      <stop offset="0.24" stop-color="#fbfbfb" />
      <stop offset="0.32" stop-color="#e4e4e3" />
      <stop offset="0.46" stop-color="#bebebc" />
      <stop offset="0.6" stop-color="#d4d4d2" />
      <stop offset="0.74" stop-color="#bbbbb9" />
      <stop offset="0.86" stop-color="#e2e2e0" />
      <stop offset="0.95" stop-color="#a3a3a1" />
      <stop offset="1" stop-color="#787775" />
    </linearGradient>
    <linearGradient id=${d.id("cap-l")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="0.3" />
      <stop offset="0.22" stop-color="#000" stop-opacity="0.05" />
      <stop offset="0.45" stop-color="#fff" stop-opacity="0.12" />
      <stop offset="0.8" stop-color="#fff" stop-opacity="0" />
      <stop offset="1" stop-color="#000" stop-opacity="0.08" />
    </linearGradient>
    <linearGradient id=${d.id("cap-r")} x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="0.34" />
      <stop offset="0.22" stop-color="#000" stop-opacity="0.07" />
      <stop offset="0.45" stop-color="#fff" stop-opacity="0.08" />
      <stop offset="0.8" stop-color="#fff" stop-opacity="0" />
      <stop offset="1" stop-color="#000" stop-opacity="0.08" />
    </linearGradient>
    <linearGradient id=${d.id("chrome-v")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#8b8a88" />
      <stop offset="0.1" stop-color="#cbcbc9" />
      <stop offset="0.28" stop-color="#f1f1f0" />
      <stop offset="0.5" stop-color="#d2d2d0" />
      <stop offset="0.72" stop-color="#e2e2e0" />
      <stop offset="0.9" stop-color="#afafad" />
      <stop offset="1" stop-color="#8d8c8a" />
    </linearGradient>
    <linearGradient id=${d.id("chrome-end")} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.35" />
      <stop offset="0.3" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="0.65" stop-color="#000000" stop-opacity="0.12" />
      <stop offset="1" stop-color="#000000" stop-opacity="0.4" />
    </linearGradient>
    <linearGradient id=${d.id("glass")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2b2e31" />
      <stop offset="0.45" stop-color="#16181a" />
      <stop offset="1" stop-color="#0c0d0e" />
    </linearGradient>
    <linearGradient id=${d.id("glass-env")} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.06" />
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.015" />
      <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
    <linearGradient id=${d.id("ao-down")} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0.42" />
      <stop offset="0.35" stop-color="#000000" stop-opacity="0.14" />
      <stop offset="1" stop-color="#000000" stop-opacity="0" />
    </linearGradient>
    <linearGradient id=${d.id("ao-up")} x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#000000" stop-opacity="0.32" />
      <stop offset="1" stop-color="#000000" stop-opacity="0" />
    </linearGradient>
    <radialGradient id=${d.id("floor")} cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#000000" stop-opacity="0.5" />
      <stop offset="0.55" stop-color="#000000" stop-opacity="0.2" />
      <stop offset="1" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    ${grainFilter(d.id("grain"), "2 0.035")}
    ${grainFilter(d.id("grain-h"), "0.035 2")}
    <filter id=${d.id("blur-s")} x="-20%" y="-60%" width="140%" height="220%">
      <feGaussianBlur stdDeviation="1.4" />
    </filter>
    <filter id=${d.id("blur-m")} x="-30%" y="-80%" width="160%" height="260%">
      <feGaussianBlur stdDeviation="3.2" />
    </filter>
    <filter id=${d.id("offline")} x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
      <feColorMatrix type="saturate" values="0.06" />
      <feComponentTransfer>
        <feFuncR type="linear" slope="0.6" intercept="0.22" />
        <feFuncG type="linear" slope="0.6" intercept="0.22" />
        <feFuncB type="linear" slope="0.6" intercept="0.22" />
      </feComponentTransfer>
    </filter>
  `;
}

/**
 * Brushed grain as a gray noise for a soft-light overlay: fine streaks along one direction,
 * at low contrast, the way satin #4 steel reads in product photos.
 */
function grainFilter(id: string, frequency: string): SVGTemplateResult {
  return svg`<filter id=${id} x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=${frequency} numOctaves="2" seed="7" />
    <feColorMatrix type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" />
    <feComposite in2="SourceAlpha" operator="in" />
  </filter>`;
}

/**
 * The tone a panel color is drawn in. Stained wood reads a little less saturated than its
 * swatch once the grain is over it, as on the refrigeration panels, so the same walnut matches
 * across the set; paint is drawn as it is.
 */
export function panelTone(color: Rgb): Rgb {
  if (!isWoodTone(color)) return color;
  const gray = 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2];
  return color.map((v) => v + (gray - v) * 0.3) as Rgb;
}

/** Gradients for one painted panel color: flat paint with a soft sheen, optional wood grain. */
export function paintDefs(d: Defs, name: string, color: Rgb): SVGTemplateResult {
  const wood = isWoodTone(color);
  const base = panelTone(color);
  return svg`
    <linearGradient id=${d.id(`${name}-base`)} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color=${shade(base, 0.05)} />
      <stop offset="0.55" stop-color=${toHex(base)} />
      <stop offset="1" stop-color=${shade(base, -0.07)} />
    </linearGradient>
    <linearGradient id=${d.id(`${name}-sheen`)} x1="0" y1="0" x2="1" y2="0.9">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.09" />
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.035" />
      <stop offset="0.75" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="1" stop-color="#000000" stop-opacity="0.05" />
    </linearGradient>
    ${wood ? woodFilter(d.id(`${name}-wood`), "0.4 0.006", "0.012 0.0045", 11) : nothing}
  `;
}

/**
 * Wood grain for stained panels: fine streaks along the grain, warped by a slow noise so the
 * lines flow the way sawn wood does instead of running ruler-straight. Kept low in contrast,
 * as on Cove's panel photo.
 */
function woodFilter(id: string, grain: string, warp: string, seed: number): SVGTemplateResult {
  return svg`<filter id=${id} x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=${grain} numOctaves="3" seed=${seed} result="grain" />
    <feTurbulence type="fractalNoise" baseFrequency=${warp} numOctaves="2" seed=${seed + 1} result="warp" />
    <feDisplacementMap in="grain" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" />
    <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.065  1.5 0 0 0 -0.6" />
    <feComposite in2="SourceAlpha" operator="in" />
  </filter>`;
}

// ---------------------------------------------------------------------------------------------
// Faces

export interface FaceOptions {
  /** Darkens the whole face, 0–1, e.g. for a recessed or downward-facing part. */
  dim?: number;
  /** Strength of the brushed grain, 0 turns it off. */
  grain?: number;
  /** Which way the steel is brushed: up and down (doors) or across (Wolf's cooking fronts). */
  brush?: "v" | "h";
}

/** Brushed stainless: base tone, light falloff, a faint environment band and the grain. */
export function stainless(d: Defs, path: string, options: FaceOptions = {}): SVGTemplateResult {
  const grain = options.grain ?? 0.1;
  const filter = d.url(options.brush === "h" ? "grain-h" : "grain");
  return svg`
    <path d=${path} fill=${d.url("ss")} />
    <path d=${path} fill=${d.url("ss-falloff")} />
    <path d=${path} fill=${d.url("ss-env")} />
    <path d=${path} fill=${d.url("ss-glow")} />
    ${grain > 0
      ? svg`<path d=${path} fill="#000" filter=${filter} opacity=${grain} style="mix-blend-mode:soft-light" />`
      : nothing}
    ${options.dim ? svg`<path d=${path} fill="#000" opacity=${options.dim} />` : nothing}
  `;
}

/** A painted (or stained) panel face from `paintDefs`. */
export function painted(
  d: Defs,
  name: string,
  path: string,
  color: Rgb,
  options: FaceOptions = {},
): SVGTemplateResult {
  return svg`
    <path d=${path} fill=${d.url(`${name}-base`)} />
    ${isWoodTone(color)
      ? svg`<path d=${path} fill="#000" filter=${d.url(`${name}-wood`)} opacity="0.22" />`
      : nothing}
    <path d=${path} fill=${d.url(`${name}-sheen`)} />
    ${options.dim ? svg`<path d=${path} fill="#000" opacity=${options.dim} />` : nothing}
  `;
}

/** Black glass with a restrained reflection. */
export function blackGlass(d: Defs, path: string): SVGTemplateResult {
  return svg`
    <path d=${path} fill=${d.url("glass")} />
    <path d=${path} fill=${d.url("glass-env")} />
  `;
}

/**
 * Edge light on a rectangular part lit from above: a crisp highlight along the top and left,
 * a shadow along the bottom and right, so the part reads as a raised, folded edge.
 */
export function bevel(
  x: number,
  y: number,
  w: number,
  h: number,
  strength = 1,
  width = 0.8,
): SVGTemplateResult {
  return svg`
    <rect x=${x} y=${y} width=${w} height=${width} fill="#ffffff" opacity=${0.7 * strength} />
    <rect x=${x} y=${y} width=${width} height=${h} fill="#ffffff" opacity=${0.35 * strength} />
    <rect x=${x + w - width} y=${y} width=${width} height=${h} fill="#000000" opacity=${0.2 * strength} />
    <rect x=${x} y=${y + h - width} width=${w} height=${width} fill="#000000" opacity=${0.3 * strength} />
  `;
}

/** A thin outline that separates a part from what's behind it. */
export function outline(path: string, opacity = 0.35, width = 0.6): SVGTemplateResult {
  return svg`<path d=${path} fill="none" stroke="#2a2a28" stroke-opacity=${opacity} stroke-width=${width} />`;
}

// ---------------------------------------------------------------------------------------------
// Hardware

export type BarStyle = "pro" | "tubular";

/** A rectangle with one corner radius on its left side and another on its right. */
function sidedRect(x: number, y: number, w: number, h: number, left: number, right: number): string {
  return (
    `M${n(x + left)} ${n(y)}H${n(x + w - right)}A${right} ${right} 0 0 1 ${n(x + w)} ${n(y + right)}` +
    `V${n(y + h - right)}A${right} ${right} 0 0 1 ${n(x + w - right)} ${n(y + h)}H${n(x + left)}` +
    `A${left} ${left} 0 0 1 ${n(x)} ${n(y + h - left)}V${n(y + left)}A${left} ${left} 0 0 1 ${n(x + left)} ${n(y)}Z`
  );
}

/**
 * A horizontal stainless bar handle from x1 to x2, centered on cy, seen from the front.
 * `posts` is how far the mounts show between the door and the bar when the door is tilted
 * toward the viewer (0 when it's closed, so they hide behind the bar).
 *
 * The pro handle's collars are short cylinders on the bar's axis: from the front, crisp blocks
 * with softly rounded outer corners, carrying the bar's own bands, their outer end rounding
 * away from the light and a dark seam where the bar enters. The tubular rod mounts at its ends.
 */
export function barHandle(
  d: Defs,
  x1: number,
  x2: number,
  cy: number,
  style: BarStyle,
  posts = 0,
): SVGTemplateResult {
  const pro = style === "pro";
  const dia = pro ? 13 : 6.4;
  const r = dia / 2;
  const collar = pro ? { w: 9.5, h: 16 } : null;
  const barX1 = collar ? x1 + collar.w - 1 : x1;
  const barX2 = collar ? x2 - collar.w + 1 : x2;
  const open = posts > 0;
  // A tilted door turns the hardware toward the floor, so it catches a little less light.
  const dim = open ? 0.08 : 0;
  const shadow = svg`<rect x=${x1 + 3} y=${cy + r * 0.35} width=${x2 - x1 - 6} height=${dia * 0.85} rx=${r}
    fill="#000" opacity="0.13" filter=${d.url("blur-m")} />`;
  const bar = svg`
    <rect x=${barX1} y=${cy - r} width=${barX2 - barX1} height=${dia} rx=${collar ? 0 : r} fill=${d.url("chrome")} />
    ${dim ? svg`<rect x=${barX1} y=${cy - r} width=${barX2 - barX1} height=${dia} rx=${collar ? 0 : r} fill="#000"
      opacity=${dim} />` : nothing}`;

  if (!collar) {
    // Mounts as thick as the rod, at its ends: hidden behind it while the door is closed.
    const postW = Math.round(dia);
    const mounts = [x1 + 4, x2 - 4].map((px) =>
      open
        ? svg`<rect x=${px - postW / 2} y=${cy - posts} width=${postW} height=${posts + 0.5} rx=${postW / 2}
              ry="1.2" fill=${d.url("chrome-v")} />
            <rect x=${px - postW / 2} y=${cy - posts} width=${postW} height=${posts + 0.5} rx=${postW / 2}
              ry="1.2" fill="#000" opacity="0.12" />`
        : svg`<rect x=${px - postW / 2 - 0.5} y=${cy + r - 0.4} width=${postW + 1} height="2" rx="1" fill="#000"
            opacity="0.14" filter=${d.url("blur-s")} />`,
    );
    return svg`${open ? nothing : shadow}${mounts}${bar}`;
  }

  const top = cy - collar.h / 2;
  const collars = [x1, x2 - collar.w].map((cx, index) => {
    const left = index === 0;
    const path = sidedRect(cx, top, collar.w, collar.h, left ? 2 : 0.6, left ? 0.6 : 2);
    // Open, the bracket's top face runs from the door's face out to the collar.
    const face = polyPath([
      [cx, top - posts],
      [cx + collar.w, top - posts],
      [cx + collar.w, top],
      [cx, top],
    ]);
    return svg`
      ${open
        ? svg`<path d=${face} fill="#c9cacb" />
          <path d=${face} fill=${d.url("chrome-end")} />
          <rect x=${cx} y=${top - posts} width=${collar.w} height="0.5" fill="#fff" opacity="0.6" />`
        : svg`<rect x=${cx + 0.4} y=${top + 1.6} width=${collar.w - 0.8} height=${collar.h} rx="1.5" fill="#000"
            opacity="0.2" filter=${d.url("blur-s")} />`}
      <path d=${path} fill=${d.url("chrome")} />
      <path d=${path} fill="#000" opacity=${open ? 0.15 : 0.07} />
      <path d=${path} fill=${d.url(left ? "cap-l" : "cap-r")} />
      <rect x=${left ? cx + collar.w - 0.5 : cx} y=${cy - r} width="0.5" height=${dia} fill="#3b3a37"
        opacity="0.5" />
      <path d=${path} fill="none" stroke="#3b3a37" stroke-opacity="0.15" stroke-width="0.4" />
    `;
  });
  return svg`${open ? nothing : shadow}${bar}${collars}`;
}

/** A vertical tubular handle from y1 to y2 at x, standing off a door seen from the front. */
export function vBarHandle(d: Defs, x: number, y1: number, y2: number, dia = 8): SVGTemplateResult {
  const r = dia / 2;
  return svg`
    <rect x=${x - r + 2.5} y=${y1 + 3} width=${dia} height=${y2 - y1} rx=${r} fill="#000" opacity="0.16"
      filter=${d.url("blur-m")} />
    ${[y1 + 4, y2 - 4].map(
      (y) => svg`<rect x=${x - 2} y=${y - 2} width="5.5" height="4" rx="1" fill="#000" opacity="0.16"
        filter=${d.url("blur-s")} />`,
    )}
    <rect x=${x - r} y=${y1} width=${dia} height=${y2 - y1} rx=${r} fill=${d.url("chrome-v")} />
  `;
}

/** The contact shadow under an appliance standing on the floor at y. */
export function floorShadow(
  d: Defs,
  x: number,
  w: number,
  y: number,
  theme: "light" | "dark",
): SVGTemplateResult {
  // A dark page swallows a light shadow; deepen it there so the appliance still sits down.
  const k = theme === "dark" ? 1.5 : 1;
  return svg`
    <ellipse cx=${x + w / 2} cy=${y + 1} rx=${w * 0.58} ry="7.5" fill=${d.url("floor")}
      opacity=${Math.min(1, 0.6 * k)} />
    <rect x=${x + 1.5} y=${y - 1.4} width=${w - 3} height="2.8" rx="1.4" fill="#000"
      opacity=${Math.min(1, 0.4 * k)} filter=${d.url("blur-s")} />
  `;
}

/** A louvered toe-kick grille: dark recess with horizontal slats catching light on top. */
export function kickGrille(d: Defs, x: number, y: number, w: number, h: number): SVGTemplateResult {
  const slats: string[] = [];
  for (let sy = y + 3; sy < y + h - 2; sy += 3.4) slats.push(`M${n(x + 3)} ${n(sy)}H${n(x + w - 3)}`);
  return svg`
    <rect x=${x} y=${y} width=${w} height=${h} fill="#1b1c1d" />
    <path d=${slats.join("")} stroke="#5d6064" stroke-width="1.3" />
    <path d=${slats.join("")} stroke="#9a9ea2" stroke-width="0.45" transform="translate(0 -0.5)" />
    <rect x=${x} y=${y} width=${w} height=${h} fill=${d.url("ao-down")} />
  `;
}
