import { svg, type SVGTemplateResult } from "lit";
import { type Defs, panelTone, polyPath, shade } from "../generic/materials";
import { type DoorView, type Front } from "./door";

/**
 * The open dishwasher: the door swung partway down, its top edge (where Cove hides the
 * controls) turned toward the viewer, and the tub above it lit by its four LEDs (two at the
 * top, two on the sides), the loaded cutlery tray and upper rack in view.
 */

/** How far the door is drawn swung down, including a slightly raised viewpoint. */
export const OPEN_ANGLE = (52 * Math.PI) / 180;
/** The door's near (top) edge widens by this much: it's closer to the viewer. */
export const OPEN_WIDEN = 0.09;
/** Door thickness at the top edge: the 3/4″ panel plus the door's control surface. */
const DOOR_DEPTH = 22;
const PANEL_DEPTH = 7.5;

const n = (value: number) => Math.round(value * 100) / 100;

/** Where the door's top edge (its controls) begins on screen. */
export function stripTop(view: DoorView): number {
  return view.at(0, 0)[1] - DOOR_DEPTH * view.lift;
}

/** Path data for lines from each point toward a vanishing point, stopped at `stopY`. */
function converging(points: Array<[number, number]>, vp: [number, number], stopY: number): string {
  return points
    .map(([x, y]) => {
      const t = (y - stopY) / (y - vp[1]);
      return `M${n(x)} ${n(y)}L${n(x + (vp[0] - x) * t)} ${n(stopY)}`;
    })
    .join("");
}

/** A rack's front wire: a gray-coated rod with a highlight along its top. */
function rod(x1: number, x2: number, y: number, weight: number): SVGTemplateResult {
  return svg`
    <path d=${`M${n(x1)} ${n(y + weight * 0.4)}H${n(x2)}`} stroke="#14181b" stroke-opacity="0.6"
      stroke-width=${weight} stroke-linecap="round" />
    <path d=${`M${n(x1)} ${n(y)}H${n(x2)}`} stroke="#9aa1a6" stroke-width=${weight} stroke-linecap="round" />
    <path d=${`M${n(x1 + 1)} ${n(y - weight * 0.28)}H${n(x2 - 1)}`} stroke="#ffffff"
      stroke-opacity="0.55" stroke-width="0.4" />
  `;
}

/** A gray plastic rack handle (plain: the real one carries a logo). */
function rackHandle(cx: number, y: number, w: number, h: number): SVGTemplateResult {
  return svg`
    <rect x=${cx - w / 2} y=${y + 1.2} width=${w} height=${h} rx="2.4" fill="#000" opacity="0.45" />
    <rect x=${cx - w / 2} y=${y} width=${w} height=${h} rx="2.4" fill="#5d6267" />
    <rect x=${cx - w / 2 + 1} y=${y + 0.6} width=${w - 2} height=${h * 0.22} rx="1.2" fill="#ffffff"
      opacity="0.2" />
    <rect x=${cx - w / 2 + 3} y=${y + h * 0.45} width=${w - 6} height=${h * 0.3} rx="1" fill="#000"
      opacity="0.14" />
  `;
}

/** Vertical wires every `step` units from x0 to x1, from y0 down to y1. */
function wires(x0: number, x1: number, step: number, y0: number, y1: number): string {
  const out: string[] = [];
  for (let x = x0; x < x1; x += step) out.push(`M${n(x)} ${n(y0)}V${n(y1)}`);
  return out.join("");
}

/**
 * The upper rack's load, as in Cove's photo: tumblers upside down on the left, plates standing
 * in the middle and bowls along the front.
 */
