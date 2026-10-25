import { nothing, svg, type SVGTemplateResult } from "lit";
import type { DrawingState } from "../types";
import { depthScale, n, pathOf, project, projectRect, random, type Point, type Rect } from "./geometry";
import { wineRacks, type Contents, type Front } from "./layout";
import type { Scene } from "./materials";

export interface CavityOptions {
  /** Seen through a closed glass door rather than an open one. */
  glass: boolean;
  state: DrawingState;
}

interface Liner {
  back: string;
  side: string;
  ceiling: string;
  floor: string;
  led: string;
  /** Strength of the light glare near the ceiling. */
  glare: number;
}

// White liners for refrigerators and freezers; the espresso liner of wine and beverage units.
const LIGHT: Liner = { back: "#eef2f3", side: "#e3e8ea", ceiling: "#d3d9dc", floor: "#e9edef", led: "#ffffff", glare: 0.5 };
const DARK: Liner = { back: "#3a302a", side: "#463a33", ceiling: "#2c2520", floor: "#302822", led: "#fff1d8", glare: 0.2 };
const ICE: Liner = { back: "#4e5357", side: "#5a5f63", ceiling: "#44484b", floor: "#5f6366", led: "#eef6ff", glare: 0.25 };

export const place = (x: number, y: number, k: number, content: SVGTemplateResult) =>
  svg`<g transform=${`translate(${n(x)} ${n(y)}) scale(${Math.round(k * 1000) / 1000})`}>${content}</g>`;

const box = (r: Rect, fill: string, extra = "") =>
  svg`<rect x=${n(r.x)} y=${n(r.y)} width=${n(r.w)} height=${n(r.h)} fill=${fill} style=${extra} />`;

// Contents: each drawn upright, its base centered at (0, 0), in drawing units. Colors are
// the muted ones of food photography; a soft contact shadow sits under everything. An open
// refrigerator draws hundreds of them, so their templates keep no whitespace between elements:
// each gap would be one more text node in the page.

export interface Item {
  w: number;
  h: number;
  draw: SVGTemplateResult;
  /** Only one of these per interior (a carton of eggs, not five). */
  single?: boolean;
}

const contact = (w: number) => svg`<ellipse cx="0" cy="-0.6" rx=${n(w * 0.56)} ry=${n(Math.max(1.4, w * 0.07))} fill="#000" opacity="0.18" />`;

interface BottleOptions {
  w: number;
  h: number;
  /** Glass tint; for clear glass or plastic the liquid shows through. */
  glass: string;
  glassOpacity: number;
  liquid: string | null;
  cap: string;
  label: string | null;
  /** Wine-bottle shoulders rather than a short-necked jug. */
  tall?: boolean;
}

function bottleShape(o: BottleOptions, s: Scene): SVGTemplateResult {
  const { w, h } = o;
  const neck = w * (o.tall ? 0.3 : 0.42);
  const shoulder = h * (o.tall ? 0.6 : 0.68);
  const r = w * 0.14;
  const d = `M${n(-w / 2)} ${n(-r)}V${n(-shoulder + w * 0.3)}C${n(-w / 2)} ${n(-shoulder - w * 0.1)} ${n(-neck / 2)} ${n(-shoulder - h * 0.06)} ${n(
    -neck / 2,
  )} ${n(-h * 0.83)}V${n(-h * 0.94)}H${n(neck / 2)}V${n(-h * 0.83)}C${n(neck / 2)} ${n(-shoulder - h * 0.06)} ${n(w / 2)} ${n(-shoulder - w * 0.1)} ${n(
    w / 2,
  )} ${n(-shoulder + w * 0.3)}V${n(-r)}Q${n(w / 2)} 0 ${n(w / 2 - r)} 0H${n(-w / 2 + r)}Q${n(-w / 2)} 0 ${n(-w / 2)} ${n(-r)}Z`;
  const level = -h * (o.tall ? 0.7 : 0.78);
  const liquid = o.liquid
    ? svg`<rect x=${n(-w / 2 + 0.8)} y=${n(level)} width=${n(w - 1.6)} height=${n(-level - 1)} rx=${n(r)} fill=${o.liquid} />`
    : nothing;
  const label = o.label
    ? svg`<rect x=${n(-w / 2)} y=${n(-shoulder * 0.82)} width=${n(w)} height=${n(shoulder * 0.44)} fill=${o.label} /><rect x=${n(-w / 2)} y=${n(-shoulder * 0.62)} width=${n(w)} height=${n(shoulder * 0.08)} fill="#000" opacity="0.12" />`
    : nothing;
  return svg`${contact(w)}${liquid}<path d=${d} fill=${o.glass} fill-opacity=${o.glassOpacity} />${label}<rect x=${n(-neck / 2 - 0.6)} y=${n(-h)} width=${n(neck + 1.2)} height=${n(h * 0.075)} rx="1" fill=${o.cap} /><path d=${d} fill=${s.ref("cyl")} /><path d=${`M${n(-w * 0.22)} ${n(-h * 0.12)}V${n(-shoulder * 0.9)}`} stroke="#fff" stroke-opacity="0.38" stroke-width=${n(w * 0.06)} stroke-linecap="round" />`;
}

function jarShape(w: number, h: number, contents: string, lid: string, s: Scene): SVGTemplateResult {
  return svg`${contact(w)}<rect x=${n(-w / 2)} y=${n(-h * 0.86)} width=${n(w)} height=${n(h * 0.86)} rx=${n(w * 0.16)} fill=${contents} /><rect x=${n(-w / 2)} y=${n(-h * 0.86)} width=${n(w)} height=${n(h * 0.86)} rx=${n(w * 0.16)} fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-opacity="0.3" stroke-width="0.7" /><rect x=${n(-w * 0.45)} y=${n(-h)} width=${n(w * 0.9)} height=${n(h * 0.17)} rx="1.4" fill=${lid} /><rect x=${n(-w * 0.45)} y=${n(-h)} width=${n(w * 0.9)} height=${n(h * 0.17)} rx="1.4" fill=${s.ref("cyl")} /><rect x=${n(-w / 2)} y=${n(-h * 0.86)} width=${n(w)} height=${n(h * 0.86)} rx=${n(w * 0.16)} fill=${s.ref("cyl")} opacity="0.7" />`;
}

/** A clear storage container with food inside and a tinted lid. */
function containerShape(w: number, h: number, food: string[], lid: string, rnd: () => number): SVGTemplateResult {
  const blobs = Array.from({ length: 6 }, (_, i) => {
    const x = -w / 2 + 6 + (i + rnd() * 0.6) * ((w - 12) / 6);
    return svg`<ellipse cx=${n(x)} cy=${n(-h * 0.32)} rx=${n(w * 0.11)} ry=${n(h * 0.24)} fill=${food[i % food.length]} />`;
  });
  return svg`${contact(w)}${blobs}<rect x=${n(-w / 2)} y=${n(-h * 0.86)} width=${n(w)} height=${n(h * 0.86)} rx="2.5" fill="#f4f8fa" fill-opacity="0.4" stroke="#ffffff" stroke-opacity="0.5" stroke-width="0.7" /><rect x=${n(-w / 2 - 1)} y=${n(-h)} width=${n(w + 2)} height=${n(h * 0.16)} rx="2" fill=${lid} /><path d=${`M${n(-w / 2 + 2)} ${n(-h * 0.7)}H${n(w / 2 - 2)}`} stroke="#fff" stroke-opacity="0.4" stroke-width="0.7" />`;
}

function cartonShape(w: number, h: number, color: string, band: string): SVGTemplateResult {
  return svg`${contact(w)}<path d=${`M${n(-w / 2)} 0V${n(-h * 0.8)}L${n(-w * 0.3)} ${n(-h * 0.96)}H${n(w * 0.3)}L${n(w / 2)} ${n(-h * 0.8)}V0Z`} fill=${color} /><rect x=${n(-w * 0.32)} y=${n(-h)} width=${n(w * 0.64)} height=${n(h * 0.05)} fill=${color} /><rect x=${n(-w / 2)} y=${n(-h * 0.58)} width=${n(w)} height=${n(h * 0.24)} fill=${band} /><rect x=${n(w * 0.08)} y=${n(-h * 0.8)} width=${n(w * 0.42)} height=${n(h * 0.8)} fill="#000" opacity="0.1" />`;
}

