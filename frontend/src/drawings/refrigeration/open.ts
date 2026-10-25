import { nothing, svg, type SVGTemplateResult } from "lit";
import type { DrawingState } from "../types";
import { depthScale, n, pathOf, project, projectRect, random, type Point, type Rect } from "./geometry";
import { drawerContents, freezerItems, fridgeItems, place } from "./interior";
import type { Front } from "./layout";
import type { Scene } from "./materials";
import { closedFront, edgeColor, handleDiameter, handleOffset, handlePlacement } from "./parts";

export interface OpenFront {
  /** Drawn where the closed front was: the opening and what's behind it. */
  back: SVGTemplateResult;
  /** Drawn over everything else: the swung door or the pulled drawer. */
  front: SVGTemplateResult;
  /** Extent of the drawing outside the cabinet, for the viewBox. */
  points: Point[];
  /**
   * A pulled drawer's front, moved toward the viewer and scaled by k about its top-left
   * corner, so what sits on the closed front (its readout) can move with it.
   */
  moved?: Rect & { k: number };
}

/** How far an open door has swung, solved from the CL4850SID open photo's door corners. */
const SWING = (113 * Math.PI) / 180;
/**
 * Undercounter doors are shown open a little past square. The drawing keeps room for its open
 * doors in every state, and at the tall doors' swing that room would make a closed undercounter
 * unit smaller than a card's stage allows.
 */
const SWING_UNDERCOUNTER = (95 * Math.PI) / 180;

/**
 * A door swung open about its hinge. Past 90° its inner face shows: gasket, liner and door
 * bins (or the glass seen from behind), with the edge toward the viewer and the handle just
 * beyond it. Mild perspective makes the free edge, which is nearer, a little larger.
 */
