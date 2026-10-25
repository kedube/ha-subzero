import { nothing, svg, type SVGTemplateResult } from "lit";
import type { DrawingState } from "../types";
import { n, type Rect } from "./geometry";
import { cavity } from "./interior";
import type { Front, Layout } from "./layout";
import { shade, surface, type Scene } from "./materials";

const rect = (r: Rect, fill: string, extra: { rx?: number; opacity?: number } = {}) =>
  svg`<rect x=${n(r.x)} y=${n(r.y)} width=${n(r.w)} height=${n(r.h)} rx=${extra.rx ?? 0} fill=${fill} opacity=${extra.opacity ?? 1} />`;

/** Classic and BI: five angled louvers in a thin stainless frame, as on the CL4850SID. */
function louvers(s: Scene, g: Rect): SVGTemplateResult {
  const frame = 1.6;
  const rail = 2.8;
  const count = 5;
  const inner = { x: g.x + frame, y: g.y + frame, w: g.w - 2 * frame, h: g.h - frame - rail };
  const pitch = inner.h / count;
  const rows: SVGTemplateResult[] = [];
  for (let i = 0; i < count; i++) {
    const y = inner.y + i * pitch;
    const last = i === count - 1;
    // Each louver: a lit upper face, the angled underside, then the dark slot below it.
    const top = pitch * 0.48;
    const face = last ? pitch - top : pitch * 0.36;
    // The photo's upper louvers darken over their last few inches, where the frame shades them.
    const end = [0.18, 0.12, 0.06][i] ?? 0;
    rows.push(svg`${rect({ x: inner.x, y, w: inner.w, h: top }, s.ref("louverTop"))}
      ${rect({ x: inner.x, y: y + top, w: inner.w, h: face }, s.ref("louverFace"))}
      ${last ? nothing : rect({ x: inner.x, y: y + top + face, w: inner.w, h: pitch - top - face }, "#090909")}
      ${end ? rect({ x: inner.x + inner.w * 0.9, y, w: inner.w * 0.1, h: top + face }, s.ref("endShade"), { opacity: end }) : nothing}
      <path d=${`M${n(inner.x)} ${n(y + 0.5)}H${n(inner.x + inner.w)}`} stroke="#fff" stroke-opacity="0.55" stroke-width="0.8" />
      <path d=${`M${n(inner.x)} ${n(y + top)}H${n(inner.x + inner.w)}`} stroke="#000" stroke-opacity="0.25" stroke-width="0.6" />
      <path d=${`M${n(inner.x + inner.w - 3.5)} ${n(y + top)}L${n(inner.x + inner.w)} ${n(y + top + face)}V${n(y + top)}Z`} fill="#000" opacity="0.28" />`);
  }
  const x1 = g.x + g.w;
  const y1 = g.y + g.h;
  return svg`<g>
    ${rect(g, "#1a1a1a")}
    ${rows}
    ${rect(inner, s.ref("grainH"), { opacity: 0.045 })}
    ${rect({ x: g.x, y: g.y, w: g.w, h: frame }, "#cfd0d1")}
    ${rect({ x: g.x, y: g.y, w: frame, h: g.h }, "#bcbdbe")}
    ${rect({ x: x1 - frame, y: g.y, w: frame, h: g.h }, "#a9aaab")}
    ${rect({ x: g.x, y: y1 - rail, w: g.w, h: rail }, "#c7c8c9")}
    <path d=${`M${n(g.x)} ${n(g.y + 0.4)}H${n(x1)}`} stroke="#fff" stroke-opacity="0.7" stroke-width="0.8" />
    <path d=${`M${n(g.x)} ${n(y1 - rail + 0.4)}H${n(x1)}`} stroke="#fff" stroke-opacity="0.55" stroke-width="0.7" />
    <path d=${`M${n(g.x)} ${n(y1 - 0.4)}H${n(x1)}`} stroke="#000" stroke-opacity="0.35" stroke-width="0.8" />
    <path d=${`M${n(g.x + 0.4)} ${n(g.y)}V${n(y1)}M${n(x1 - 0.4)} ${n(g.y)}V${n(y1)}`} stroke="#000" stroke-opacity="0.3" stroke-width="0.8" />
  </g>`;
}