function dishes(d: Defs, W: number, rail: number, trayRail: number): SVGTemplateResult {
  const tumblers: SVGTemplateResult[] = [];
  const glassTop = trayRail + 7;
  for (let i = 0; i < 9; i++) {
    const front = i >= 5;
    const x = front ? 30 + (i - 5) * 18 : 22 + i * 17.5;
    const y = glassTop + (front ? 9 : (i % 2) * 3);
    const h = rail - y + (front ? 14 : 8);
    tumblers.push(svg`
      <rect x=${n(x)} y=${n(y)} width="15" height=${n(h)} rx="3" fill="#dfeaf5" fill-opacity="0.1"
        stroke="#f4f9ff" stroke-opacity="0.5" stroke-width="0.6" />
      <rect x=${n(x + 1)} y=${n(y + 0.8)} width="13" height="2.4" rx="1.2" fill="#fff" opacity="0.22" />
      <path d=${`M${n(x + 2.8)} ${n(y + 4)}V${n(y + h - 3)}`} stroke="#fff" stroke-opacity="0.6" stroke-width="0.9" />
      <path d=${`M${n(x + 11.8)} ${n(y + 6)}V${n(y + h - 6)}`} stroke="#fff" stroke-opacity="0.22" stroke-width="0.6" />
      <path d=${`M${n(x + 1.5)} ${n(y + h - 1.2)}H${n(x + 13.5)}`} stroke="#fff" stroke-opacity="0.45"
        stroke-width="0.8" />
    `);
  }
  // Plates standing in the tines, leaning back to the right: each a thin bright edge with its
  // shaded face beside it.
  const plates: string[] = [];
  const plateShade: string[] = [];
  const yTop = trayRail + 9;
  for (let i = 0; i < 8; i++) {
    const x = W / 2 + 2 + i * 3.6;
    plates.push(polyPath([[x, rail], [x + 2.8, rail], [x + 6.8, yTop + i * 0.5], [x + 4, yTop + i * 0.5]]));
    plateShade.push(polyPath([[x + 2.8, rail], [x + 3.4, rail], [x + 7.4, yTop + i * 0.5], [x + 6.8, yTop + i * 0.5]]));
  }
  // Bowls along the front, behind the rail, their rims catching the LEDs.
  const bowls = [W / 2 - 4, W / 2 + 40, W / 2 + 78].map(
    (cx) => svg`
      <ellipse cx=${n(cx + 1)} cy=${n(rail + 13)} rx="17" ry="9.5" fill="#000" opacity="0.35"
        filter=${d.url("blur-s")} />
      <ellipse cx=${n(cx)} cy=${n(rail + 11)} rx="16.5" ry="9" fill="#e9edf0" />
      <ellipse cx=${n(cx)} cy=${n(rail + 12.2)} rx="12" ry="5.6" fill="#b9c3ca" />
      <ellipse cx=${n(cx - 4)} cy=${n(rail + 8)} rx="6" ry="1.6" fill="#fff" opacity="0.7" />
    `,
  );
  return svg`
    <path d=${plates.join("")} fill="#e9edf0" />
    <path d=${plateShade.join("")} fill="#8b97a0" opacity="0.6" />
    ${bowls}${tumblers}`;
}

/**
 * Flatware lying across the cutlery tray in three loose rows, catching the LEDs: thin handles,
 * every third piece a spoon or fork with a broader head.
 */
function flatware(left: number, right: number, top: number, bottom: number): SVGTemplateResult {
  const pieces: string[] = [];
  const heads: string[] = [];
  const shine: string[] = [];
  const w = right - left;
  const rows = 3;
  const pitch = (bottom - top) / rows;
  for (let row = 0; row < rows; row++) {
    for (let k = 0; k < 8; k++) {
      // Fixed jitter, so the tray reads as loaded the same way every time.
      const j = ((row * 5 + k * 3) % 7) / 7;
      const x = left + (k + 0.15 * j) * (w / 8) + (row % 2) * 5;
      const len = w / 8 - 4 - 3 * j;
      const y = top + pitch * (row + 0.35 + 0.4 * j);
      const dy = (j - 0.5) * 2.4;
      if (x + len > right) continue;
      pieces.push(`M${n(x)} ${n(y)}l${n(len)} ${n(dy)}`);
      if ((row + k) % 3 === 0) heads.push(`M${n(x + len - 3.2)} ${n(y + dy - 1)}h4.2v2h-4.2Z`);
      shine.push(`M${n(x + len * 0.2)} ${n(y - 0.35 + dy * 0.2)}l${n(len * 0.5)} ${n(dy * 0.5)}`);
    }
  }
  return svg`
    <path d=${pieces.join("")} stroke="#000" stroke-opacity="0.4" stroke-width="1.6" stroke-linecap="round"
      transform="translate(0 0.8)" />
    <path d=${pieces.join("")} stroke="#b4bcc3" stroke-width="1" stroke-linecap="round" />
    <path d=${heads.join("")} fill="#d5dbe0" />
    <path d=${shine.join("")} stroke="#ffffff" stroke-opacity="0.8" stroke-width="0.4" stroke-linecap="round" />
  `;
}