function bowlShape(w: number, fruit: "grapes" | "oranges" | "berries", rnd: () => number): SVGTemplateResult {
  const colors = fruit === "grapes" ? ["#a3b768", "#93a85a", "#b0c178"] : fruit === "oranges" ? ["#d9904a", "#e09c55"] : ["#9e3f4a", "#4a4670", "#ad4a55"];
  const size = fruit === "oranges" ? w * 0.16 : fruit === "grapes" ? w * 0.065 : w * 0.07;
  const pieces: SVGTemplateResult[] = [];
  const count = fruit === "oranges" ? 5 : 16;
  for (let i = 0; i < count; i++) {
    const t = rnd();
    const x = (t - 0.5) * w * 0.7;
    const y = -w * 0.28 - rnd() * (w * 0.22) * Math.sin(t * Math.PI) - size * 0.4;
    const c = colors[Math.floor(rnd() * colors.length)];
    pieces.push(
      svg`<circle cx=${n(x)} cy=${n(y)} r=${n(size)} fill=${c} /><circle cx=${n(x + size * 0.25)} cy=${n(y + size * 0.2)} r=${n(size * 0.8)} fill="#000" opacity="0.12" /><circle cx=${n(x - size * 0.3)} cy=${n(y - size * 0.35)} r=${n(size * 0.28)} fill="#fff" opacity="0.28" />`,
    );
  }
  const bowl = `M${n(-w / 2)} ${n(-w * 0.3)}H${n(w / 2)}C${n(w * 0.46)} ${n(-w * 0.08)} ${n(w * 0.2)} 0 0 0C${n(-w * 0.2)} 0 ${n(-w * 0.46)} ${n(-w * 0.08)} ${n(-w / 2)} ${n(-w * 0.3)}Z`;
  return svg`${contact(w * 0.7)}${pieces}<path d=${bowl} fill="#efe9df" /><path d=${bowl} fill="#000" opacity="0.06" /><path d=${`M${n(-w / 2)} ${n(-w * 0.3)}H${n(w / 2)}`} stroke="#fff" stroke-width="1.2" stroke-opacity="0.9" />`;
}

function eggsShape(w: number): SVGTemplateResult {
  const eggs = Array.from({ length: 5 }, (_, i) => {
    const x = -w / 2 + (i + 0.5) * (w / 5);
    return svg`<ellipse cx=${n(x)} cy=${n(-9)} rx=${n(w / 11)} ry="8" fill="#d6b08e" /><ellipse cx=${n(x - w / 40)} cy=${n(-12)} rx=${n(w / 40)} ry="2.6" fill="#fff" opacity="0.3" />`;
  });
  return svg`${contact(w)}${eggs}<rect x=${n(-w / 2)} y="-8" width=${n(w)} height="8" rx="1.5" fill="#f2f5f6" fill-opacity="0.6" stroke="#fff" stroke-opacity="0.6" stroke-width="0.7" />`;
}

function cupShape(w: number, h: number, lid: string): SVGTemplateResult {
  return svg`${contact(w)}<path d=${`M${n(-w / 2)} ${n(-h)}H${n(w / 2)}L${n(w * 0.4)} 0H${n(-w * 0.4)}Z`} fill="#f3f1eb" /><rect x=${n(-w / 2 - 0.5)} y=${n(-h - 1.5)} width=${n(w + 1)} height="2.6" rx="1" fill=${lid} /><path d=${`M${n(w * 0.12)} ${n(-h)}L${n(w * 0.1)} 0`} stroke="#000" stroke-opacity="0.08" stroke-width=${n(w * 0.3)} />`;
}

/**
 * A frozen-food box seen slightly from above: its front with a small printed label, a lit
 * top face and a darker side, so it reads as a solid package rather than a flat tile.
 */
function packShape(w: number, h: number, color: string, accent: string, rnd: () => number): SVGTemplateResult {
  const top = Math.min(6, h * 0.16);
  const side = Math.min(5, w * 0.1);
  const front = `M${n(-w / 2)} 0V${n(-h)}H${n(w / 2 - side)}V0Z`;
  const lid = `M${n(-w / 2)} ${n(-h)}L${n(-w / 2 + side)} ${n(-h - top)}H${n(w / 2)}L${n(w / 2 - side)} ${n(-h)}Z`;
  const flank = `M${n(w / 2 - side)} 0V${n(-h)}L${n(w / 2)} ${n(-h - top)}V${n(-top)}Z`;
  const lw = (w - side) * (0.4 + rnd() * 0.25);
  const lx = -w / 2 + 3 + rnd() * (w - side - lw - 6);
  return svg`${contact(w)}<path d=${front} fill=${color} /><path d=${lid} fill=${color} /><path d=${lid} fill="#fff" opacity="0.14" /><path d=${flank} fill=${color} /><path d=${flank} fill="#000" opacity="0.15" /><rect x=${n(lx)} y=${n(-h * 0.62)} width=${n(lw)} height=${n(h * 0.3)} rx="0.8" fill=${accent} /><path d=${`M${n(-w / 2)} ${n(-h + 0.5)}H${n(w / 2 - side)}`} stroke="#fff" stroke-opacity="0.45" stroke-width="0.7" />`;
}

/** A frosted freezer bag: what's inside shows faintly through the plastic. */
function bagShape(w: number, h: number, contents: string, rnd: () => number): SVGTemplateResult {
  const zig = Array.from({ length: 9 }, (_, i) => `${n(-w / 2 + (i * w) / 8)} ${n(-h - (i % 2 ? 2 : 0))}`).join(" L");
  const peas = Array.from({ length: 10 }, () => {
    const x = (rnd() - 0.5) * w * 0.8;
    const y = -h * (0.15 + rnd() * 0.55);
    return svg`<circle cx=${n(x)} cy=${n(y)} r=${n(w * 0.06)} fill=${contents} />`;
  });
  return svg`${contact(w)}<path d=${`M${n(-w / 2)} 0V${n(-h)} L${zig}V0Z`} fill="#dfe6ea" />${peas}<path d=${`M${n(-w / 2)} 0V${n(-h)} L${zig}V0Z`} fill="#f2f6f8" fill-opacity="0.5" /><path d=${`M${n(-w / 2)} ${n(-h * 0.84)}H${n(w / 2)}`} stroke="#9aa6ad" stroke-opacity="0.5" stroke-width="0.8" /><path d=${`M${n(w * 0.3)} ${n(-h)}V0`} stroke="#000" stroke-opacity="0.06" stroke-width=${n(w * 0.25)} />`;
}

/** A can: brushed metal or a pastel print, with the soft vertical highlight of a cylinder. */
function canShape(w: number, h: number, color: string, band: string, s: Scene): SVGTemplateResult {
  return svg`${contact(w)}<rect x=${n(-w / 2)} y=${n(-h)} width=${n(w)} height=${n(h)} rx=${n(w * 0.1)} fill=${color} /><rect x=${n(-w / 2)} y=${n(-h * 0.66)} width=${n(w)} height=${n(h * 0.34)} fill=${band} /><rect x=${n(-w / 2 + 0.8)} y=${n(-h - 0.6)} width=${n(w - 1.6)} height="3" rx="1.2" fill="#c3c7ca" /><rect x=${n(-w / 2)} y=${n(-h)} width=${n(w)} height=${n(h)} rx=${n(w * 0.1)} fill=${s.ref("cyl")} /><path d=${`M${n(-w / 2 + w * 0.3)} ${n(-h + 3)}V${n(-2)}`} stroke="#fff" stroke-opacity="0.5" stroke-width="1" />`;
}

type Maker = (rnd: () => number) => Item;
const pick = <T,>(rnd: () => number, list: T[]) => list[Math.floor(rnd() * list.length)];