/**
 * PRO: a grille panel set into the cabinet frame, with three long slots and two small
 * display windows along its lower edge.
 */
function slots(s: Scene, g: Rect): SVGTemplateResult {
  const panel = { x: g.x + 12, y: g.y + 7, w: g.w - 24, h: g.h - 9 };
  const slotW = panel.w * 0.86;
  const x = panel.x + (panel.w - slotW) / 2;
  const list = [24, 44, 64].map((dy) => {
    const y = panel.y + dy;
    return svg`<rect x=${n(x)} y=${n(y)} width=${n(slotW)} height="8" rx="4" fill="#202122" />
      <rect x=${n(x + 2)} y=${n(y + 0.6)} width=${n(slotW - 4)} height="3" rx="1.5" fill="#000" opacity="0.7" />
      <path d=${`M${n(x + 4)} ${n(y + 8.7)}H${n(x + slotW - 4)}`} stroke="#fff" stroke-opacity="0.6" stroke-width="0.8" />`;
  });
  const display = (cx: number) =>
    svg`<rect x=${n(cx - 15)} y=${n(panel.y + 84)} width="30" height="9" rx="1.5" fill="#3b3e41" />
      <rect x=${n(cx - 15)} y=${n(panel.y + 84)} width="30" height="9" rx="1.5" fill="none" stroke="#000" stroke-opacity="0.4" stroke-width="0.8" />
      <rect x=${n(cx - 10)} y=${n(panel.y + 87.5)} width="20" height="2" rx="1" fill="#d9e2ea" opacity="0.35" />`;
  return svg`<g>
    ${surface(s, g, { grain: "v", radius: 0.6 })}
    <rect x=${n(panel.x - 1.2)} y=${n(panel.y - 1.2)} width=${n(panel.w + 2.4)} height=${n(panel.h + 2.4)} rx="1" fill="#1a1a1a" />
    ${surface(s, panel, { grain: "h", radius: 0.6 })}
    ${list}
    ${display(panel.x + panel.w * 0.08)}
    ${display(panel.x + panel.w * 0.92)}
  </g>`;
}

/** The grille, or a flat panel over it on panel-ready Classic fronts, plus the hinge band. */
export function top(s: Scene): SVGTemplateResult {
  const L = s.layout;
  if (!L.grille) return svg``;
  // A panel-ready front's top panel comes down to a thin reveal above the doors.
  const panelDrop = L.band ? L.band.h - REVEAL : 0;
  const grille =
    L.top === "slots"
      ? slots(s, L.grille)
      : s.finish.kind === "panel"
        ? surface(s, { x: L.grille.x, y: L.grille.y, w: L.grille.w, h: L.grille.h + panelDrop - 0.6 }, { radius: 0.8 })
        : louvers(s, L.grille);
  return svg`${grille}${L.band ? hingeBand(s, L, L.band) : nothing}`;
}

/** The reveal between a panel-ready top panel and the doors. */
const REVEAL = 3;

/**
 * Top hinges, visible in the dark band between grille and doors, as in the photo. Behind
 * panels and on the black finish the hardware is dark, as on the CL4850SID/O.
 */