/**
 * The tub opening, its dark frame, and what the LEDs light inside, down to `bottom`: dark
 * stainless walls with cool highlights, the cutlery tray and the loaded upper rack.
 */
export function interior(d: Defs, width: number, bottom: number): SVGTemplateResult {
  const W = width;
  const top = 8;
  const side = 12;
  const r = 10;
  const band = bottom - top;
  const opening =
    `M${side} ${n(bottom)}V${top + r}A${r} ${r} 0 0 1 ${side + r} ${top}H${W - side - r}` +
    `A${r} ${r} 0 0 1 ${W - side} ${top + r}V${n(bottom)}Z`;
  const vp: [number, number] = [W / 2, -60];
  const back = 0.8;
  const bx = (x: number) => vp[0] + (x - vp[0]) * back;
  const by = (y: number) => vp[1] + (y - vp[1]) * back;
  // The left wall; the right one is its mirror image.
  const sideWall = polyPath([
    [side, top],
    [bx(side), by(top) - 20],
    [bx(side), bottom + 6],
    [side, bottom + 6],
  ]);

  // Cutlery tray across the top: slats running back from its front rail, short uprights.
  const tray = top + band * 0.33;
  const trayL = 20;
  const trayR = W - 20;
  const slats: Array<[number, number]> = [];
  for (let x = trayL + 4; x < trayR - 1; x += 6.8) slats.push([x, tray]);

  // Upper rack: its front face, the top rails running back, and tines and a cup shelf inside.
  const rail = top + band * 0.74;
  const rackL = 18;
  const rackR = W - 18;
  const backY = by(rail);
  const tines: string[] = [];
  for (let x = W / 2 + 44; x < rackR - 8; x += 6.8) tines.push(`M${n(x)} ${n(rail + 1)}l-6 ${n(-band * 0.3)}`);
  const shelfY = rail - band * 0.2;

  return svg`
    <defs>
      <clipPath id=${d.id("tub")}><path d=${opening} /></clipPath>
      <linearGradient id=${d.id("tub-back")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5f6c77" />
        <stop offset="0.35" stop-color="#424e58" />
        <stop offset="1" stop-color="#1c2227" />
      </linearGradient>
      <linearGradient id=${d.id("tub-side")} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#3a444d" />
        <stop offset="0.6" stop-color="#788895" />
        <stop offset="1" stop-color="#56636e" />
      </linearGradient>
      <radialGradient id=${d.id("led")} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#ffffff" stop-opacity="1" />
        <stop offset="0.18" stop-color="#e6f1ff" stop-opacity="0.75" />
        <stop offset="0.5" stop-color="#c9ddf6" stop-opacity="0.22" />
        <stop offset="1" stop-color="#c2d8f2" stop-opacity="0" />
      </radialGradient>
    </defs>
    <path fill-rule="evenodd" fill="#1c1e20" d=${`M1.9 0H${W - 1.9}V${n(bottom)}H1.9Z${opening}`} />
    <g clip-path=${d.url("tub")}>
      <rect x="0" y="0" width=${W} height=${n(bottom + 6)} fill=${d.url("tub-back")} />
      <path d=${sideWall} fill=${d.url("tub-side")} />
      <path d=${sideWall} fill=${d.url("tub-side")} transform=${`translate(${W} 0) scale(-1 1)`} />
      <path d=${`M${n(bx(side))} 0V${n(bottom + 6)}M${n(bx(W - side))} 0V${n(bottom + 6)}`}
        stroke="#14181b" stroke-opacity="0.5" stroke-width="0.8" />
      <path d=${`M${n(bx(side) + 3)} ${top}V${n(bottom)}M${n(bx(W - side) - 3)} ${top}V${n(bottom)}`}
        stroke="#eef6ff" stroke-opacity="0.55" stroke-width="1.2" />

      <rect x="0" y=${n(tray + 4)} width=${W} height=${n(band * 0.3)} fill="#000" opacity="0.25" />
      <path d=${wires(bx(rackL) + 5, bx(rackR) - 2, 6.8, backY, rail)} stroke="#6f7880" stroke-opacity="0.6"
        stroke-width="0.7" />
      <path d=${tines.join("")} stroke="#5e666d" stroke-width="1" />
      ${dishes(d, W, rail, tray)}
      <path d=${`M${n(W / 2 + 34)} ${n(shelfY)}H${n(bx(rackR) - 6)}`} stroke="#8d969d" stroke-width="2" />
      <path d=${`M${n(W / 2 + 34)} ${n(shelfY - 0.7)}H${n(bx(rackR) - 6)}`} stroke="#fff" stroke-opacity="0.35"
        stroke-width="0.4" />
      <path d=${`M${n(bx(rackL))} ${n(backY)}H${n(bx(rackR))}M${rackL} ${n(rail)}L${n(bx(rackL))} ${n(backY)}M${rackR} ${n(rail)}L${n(bx(rackR))} ${n(backY)}`}
        stroke="#9aa1a6" stroke-width="1.4" fill="none" />
      <path d=${wires(rackL + 3.5, rackR - 1, 6.8, rail, bottom + 4)} stroke="#14181b" stroke-opacity="0.5"
        stroke-width="1.5" />
      <path d=${wires(rackL + 3.5, rackR - 1, 6.8, rail, bottom + 4)} stroke="#9aa1a6" stroke-width="0.9"
        stroke-opacity="0.85" />
      <path d=${wires(rackL + 3.1, rackR - 1.4, 6.8, rail + 1, bottom + 4)} stroke="#fff" stroke-opacity="0.35"
        stroke-width="0.4" />
      <path d=${`M${rackL} ${n(rail + band * 0.2)}H${rackR}`} stroke="#9aa1a6" stroke-width="1.1" />
      ${rod(rackL, rackR, rail, 2.3)}
      ${rackHandle(W / 2, rail + 1.4, 58, 12)}
      <rect x=${rackL - 4} y=${n(rail - 4)} width="7" height="10" rx="2" fill="#3f4448" />
      <rect x=${rackR - 3} y=${n(rail - 4)} width="7" height="10" rx="2" fill="#3f4448" />

      <path d=${converging(slats, vp, top - 2)} stroke="#14181b" stroke-opacity="0.45" stroke-width="1.4" />
      <path d=${converging(slats, vp, top - 2)} stroke="#9aa1a6" stroke-width="0.75" />
      ${flatware(trayL + 4, trayR - 4, top + 5, tray - 3)}
      <path d=${wires(trayL + 3, trayR - 1, 6.8, tray, tray + 6)} stroke="#9aa1a6" stroke-width="0.75" />
      ${rod(trayL, trayR, tray + 6, 1.3)}
      ${rod(trayL, trayR, tray, 2)}
      ${rackHandle(W / 2, tray - 4, 52, 10)}
      <rect x=${trayL - 4} y=${n(tray - 4)} width="7" height="10" rx="2" fill="#3f4448" />
      <rect x=${trayR - 3} y=${n(tray - 4)} width="7" height="10" rx="2" fill="#3f4448" />

      <ellipse cx="24" cy=${top + 2} rx="34" ry="17" fill=${d.url("led")} />
      <ellipse cx=${W - 24} cy=${top + 2} rx="34" ry="17" fill=${d.url("led")} />
      <ellipse cx="24" cy=${top + 1.5} rx="4" ry="1.4" fill="#ffffff" />
      <ellipse cx=${W - 24} cy=${top + 1.5} rx="4" ry="1.4" fill="#ffffff" />
      <ellipse cx="14" cy=${n(top + band * 0.72)} rx="9" ry="24" fill=${d.url("led")} opacity="0.85" />
      <ellipse cx=${W - 14} cy=${n(top + band * 0.72)} rx="9" ry="24" fill=${d.url("led")} opacity="0.85" />
      <rect x="0" y=${n(bottom - 10)} width=${W} height="10" fill=${d.url("ao-up")} />
    </g>
    <path d=${opening} fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="0.8" />
    <path d=${`M2.3 ${n(bottom)}V0.4H${W - 2.3}V${n(bottom)}`} fill="none" stroke="#5a5e62" stroke-width="0.8" />
  `;
}