export function swungDoor(s: Scene, front: Front, index: number): OpenFront {
  const { x, y, w, h } = front.rect;
  const left = front.hinge === "left";
  const hx = left ? x : x + w;
  const swing = s.layout.undercounter ? SWING_UNDERCOUNTER : SWING;
  const cos = Math.cos(swing);
  const sin = Math.sin(swing);
  const slab = s.layout.undercounter ? 22 : 26;
  const glass = front.window !== null;
  const binDepth = glass || front.contents === "ice" ? 0 : s.layout.undercounter ? 30 : 40;
  // Door coordinates: u runs from the hinge along the door, v outward from its outer face.
  const P = (u: number, v: number, yy: number): Point => {
    const dx = u * cos - v * sin;
    return project(s.camera, left ? hx + dx : hx - dx, yy, u * sin + v * cos);
  };
  const depthAt = (u: number, v: number) => depthScale(s.camera, u * sin + v * cos);
  const quad = (u0: number, u1: number, v: number, y0: number, y1: number): Point[] => [P(u0, v, y0), P(u1, v, y0), P(u1, v, y1), P(u0, v, y1)];
  const inner = quad(0, w, -slab, y, y + h);
  const edgeFace = [P(w, -slab, y), P(w, 0, y), P(w, 0, y + h), P(w, -slab, y + h)];
  const points: Point[] = [...inner, ...edgeFace];
  const parts: SVGTemplateResult[] = [];
  const dark = glass || front.contents === "ice";
  const spill = s.id(`sp${index}`);

  parts.push(svg`<linearGradient id=${spill} x1=${left ? 1 : 0} y1="0" x2=${left ? 0 : 1} y2="0">
      <stop offset="0" stop-color="#fffaf0" stop-opacity="0.45" />
      <stop offset="1" stop-color="#fffaf0" stop-opacity="0" />
    </linearGradient>
    ${glass ? nothing : svg`<path d=${pathOf(inner)} fill=${dark ? "#202224" : "#868d92"} />`}`);

  if (glass) {
    // The window seen from behind, as in the DEU2450BG lifestyle photos: a dark bronze frame
    // around clear, tinted glass that shows whatever is behind the door.
    const win = front.window!;
    const u0 = left ? win.x - x : x + w - (win.x + win.w);
    const pane = quad(u0, u0 + win.w, -slab, win.y, win.y + win.h);
    const liner = quad(6, w - 6, -slab, y + 6, y + h - 6);
    parts.push(svg`<path d=${pathOf(inner) + pathOf(pane)} fill="#1f1c19" fill-rule="evenodd" />
      <path d=${pathOf(liner) + pathOf(pane)} fill="#2e2924" fill-rule="evenodd" />
      <path d=${pathOf(pane)} fill="#1c1611" fill-opacity="0.5" stroke="#0b0a09" stroke-opacity="0.85" stroke-width="1.6" />
      <path d=${pathOf(pane)} fill=${s.ref("sheen")} />`);
  } else {
    const liner = quad(9, w - 9, -slab, y + 9, y + h - 9);
    parts.push(svg`<path d=${pathOf(liner)} fill=${dark ? "#3a3d40" : "#d9dee1"} />
      <path d=${pathOf(liner)} fill=${`url(#${spill})`} />`);
  }

  if (binDepth) {
    // Door bins as in the open photo: clear plastic boxes with a thick bright top rail, a hazy
    // front over the lower part of what stands in them, and end walls that catch the light.
    const count = h > 500 ? 5 : h > 300 ? 3 : 2;
    const hb = s.layout.undercounter ? 34 : 44;
    const u1 = 12;
    const u2 = w - 12;
    const vf = -slab - binDepth;
    const rnd = random(index * 13 + 5);
    // Bottles, cartons, jars and cups; bowls, containers and eggs stay on the shelves.
    const makers = front.contents === "freezer" ? freezerItems(s) : fridgeItems(s).filter((_, i) => i !== 3 && i !== 4 && i !== 8);
    const vMid = -slab - binDepth * 0.55;
    const line = (a: Point, b: Point, stroke: string, opacity: number, width: number) =>
      svg`<path d=${`M${n(a[0])} ${n(a[1])}L${n(b[0])} ${n(b[1])}`} stroke=${stroke} stroke-opacity=${opacity} stroke-width=${width} />`;
    const wall = (u: number, yb: number) => [P(u, -slab, yb), P(u, vf, yb), P(u, vf, yb + hb), P(u, -slab, yb + hb)];
    for (let j = 0; j < count; j++) {
      const yb = y + h * 0.09 + (j * (h * 0.8 - hb)) / Math.max(1, count - 1);
      const items: SVGTemplateResult[] = [];
      // Items run from the hinge (far) to the free edge (near), so nearer ones overlap.
      for (let u = u1 + 14; u < u2 - 10; u += 30 + rnd() * 16) {
        const item = makers[Math.floor(rnd() * makers.length)](rnd);
        if (item.h > hb * 2.4) continue;
        const [px, py] = P(u, vMid, yb + hb - 3);
        items.push(place(px, py, depthAt(u, vMid), item.draw));
      }
      const binFront = quad(u1, u2, vf, yb, yb + hb);
      const floor = [P(u1, -slab, yb + hb), P(u2, -slab, yb + hb), P(u2, vf, yb + hb), P(u1, vf, yb + hb)];
      const near = wall(u2, yb);
      points.push(...binFront);
      parts.push(svg`<path d=${pathOf(floor)} fill="#000" opacity="0.1" />
        <path d=${pathOf(wall(u1, yb))} fill="#e6eef1" fill-opacity="0.18" />
        ${items}
        <path d=${pathOf(near)} fill="#e6eef1" fill-opacity="0.24" stroke="#ffffff" stroke-opacity="0.3" stroke-width="0.6" />
        <path d=${pathOf(binFront)} fill="#eaf1f4" fill-opacity="0.3" />
        <path d=${pathOf(quad(u1, u2, vf, yb + hb * 0.45, yb + hb))} fill="#ffffff" fill-opacity="0.16" />
        <path d=${pathOf(quad(u1, u2, vf, yb + hb - 2.5, yb + hb))} fill="#ffffff" fill-opacity="0.45" />
        <path d=${pathOf(quad(u1, u2, vf, yb, yb + 3.5))} fill="#f6f9fa" fill-opacity="0.88" />
        ${line(P(u1, vf, yb + 3.5), P(u2, vf, yb + 3.5), "#6f8089", 0.35, 0.6)}
        ${line(binFront[3], binFront[2], "#8a9ba4", 0.5, 0.9)}
        ${line(near[0], near[1], "#ffffff", 0.7, 0.9)}
        ${line(near[1], near[2], "#ffffff", 0.6, 0.8)}`);
    }
  }

  // The door's edge, its outer skin seen side-on, nearest the viewer.
  parts.push(svg`<path d=${pathOf(edgeFace)} fill=${edgeColor(s)} />
    <path d=${pathOf(edgeFace)} fill=${s.ref("faceX")} />
    <path d=${`M${n(edgeFace[1][0])} ${n(edgeFace[1][1])}L${n(edgeFace[2][0])} ${n(edgeFace[2][1])}`} stroke="#000" stroke-opacity="0.3" stroke-width="1" />
    <path d=${`M${n(edgeFace[0][0])} ${n(edgeFace[0][1])}L${n(edgeFace[3][0])} ${n(edgeFace[3][1])}`} stroke="#fff" stroke-opacity="0.35" stroke-width="0.8" />`);

  const placement = handlePlacement(s, front);
  if (placement && placement.orient === "v") {
    // The handle stands off the outer face, so it shows just past the edge.
    const pro = s.handle === "pro";
    const uh = w - handleOffset(s);
    const vh = pro ? 30 : 26;
    const top = P(uh, vh, placement.y);
    const bottom = P(uh, vh, placement.y + placement.len);
    const d = handleDiameter(s) * depthAt(uh, vh);
    const standoffs = [placement.y + 14, placement.y + placement.len - 14].map((ys) => {
      const q = [P(uh, 1, ys - 5), P(uh, vh - 3, ys - 5), P(uh, vh - 3, ys + 5), P(uh, 1, ys + 5)];
      return svg`<path d=${pathOf(q)} fill="#8f9295" />`;
    });
    points.push(top, bottom);
    parts.push(svg`${standoffs}
      <rect x=${n(top[0] - d / 2)} y=${n(top[1])} width=${n(d)} height=${n(bottom[1] - top[1])} rx=${n(d / 4)} fill=${s.ref("tubeV")} />`);
  }

  // A thin contact shadow where the door meets the floor, kept inside the drawing's margin.
  const floorY = Math.max(inner[2][1], inner[3][1], edgeFace[2][1]);
  const xs = [...inner, ...edgeFace].map(([px]) => px);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  points.push([x0, floorY + 5], [x1, floorY + 5]);
  const shadow = svg`<ellipse cx=${n((x0 + x1) / 2)} cy=${n(floorY + 1.5)} rx=${n((x1 - x0) / 2 + 4)} ry="3" fill="#000" opacity=${s.theme === "dark" ? 0.5 : 0.24} filter=${s.ref("blur")} />`;
  return { back: svg``, front: svg`<g>${shadow}${parts}</g>`, points };
}

/**
 * A drawer pulled out about 17", seen through the module's camera: its front comes forward
 * (larger, and lower below the eye), uncovering the lit drawer and what's in it between side
 * walls that run back into the opening, and casts a shadow on the front below.
 */
export function pulledDrawer(s: Scene, front: Front, index: number, state: DrawingState): OpenFront {
  const r = front.rect;
  const pulled = projectRect(s.camera, r, 0.75 * s.layout.depth);
  const k = pulled.w / r.w;
  // A little extra drop so the drawer's contents show; the camera alone shows only a sliver.
  const moved = { ...pulled, y: pulled.y + Math.min(6, r.h * 0.05), k };
  const opening = { x: r.x + 6, y: r.y + 3, w: r.w - 12, h: r.h - 5 };
  // The drawer box: its back inside the opening, its sides running forward to the front.
  const backL: Point = [opening.x + 4, opening.y + 2];
  const backR: Point = [opening.x + opening.w - 4, opening.y + 2];
  const frontL: Point = [moved.x + 7 * k, moved.y + 1];
  const frontR: Point = [moved.x + moved.w - 7 * k, moved.y + 1];
  const wall = 5;
  const innerL: Point = [frontL[0] + wall * k, frontL[1]];
  const innerR: Point = [frontR[0] - wall * k, frontR[1]];
  const innerBackL: Point = [backL[0] + wall * 0.8, backL[1]];
  const innerBackR: Point = [backR[0] - wall * 0.8, backR[1]];
  const area = { x: innerL[0], y: opening.y, w: innerR[0] - innerL[0], h: moved.y - opening.y };
  const freezer = front.contents === "freezer";
  const darkLiner = front.contents === "beverage" || front.contents === "wine";
  const liner = freezer ? "#e6edf1" : darkLiner ? "#3a302a" : "#eef2f3";
  const sideFill = darkLiner ? "#2c2420" : "#d4dce0";
  const clip = s.id(`dq${index}`);
  const floor = [innerBackL, innerBackR, innerR, innerL];
  const back = svg`<rect x=${n(r.x)} y=${n(r.y)} width=${n(r.w)} height=${n(r.h)} fill="#232527" />
    <rect x=${n(opening.x)} y=${n(opening.y)} width=${n(opening.w)} height=${n(opening.h)} fill="#0f1011" />
    <clipPath id=${clip}><path d=${pathOf(floor)} /></clipPath>
    <path d=${pathOf(floor)} fill=${liner} />
    <g clip-path=${`url(#${clip})`}>
      <rect x=${n(opening.x)} y=${n(opening.y)} width=${n(opening.w)} height="8" fill="#000" opacity="0.22" />
      ${drawerContents(area, front.contents, index * 7 + 3, s)}
    </g>
    <path d=${pathOf([backL, innerBackL, innerL, frontL])} fill=${sideFill} />
    <path d=${pathOf([backL, innerBackL, innerL, frontL])} fill=${s.ref("depthL")} />
    <path d=${pathOf([innerBackR, backR, frontR, innerR])} fill=${sideFill} />
    <path d=${pathOf([innerBackR, backR, frontR, innerR])} fill=${s.ref("depthR")} />
    <path d=${`M${n(backL[0])} ${n(backL[1])}L${n(frontL[0])} ${n(frontL[1])}M${n(backR[0])} ${n(backR[1])}L${n(frontR[0])} ${n(frontR[1])}`} stroke="#ffffff" stroke-opacity="0.55" stroke-width="0.8" />`;
  const transform = `translate(${n(moved.x)} ${n(moved.y)}) scale(${Math.round(k * 1000) / 1000}) translate(${n(-r.x)} ${n(-r.y)})`;
  const bottom = moved.y + moved.h;
  const frontPart = svg`<rect x=${n(moved.x + 6)} y=${n(bottom - 5)} width=${n(moved.w - 12)} height="11" fill="#000" opacity="0.34" filter=${s.ref("blur")} />
    <g transform=${transform}>${closedFront(s, front, index, state)}</g>`;
  return {
    back,
    front: frontPart,
    points: [
      [moved.x, moved.y],
      [moved.x + moved.w, bottom + 10],
    ],
    moved,
  };
}