function hingeBand(s: Scene, L: Layout, b: Rect): SVGTemplateResult {
  const quiet = s.finish.kind !== "stainless";
  const band = s.finish.kind === "panel" ? { x: b.x, y: b.y + b.h - REVEAL, w: b.w, h: REVEAL } : b;
  const thin = band.h < 4;
  const parts: SVGTemplateResult[] = [rect(band, s.ref("band"))];
  if (L.top === "louvers") {
    const doors = L.fronts.filter((f) => f.kind === "door" && Math.abs(f.rect.y - L.span.y0) < 0.6);
    const armY = thin ? band.y + 0.8 : band.y + 2.2;
    const armH = thin ? 1.4 : 2.4;
    for (const door of doors) {
      const left = door.hinge === "left";
      const edge = left ? door.rect.x : door.rect.x + door.rect.w;
      const dir = left ? 1 : -1;
      const pin = left ? edge : edge - 4;
      const armX = left ? edge + 9 : edge - 33;
      parts.push(svg`<rect x=${n(pin)} y=${n(band.y + 0.6)} width="4" height=${n(band.h - 1)} rx="1" fill=${s.ref(quiet ? "capV" : "tubeV")} opacity=${quiet ? 0.7 : 1} />
        <rect x=${n(armX)} y=${n(armY)} width="24" height=${armH} rx="0.7" fill=${quiet ? "#3a3b3c" : "#d9dadb"} />
        ${quiet ? nothing : svg`<path d=${`M${n(armX)} ${n(armY + armH)}h24`} stroke="#000" stroke-opacity="0.5" stroke-width="0.6" />`}`);
      if (door.rect.w > 150 && !thin) {
        // The door closer cam, a small dark bump a few inches in from the hinge.
        const bx = edge + dir * 98;
        parts.push(svg`<rect x=${n(bx - 7)} y=${n(band.y + 2.4)} width="14" height="3.4" rx="1.6" fill="#474849" />
          ${quiet ? nothing : svg`<path d=${`M${n(bx - 6)} ${n(band.y + 2.8)}h12`} stroke="#fff" stroke-opacity="0.25" stroke-width="0.5" />`}`);
      }
    }
    // Where two doors meet, the mullion's small top cap.
    for (let i = 1; i < doors.length; i++) {
      const prev = doors[i - 1].rect;
      if (doors[i].rect.y !== prev.y) continue;
      const mid = (prev.x + prev.w + doors[i].rect.x) / 2;
      parts.push(
        quiet
          ? svg`<rect x=${n(mid - 1.7)} y=${n(band.y + 0.6)} width="3.4" height=${n(band.h - 0.6)} rx="1" fill="#4a4b4c" />`
          : svg`<rect x=${n(mid - 1.7)} y=${n(band.y + 1.2)} width="3.4" height=${n(band.h - 1.2)} rx="1.2" fill=${s.ref("capV")} opacity="0.8" />`,
      );
    }
  }
  return svg`${parts}`;
}

/** The cabinet behind the fronts: dark where the gaps show, stainless on PRO's frame. */
export function cabinet(s: Scene): SVGTemplateResult {
  const L = s.layout;
  const y0 = L.band ? L.band.y + L.band.h : 0;
  const y1 = L.kick.y;
  if (L.line === "pro") {
    const frame = { x: 0, y: y0 - 3, w: L.w, h: y1 - y0 + 3 };
    return svg`${surface(s, frame, { radius: 0.5 })}
      ${L.fronts.map((f) => rect({ x: f.rect.x - 1.6, y: f.rect.y - 1.6, w: f.rect.w + 3.2, h: f.rect.h + 3.2 }, "#151515", { rx: 1.5 }))}`;
  }
  const parts: SVGTemplateResult[] = [rect({ x: 0, y: y0, w: L.w, h: y1 - y0 }, "#1c1c1d")];
  // Side-by-side doors and French doors meet over a narrow mullion whose face catches light.
  const doors = L.fronts.filter((f) => f.kind === "door");
  for (let i = 1; i < doors.length; i++) {
    const a = doors[i - 1].rect;
    const b = doors[i].rect;
    if (a.y !== b.y || b.x - (a.x + a.w) > 6) continue;
    const mid = (a.x + a.w + b.x) / 2;
    parts.push(rect({ x: mid - 0.6, y: a.y + 2, w: 1.2, h: Math.min(a.h, b.h) - 4 }, "#c4c5c6", { opacity: 0.85 }));
  }
  return svg`${parts}`;
}