export function fridgeItems(s: Scene): Maker[] {
  return [
    () => ({ w: 28, h: 96, draw: bottleShape({ w: 28, h: 96, glass: "#e8f0f2", glassOpacity: 0.35, liquid: "#e2a446", cap: "#4a6f45", label: "#f1ead8" }, s) }),
    () => ({ w: 32, h: 84, draw: cartonShape(32, 84, "#f4f4f0", "#7a93b0") }),
    (r) => ({ w: 24, h: 36, draw: jarShape(24, 36, pick(r, ["#7a3a3f", "#6f7a3c", "#a8573a", "#c79a45"]), pick(r, ["#c2a45c", "#b9bec2", "#3a3e42"]), s) }),
    (r) => ({ w: 62, h: 28, draw: containerShape(62, 28, pick(r, [["#7a9a52", "#93ad62"], ["#dcc493", "#cdb27a"], ["#b75a48", "#c97a52"]]), pick(r, ["#7d93ad", "#8faa92", "#d8dde0"]), r) }),
    (r) => ({ w: 66, h: 42, draw: bowlShape(66, pick(r, ["grapes", "oranges", "berries"] as const), r) }),
    () => ({ w: 30, h: 116, draw: bottleShape({ w: 30, h: 116, glass: "#33463a", glassOpacity: 1, liquid: null, cap: "#cdbb8c", label: "#ece5d2", tall: true }, s) }),
    (r) => ({ w: 22, h: 24, draw: cupShape(22, 24, pick(r, ["#7d93ad", "#b0646c", "#d6b25e"])) }),
    () => ({ w: 26, h: 92, draw: bottleShape({ w: 26, h: 92, glass: "#dfeaf0", glassOpacity: 0.45, liquid: "#e8eef1", cap: "#4f6f96", label: "#8ea3bd" }, s) }),
    () => ({ w: 72, h: 20, draw: eggsShape(72), single: true }),
  ];
}

// Frozen food as in Sub-Zero's photos: white and kraft boxes, frosted bags, small muted labels.
const BOXES: Array<[string, string]> = [
  ["#ecebe7", "#a8786c"],
  ["#c9b08a", "#efe9dc"],
  ["#f1f0ec", "#7d93ab"],
  ["#d6c2a0", "#8a6a50"],
  ["#e6e3dc", "#86a07c"],
  ["#f3f2ee", "#c2a67a"],
];

export function freezerItems(s: Scene): Maker[] {
  return [
    (r) => {
      const [c, a] = pick(r, BOXES);
      return { w: 54, h: 34, draw: packShape(54, 34, c, a, r) };
    },
    (r) => {
      const [c, a] = pick(r, BOXES);
      return { w: 40, h: 56, draw: packShape(40, 56, c, a, r) };
    },
    (r) => ({ w: 50, h: 42, draw: bagShape(50, 42, pick(r, ["#86a35e", "#bfa36e", "#a65a52", "#d9d0b8"]), r) }),
    (r) => ({ w: 32, h: 34, draw: jarShape(32, 34, pick(r, ["#efe6d2", "#6e4a3a", "#dcb3b8"]), "#f2efe8", s) }),
  ];
}

// Beverage cans as in the DEU2450BG lifestyle photo: brushed metal and soft pastel prints.
const CANS: Array<[string, string]> = [
  ["#c9ccce", "#e3b7b9"],
  ["#d7d9db", "#a9d3c0"],
  ["#cfd2d4", "#d9c48a"],
  ["#e8e8e4", "#8fa7c4"],
  ["#b9bcbf", "#f0ece4"],
  ["#2f3b4a", "#c9ccce"],
];

/** Fills a shelf from x0 to x1 with items no taller than maxH, standing at depth z. */
function arrange(
  s: Scene,
  makers: Maker[],
  x0: number,
  x1: number,
  y: number,
  maxH: number,
  z: number,
  seed: number,
  used: Set<number> = new Set(),
): SVGTemplateResult[] {
  const rnd = random(seed);
  const k = depthScale(s.inside, z);
  const out: SVGTemplateResult[] = [];
  let x = x0 + 5 + rnd() * 10;
  let guard = 0;
  while (x < x1 - 20 && guard++ < 40) {
    const which = Math.floor(rnd() * makers.length);
    const item = makers[which](rnd);
    if (item.h > maxH || x + item.w > x1 - 4 || (item.single && used.has(which))) {
      x += 6;
      continue;
    }
    if (item.single) used.add(which);
    const [px, py] = project(s.inside, x + item.w / 2, y, z);
    out.push(place(px, py, k, item.draw));
    x += item.w + 2 + rnd() * 10;
  }
  return out;
}

/** The cabinet interior in one-point perspective: back wall, side walls, ceiling and floor. */
function shell(s: Scene, r: Rect, liner: Liner): SVGTemplateResult {
  const d = s.layout.depth;
  const back = (x: number, y: number) => project(s.inside, x, y, -d);
  const fTL: Point = [r.x, r.y];
  const fTR: Point = [r.x + r.w, r.y];
  const fBR: Point = [r.x + r.w, r.y + r.h];
  const fBL: Point = [r.x, r.y + r.h];
  const bTL = back(r.x, r.y);
  const bTR = back(r.x + r.w, r.y);
  const bBR = back(r.x + r.w, r.y + r.h);
  const bBL = back(r.x, r.y + r.h);
  const backRect = { x: bTL[0], y: bTL[1], w: bTR[0] - bTL[0], h: bBL[1] - bTL[1] };
  const left = [fTL, bTL, bBL, fBL];
  const right = [bTR, fTR, fBR, bBR];
  const ceiling = [fTL, fTR, bTR, bTL];
  const floor = [bBL, bBR, fBR, fBL];
  return svg`<path d=${pathOf([bTL, bTR, bBR, bBL])} fill=${liner.back} />
    ${box(backRect, s.ref("shadeDown"))}
    <path d=${pathOf(left)} fill=${liner.side} /><path d=${pathOf(left)} fill=${s.ref("depthL")} />
    <path d=${pathOf(right)} fill=${liner.side} /><path d=${pathOf(right)} fill=${s.ref("depthR")} />
    <path d=${pathOf(ceiling)} fill=${liner.ceiling} /><path d=${pathOf(ceiling)} fill=${s.ref("depthT")} />
    <path d=${pathOf(floor)} fill=${liner.floor} /><path d=${pathOf(floor)} fill=${s.ref("depthB")} />
    <path d=${`M${n(bTL[0])} ${n(bTL[1])}V${n(bBL[1])}H${n(bBR[0])}V${n(bTR[1])}Z`} fill="none" stroke="#000" stroke-opacity="0.1" stroke-width="1.6" />`;
}

/** LED lighting: a strip along the ceiling's front edge, and ClearSight light columns. */
function lights(s: Scene, r: Rect, liner: Liner, columns: boolean): SVGTemplateResult {
  const strip = { x: r.x + 8, y: r.y + 2.5, w: r.w - 16, h: 3.4 };
  const cols = columns
    ? [r.x + 2, r.x + r.w - 5.5].map(
        (x) => svg`<rect x=${n(x - 3)} y=${n(r.y + 12)} width="9" height=${n(r.h - 30)} fill=${liner.led} opacity="0.5" filter=${s.ref("blur")} />
          <rect x=${n(x)} y=${n(r.y + 12)} width="3.4" height=${n(r.h - 30)} rx="1.7" fill=${liner.led} />`,
      )
    : nothing;
  return svg`<rect x=${n(strip.x)} y=${n(strip.y - 2)} width=${n(strip.w)} height=${n(strip.h + 6)} fill=${liner.led} opacity="0.6" filter=${s.ref("blur")} />
    <rect x=${n(strip.x)} y=${n(strip.y)} width=${n(strip.w)} height=${n(strip.h)} rx="1.7" fill=${liner.led} />
    ${cols}
    ${box({ x: r.x, y: r.y, w: r.w, h: r.h * 0.5 }, s.ref("glare"), `opacity:${liner.glare}`)}`;
}