/**
 * The door's top edge turned toward the viewer: the panel's own edge at the front, then
 * Cove's control surface with its small display at the left and printed touch labels
 * (`controls` false leaves the surface plain, for a dishwasher with its controls in front).
 */
export function controlStrip(d: Defs, view: DoorView, front: Front, controls: boolean): SVGTemplateResult {
  const [xl, yFront] = view.at(0, 0);
  const [xr] = view.at(view.width, 0);
  const yPanel = yFront - PANEL_DEPTH * view.lift;
  const yBack = yFront - DOOR_DEPTH * view.lift;
  const w = xr - xl;
  const shrink = w * 0.004;
  const inset = 2.2;
  // The control surface (the door's inner top) is a touch narrower than the panel.
  const cx0 = xl + inset + shrink;
  const cx1 = xr - inset - shrink;
  const surface = polyPath([
    [cx0 - 0.4, yPanel],
    [cx1 + 0.4, yPanel],
    [cx1, yBack],
    [cx0, yBack],
  ]);
  const panelEdge = polyPath([
    [xl, yFront],
    [xr, yFront],
    [xr - shrink, yPanel],
    [xl + shrink, yPanel],
  ]);
  const band = yPanel - yBack;
  const midY = yBack + band * 0.5;
  const cw = cx1 - cx0;
  // Touch-label positions and lengths across the strip, from Cove's control panel layout.
  const labelAt = [0.255, 0.33, 0.395, 0.46, 0.53, 0.65, 0.715, 0.785, 0.85];
  const labelW = [0.022, 0.034, 0.028, 0.026, 0.04, 0.034, 0.025, 0.031, 0.022];
  const labels = labelAt
    .map((f, i) => {
      const lw = labelW[i] * cw;
      const x = cx0 + f * cw - lw / 2;
      return `M${n(x)} ${n(midY - 0.6)}h${n(lw)}v1.2h${n(-lw)}Z`;
    })
    .join("");
  const displayX = cx0 + 0.035 * cw;
  const displayW = 0.135 * cw;
  const displayH = Math.max(2.8, band * 0.34);
  return svg`
    <defs>
      <linearGradient id=${d.id("ctl")} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#9da1a4" />
        <stop offset="0.45" stop-color="#bfc2c4" />
        <stop offset="1" stop-color="#cfd1d2" />
      </linearGradient>
    </defs>
    <path d=${panelEdge} fill=${front.kind === "stainless" ? "#cfcecc" : shade(panelTone(front.color), 0.12)} />
    <path d=${panelEdge} fill="#000" opacity=${front.kind === "stainless" ? 0.04 : 0.02} />
    <path d=${polyPath([[xl, yFront - 0.8], [xr, yFront - 0.8], [xr, yFront], [xl, yFront]])}
      fill="#ffffff" opacity="0.75" />
    <path d=${surface} fill=${d.url("ctl")} />
    <path d=${surface} fill="#000" filter=${d.url("grain")} opacity="0.12" style="mix-blend-mode:soft-light" />
    <path d=${polyPath([[cx0, yBack], [cx1, yBack], [cx1, yBack + 0.9], [cx0, yBack + 0.9]])}
      fill="#000" opacity="0.5" />
    <path d=${polyPath([[cx0, yPanel - 0.5], [cx1, yPanel - 0.5], [cx1, yPanel], [cx0, yPanel]])}
      fill="#000" opacity="0.2" />
    ${controls
      ? svg`
        <rect x=${n(displayX)} y=${n(midY - displayH / 2)} width=${n(displayW)} height=${n(displayH)}
          rx="0.5" fill="#152c4a" />
        <rect x=${n(displayX + displayW * 0.07)} y=${n(midY - 0.6)} width=${n(displayW * 0.3)} height="1.2"
          fill="#e8f1ff" opacity="0.92" />
        <rect x=${n(displayX + displayW * 0.68)} y=${n(midY - 0.6)} width=${n(displayW * 0.24)} height="1.2"
          fill="#e8f1ff" opacity="0.92" />
        <path d=${labels} fill="#ffffff" opacity="0.82" />`
      : null}
  `;
}