/** Toe kick: an evenly lit kickplate (black behind panels), bottom hinges, PRO's corner feet. */
export function kick(s: Scene): SVGTemplateResult {
  const L = s.layout;
  const k = L.kick;
  const black = s.finish.kind !== "stainless";
  const fill = black ? s.ref("kickBlack") : s.ref("kick");
  const plate = (r: Rect) =>
    svg`${rect(r, fill)}
      ${black ? nothing : rect(r, s.ref("grainH"), { opacity: 0.05 })}
      ${rect({ x: r.x, y: r.y, w: r.w, h: Math.min(L.line === "classic" ? 3 : 2, r.h) }, "#000", { opacity: 0.1 })}
      <path d=${`M${n(r.x)} ${n(r.y + r.h - 0.5)}H${n(r.x + r.w)}`} stroke="#000" stroke-opacity="0.45" stroke-width="1" />`;
  if (L.line === "pro") {
    const foot = 36;
    const recess = { x: foot, y: k.y + 4, w: L.w - 2 * foot, h: k.h - 4 };
    const feet = [0, L.w - foot].map((x) => {
      const inner = x === 0 ? foot : L.w - foot;
      const d =
        x === 0
          ? `M0 ${k.y}H${inner}V${k.y + 8}L${inner - 6} ${k.y + k.h}H0Z`
          : `M${L.w} ${k.y}H${inner}V${k.y + 8}L${inner + 6} ${k.y + k.h}H${L.w}Z`;
      return svg`<path d=${d} fill=${s.ref("steel")} />
        <path d=${d} fill=${s.ref("grainV")} opacity="0.12" />
        <path d=${d} fill="#000" opacity="0.12" />`;
    });
    return svg`${rect(recess, "#2a2b2c")}
      ${rect({ x: recess.x, y: recess.y, w: recess.w, h: 8 }, "#000", { opacity: 0.4 })}
      ${rect({ x: 0, y: k.y, w: L.w, h: 4 }, "#3a3b3c")}
      ${feet}`;
  }
  if (L.line === "classic") {
    const parts: SVGTemplateResult[] = [rect({ x: 0, y: k.y, w: L.w, h: 1 }, "#2a2a2a"), plate({ x: 7, y: k.y + 1, w: L.w - 14, h: k.h - 1 })];
    // Bottom hinges: black brackets with a stacked chrome pin, under doors that reach the kick.
    for (const door of L.fronts) {
      if (door.kind !== "door" || Math.abs(door.rect.y + door.rect.h - k.y) > 0.6) continue;
      const left = door.hinge === "left";
      const edge = left ? door.rect.x : door.rect.x + door.rect.w;
      const s1 = left ? 1 : -1;
      const d = `M${edge} ${k.y}h${s1 * 50}l${s1 * 3} 5v5h${-s1 * 14}l${-s1 * 4} -3H${edge}Z`;
      const px = left ? edge : edge - 4.2;
      parts.push(svg`<path d=${d} fill="#141414" />
        <path d=${`M${edge} ${k.y + 0.6}h${s1 * 50}`} stroke="#fff" stroke-opacity="0.22" stroke-width="0.7" />
        <g opacity="0.85">
          <rect x=${n(px)} y=${n(k.y + 0.4)} width="4.2" height="5" rx="1" fill=${s.ref("capV")} />
          <rect x=${n(px)} y=${n(k.y + 6)} width="4.2" height="5" rx="1" fill=${s.ref("capV")} />
        </g>`);
    }
    return svg`${parts}`;
  }
  return svg`${rect({ x: 0, y: k.y, w: L.w, h: 1 }, "#151515")}${plate({ x: 5, y: k.y + 1, w: L.w - 10, h: k.h - 1 })}`;
}

/** PRO's exposed chrome hinges on the cabinet sides, at the top and bottom of each door. */
export function sideHinges(s: Scene): SVGTemplateResult {
  const L = s.layout;
  if (L.line !== "pro") return svg``;
  const parts: SVGTemplateResult[] = [];
  for (const door of L.fronts) {
    if (door.kind !== "door") continue;
    const x = door.hinge === "left" ? -4 : L.w - 8;
    for (const y of [door.rect.y + 8, door.rect.y + door.rect.h - 78]) {
      parts.push(svg`<rect x=${x + 2} y=${n(y + 3)} width="12" height="70" rx="2" fill="#000" opacity="0.3" filter=${s.ref("blur")} />
        <rect x=${x} y=${n(y)} width="12" height="70" rx="2.5" fill=${s.ref("tubeV")} />
        <path d=${`M${x + 1} ${n(y + 0.8)}h10M${x + 1} ${n(y + 69.2)}h10`} stroke="#000" stroke-opacity="0.35" stroke-width="0.8" />`);
    }
  }
  return svg`${parts}`;
}

export interface HandlePlacement {
  orient: "v" | "h";
  x: number;
  y: number;
  len: number;
}

/**
 * The bar's diameter, measured on the photos: the Classic's tubular handle is 1", the
 * Designer and undercounter ones are slimmer (0.6–0.7"); pro handles are heavier.
 */