/** A glass shelf with its stainless front trim, at front height y. */
function shelf(s: Scene, r: Rect, y: number): { under: SVGTemplateResult; trim: SVGTemplateResult } {
  const d = s.layout.depth;
  const fl = project(s.inside, r.x + 1, y, -14);
  const fr = project(s.inside, r.x + r.w - 1, y, -14);
  const bl = project(s.inside, r.x + 1, y, -d + 8);
  const br = project(s.inside, r.x + r.w - 1, y, -d + 8);
  const k = depthScale(s.inside, -14);
  return {
    under: svg`<path d=${pathOf([bl, br, fr, fl])} fill="#ffffff" fill-opacity="0.3" stroke="#ffffff" stroke-opacity="0.45" stroke-width="0.8" /><path d=${pathOf([fl, fr, [fr[0], fr[1] + 7], [fl[0], fl[1] + 7]])} fill="#000" opacity="0.06" />`,
    trim: svg`<rect x=${n(fl[0])} y=${n(fl[1] - 1)} width=${n(fr[0] - fl[0])} height=${n(7 * k)} fill="#b3b8bb" /><rect x=${n(fl[0])} y=${n(fl[1] + 2.5 * k)} width=${n(fr[0] - fl[0])} height=${n(3.5 * k)} fill="#8e9497" /><path d=${`M${n(fl[0])} ${n(fl[1] - 0.6)}H${n(fr[0])}`} stroke="#fff" stroke-opacity="0.95" stroke-width="1.1" /><path d=${`M${n(fl[0])} ${n(fl[1] + 7 * k - 1)}H${n(fr[0])}`} stroke="#000" stroke-opacity="0.3" stroke-width="0.9" />`,
  };
}

// Produce, muted as in the photo, each with a shade side so it reads round rather than flat.
// Greens run from the darker outer leaves at the back to lighter hearts in front.
const LETTUCE = [
  ["#7a9558", "#6d884d"],
  ["#93ad70", "#85a062"],
  ["#aac487", "#9db87a"],
];
const KALE = ["#435b40", "#4e6849", "#5a7554"];
const SPINACH = ["#4f6e3f", "#5b7b48", "#678753", "#729160"];

/** Turns points about (x, y) by `angle` degrees, as an SVG rotate() would. */
function turned(points: Point[], x: number, y: number, angle: number): Point[] {
  const a = (angle * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return points.map(([px, py]) => [x + (px - x) * c - (py - y) * s, y + (px - x) * s + (py - y) * c]);
}

// A crisper holds a few hundred leaves, so each is two paths turned in code, not a group.

/** A leaf rising from (x, y): a teardrop with a softly ruffled edge, its right half in shade. */
function leaf(x: number, y: number, w: number, h: number, angle: number, color: string, rnd: () => number): SVGTemplateResult {
  // Broad and round-topped like a lettuce leaf: widest high up, the edge a little ruffled.
  const left: Point[] = [];
  const right: Point[] = [];
  const steps = 9;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const half = (w / 2) * Math.pow(Math.sin(Math.PI * (0.08 + 0.92 * t) * 0.5), 0.6) * Math.sqrt(1 - Math.pow(Math.max(0, t - 0.72) / 0.3, 2)) * (0.9 + rnd() * 0.14);
    const yy = y - h * t;
    left.push([x - half, yy + (rnd() - 0.5) * h * 0.035]);
    right.unshift([x + half, yy + (rnd() - 0.5) * h * 0.035]);
  }
  const tip: Point = [x + (rnd() - 0.5) * w * 0.1, y - h];
  const outline = pathOf(turned([[x, y], ...left, tip, ...right], x, y, angle));
  const shadeSide = pathOf(turned([[x, y], tip, ...right], x, y, angle));
  return svg`<path d=${outline} fill=${color} stroke=${color} stroke-width="0.6" stroke-linejoin="round" /><path d=${shadeSide} fill="#000" opacity="0.17" />`;
}

/** A crinkled kale or chard leaf: a scalloped outline in deep blue-green. */
function kaleLeaf(x: number, y: number, w: number, h: number, angle: number, color: string, rnd: () => number): SVGTemplateResult {
  const pts: Point[] = [];
  const steps = 18;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI;
    const bump = i % 2 ? 0.84 + rnd() * 0.1 : 1;
    pts.push([x - Math.cos(t) * (w / 2) * Math.sin(t * 0.5 + 0.6) * bump, y - Math.sin(t) * h * 0.95 * bump - (1 - Math.abs(Math.cos(t))) * h * 0.05]);
  }
  const shadeSide = turned([[x, y], ...pts.slice(steps / 2)], x, y, angle);
  return svg`<path d=${pathOf(turned(pts, x, y, angle))} fill=${color} /><path d=${pathOf(shadeSide)} fill="#000" opacity="0.16" />`;
}

/** A broccoli crown: a dome of small florets, lit from the upper left. */
function crown(x: number, cy: number, r: number, rnd: () => number): SVGTemplateResult {
  const florets: SVGTemplateResult[] = [];
  for (let j = 0; j < 9; j++) {
    const a = Math.PI * (0.05 + rnd() * 0.9);
    const d = r * (0.35 + rnd() * 0.55);
    const fx = x - Math.cos(a) * d;
    const fy = cy - Math.sin(a) * d * 0.8;
    const fr = r * (0.32 + rnd() * 0.14);
    florets.push(svg`<circle cx=${n(fx)} cy=${n(fy)} r=${n(fr)} fill=${pick(rnd, ["#56704a", "#4a6340", "#5e7a50"])} /><circle cx=${n(fx - fr * 0.3)} cy=${n(fy - fr * 0.35)} r=${n(fr * 0.35)} fill="#7f9a68" opacity="0.55" />`);
  }
  return svg`<path d=${`M${n(x - r * 0.3)} ${n(cy + r * 1.3)}L${n(x - r * 0.22)} ${n(cy)}H${n(x + r * 0.22)}L${n(x + r * 0.3)} ${n(cy + r * 1.3)}Z`} fill="#a7b98c" />
    <circle cx=${n(x)} cy=${n(cy)} r=${n(r)} fill="#4e6943" />
    ${florets}
    <path d=${`M${n(x)} ${n(cy - r)}A${n(r)} ${n(r)} 0 0 1 ${n(x)} ${n(cy + r)}Z`} fill="#000" opacity="0.15" />`;
}

type ProduceKind = "lettuce" | "spinach" | "kale" | "broccoli" | "radish" | "citrus" | "herbs";

/**
 * One kind of produce filling [x0, x1] of a bin to the brim, standing on y and up to maxH tall,
 * the way a stocked crisper looks: rows of leaves or fruit overlapping from back to front.
 */
