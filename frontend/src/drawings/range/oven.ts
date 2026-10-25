import { nothing, svg, type SVGTemplateResult } from "lit";
import type { OvenState } from "../types";
import { depthScale, project, type DoorSlot, type RangeLayout } from "./layout";
import { fade, gray, stainlessAt, type Ids } from "./materials";

/*
 * Oven doors. Wolf's doors have windows: the light shows the cavity's dark porcelain and its
 * chrome racks, and heat shows as the broil element glowing at the top of the window, its light
 * falling on the racks. The cavity is drawn in the same perspective as the rangetop, so a
 * dropped-open door reveals it consistently.
 */

const round = (value: number) => Math.round(value * 100) / 100;
const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** How far an open door is drawn dropped down: open a little, the cavity visible above it. */
const OPEN_ANGLE = (45 * Math.PI) / 180;
const DOOR_THICKNESS = 24;
const HANDLE_STANDOFF = 18;
/** The handle tube's radius, from the photos (a 1 1/2″ tube). */
const TUBE_R = 7.6;

interface Glow {
  /** The interior light (or the door's open), 0 or 1. */
  lit: number;
  /**
   * The cavity's glow, 0–1: grows while preheating and stays warm once preheated. It's a
   * saturated red-orange, since dim amber over the dark cavity reads as brown.
   */
  heat: number;
  /** The broil element, 0–1. */
  element: number;
  probe: boolean;
  /** Self-clean: the racks are out (Wolf has them removed) and the lights are off. */
  clean: boolean;
}

export function ovenGlow(state: OvenState | null): Glow {
  if (!state) return { lit: 0, heat: 0, element: 0, probe: false, clean: false };
  // Self-clean turns the oven lights off and runs far hotter than cooking.
  if (state.self_clean) return { lit: 0, heat: 1, element: 1, probe: false, clean: true };
  const lit = state.light || state.door_open ? 1 : 0;
  let heat = 0;
  let element = 0;
  if (state.on) {
    // Brighter as it nears the setpoint. Once there the element cycles, so it settles a little.
    if (state.preheated) [heat, element] = [0.7, 0.6];
    else if (state.progress !== null) heat = element = 0.25 + 0.45 * clamp(state.progress);
    else [heat, element] = [0.5, 0.55];
  }
  return { lit, heat, element, probe: state.probe, clean: false };
}

type Point = [number, number];

const pathOf = (points: Point[]) => `M${points.map(([x, y]) => `${round(x)} ${round(y)}`).join("L")}Z`;

interface Cavity {
  x0: number;
  x1: number;
  floor: number;
  ceiling: number;
  front: number;
  back: number;
}

function cavityOf(layout: RangeLayout, door: DoorSlot): Cavity {
  const center = (door.x0 + door.x1) / 2;
  // A 30″ oven's cavity is 25 1/4″ wide and 17 1/2″ tall (DF48850 spec sheet).
  const inner = door.x1 - door.x0 - 47;
  const floor = layout.levels.doorBottom + 15;
  return { x0: center - inner / 2, x1: center + inner / 2, floor, ceiling: floor + 175, front: 12, back: 215 };
}

/**
 * The cavity seen through `clip`, through the window or with the door down: porcelain and racks
 * by the lamps, and the element's heat.
 */