export function handleDiameter(s: Scene): number {
  if (s.handle === "pro") return 12.5;
  return s.layout.line === "designer" ? 7 : 10;
}

/** How far a door's handle sits in from its free edge. */
export function handleOffset(s: Scene): number {
  const L = s.layout;
  return L.line === "pro" ? 19 : L.line === "designer" && !L.undercounter ? 18 : 15;
}

/** Where a front's handle goes, measured on the photos of each line. */
export function handlePlacement(s: Scene, front: Front): HandlePlacement | null {
  if (s.handle === "none") return null;
  const L = s.layout;
  const r = front.rect;
  if (front.handle === "top") {
    const [ratio, dy] = L.line === "pro" ? [0.68, 36] : L.undercounter ? [0.85, 14] : L.line === "classic" ? [0.87, 24] : [0.92, 15];
    const len = r.w * ratio;
    return { orient: "h", x: r.x + (r.w - len) / 2, y: r.y + dy, len };
  }
  const offset = handleOffset(s);
  const x = front.hinge === "left" ? r.x + r.w - offset : r.x + offset;
  let [y0, y1] = [r.y + 49, r.y + r.h - 46];
  if (L.undercounter) [y0, y1] = [r.y + 35, r.y + r.h - 37];
  else if (L.line === "pro") [y0, y1] = [r.y + 74, r.y + r.h - 74];
  else if (L.line === "designer") [y0, y1] = r.h > 700 ? [r.y + 166, r.y + r.h - 164] : [r.y + 150, r.y + r.h - 16];
  return { orient: "v", x, y: y0, len: y1 - y0 };
}

/**
 * A handle with its soft shadow on the front, lit from above like the rest of the set.
 * Tubular: a polished round bar whose standoffs hide behind it. Pro: a heavier bar between
 * two rounded end caps.
 */
export function handle(s: Scene, p: HandlePlacement): SVGTemplateResult {
  const pro = s.handle === "pro";
  const d = handleDiameter(s);
  const cap = 25;
  const vertical = p.orient === "v";
  const across = pro ? 17 : d;
  const dx = pro ? 0.6 : 1;
  const shadow = vertical
    ? { x: p.x - across / 2 + dx, y: p.y + 2.4, w: across, h: p.len }
    : { x: p.x + dx, y: p.y - across / 2 + 2.4, w: p.len, h: across };
  const body = pro
    ? svg`<rect x=${-d / 2} y=${cap * 0.5} width=${d} height=${n(p.len - cap)} fill=${s.ref("tubeV")} />
        <path d=${`M${d * 0.11} ${cap * 0.5}V${n(p.len - cap * 0.5)}`} stroke="#fff" stroke-opacity="0.7" stroke-width="0.8" />
        ${[0, p.len - cap].map(
          (y) => svg`<rect x="-8.5" y=${n(y)} width="17" height=${cap} rx="3.6" fill=${s.ref("capV")} />
            <rect x="-8.5" y=${n(y)} width="17" height=${cap} rx="3.6" fill=${s.ref("grainV")} opacity="0.12" />
            <path d=${`M-6 ${n(y + 0.7)}H6`} stroke="#fff" stroke-opacity="0.65" stroke-width="0.8" />
            <path d=${`M-6 ${n(y + cap - 0.7)}H6`} stroke="#000" stroke-opacity="0.35" stroke-width="0.9" />`,
        )}`
    : svg`<rect x=${-d / 2} y="0" width=${d} height=${n(p.len)} rx=${n(d * 0.18)} fill=${s.ref("tubeV")} />
        <rect x=${-d / 2} y="0" width=${d} height="2.4" rx=${n(d * 0.14)} fill="#000" opacity="0.2" />
        <rect x=${-d / 2} y=${n(p.len - 2.4)} width=${d} height="2.4" rx=${n(d * 0.14)} fill="#000" opacity="0.32" />
        <path d=${`M${n(d * 0.09)} 3.2V${n(p.len - 3.2)}`} stroke="#fff" stroke-opacity="0.7" stroke-width=${n(d * 0.07)} />`;
  const transform = vertical ? `translate(${n(p.x)} ${n(p.y)})` : `translate(${n(p.x)} ${n(p.y)}) rotate(-90)`;
  return svg`<rect x=${n(shadow.x)} y=${n(shadow.y)} width=${n(shadow.w)} height=${n(shadow.h)} rx=${n(across / 2)} fill="#000" opacity="0.18" filter=${s.ref("blur")} />
    <g transform=${transform}>${body}</g>`;
}