function produce(kind: ProduceKind, x0: number, x1: number, y: number, maxH: number, rnd: () => number): SVGTemplateResult[] {
  const out: SVGTemplateResult[] = [];
  const span = x1 - x0;
  const mid = x0 + span / 2;
  if (kind === "lettuce" || kind === "kale" || kind === "spinach") {
    // Rows of leaves, the back row tallest and darkest, fanning out from the middle; spinach is
    // smaller, rounder and deeper green.
    const small = kind === "spinach";
    (small ? [0.9, 0.78, 0.62, 0.46] : [0.95, 0.8, 0.62]).forEach((tall, row) => {
      const h0 = maxH * tall * (small ? 0.7 : 1);
      const w0 = h0 * (kind === "kale" ? 0.5 : small ? 0.8 : 0.56);
      const count = Math.max(2, Math.ceil(span / (w0 * 0.5)));
      for (let i = 0; i < count; i++) {
        const x = x0 + ((i + 0.5) * span) / count + (rnd() - 0.5) * w0 * 0.35;
        const h = h0 * (0.82 + rnd() * 0.22);
        const w = w0 * (0.85 + rnd() * 0.25);
        const angle = ((x - mid) / span) * 36 + (rnd() - 0.5) * 18;
        const base = y - (small ? maxH * 0.32 * (row / 3) : 0);
        out.push(
          kind === "kale"
            ? kaleLeaf(x, base, w, h, angle, KALE[row], rnd)
            : leaf(x, base, w, h, angle, small ? SPINACH[row % SPINACH.length] : LETTUCE[row][Math.floor(rnd() * 2)], rnd),
        );
      }
    });
    return out;
  }
  if (kind === "broccoli") {
    const r = Math.min(maxH * 0.3, span * 0.2);
    [0.66, 0.36].forEach((up, row) => {
      for (let x = x0 + r * (row ? 1.4 : 0.9); x < x1 - r * 0.5; x += r * 1.75) out.push(crown(x, y - maxH * up, r * (row ? 1.05 : 0.95), rnd));
    });
    return out;
  }
  if (kind === "radish") {
    // A bunch: greens behind, the round roots heaped in front at no fixed spacing.
    for (let x = x0 + span * 0.12; x < x1; x += span * 0.2) {
      out.push(leaf(x, y - maxH * 0.3, maxH * 0.36, maxH * 0.7, (rnd() - 0.5) * 50, pick(rnd, ["#6f8b56", "#7d9862", "#65804e"]), rnd));
    }
    const count = Math.round(span / 4.2);
    for (let i = 0; i < count; i++) {
      const r = Math.min(5, maxH * 0.17) * (0.7 + rnd() * 0.45);
      const x = x0 + r + rnd() * (span - 2 * r);
      const cy = y - r - rnd() * maxH * 0.42;
      out.push(
        svg`<circle cx=${n(x)} cy=${n(cy)} r=${n(r)} fill=${pick(rnd, ["#b04a5a", "#bd5868", "#a8424f", "#c06474"])} /><path d=${`M${n(x - r * 0.6)} ${n(cy + r * 0.55)}Q${n(x)} ${n(cy + r * 1.25)} ${n(x + r * 0.6)} ${n(cy + r * 0.55)}`} fill="#efe6e2" /><path d=${`M${n(x)} ${n(cy - r)}A${n(r)} ${n(r)} 0 0 1 ${n(x)} ${n(cy + r)}Z`} fill="#000" opacity="0.16" /><circle cx=${n(x - r * 0.35)} cy=${n(cy - r * 0.35)} r=${n(r * 0.28)} fill="#fff" opacity="0.25" />`,
      );
    }
    return out;
  }
  if (kind === "herbs") {
    // Asparagus standing up in a bunch, tips a little darker.
    for (let x = x0 + 2; x < x1 - 1; x += 2.1 + rnd() * 1.2) {
      const h = maxH * (0.8 + rnd() * 0.2);
      const lean = (x - mid) * 0.12 + (rnd() - 0.5) * 3;
      out.push(
        svg`<path d=${`M${n(x)} ${n(y)}L${n(x + lean)} ${n(y - h)}`} stroke=${pick(rnd, ["#8ea36a", "#7f965e", "#9aae78"])} stroke-width="2.3" stroke-linecap="round" /><path d=${`M${n(x + lean * 0.9)} ${n(y - h * 0.9)}L${n(x + lean)} ${n(y - h)}`} stroke="#5c7044" stroke-width="2.5" stroke-linecap="round" />`,
      );
    }
    return out;
  }
  // Clementines and lemons, heaped three deep.
  const r = Math.min(maxH * 0.21, span * 0.14);
  for (let row = 0; row < 3; row++) {
    for (let x = x0 + r * (row % 2 ? 1.9 : 1) + rnd() * r * 0.4; x < x1 - r * 0.6; x += r * (1.95 + rnd() * 0.3)) {
      const cy = y - r - row * r * 1.5 - (rnd() - 0.5) * r * 0.5;
      const c = pick(rnd, ["#d98f46", "#e09a52", "#d6bf5c"]);
      out.push(
        svg`<circle cx=${n(x)} cy=${n(cy)} r=${n(r)} fill=${c} /><circle cx=${n(x + r * 0.28)} cy=${n(cy + r * 0.25)} r=${n(r * 0.78)} fill="#000" opacity="0.13" /><circle cx=${n(x - r * 0.35)} cy=${n(cy - r * 0.38)} r=${n(r * 0.25)} fill="#fff" opacity="0.3" />`,
      );
    }
  }
  return out;
}

/** What each crisper holds, one kind per third, as in the CL4850SID open photo. */
const CRISPER_THIRDS: ProduceKind[][] = [
  ["lettuce", "herbs", "spinach"],
  ["lettuce", "radish", "broccoli"],
  ["kale", "citrus", "spinach"],
  ["kale", "lettuce", "spinach"],
];

/**
 * A clear crisper or freezer drawer over what's in it: the plastic frosts the lower part of
 * the contents, a bright rim runs along the top, and a framed handle sits at the top center.
 * Crispers are split in thirds.
 */