function interior(
  layout: RangeLayout,
  ids: Ids,
  door: DoorSlot,
  glow: Glow,
  clip: string,
  box: { x: number; y: number; w: number; h: number },
  reducedMotion: boolean,
  view: "window" | "open",
): SVGTemplateResult {
  const c = cavityOf(layout, door);
  const P = (x: number, h: number, d: number) => project(layout, x, h, d);
  const line = (x0: number, h0: number, d0: number, x1: number, h1: number, d1: number) => {
    const [ax, ay] = P(x0, h0, d0);
    const [bx, by] = P(x1, h1, d1);
    return `M${round(ax)} ${round(ay)}L${round(bx)} ${round(by)}`;
  };
  const quad = (a: Point, b: Point, d: Point, e: Point) => pathOf([a, b, d, e]);
  const back = quad(P(c.x0, c.floor, c.back), P(c.x1, c.floor, c.back), P(c.x1, c.ceiling, c.back), P(c.x0, c.ceiling, c.back));
  const floor = quad(P(c.x0, c.floor, c.front), P(c.x1, c.floor, c.front), P(c.x1, c.floor, c.back), P(c.x0, c.floor, c.back));
  const ceiling = quad(P(c.x0, c.ceiling, c.front), P(c.x1, c.ceiling, c.front), P(c.x1, c.ceiling, c.back), P(c.x0, c.ceiling, c.back));
  const left = quad(P(c.x0, c.floor, c.front), P(c.x0, c.floor, c.back), P(c.x0, c.ceiling, c.back), P(c.x0, c.ceiling, c.front));
  const right = quad(P(c.x1, c.floor, c.front), P(c.x1, c.floor, c.back), P(c.x1, c.ceiling, c.back), P(c.x1, c.ceiling, c.front));
  const w = c.x1 - c.x0;
  const level = (position: number) => c.floor + 28 * position - 3;

  // Through the window, racks in positions 2 and 4 of six leave the top of the glass to the
  // element; with the door down only the top of the cavity shows, so the racks sit higher.
  // Chrome: the frame catches the light, the wires running back are finer.
  const racks = glow.clean ? [] : (view === "window" ? [2, 4] : [3, 5]).map(level);
  // The lamps light the front of each rack best; its far half falls back into the dark.
  let front = "";
  let frame = "";
  let wires = "";
  let farWires = "";
  for (const h of racks) {
    front += line(c.x0 + 4, h, 18, c.x1 - 4, h, 18);
    frame += line(c.x0 + 4, h, 200, c.x1 - 4, h, 200);
    frame += line(c.x0 + 4, h, 18, c.x0 + 4, h, 200) + line(c.x1 - 4, h, 18, c.x1 - 4, h, 200);
    wires += line(c.x0 + 4, h, 110, c.x1 - 4, h, 110);
    const count = Math.round((w - 8) / 11);
    for (let index = 1; index < count; index++) {
      const x = c.x0 + 4 + ((w - 8) * index) / count;
      wires += line(x, h, 18, x, h + 0.01, 110);
      farWires += line(x, h, 110, x, h + 0.01, 200);
    }
  }
  // The rails the racks slide on, along both side walls at every position.
  let rails = "";
  for (let position = 1; position <= 6; position++) {
    const h = level(position) - 2.5;
    rails += line(c.x0, h, 24, c.x0, h, 196) + line(c.x1, h, 24, c.x1, h, 196);
  }

  // The broil element's hairpin runs under the ceiling. Seen from above, its true height is just
  // hidden from the window, so there it's drawn a little lower, its front runs at the top of the
  // glass.
  const eh = view === "window" ? c.ceiling - 35 : c.ceiling - 9;
  const runs = [30, 70, 110, 150];
  let element = "";
  runs.forEach((d, index) => {
    // The runs reach almost to the side walls, so through the window the bends stay out of sight.
    const [from, to] = index % 2 ? [c.x1 - 12, c.x0 + 12] : [c.x0 + 12, c.x1 - 12];
    const [ax, ay] = P(from, eh, d);
    const [bx, by] = P(to, eh, d);
    element += index ? `L${round(ax)} ${round(ay)}` : `M${round(ax)} ${round(ay)}`;
    element += `L${round(bx)} ${round(by)}`;
    const next = runs[index + 1];
    if (next !== undefined) {
      const bend = to + (to > from ? 8 : -8);
      const [cx, cy] = P(bend, eh, (d + next) / 2);
      const [ex, ey] = P(to, eh, next);
      element += `Q${round(cx)} ${round(cy)} ${round(ex)} ${round(ey)}`;
      element += `M${round(ex)} ${round(ey)}`;
    }
  });

  // Wolf's lamps sit high on the side walls; on a closed door their light reaches the window as
  // warm pools on the back wall.
  const lampH = c.ceiling - 26;
  const lamps = [P(c.x0 + 1, lampH, 140), P(c.x1 - 1, lampH, 140)];
  const lampScale = depthScale(140);
  const pools = [P(c.x0 + w * 0.16, lampH - 40, c.back), P(c.x1 - w * 0.16, lampH - 40, c.back)];
  const poolRx = w * 0.42 * depthScale(c.back);
  // The convection fan's cover: a plain panel high on the back wall.
  const cover = quad(
    P(c.x0 + w * 0.2, c.ceiling - 40, c.back),
    P(c.x1 - w * 0.2, c.ceiling - 40, c.back),
    P(c.x1 - w * 0.2, c.ceiling - 8, c.back),
    P(c.x0 + w * 0.2, c.ceiling - 8, c.back),
  );
  // The probe's braided cable runs from its jack high on the left wall down to the probe's
  // handle over the lower rack, clear of the readout in the window's upper part.
  const rackRow = racks.length ? racks[0] : c.floor + 50;
  const probeStart = P(c.x0 + 2, c.floor + 125, 40);
  const probeEnd = P((c.x0 + c.x1) / 2 - 10, rackRow + 12, 105);
  const probe = `M${round(probeStart[0])} ${round(probeStart[1])}C${round(probeStart[0] + 18)} ${round(probeStart[1] + 26)} ${round(probeEnd[0] - 30)} ${round(probeEnd[1] - 8)} ${round(probeEnd[0])} ${round(probeEnd[1])}`;
  const [hx, hy] = probeEnd;
  const probeHandle = `M${round(hx)} ${round(hy)}l5 2.4`;
  const probeNeedle = `M${round(hx + 5)} ${round(hy + 2.4)}l4.2 5.6`;
  return svg`
    <g clip-path=${`url(#${clip})`}>
      <rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} fill=${ids.url("cavity")} />
      <g style=${fade(glow.lit, reducedMotion)}>
        <path d=${back} fill=${ids.url("porcelain")} />
        <path d=${floor} fill="#111219" />
        <path d=${ceiling} fill="#1e202c" />
        <path d=${left} fill="#171924" />
        <path d=${right} fill="#171924" />
        <path d=${cover} fill="#1a1c27" stroke="#2a2d3d" stroke-width="0.5" />
        ${pools.map(
          ([x, y]) => svg`<ellipse cx=${round(x)} cy=${round(y)} rx=${round(poolRx)} ry=${round(poolRx * 0.9)} fill=${ids.url("pool")} />`,
        )}
        <path d=${rails} fill="none" stroke="#a39583" stroke-width="0.5" stroke-opacity="0.55" stroke-linecap="round" />
        ${lamps.map(
          ([x, y]) => svg`
            <ellipse cx=${round(x)} cy=${round(y)} rx=${round(30 * lampScale)} ry=${round(38 * lampScale)} fill=${ids.url("pool")} />
            <ellipse cx=${round(x)} cy=${round(y)} rx=${round(12 * lampScale)} ry=${round(9 * lampScale)} fill=${ids.url("lamp")} />`,
        )}
      </g>
      <rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} fill=${ids.url(glow.clean ? "heat-clean" : "heat")}
        style=${fade(glow.heat, reducedMotion)} />
      <g style=${fade(glow.element, reducedMotion)}>
        <path d=${element} fill="none" stroke="#ff7a2e" stroke-width="4" stroke-linecap="round" opacity="0.55"
          filter=${ids.url("glow")} />
        <path d=${element} fill="none" stroke=${ids.url("element")} stroke-width="1.5" stroke-linecap="round" />
        <path d=${element} fill="none" stroke="#ffe2b0" stroke-width="0.45" stroke-linecap="round" opacity="0.8" />
      </g>
      <g style=${fade(glow.lit, reducedMotion)}>
        <path d=${farWires} fill="none" stroke="#c9b496" stroke-width="0.35" stroke-opacity="0.3" />
        <path d=${wires} fill="none" stroke="#e6d3b2" stroke-width="0.4" stroke-opacity="0.55" />
        <path d=${frame} fill="none" stroke="#d9c8ac" stroke-width="0.8" stroke-opacity="0.75" stroke-linecap="round" />
        <path d=${front} fill="none" stroke="#f8ead3" stroke-width="1.05" stroke-linecap="round" />
      </g>
      <path d=${front + frame} fill="none" stroke="#ffa86a" stroke-width="1" stroke-linecap="round"
        style=${fade(glow.heat * 0.5, reducedMotion)} />
      ${
        glow.probe
          ? svg`<g fill="none" stroke-linecap="round" style=${fade(Math.max(glow.lit * 0.9, glow.heat * 0.45), reducedMotion)}>
              <path d=${probe} stroke="#c9c9c9" stroke-width="0.6" />
              <path d=${probeHandle} stroke="#8e8e8e" stroke-width="1.9" />
              <path d=${probeHandle} stroke="#d8d8d8" stroke-width="0.5" transform="translate(0 -0.4)" />
              <path d=${probeNeedle} stroke="#e4e4e4" stroke-width="0.45" />
            </g>`
          : nothing
      }
    </g>
  `;
}

interface WindowBox {
  /** Outer edge of the frame (pro) or of the recessed panel (transitional). */
  fx0: number;
  fy0: number;
  fx1: number;
  fy1: number;
  gx0: number;
  gy0: number;
  gx1: number;
  gy1: number;
}

/** Window placement on a door, as measured on the photos. */
export function windowBox(layout: RangeLayout, x0: number, x1: number, top: number): WindowBox {
  const w = x1 - x0;
  if (layout.transitional) {
    // IR36550/S/T: a recessed panel 4.1″ in from the sides and 3 1/2″ down, an inch below the
    // handle; the glass 5.2″ in.
    const inset = Math.min(41, w * 0.115);
    return {
      fx0: x0 + inset,
      fy0: top + 35,
      fx1: x1 - inset,
      fy1: top + 195,
      gx0: x0 + inset + 11,
      gy0: top + 48,
      gx1: x1 - inset - 11,
      gy1: top + 183,
    };
  }
  // DF48850/S/P: a beveled frame 3.4″ in from the sides of the 18″ door, 4.3″ on wider doors.
  const margin = w < 240 ? 34 : 43;
  const bevel = 8.7;
  return {
    fx0: x0 + margin,
    fy0: top + 42.6,
    fx1: x1 - margin,
    fy1: top + 179,
    gx0: x0 + margin + bevel,
    gy0: top + 42.6 + bevel,
    gx1: x1 - margin - bevel,
    gy1: top + 179 - bevel,
  };
}

/** Which way a handle post's rounded end faces: the range's side, or the gap between doors. */
type PostEnd = "outer" | "inner";

/**
 * Wolf's pro handle: a polished tube between two posts a little taller than it. Each post's end
 * toward the door's edge is rounded back, so it reads as a darker D-shaped face: about 3/8″ at
 * the range's sides, 1/2″ beside the gap between two doors. The handle falls off with the light
 * toward the range's sides, all but its specular highlight.
 */
function proHandle(
  ids: Ids,
  x0: number,
  x1: number,
  y: number,
  ends: [PostEnd, PostEnd],
  scale = 1,
  open = false,
): SVGTemplateResult {
  const r = TUBE_R * scale;
  const face = 12.5 * scale;
  const bh = 19 * scale;
  const top = y - bh / 2;
  // From the camera's height a closed door's posts show a sliver of their lit top face, which
  // reads about 3/8″ deep in both photos; a dropped door turns it away.
  const lid = open ? 0 : 3.6 * scale;
  const ry = bh / 2 - 1.2 * scale;
  const depth = (end: PostEnd) => (end === "outer" ? 3.5 : 5.5) * scale;
  const [left, right] = ends.map(depth);
  const posts = [
    { fx: x0 + left, edge: x0 + left + 0.4, end: left, side: -1, sweep: 0, fill: "post-end-l" },
    { fx: x1 - right - face, edge: x1 - right - 0.4, end: right, side: 1, sweep: 1, fill: "post-end" },
  ];
  const tx0 = x0 + left + face / 2;
  const tx1 = x1 - right - face / 2;
  // The run of tube between the posts, which the falloff and the highlight cover once.
  const between = { x: x0 + left + face, w: x1 - right - face - (x0 + left + face) };
  const caps = posts.map(
    ({ edge, end, sweep }) => `M${round(edge)} ${round(y - ry)}A${round(end)} ${round(ry)} 0 0 ${sweep} ${round(edge)} ${round(y + ry)}Z`,
  );
  // The posts are machined blocks: nearly square corners.
  const corner = round(1.5 * scale);
  const faceRect = (fx: number, fill: string) =>
    svg`<rect x=${round(fx)} y=${round(top)} width=${round(face)} height=${round(bh)} rx=${corner} fill=${fill} />`;
  const lidRect = (fx: number, fill: string) =>
    lid
      ? svg`<rect x=${round(fx + corner / 2)} y=${round(top - lid + 0.3 * scale)} width=${round(face - corner)} height=${round(lid)} fill=${fill} />`
      : nothing;
  // The broad highlight along the top and the narrow one near the bottom stay bright to the
  // range's sides, as on polished metal; only the tones between them fall off.
  const glint = (gx: number, gw: number, gy: number, gh: number) => svg`
    <rect x=${round(gx)} y=${round(gy + gh * 0.12)} width=${round(gw)} height=${round(gh * 0.26)} fill=${ids.url("tube-glint")} opacity="0.9" />
    <rect x=${round(gx)} y=${round(gy + gh * 0.8)} width=${round(gw)} height=${round(gh * 0.13)} fill=${ids.url("tube-glint")} opacity="0.55" />`;
  return svg`
    <rect x=${round(tx0)} y=${round(y - r)} width=${round(tx1 - tx0)} height=${round(r * 2)} fill=${ids.url("tube")} />
    ${posts.map(
      ({ fx, edge, end, side, fill }, index) => svg`
        <path d=${caps[index]} fill=${ids.url(fill)} />
        <line x1=${round(edge + side * end * 0.45)} y1=${round(y - ry + 2.5 * scale)}
          x2=${round(edge + side * end * 0.45)} y2=${round(y + ry - 2.5 * scale)}
          stroke="#fff" stroke-opacity="0.3" stroke-width=${round(0.6 * scale)} stroke-linecap="round" />
        ${lidRect(fx, ids.url("post-top"))}
        ${faceRect(fx, ids.url("tube"))}
        ${faceRect(fx, ids.url("tube-side"))}
        <rect x=${round(fx)} y=${round(top)} width=${round(face)} height=${round(bh)} rx=${corner} fill="none"
          stroke="#6d6c6a" stroke-width="0.3" />
      `,
    )}
    <g fill=${ids.url("falloff")}>
      <rect x=${round(between.x)} y=${round(y - r)} width=${round(between.w)} height=${round(r * 2)} />
      ${caps.map((d) => svg`<path d=${d} />`)}
      ${posts.map(({ fx }) => svg`${faceRect(fx, ids.url("falloff"))}${lidRect(fx, ids.url("falloff"))}`)}
    </g>
    ${glint(between.x, between.w, y - r, 2 * r)}
    ${posts.map(({ fx }) => glint(fx + 1.5 * scale, face - 3 * scale, top, bh))}
  `;
}

/** A door's handle post ends, and how far in from its sides the handle runs. */
function handleSpan(layout: RangeLayout, door: DoorSlot, scale = 1) {
  const ends: [PostEnd, PostEnd] = [
    door.x0 < 1 ? "outer" : "inner",
    door.x1 > layout.width - 1 ? "outer" : "inner",
  ];
  const inset = (end: PostEnd) => (end === "outer" ? 0.3 : 2) * scale;
  return { x0: door.x0 + inset(ends[0]), x1: door.x1 - inset(ends[1]), ends };
}

function slimHandle(ids: Ids, x0: number, x1: number, y: number): SVGTemplateResult {
  return svg`
    <rect x=${x0} y=${y - 4} width="3.2" height="8" fill="#9a9997" />
    <rect x=${x1 - 3.2} y=${y - 4} width="3.2" height="8" fill="#9a9997" />
    <rect x=${x0 + 1.2} y=${y - 4.2} width=${x1 - x0 - 2.4} height="8.4" rx="2.2" fill=${ids.url("tube")} />
    <rect x=${x0 + 1.2} y=${y - 4.2} width=${x1 - x0 - 2.4} height="8.4" rx="2.2" fill=${ids.url("falloff")} />
    <rect x=${x0 + 1.2} y=${y - 4.2} width=${x1 - x0 - 2.4} height="8.4" rx="2.2" fill="none" stroke="#7c7b79" stroke-width="0.3" />
  `;
}

function bevels(layout: RangeLayout, box: WindowBox): SVGTemplateResult {
  const at = (x: number) => stainlessAt(x, layout.width);
  const middle = at((box.fx0 + box.fx1) / 2);
  // Each side bevel faces across the window and mirrors the door about a foot that way, as
  // polished metal does.
  const left = at(box.fx0 + 120);
  const right = at(box.fx1 - 120);
  return svg`
    <path d=${`M${box.fx0} ${box.fy0}H${box.fx1}L${box.gx1} ${box.gy0}H${box.gx0}Z`} fill=${gray(middle * 0.75 + 35)} />
    <path d=${`M${box.fx0} ${box.fy1}H${box.fx1}L${box.gx1} ${box.gy1}H${box.gx0}Z`} fill=${gray(middle * 0.75 + 50)} />
    <path d=${`M${box.fx0} ${box.fy0}L${box.gx0} ${box.gy0}V${box.gy1}L${box.fx0} ${box.fy1}Z`} fill=${gray(left)} />
    <path d=${`M${box.fx1} ${box.fy0}L${box.gx1} ${box.gy0}V${box.gy1}L${box.fx1} ${box.fy1}Z`} fill=${gray(right)} />
    <path d=${`M${box.fx0} ${box.fy0}H${box.fx1}V${box.fy1}H${box.fx0}Z`} fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="0.4" />
    <rect x=${box.gx0} y=${box.gy0} width=${box.gx1 - box.gx0} height=${box.gy1 - box.gy0} fill="none" stroke="#141414" stroke-width="0.7" />
  `;
}

function recessedPanel(box: WindowBox): SVGTemplateResult {
  // Transitional doors: a shallow recessed panel holds the glass flush in a flat frame. Lit from
  // above and in front, its top and bottom edges catch the light and its sides read as fine
  // dark lines; the glass meets the frame without a lit edge.
  return svg`
    <path d=${`M${box.fx0} ${box.fy0}V${box.fy1}M${box.fx1} ${box.fy0}V${box.fy1}`} fill="none" stroke="#000"
      stroke-opacity="0.28" stroke-width="0.6" />
    <path d=${`M${box.fx0} ${box.fy0}H${box.fx1}`} fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="0.5" />
    <path d=${`M${box.fx0} ${box.fy1}H${box.fx1}`} fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="0.7" />
    <rect x=${box.gx0} y=${box.gy0} width=${box.gx1 - box.gx0} height=${box.gy1 - box.gy0} fill="none" stroke="#000"
      stroke-opacity="0.35" stroke-width="1.4" />
  `;
}

function windowGlass(
  layout: RangeLayout,
  ids: Ids,
  door: DoorSlot,
  box: WindowBox,
  glow: Glow,
  reducedMotion: boolean,
): SVGTemplateResult {
  const clip = ids.id(`glass-${door.slot.prefix}`);
  const glass = { x: box.gx0, y: box.gy0, w: box.gx1 - box.gx0, h: box.gy1 - box.gy0 };
  const shown = Math.max(glow.lit, glow.heat) > 0;
  return svg`
    <clipPath id=${clip}><rect x=${glass.x} y=${glass.y} width=${glass.w} height=${glass.h} /></clipPath>
    <rect x=${glass.x} y=${glass.y} width=${glass.w} height=${glass.h} fill=${ids.url("glass")} />
    <g style=${fade(shown ? 1 : 0, reducedMotion)}>
      ${interior(layout, ids, door, glow, clip, glass, reducedMotion, "window")}
      <rect x=${glass.x} y=${glass.y} width=${glass.w} height=${glass.h} fill="#000" opacity=${glow.lit ? 0.16 : 0.12} />
    </g>
    <rect x=${glass.x} y=${glass.y} width=${glass.w} height=${glass.h} fill=${ids.url("glass-reflect")}
      style=${fade(shown ? 0.45 : 1, reducedMotion)} />
    <rect x=${glass.x} y=${glass.y} width=${glass.w} height=${glass.h} fill=${ids.url("sheen")} />
  `;
}

/** Where a door meets the range's sides, and the top of the corner shade below its handle. */
interface Corners {
  left: boolean;
  right: boolean;
  top: number;
}

/** The corner shade's reach, from the photos: about 6″ in and 4 1/2″ down. */
const CORNER_W = 60;
const CORNER_H = 45;

/**
 * A door's stainless face. `flat` levels the hot spot off over the whole door, as on the
 * induction range's photo; otherwise only its lower part, below the window, is leveled.
 */
function doorFace(
  ids: Ids,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  corners: Corners | null,
  flat = false,
): SVGTemplateResult {
  const w = x1 - x0;
  const h = y1 - y0;
  return svg`
    <rect x=${x0} y=${y0} width=${w} height=${h} fill=${ids.url("ss")} />
    <rect x=${x0} y=${y0} width=${w} height=${h} fill=${ids.url("shade-door")} />
    <rect x=${x0} y=${y0} width=${w} height=${h} fill=${ids.url("lower")} mask=${flat ? nothing : ids.url("lower-mask")} />
    ${
      corners?.left
        ? svg`<rect x=${x0} y=${corners.top} width=${CORNER_W} height=${CORNER_H} fill=${ids.url("corner-l")} />`
        : nothing
    }
    ${
      corners?.right
        ? svg`<rect x=${x1 - CORNER_W} y=${corners.top} width=${CORNER_W} height=${CORNER_H} fill=${ids.url("corner-r")} />`
        : nothing
    }
    <rect x=${x0} y=${y0} width=${w} height=${h} fill=${ids.url("grain")} />
    <line x1=${x0 + 0.5} y1=${y0 + 0.45} x2=${x1 - 0.5} y2=${y0 + 0.45} stroke="#fff" stroke-opacity="0.55" stroke-width="0.8" />
    <line x1=${x0 + 0.3} y1=${y0 + 1} x2=${x0 + 0.3} y2=${y1 - 0.5} stroke="#fff" stroke-opacity="0.3" stroke-width="0.5" />
    <line x1=${x1 - 0.3} y1=${y0 + 1} x2=${x1 - 0.3} y2=${y1 - 0.5} stroke="#000" stroke-opacity="0.22" stroke-width="0.6" />
    <line x1=${x0 + 0.5} y1=${y1 - 0.4} x2=${x1 - 0.5} y2=${y1 - 0.4} stroke="#000" stroke-opacity="0.3" stroke-width="0.8" />
  `;
}

/** Where a pro door's handle runs: its center line, from the door's top. */
const PRO_HANDLE_Y = 16;
const SLIM_HANDLE_Y = 19.4;

/** A closed door with its window, the cavity behind the glass, and the handle. */
export function closedDoor(
  layout: RangeLayout,
  ids: Ids,
  door: DoorSlot,
  state: OvenState | null,
  reducedMotion: boolean,
): SVGTemplateResult {
  const y0 = layout.floorY - layout.levels.doorTop;
  const y1 = layout.floorY - layout.levels.doorBottom;
  const box = windowBox(layout, door.x0, door.x1, y0);
  const glow = ovenGlow(state);
  // IR36550/S/T's bar handle starts 3.9″ in from the door's sides.
  const inset = Math.min(39, (door.x1 - door.x0) * 0.11);
  const handleY = y0 + (layout.transitional ? SLIM_HANDLE_Y : PRO_HANDLE_Y);
  const span = handleSpan(layout, door);
  const corners = layout.transitional
    ? null
    : { left: span.ends[0] === "outer", right: span.ends[1] === "outer", top: handleY + TUBE_R };
  return svg`
    <g>
      ${doorFace(ids, door.x0, y0, door.x1, y1, corners, layout.transitional)}
      ${windowGlass(layout, ids, door, box, glow, reducedMotion)}
      ${layout.transitional ? recessedPanel(box) : bevels(layout, box)}
      <rect x=${box.gx0 - 1} y=${box.gy0 - 1} width=${box.gx1 - box.gx0 + 2} height=${box.gy1 - box.gy0 + 2}
        fill="none" stroke="#ff9a4a" stroke-width="2" filter=${ids.url("halo")} style=${fade(glow.heat * 0.25, reducedMotion)} />
      ${
        // The photos show no shadow under a handle, but the door just above it is shaded.
        layout.transitional
          ? svg`
            <rect x=${door.x0 + inset - 2} y=${handleY - 13.2} width=${door.x1 - door.x0 - 2 * inset + 4} height="9"
              fill=${ids.url("handle-shadow")} mask=${ids.url("rise-mask")} filter=${ids.url("softer")} />
            ${slimHandle(ids, door.x0 + inset, door.x1 - inset, handleY)}`
          : svg`
            <rect x=${door.x0} y=${y0 + 1} width=${door.x1 - door.x0} height=${handleY - TUBE_R - y0 - 1}
              fill=${ids.url("handle-shadow")} mask=${ids.url("rise-mask")} />
            ${proHandle(ids, span.x0, span.x1, handleY, span.ends)}`
      }
    </g>
  `;
}

/**
 * A door dropped open: the face foreshortens toward the camera, its top edge shows, and the
 * lit cavity appears above it inside the oven's front frame. The door keeps the body's width;
 * true sideways perspective would flare its corners past the body, which reads as a fault.
 */
export function openDoor(
  layout: RangeLayout,
  ids: Ids,
  door: DoorSlot,
  state: OvenState | null,
  reducedMotion: boolean,
): SVGTemplateResult {
  const { doorBottom, doorTop } = layout.levels;
  const height = doorTop - doorBottom;
  const y0 = layout.floorY - doorTop;
  const y1 = layout.floorY - doorBottom;
  const { x0, x1 } = door;
  const glow = { ...ovenGlow(state), lit: 1 };
  const cos = Math.cos(OPEN_ANGLE);
  const sin = Math.sin(OPEN_ANGLE);
  // A point on the door: across (x), up from the hinge (v), and out from its face (off).
  const D = (x: number, v: number, off = 0): Point => {
    const [, y] = project(layout, x, doorBottom + v * cos - off * sin, -v * sin - off * cos);
    return [x, y];
  };

  // The oven's front frame and the cavity opening inside the door's outline.
  const { ox0, ox1, oy0, oy1 } = openingBox(layout, door);
  const clip = ids.id(`opening-${door.slot.prefix}`);
  const opening = { x: ox0, y: oy0, w: ox1 - ox0, h: oy1 - oy0 };
  const vents = Math.max(3, Math.round((ox1 - ox0) / 34));
  const ventSlots = Array.from({ length: vents }, (_, index) => ox0 + 10 + ((ox1 - ox0 - 20) * (index + 0.5)) / vents);

  // The door itself, by its local features.
  const corners = (u0: number, v0: number, u1: number, v1: number, off = 0) =>
    pathOf([D(u0, v0, off), D(u1, v0, off), D(u1, v1, off), D(u0, v1, off)]);
  const face = corners(x0, 0, x1, height);
  const box = windowBox(layout, x0, x1, 0);
  // windowBox measures down from the top; convert to heights up from the hinge.
  const v = (fromTop: number) => height - fromTop;
  const glassPath = corners(box.gx0, v(box.gy1), box.gx1, v(box.gy0));
  const framePaths = layout.transitional
    ? []
    : [
        pathOf([D(box.fx0, v(box.fy0)), D(box.fx1, v(box.fy0)), D(box.gx1, v(box.gy0)), D(box.gx0, v(box.gy0))]),
        pathOf([D(box.fx0, v(box.fy1)), D(box.fx1, v(box.fy1)), D(box.gx1, v(box.gy1)), D(box.gx0, v(box.gy1))]),
        pathOf([D(box.fx0, v(box.fy0)), D(box.gx0, v(box.gy0)), D(box.gx0, v(box.gy1)), D(box.fx0, v(box.fy1))]),
        pathOf([D(box.fx1, v(box.fy0)), D(box.gx1, v(box.gy0)), D(box.gx1, v(box.gy1)), D(box.fx1, v(box.fy1))]),
      ];
  const topEdge = pathOf([D(x0, height), D(x1, height), D(x1, height, -DOOR_THICKNESS), D(x0, height, -DOOR_THICKNESS)]);
  const [, gasketY] = D(x0, height, -DOOR_THICKNESS * 0.5);
  const handleV = height - (layout.transitional ? SLIM_HANDLE_Y : PRO_HANDLE_Y);
  const [, hy] = D(x0, handleV, HANDLE_STANDOFF);
  const handleScale = depthScale(-handleV * sin - HANDLE_STANDOFF * cos);
  const span = handleSpan(layout, door, handleScale);
  const level = stainlessAt((x0 + x1) / 2, layout.width);

  return svg`
    <g>
      <rect x=${x0} y=${y0} width=${x1 - x0} height=${y1 - y0} fill=${ids.url("ss-dim")} />
      <rect x=${x0} y=${y0} width=${x1 - x0} height=${y1 - y0} fill=${ids.url("grain")} />
      ${ventSlots.map(
        (x) => svg`<g fill="#202122">
          <rect x=${x - 5} y=${y0 + 3.6} width="10" height="0.9" rx="0.45" />
          <rect x=${x - 5} y=${y0 + 6} width="10" height="0.9" rx="0.45" />
          <rect x=${x - 5} y=${y0 + 8.4} width="10" height="0.9" rx="0.45" />
        </g>`,
      )}
      <circle cx=${ox0 + 3} cy=${y0 + 6.4} r="1.3" fill="#2a2b2c" />
      <circle cx=${ox1 - 3} cy=${y0 + 6.4} r="1.3" fill="#2a2b2c" />
      <clipPath id=${clip}><rect x=${opening.x} y=${opening.y} width=${opening.w} height=${opening.h} rx="5" /></clipPath>
      ${interior(layout, ids, door, glow, clip, opening, reducedMotion, "open")}
      <rect x=${opening.x} y=${opening.y} width=${opening.w} height=${opening.h} rx="5" fill="none" stroke="#5a5650" stroke-width="2.2" />

      <path d=${face} fill=${ids.url("ss")} />
      <path d=${face} fill=${ids.url("shade-open")} />
      <path d=${face} fill=${ids.url("grain")} />
      <path d=${glassPath} fill=${ids.url("glass")} />
      ${framePaths.map((d, index) => svg`<path d=${d} fill=${gray(level * 0.72 + [30, 45, 40, 34][index])} />`)}
      <path d=${glassPath} fill="none" stroke="#141414" stroke-width="0.6" />
      <path d=${topEdge} fill=${gray(level * 0.75 + 46)} />
      <line x1=${x0 + 12} y1=${round(gasketY)} x2=${x1 - 12} y2=${round(gasketY)} stroke="#2a2b2c" stroke-opacity="0.4" stroke-width="0.8" />
      <path d=${topEdge} fill="none" stroke="#fff" stroke-opacity="0.4" stroke-width="0.4" />
      ${
        layout.transitional
          ? slimHandle(ids, x0 + 39, x1 - 39, hy)
          : proHandle(ids, span.x0, span.x1, hy, span.ends, handleScale, true)
      }
    </g>
  `;
}

/** The oven's front frame opening that a dropped door reveals, in drawing coordinates. */
export function openingBox(layout: RangeLayout, door: DoorSlot): { ox0: number; ox1: number; oy0: number; oy1: number } {
  const y0 = layout.floorY - layout.levels.doorTop;
  const y1 = layout.floorY - layout.levels.doorBottom;
  return { ox0: door.x0 + 16, ox1: door.x1 - 16, oy0: y0 + 14, oy1: y1 - 8 };
}