/**
 * External dispenser in the freezer door: a recess framed by a brushed trim ring, with its
 * light, the chute, ice and water paddles and a perforated drip tray, under a control strip.
 */
function dispenser(s: Scene, front: Front): SVGTemplateResult {
  const r = front.rect;
  const handleLeft = front.hinge === "right";
  const x0 = r.x + (handleLeft ? 35 : 6);
  const x1 = r.x + r.w - (handleLeft ? 6 : 35);
  const w = Math.min(100, x1 - x0 - 24);
  const x = (x0 + x1) / 2 - w / 2;
  const cx = x + w / 2;
  const y = r.y + r.h * 0.3;
  const h = 150;
  const trim = 2.5;
  const holes: SVGTemplateResult[] = [];
  for (let row = 0; row < 3; row++) {
    for (let hx = x + 14 + (row % 2) * 2.5; hx < x + w - 13; hx += 5) {
      holes.push(svg`<circle cx=${n(hx)} cy=${n(y + h - 19 + row * 3.6)} r="0.8" fill="#0b0c0d" />`);
    }
  }
  const paddle = (px: number) =>
    svg`<rect x=${n(px)} y=${n(y + 40)} width="18" height="44" rx="2.2" fill="#2b2d30" />
      <path d=${`M${n(px + 1.2)} ${n(y + 41)}H${n(px + 16.8)}M${n(px + 0.8)} ${n(y + 42)}V${n(y + 82)}`} stroke="#fff" stroke-opacity="0.22" stroke-width="0.6" />
      <rect x=${n(px)} y=${n(y + 80)} width="18" height="4" rx="1.6" fill="#000" opacity="0.25" />`;
  return svg`<g>
    <rect x=${n(x)} y=${n(y - 24)} width=${n(w)} height="13" rx="2" fill="#121314" />
    ${[0.3, 0.5, 0.7].map((t) => svg`<circle cx=${n(x + w * t)} cy=${n(y - 17.5)} r="1.6" fill="#8fa3b5" opacity="0.4" />`)}
    ${surface(s, { x: x - trim, y: y - trim, w: w + 2 * trim, h: h + 2 * trim }, { grain: "h", radius: 7, edgeStrength: 0.8 })}
    <rect x=${n(x)} y=${n(y)} width=${n(w)} height=${h} rx="6" fill=${s.ref("niche")} />
    <rect x=${n(x)} y=${n(y)} width=${n(w)} height="22" rx="6" fill=${s.ref("shadeDown")} transform=${`rotate(180 ${n(cx)} ${n(y + 11)})`} opacity="0.9" />
    <circle cx=${n(cx)} cy=${n(y + 7)} r="5" fill="#ffd9a0" opacity="0.25" filter=${s.ref("blur")} />
    <circle cx=${n(cx)} cy=${n(y + 7)} r="1.5" fill="#ffe7c2" />
    <ellipse cx=${n(cx)} cy=${n(y + 26)} rx="7" ry="4" fill="#050505" stroke="#5a5d60" stroke-opacity="0.6" stroke-width="0.8" />
    ${paddle(cx - 20)}
    ${paddle(cx + 2)}
    <rect x=${n(x + 8)} y=${n(y + h - 24)} width=${n(w - 16)} height="16" rx="2" fill="#2f3134" />
    ${holes}
    <rect x=${n(x + 6)} y=${n(y + h - 8)} width=${n(w - 12)} height="3" rx="1.2" fill=${s.ref("tubeH")} />
  </g>`;
}

/**
 * A glass window: the lit interior seen through tinted glass, in a soft dark edge with a thin
 * bevel on the frame around it, as in the DEU2450BG and WDZ photos.
 */