function clearDrawer(front: Rect, k: number, thirds: boolean, contents: SVGTemplateResult[], clip: string): SVGTemplateResult {
  const rim = 3 * k;
  const hw = front.w * 0.22;
  const hh = Math.max(4, front.h * 0.18);
  const hx = front.x + (front.w - hw) / 2;
  const dividers = thirds
    ? [1, 2].map((j) => svg`<rect x=${n(front.x + (front.w * j) / 3 - 0.6)} y=${n(front.y + rim)} width="1.2" height=${n(front.h - rim)} fill="#fff" opacity="0.5" />`)
    : nothing;
  return svg`<g>
    <rect x=${n(front.x)} y=${n(front.y)} width=${n(front.w)} height=${n(front.h)} rx="2" fill="#000" opacity="0.05" />
    <clipPath id=${clip}><rect x=${n(front.x)} y=${n(front.y - 4)} width=${n(front.w)} height=${n(front.h + 4)} /></clipPath>
    <g clip-path=${`url(#${clip})`}>${contents}</g>
    <rect x=${n(front.x)} y=${n(front.y + front.h * 0.35)} width=${n(front.w)} height=${n(front.h * 0.65)} fill="#fff" opacity="0.35" />
    <rect x=${n(front.x)} y=${n(front.y)} width=${n(front.w)} height=${n(front.h)} rx="2" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="0.8" />
    <rect x=${n(front.x)} y=${n(front.y)} width=${n(front.w)} height=${n(rim)} fill="#fff" opacity="0.6" />
    ${dividers}
    <rect x=${n(hx)} y=${n(front.y + rim * 0.6)} width=${n(hw)} height=${n(hh)} rx="1" fill="#fff" fill-opacity="0.3" stroke="#9aa3a8" stroke-width="1.2" />
    <path d=${`M${n(front.x + 2)} ${n(front.y + front.h - 0.8)}H${n(front.x + front.w - 2)}`} stroke="#fff" stroke-opacity="0.8" stroke-width="1" />
  </g>`;
}

/** The crisper region of a refrigerator interior and how many bins it holds. */
function crisperPlan(r: Rect): { top: number; count: number } | null {
  if (r.h <= 260) return null;
  const tall = r.h > 520;
  return { top: r.y + r.h * (tall ? 0.63 : 0.73), count: tall ? 4 : 2 };
}

/** Bin fronts from y0 to y1, in perspective. */
function binFronts(s: Scene, r: Rect, y0: number, y1: number, count: number): Rect[] {
  const pitch = (y1 - y0) / count;
  return Array.from({ length: count }, (_, i) => projectRect(s.inside, { x: r.x + 5, y: y0 + i * pitch + 3, w: r.w - 10, h: pitch - 5 }, -18));
}

/** The crisper bins' fronts, top to bottom, where the crisper readout goes; empty without one. */
export function crisperBins(s: Scene, front: Front): Rect[] {
  if (front.contents !== "fridge" && front.contents !== "food") return [];
  const plan = crisperPlan(front.cavity);
  return plan ? binFronts(s, front.cavity, plan.top, front.cavity.y + front.cavity.h * 0.995, plan.count) : [];
}

function crispers(s: Scene, r: Rect, y0: number, y1: number, count: number, seed: number, id: string): SVGTemplateResult[] {
  const rnd = random(seed);
  return binFronts(s, r, y0, y1, count).map((front, i) => {
    const thirds = CRISPER_THIRDS[i % CRISPER_THIRDS.length];
    const base = front.y + front.h - 2;
    const inside = thirds.map((kind, j) => {
      const x0 = front.x + (front.w * j) / 3 + 1.5;
      const w = front.w / 3 - 3;
      const clip = `${id}b${i}s${j}`;
      return svg`<clipPath id=${clip}><rect x=${n(x0)} y=${n(front.y - 3)} width=${n(w)} height=${n(front.h + 3)} /></clipPath><g clip-path=${`url(#${clip})`}>${produce(kind, x0 + 1, x0 + w - 1, base, front.h * 0.92, rnd)}<rect x=${n(x0)} y=${n(front.y - 3)} width=${n(w)} height=${n(front.h + 3)} fill=${s.ref("binLight")} /></g>`;
    });
    return clearDrawer(front, depthScale(s.inside, -18), true, inside, `${id}b${i}`);
  });
}

function freezerDrawers(s: Scene, r: Rect, y0: number, y1: number, count: number, seed: number, id: string): SVGTemplateResult[] {
  const rnd = random(seed);
  const z = -58;
  const k = depthScale(s.inside, z);
  const items = freezerItems(s);
  return binFronts(s, r, y0, y1, count).map((front, i) => {
    const inside: SVGTemplateResult[] = [];
    // Two rows: the back row stands higher and a little smaller, so the drawer looks full.
    [0.3, 0].forEach((up, row) => {
      const base = front.y + front.h - 2 - front.h * up;
      const reach = front.h * (row ? 0.95 : 0.7);
      for (let x = front.x + 4 + row * 12 * k; x < front.x + front.w - 26 * k; x += (36 + rnd() * 10) * k) {
        const item = items[Math.floor(rnd() * 3)](rnd);
        const fit = Math.min(k * (row ? 1 : 0.9), reach / item.h);
        inside.push(place(x + (item.w / 2) * fit, base, fit, item.draw));
      }
    });
    return clearDrawer(front, depthScale(s.inside, -18), false, inside, `${id}b${i}`);
  });
}

function fridge(s: Scene, front: Front, seed: number, id: string): SVGTemplateResult {
  const r = front.cavity;
  const tall = r.h > 520;
  const medium = r.h > 260;
  const plan = crisperPlan(r);
  const crisper = plan ? (plan.top - r.y) / r.h : 1;
  const count = tall ? 4 : medium ? 3 : 2;
  const first = medium ? 0.17 : 0.38;
  const last = crisper < 1 ? crisper - 0.12 : 0.72;
  const surfaces = Array.from({ length: count }, (_, i) => r.y + r.h * (first + ((last - first) * i) / Math.max(1, count - 1)));
  if (crisper < 1) surfaces.push(r.y + r.h * crisper);
  // The internal dispenser: a white module on the left, between the second and third shelves.
  const dispenser = s.layout.internalDispenser && tall && front.contents === "fridge";
  const disp = projectRect(s.inside, { x: r.x + 1, y: r.y + r.h * 0.2, w: Math.min(50, r.w * 0.17), h: r.h * 0.25 }, -26);
  const makers = fridgeItems(s);
  const used = new Set<number>();
  const layers: SVGTemplateResult[] = [];
  surfaces.forEach((y, i) => {
    const above = i ? surfaces[i - 1] : r.y + r.h * 0.03;
    const blocked = dispenser && y > disp.y && above < disp.y + disp.h;
    const sh = shelf(s, r, y);
    layers.push(sh.under);
    layers.push(...arrange(s, makers, blocked ? disp.x + disp.w + 6 : r.x, r.x + r.w, y, (y - above) * 0.8, -62, seed * 31 + i, used));
    layers.push(sh.trim);
  });
  const dispenserModule = dispenser
    ? svg`<rect x=${n(disp.x + 2)} y=${n(disp.y + 3)} width=${n(disp.w)} height=${n(disp.h)} rx="2" fill="#000" opacity="0.16" filter=${s.ref("blur")} />
        <rect x=${n(disp.x)} y=${n(disp.y)} width=${n(disp.w)} height=${n(disp.h)} rx="2.5" fill="#f3f5f6" />
        <rect x=${n(disp.x + disp.w - 4)} y=${n(disp.y)} width="4" height=${n(disp.h)} rx="2" fill="#000" opacity="0.08" />
        <rect x=${n(disp.x + disp.w * 0.12)} y=${n(disp.y + disp.h * 0.24)} width=${n(disp.w * 0.76)} height=${n(disp.h * 0.6)} rx="2" fill="#dfe4e7" />
        <path d=${`M${n(disp.x + disp.w * 0.5)} ${n(disp.y + disp.h * 0.3)}V${n(disp.y + disp.h * 0.78)}`} stroke="#9aa3a8" stroke-width="1.2" />
        <rect x=${n(disp.x + disp.w * 0.22)} y=${n(disp.y + disp.h * 0.08)} width=${n(disp.w * 0.14)} height=${n(disp.w * 0.14)} rx="0.6" fill="none" stroke="#7d878d" stroke-width="0.8" />
        <path d=${`M${n(disp.x + disp.w * 0.7)} ${n(disp.y + disp.h * 0.07)}c2 3 3 4 3 5a3 3 0 0 1 -6 0c0 -1 1 -2 3 -5z`} fill="none" stroke="#7d878d" stroke-width="0.8" />`
    : nothing;
  return svg`${layers}${dispenserModule}${plan ? crispers(s, r, plan.top, r.y + r.h * 0.995, plan.count, seed, id) : nothing}`;
}

/**
 * The ice maker's module across the top of a freezer, closed as in the CL4850SID open photo:
 * a light gray housing with a frosted window onto the bin.
 */
function iceModule(s: Scene, r: Rect, seed: number): SVGTemplateResult {
  const m = projectRect(s.inside, { x: r.x + r.w * 0.36, y: r.y + r.h * 0.03, w: r.w * 0.58, h: r.h * 0.22 }, -40);
  const win = { x: m.x + m.w * 0.12, y: m.y + m.h * 0.42, w: m.w * 0.76, h: m.h * 0.4 };
  return svg`<rect x=${n(m.x + 2)} y=${n(m.y + 3)} width=${n(m.w)} height=${n(m.h)} rx="2.5" fill="#000" opacity="0.2" filter=${s.ref("blur")} />
    <rect x=${n(m.x)} y=${n(m.y)} width=${n(m.w)} height=${n(m.h)} rx="2.5" fill="#d9dee1" stroke="#a3adb3" stroke-width="0.8" />
    <rect x=${n(m.x)} y=${n(m.y)} width=${n(m.w)} height=${n(m.h * 0.3)} rx="2.5" fill="#fff" opacity="0.4" />
    <rect x=${n(m.x)} y=${n(m.y + m.h - 3.5)} width=${n(m.w)} height="3.5" rx="1.5" fill="#000" opacity="0.16" />
    <rect x=${n(win.x)} y=${n(win.y)} width=${n(win.w)} height=${n(win.h)} rx="1.5" fill="#9eabb3" />
    <g opacity="0.25">${cubes(s, win, seed, false, 11)}</g>
    <rect x=${n(win.x)} y=${n(win.y)} width=${n(win.w)} height=${n(win.h)} rx="1.5" fill="#eef3f5" fill-opacity="0.35" stroke="#8f9aa1" stroke-width="0.8" />
    <rect x=${n(win.x)} y=${n(win.y)} width=${n(win.w)} height=${n(win.h * 0.22)} rx="1.5" fill="#fff" opacity="0.3" />
    <rect x=${n(m.x + m.w * 0.12)} y=${n(m.y + m.h * 0.14)} width=${n(m.w * 0.3)} height=${n(Math.max(2, m.h * 0.08))} rx="1" fill="#aeb7bc" />`;
}

function freezer(s: Scene, front: Front, seed: number, id: string): SVGTemplateResult {
  const r = front.cavity;
  const tall = r.h > 520;
  const basketTop = tall ? 0.6 : 0.66;
  const ice = front.ice;
  const surfaces = (ice ? [0.32, 0.46] : [0.2, 0.34, 0.47]).map((t) => r.y + r.h * t).concat([r.y + r.h * basketTop]);
  const layers: SVGTemplateResult[] = [];
  if (ice) layers.push(iceModule(s, r, seed));
  const makers = freezerItems(s);
  surfaces.forEach((y, i) => {
    const above = i ? surfaces[i - 1] : r.y + r.h * (ice ? 0.27 : 0.03);
    const sh = shelf(s, r, y);
    layers.push(sh.under);
    layers.push(...arrange(s, makers, r.x, r.x + r.w, y, (y - above) * 0.78, -58, seed * 17 + i));
    layers.push(sh.trim);
  });
  return svg`${layers}${freezerDrawers(s, r, r.y + r.h * basketTop, r.y + r.h * 0.995, tall ? 3 : 2, seed + 3, id)}`;
}

/**
 * Ice heaped in a bin: irregular, translucent cubes, mounded in the middle and lit from above,
 * without outlines so the pile doesn't read as a grid. Dimmer while production is paused. A
 * bin holds over a hundred cubes, so each is one turned rect with a top-lit gradient.
 */
function cubes(s: Scene, bin: Rect, seed: number, paused: boolean, smallest = 6): SVGTemplateResult {
  const rnd = random(seed + 11);
  const out: SVGTemplateResult[] = [];
  const size = Math.max(smallest, Math.min(12, bin.w / 10));
  const step = size * 0.78;
  for (let y = bin.y + bin.h - size * 0.4; y > bin.y; y -= step * 0.8) {
    for (let x = bin.x + size * 0.3; x < bin.x + bin.w; x += step) {
      // The heap's surface: highest in the middle of the bin.
      const t = (x - bin.x) / bin.w;
      const surfaceY = bin.y + bin.h * (0.32 - 0.22 * Math.sin(t * Math.PI)) + rnd() * size * 0.6;
      if (y < surfaceY) continue;
      const c = size * (0.75 + rnd() * 0.4);
      const cx = x + (rnd() - 0.5) * size * 0.5;
      const cy = y + (rnd() - 0.5) * size * 0.4;
      const a = (rnd() - 0.5) * 40;
      const tone = 0.82 + rnd() * 0.18;
      out.push(
        svg`<rect x=${n(cx - c / 2)} y=${n(cy - c * 0.45)} width=${n(c)} height=${n(c * 0.9)} rx=${n(c * 0.22)} transform=${`rotate(${n(a)} ${n(cx)} ${n(cy)})`} fill=${s.ref("ice")} opacity=${n(tone * 10) / 10} />`,
      );
    }
  }
  return svg`<g opacity=${paused ? 0.6 : 1}>${out}</g>`;
}

/** Wine racks: maple fronts with bottles resting behind, bottoms and necks alternating. */
function wine(s: Scene, front: Front, span: [number, number], seed: number): SVGTemplateResult {
  const r = front.cavity;
  const racks = front.racks ?? { count: 6, split: null };
  const { bars, divider } = wineRacks(span, racks);
  const rnd = random(seed);
  // Capsules as in stocked units: mostly dark and matte, small at this distance.
  const foils = ["#8f7a45", "#4a1520", "#9a968a", "#1b1b1b", "#7d8083", "#5e1822"];
  const glass = ["#1d2a1e", "#2b1d12", "#141414", "#22301f"];
  const across = Math.max(3, Math.floor((r.w - 8) / 24.5));
  const step = (r.w - 8) / across;
  const out: SVGTemplateResult[] = [];
  bars.forEach((bar, i) => {
    const bottles: SVGTemplateResult[] = [];
    for (let j = 0; j < across; j++) {
      const cx = r.x + 4 + (j + 0.5) * step;
      const cy = bar - 5;
      const color = glass[Math.floor(rnd() * glass.length)];
      bottles.push(
        (i + j) % 2 === 0
          ? svg`<circle cx=${n(cx)} cy=${n(cy)} r="13.5" fill=${color} /><circle cx=${n(cx)} cy=${n(cy)} r="9.5" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.4" /><circle cx=${n(cx)} cy=${n(cy)} r="5" fill="#000" opacity="0.35" /><ellipse cx=${n(cx - 5)} cy=${n(cy - 6.5)} rx="4" ry="2" fill="#fff" opacity="0.2" />`
          : svg`<circle cx=${n(cx)} cy=${n(cy)} r="12" fill=${color} opacity="0.85" /><circle cx=${n(cx)} cy=${n(cy)} r="4.5" fill=${foils[Math.floor(rnd() * foils.length)]} stroke="#000" stroke-opacity="0.35" stroke-width="0.8" /><circle cx=${n(cx - 1.4)} cy=${n(cy - 1.5)} r="1.4" fill="#fff" opacity="0.25" />`,
      );
    }
    out.push(svg`${bottles}<rect x=${n(r.x + 2)} y=${n(bar)} width=${n(r.w - 4)} height="15.5" rx="1" fill=${s.ref("wood")} /><path d=${`M${n(r.x + 2)} ${n(bar + 0.5)}H${n(r.x + r.w - 2)}`} stroke="#fff" stroke-opacity="0.45" stroke-width="0.8" /><path d=${`M${n(r.x + 2)} ${n(bar + 15.5)}H${n(r.x + r.w - 2)}`} stroke="#000" stroke-opacity="0.5" stroke-width="1.2" />`);
  });
  if (divider) {
    // The divider between zones, with its small internal display.
    const cx = r.x + r.w / 2;
    const y = divider.y;
    out.push(svg`<rect x=${n(r.x)} y=${n(y)} width=${n(r.w)} height=${divider.h} fill="#1b1612" />
      <path d=${`M${n(r.x)} ${n(y + 0.6)}H${n(r.x + r.w)}`} stroke="#6a5a4c" stroke-width="1" />
      <rect x=${n(cx - 17)} y=${n(y + 6)} width="34" height="9" rx="1.5" fill="#090a0b" />
      <rect x=${n(cx - 12)} y=${n(y + 9.5)} width="24" height="2" rx="1" fill="#a9c8ff" opacity="0.6" />`);
  }
  return svg`${out}`;
}

/** Bottles for a beverage center: beer, sparkling water, soda, a bottle of wine; varied heights. */
const BEVERAGE_BOTTLES: BottleOptions[] = [
  { w: 24, h: 90, glass: "#5a3a1c", glassOpacity: 0.95, liquid: null, cap: "#b9a36a", label: "#e4dccb" },
  { w: 24, h: 88, glass: "#4f3420", glassOpacity: 0.95, liquid: null, cap: "#8a8f93", label: "#c9b38c" },
  { w: 26, h: 100, glass: "#cfe0e4", glassOpacity: 0.45, liquid: "#e9efe9", cap: "#6f8a74", label: "#9fb9a6" },
  { w: 26, h: 96, glass: "#3d5a3e", glassOpacity: 0.9, liquid: null, cap: "#c9ccce", label: "#e9e6dc" },
  { w: 30, h: 116, glass: "#1f2a1c", glassOpacity: 1, liquid: null, cap: "#6a2a30", label: "#ece5d2", tall: true },
  { w: 24, h: 84, glass: "#d6e2e6", glassOpacity: 0.5, liquid: "#d9b26a", cap: "#30343a", label: "#2f3b4a" },
];

/** A beverage center stocked as in Sub-Zero's photos: cans, bottles, two pull-out drawers. */
function beverage(s: Scene, front: Front, span: [number, number], seed: number): SVGTemplateResult {
  const r = front.cavity;
  const H = span[1] - span[0];
  const at = (t: number) => span[0] + H * t;
  const rnd = random(seed);
  const top = shelf(s, r, at(0.13));
  const mid = shelf(s, r, at(0.37));
  const z = -55;
  const k = depthScale(s.inside, z);
  const cans: SVGTemplateResult[] = [];
  let x = r.x + 7;
  while (x < r.x + r.w - 26) {
    const slim = rnd() > 0.7;
    const [w, h] = slim ? [21, 60] : [25.5, 48];
    if (x + w > r.x + r.w - 5) break;
    const [color, band] = CANS[Math.floor(rnd() * CANS.length)];
    const [px, py] = project(s.inside, x + w / 2, at(0.37), z);
    cans.push(place(px, py, k, canShape(w, h, color, band, s)));
    x += w + 1.5 + rnd() * 3;
  }
  const bottles: SVGTemplateResult[] = [];
  x = r.x + 6;
  while (x < r.x + r.w - 28) {
    const base = BEVERAGE_BOTTLES[Math.floor(rnd() * BEVERAGE_BOTTLES.length)];
    const scale = 0.85 + rnd() * 0.25;
    const o: BottleOptions = { ...base, h: Math.min(116, base.h * scale) };
    if (x + o.w > r.x + r.w - 4) break;
    const [px, py] = project(s.inside, x + o.w / 2, at(0.75), -58);
    bottles.push(place(px, py, depthScale(s.inside, -58), bottleShape(o, s)));
    x += o.w + 1 + rnd() * 4;
  }
  // The pull-out drawers, as in the lifestyle photos: cans standing in wire baskets, their
  // upper halves and lids showing over the maple fronts, the back row a little higher.
  const drawer = (t0: number, t1: number, seed2: number) => {
    const rd = random(seed2);
    const face = at(t1) - 13;
    const standing: SVGTemplateResult[] = [];
    for (const row of [1, 0]) {
      const cans: SVGTemplateResult[] = [];
      let cx = r.x + 5 + row * 11 + rd() * 4;
      while (cx < r.x + r.w - 8) {
        const w = 21 + rd() * 3.5;
        const y = at(t0) + 1.5 - row * 2.5 + rd() * 1.5;
        const [color, band] = CANS[Math.floor(rd() * CANS.length)];
        const h = n(face - y + 2);
        cans.push(
          svg`<rect x=${n(cx)} y=${n(y)} width=${n(w)} height=${h} fill=${rd() > 0.45 ? band : color} /><rect x=${n(cx)} y=${n(y)} width=${n(w)} height=${h} fill=${s.ref("cyl")} /><ellipse cx=${n(cx + w / 2)} cy=${n(y)} rx=${n(w / 2)} ry="1.8" fill="#c3c7ca" /><ellipse cx=${n(cx + w / 2)} cy=${n(y + 0.2)} rx=${n(w / 2 - 2.2)} ry="1" fill="#8f969b" />`,
        );
        cx += w + 1 + rd() * 2.5;
      }
      standing.push(svg`<g opacity=${row ? 0.7 : 1}>${cans}</g>`);
    }
    return svg`<rect x=${n(r.x + 2)} y=${n(at(t0) - 5)} width=${n(r.w - 4)} height=${n(at(t1) - at(t0) + 5)} fill="#17130f" opacity="0.55" />
      ${standing}
      ${[0.4, 0.75].map((t) => svg`<path d=${`M${n(r.x + 4)} ${n(at(t0) + (face - at(t0)) * t)}H${n(r.x + r.w - 4)}`} stroke="#8a8279" stroke-opacity="0.35" stroke-width="0.6" />`)}
      <rect x=${n(r.x + 2)} y=${n(face)} width=${n(r.w - 4)} height="13" rx="1" fill=${s.ref("wood")} />
      <path d=${`M${n(r.x + 2)} ${n(face + 0.5)}H${n(r.x + r.w - 2)}`} stroke="#fff" stroke-opacity="0.45" stroke-width="0.8" />`;
  };
  return svg`${top.under}${top.trim}${mid.under}${cans}${mid.trim}${bottles}${drawer(0.77, 0.88, seed + 101)}${drawer(0.9, 1, seed + 202)}`;
}