function glassWindow(s: Scene, front: Front, index: number, state: DrawingState): SVGTemplateResult {
  const win = front.window!;
  const clip = s.id(`w${index}`);
  const clear = front.contents === "food";
  const box = { x: n(win.x), y: n(win.y), w: n(win.w), h: n(win.h) };
  const x1 = box.x + box.w;
  const y1 = box.y + box.h;
  return svg`<clipPath id=${clip}><rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} /></clipPath>
    <rect x=${box.x - 1} y=${box.y - 1} width=${box.w + 2} height=${box.h + 2} rx="0.6" fill="#1d1d1d" opacity="0.85" />
    <g clip-path=${`url(#${clip})`}>
      <g filter=${clear ? nothing : s.ref("mute")}>${cavity(s, front, { glass: true, state })}</g>
      <rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} fill=${s.ref("tint")} opacity=${clear ? 0.4 : 1} />
      <rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} fill=${s.ref("sheen")} />
      <rect x=${box.x} y=${box.y} width=${box.w} height="7" fill="#000" opacity="0.35" />
    </g>
    <path d=${`M${n(box.x - 1.6)} ${n(box.y - 1.3)}H${n(x1 + 1.3)}M${n(box.x - 1.3)} ${n(box.y - 1.6)}V${n(y1 + 1.3)}`} stroke="#fff" stroke-opacity="0.35" stroke-width="0.6" />
    <path d=${`M${n(box.x - 1)} ${n(y1 + 1.3)}H${n(x1 + 1.6)}M${n(x1 + 1.3)} ${n(box.y - 1)}V${n(y1 + 1.6)}`} stroke="#000" stroke-opacity="0.25" stroke-width="0.6" />`;
}

/** A closed door or drawer: face, window or dispenser, handle. */
export function closedFront(s: Scene, front: Front, index: number, state: DrawingState): SVGTemplateResult {
  const placement = handlePlacement(s, front);
  return svg`<g>
    ${surface(s, front.rect)}
    ${front.window ? glassWindow(s, front, index, state) : nothing}
    ${front.dispenser ? dispenser(s, front) : nothing}
    ${placement ? handle(s, placement) : nothing}
  </g>`;
}

/**
 * The floor contact shadow under the cabinet; the only part that adapts to the theme. Its
 * depth follows the drawing's height, so every card in a row sits on the same thin shadow.
 */
export function floorShadow(s: Scene, viewHeight: number): SVGTemplateResult {
  const { w, h } = s.layout;
  const dark = s.theme === "dark";
  return svg`<ellipse cx=${n(w / 2)} cy=${n(h + 1)} rx=${n(w * 0.62)} ry=${n(viewHeight * 0.012)} fill=${s.ref("floor")} />
    <rect x="3" y=${n(h - 1.5)} width=${n(w - 6)} height="3" rx="1.5" fill="#000" opacity=${dark ? 0.6 : 0.32} filter=${s.ref("blur")} />`;
}

// UI over the drawing (zone readouts, the ice maker's badge) is laid out in CSS pixels, the
// same in every drawing module: a 20 px pill with 12 px text, scaled into the drawing by the
// caller's units-per-pixel so it shows at one size on a small card and in the full view.
export const LABEL_H = 20;
const TEXT_SIZE = 12;
const PAD = 8.5;
const ICON = 13;
const TEXT_STYLE = "font-family:var(--ha-font-family-body, Roboto, system-ui);font-variant-numeric:tabular-nums";

/** Rough text width: the panel's own font draws it, so leave room for a wide one. */
function textWidth(text: string): number {
  let em = 0;
  for (const char of text) em += /[0-9]/.test(char) ? 0.6 : /[-°.,: ]/.test(char) ? 0.38 : 0.64;
  return em * TEXT_SIZE;
}

/** The frosted backing every label shares, centered on (0, 0): a hairline edge and a soft shadow. */
function frost(s: Scene, w: number): SVGTemplateResult {
  const h = LABEL_H;
  return svg`<rect x=${n(-w / 2 + 0.5)} y=${-h / 2 + 1.2} width=${n(w - 1)} height=${h} rx=${h / 2} fill="#000" opacity="0.28" filter=${s.ref("pill")} />
    <rect x=${n(-w / 2)} y=${-h / 2} width=${n(w)} height=${h} rx=${h / 2} fill="rgb(20,22,25)" fill-opacity="0.6" stroke="#fff" stroke-opacity="0.22" stroke-width="1" />`;
}

const scaled = (cx: number, cy: number, ui: number) => `translate(${n(cx)} ${n(cy)}) scale(${Math.round(ui * 1000) / 1000})`;

/** Ice states shown as a small mark beside the freezer readout. */
export type IceMark = "on" | "max" | "night" | null;

/** An ice cube, drawn on a 20-unit grid centered on (0, 0). */
const CUBE = svg`<path d="M0 -8 7 -4V4L0 8-7 4V-4Z M-7 -4 0 0 7 -4M0 0V8" fill="#fff" fill-opacity="0.16" stroke="#fff" stroke-width="1.7" stroke-linejoin="round" />`;

/** The ice mark in white at 85%, ICON px tall with its left edge at x (in the label's pixels). */
function iceGlyph(x: number, mark: Exclude<IceMark, null>): SVGTemplateResult {
  const k = ICON / 20;
  const extra =
    mark === "max"
      ? svg`<path d="M11 -9V-3M8 -6H14" stroke="#fff" stroke-width="2" stroke-linecap="round" />`
      : mark === "night"
        ? svg`<path d="M12.6 -10.4A3.6 3.6 0 1 0 14.4 -4.2 2.9 2.9 0 1 1 12.6 -10.4Z" fill="#fff" />`
        : nothing;
  return svg`<g transform=${`translate(${n(x + ICON / 2)} 0) scale(${k})`} opacity="0.85">${CUBE}${extra}</g>`;
}

/** Width of the ice mark in the label's pixels. */
const iceWidth = (mark: IceMark) => (mark ? ICON + (mark === "on" ? 0 : 5) : 0);

/** A zone readout: a frosted label centered on (cx, cy), `ui` drawing units per CSS pixel. */
export function readout(s: Scene, cx: number, cy: number, text: string, ui: number, mark: IceMark): SVGTemplateResult {
  const textW = textWidth(text);
  const gap = mark ? 4 : 0;
  const w = PAD * 2 + textW + gap + iceWidth(mark);
  const x0 = -w / 2 + PAD;
  return svg`<g class=${s.id("readout")} transform=${scaled(cx, cy, ui)}>
    ${frost(s, w)}
    <text x=${n(x0 + textW / 2)} y="0" dominant-baseline="central" text-anchor="middle" font-size=${TEXT_SIZE} font-weight="600" fill="#fff" style=${TEXT_STYLE}>${text}</text>
    ${mark ? iceGlyph(x0 + textW + gap, mark) : nothing}
  </g>`;
}

/** A round frosted chip with the ice maker's production state: making, paused or cleaning. */
export function badge(s: Scene, cx: number, cy: number, ui: number, icon: "making" | "paused" | "cleaning"): SVGTemplateResult {
  const glyph =
    icon === "paused"
      ? svg`<rect x="-4.6" y="-5.5" width="3.2" height="11" rx="1" fill="#fff" />
          <rect x="1.4" y="-5.5" width="3.2" height="11" rx="1" fill="#fff" />`
      : icon === "cleaning"
        ? svg`<path d="M-1 -7.5C2.4 -2.8 4.6 0 4.6 2.8A5.6 5.6 0 0 1 -6.6 2.8C-6.6 0 -4.4 -2.8 -1 -7.5Z" fill="#fff" fill-opacity="0.2" stroke="#fff" stroke-width="1.7" stroke-linejoin="round" />
            <path d="M6.2 -8.6 6.9 -6.9 8.6 -6.2 6.9 -5.5 6.2 -3.8 5.5 -5.5 3.8 -6.2 5.5 -6.9Z" fill="#fff" />`
        : CUBE;
  return svg`<g class=${s.id("readout")} transform=${scaled(cx, cy, ui)}>
    ${frost(s, LABEL_H)}
    <g transform=${`scale(${ICON / 20})`} opacity="0.85">${glyph}</g>
  </g>`;
}

/** The panel color slightly darker, for edges seen side-on (an open door's edge). */
export function edgeColor(s: Scene): string {
  if (s.finish.kind === "panel") return shade(s.finish.color, -0.18);
  if (s.finish.kind === "black") return "#26282a";
  return "#a9abad";
}