/** An ice maker: the evaporator up top and a bin of clear cubes, dimmed while paused. */
function ice(s: Scene, front: Front, paused: boolean): SVGTemplateResult {
  const r = front.cavity;
  const evap = projectRect(s.inside, { x: r.x + r.w * 0.12, y: r.y + r.h * 0.06, w: r.w * 0.76, h: r.h * 0.22 }, -120);
  const bin = projectRect(s.inside, { x: r.x + 4, y: r.y + r.h * 0.42, w: r.w - 8, h: r.h * 0.56 }, -18);
  return svg`<rect x=${n(evap.x)} y=${n(evap.y)} width=${n(evap.w)} height=${n(evap.h)} rx="1.5" fill="#a9aeb2" />
    ${Array.from({ length: 10 }, (_, i) => svg`<path d=${`M${n(evap.x + ((i + 0.5) * evap.w) / 10)} ${n(evap.y + 2)}v${n(evap.h - 4)}`} stroke="#d9dde0" stroke-width="1.2" />`)}
    <rect x=${n(bin.x)} y=${n(bin.y)} width=${n(bin.w)} height=${n(bin.h)} rx="3" fill="#2a2d30" />
    ${cubes(s, bin, 7, paused)}
    <rect x=${n(bin.x)} y=${n(bin.y)} width=${n(bin.w)} height=${n(bin.h)} rx="3" fill="#dfe8ee" fill-opacity="0.1" stroke="#ffffff" stroke-opacity="0.35" stroke-width="0.8" />`;
}

/**
 * The interior behind a front, lit, in perspective toward the camera. Behind a closed glass
 * door the caller clips it to the window and tints it; when the door is open it's drawn as is.
 */
export function cavity(s: Scene, front: Front, o: CavityOptions): SVGTemplateResult {
  const r = front.cavity;
  const contents: Contents = front.contents;
  const liner = contents === "wine" || contents === "beverage" ? DARK : contents === "ice" ? ICE : LIGHT;
  const seed = Math.round(r.x * 7 + r.y * 13 + r.w);
  // Two glass French doors share one interior, so a window's ids carry its door too.
  const clip = s.id(`c${front.cavityId}${o.glass ? `g${Math.round(front.rect.x)}` : ""}`);
  // Racks and shelves line up with the window when there is one, so the photo's
  // arrangement shows through the glass.
  const span: [number, number] = front.window ? [front.window.y, front.window.y + front.window.h] : [r.y, r.y + r.h];
  const inner =
    contents === "fridge" || contents === "food"
      ? fridge(s, front, seed, clip)
      : contents === "freezer"
        ? freezer(s, front, seed, clip)
        : contents === "wine"
          ? wine(s, front, span, seed)
          : contents === "beverage"
            ? beverage(s, front, span, seed)
            : ice(s, front, o.state.ice_maker?.paused ?? false);
  return svg`<clipPath id=${clip}><rect x=${n(r.x)} y=${n(r.y)} width=${n(r.w)} height=${n(r.h)} /></clipPath>
    <g clip-path=${`url(#${clip})`}>
      ${shell(s, r, liner)}
      ${inner}
      ${lights(s, r, liner, contents === "fridge" || contents === "freezer" || contents === "food")}
    </g>`;
}

/** What a pulled-out drawer holds, seen from above inside the drawer's opening. */
export function drawerContents(area: Rect, contents: Contents, seed: number, s: Scene): SVGTemplateResult {
  const rnd = random(seed);
  const items: SVGTemplateResult[] = [];
  const rows = 2;
  for (let row = 0; row < rows; row++) {
    const k = 0.8 + 0.25 * row;
    const base = area.y + area.h * (0.55 + 0.45 * row) + 2;
    if (contents === "freezer") {
      const freezer = freezerItems(s);
      for (let x = area.x + 26 * k; x < area.x + area.w - 24 * k; x += (50 + rnd() * 12) * k) {
        items.push(place(x, base, k, freezer[Math.floor(rnd() * 3)](rnd).draw));
      }
    } else if (contents === "beverage") {
      for (let x = area.x + 16 * k; x < area.x + area.w - 14 * k; x += 28 * k) {
        const [color, band] = CANS[Math.floor(rnd() * CANS.length)];
        items.push(place(x, base, k, canShape(25, 40, color, band, s)));
      }
    } else {
      const kinds: ProduceKind[] = ["lettuce", "broccoli", "kale", "citrus", "lettuce", "radish"];
      const width = area.w / 4;
      for (let j = 0; j < 4; j++) {
        const x0 = area.x + j * width;
        items.push(...produce(kinds[(j + row * 2 + seed) % kinds.length], x0, x0 + width, base, 30 * k, rnd));
      }
    }
  }
  return svg`${items}`;
}
