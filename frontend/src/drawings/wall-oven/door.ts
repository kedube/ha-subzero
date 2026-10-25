import { nothing, svg, type SVGTemplateResult } from "lit";
import {
  DOOR_THICKNESS,
  HANDLE_STANDOFF,
  WIDTH,
  type DoorDesign,
  type DoorRect,
  type Handle,
  type OvenStyle,
} from "./layout";
import { clamp, mix, points, round, url, type Materials, type Pt } from "./materials";

/** A pinhole camera in front of the appliance; z points out of its face toward the viewer. */
export interface Camera {
  cx: number;
  cy: number;
  /** Distance from the camera to the appliance's face. */
  d: number;
}

export function project(camera: Camera, x: number, y: number, z: number): Pt {
  const scale = camera.d / (camera.d - z);
  return [camera.cx + (x - camera.cx) * scale, camera.cy + (y - camera.cy) * scale];
}

/**
 * Where a point on a door lands in the drawing: u across from the door's left edge, v down from
 * its top edge, n out of its face. A shut door is the identity; an open one is dropped forward
 * on its bottom hinge and seen through the camera, so it foreshortens and widens toward you.
 */
export interface DoorMap {
  shut: boolean;
  at(u: number, v: number, n?: number): Pt;
}

export function shutDoor(left: number, top: number): DoorMap {
  return { shut: true, at: (u, v) => [left + u, top + v] };
}

export function openDoor(
  left: number,
  top: number,
  height: number,
  angle: number,
  camera: Camera,
): DoorMap {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const hinge = top + height;
  return {
    shut: false,
    at(u, v, n = 0) {
      const rise = height - v;
      return project(camera, left + u, hinge - rise * cos + n * sin, rise * sin + n * cos);
    },
  };
}

/**
 * The camera for looking into a cavity: about seven feet back, as Wolf's interior photos are
 * taken, so the porcelain walls and racks show their depth. Through a shut door's window it looks
 * from a third of the way down; with the door dropped it looks in from just above the top rack.
 * The door itself is seen from farther away, so a dropped door doesn't sprawl past the oven.
 */
export function interiorCamera(doorTop: number, doorHeight: number, open = false): Camera {
  return { cx: WIDTH / 2, cy: doorTop + doorHeight * (open ? 0.2 : 0.3), d: 850 };
}

/** How the cavity is lit: the interior light and the heating glow, each 0 to 1. */
export interface CavityLook {
  lamp: number;
  heat: number;
  selfClean: boolean;
  /** The temperature probe is plugged in: its cable shows when the cavity is lit. */
  probe: boolean;
}

const isLit = (look: CavityLook): boolean => look.lamp > 0 || look.heat > 0;

/** A quadrilateral on the door, in drawing coordinates. */
function quad(map: DoorMap, r: DoorRect, n = 0): Pt[] {
  return [
    map.at(r.u0, r.v0, n),
    map.at(r.u1, r.v0, n),
    map.at(r.u1, r.v1, n),
    map.at(r.u0, r.v1, n),
  ];
}

/** A door-space rectangle: a crisp `<rect>` while shut, a projected polygon while open. */
function area(map: DoorMap, r: DoorRect, fill: string, opacity = 1, n = 0): SVGTemplateResult {
  if (map.shut) {
    const [x, y] = map.at(r.u0, r.v0);
    return svg`<rect x=${round(x)} y=${round(y)} width=${round(r.u1 - r.u0)} height=${round(r.v1 - r.v0)}
      fill=${fill} opacity=${opacity} />`;
  }
  return svg`<polygon points=${points(quad(map, r, n))} fill=${fill} opacity=${opacity} />`;
}

function line(
  map: DoorMap,
  u0: number,
  v0: number,
  u1: number,
  v1: number,
  stroke: string,
  width: number,
  opacity: number,
  n = 0,
): SVGTemplateResult {
  const [x0, y0] = map.at(u0, v0, n);
  const [x1, y1] = map.at(u1, v1, n);
  return svg`<line x1=${round(x0)} y1=${round(y0)} x2=${round(x1)} y2=${round(y1)} stroke=${stroke}
    stroke-width=${width} opacity=${opacity} />`;
}

export interface DoorOptions {
  m: Materials;
  map: DoorMap;
  design: DoorDesign;
  style: OvenStyle;
  height: number;
  look: CavityLook;
  /** The door's top in the drawing, to place the cavity behind it. */
  top: number;
  /** A key unique within the drawing for this door's clip paths and gradients. */
  key: string;
}

/** A shut door's brushed face, to be grained along with the panels. */
export function doorBase(o: DoorOptions): SVGTemplateResult {
  const face = { u0: 0, u1: WIDTH, v0: 0, v1: o.height };
  return svg`${area(o.map, face, url(o.m.metal))}${area(o.map, face, url(o.m.sheen))}`;
}

/** Everything on a shut door's face except its base: glass, window, bevel and handle. */
export function doorDetails(o: DoorOptions): SVGTemplateResult {
  const { m, map, design } = o;
  const black = o.style !== "professional";
  return svg`
    ${design.frameLine ? frameLine(map, design.frameLine, o.height) : nothing}
    ${black ? area(map, design.glass, url(m.blackGlass)) : nothing}
    ${black ? glassEdges(map, design.glass) : nothing}
    ${windowPane(o)}
    ${design.bevel ? bevel(m, map, design.window, design.bevel) : nothing}
    ${design.recess ? recess(m, map, design.window, design.recess) : nothing}
    ${handle(m, map, design.handle)}
    ${line(map, 0.5, 0.4, WIDTH - 0.5, 0.4, "#fff", 0.8, 0.55)}
    ${line(map, 0.5, o.height - 0.4, WIDTH - 0.5, o.height - 0.4, "#000", 0.8, 0.3)}
  `;
}

/** M Series Transitional: the glass sits in a slightly raised stainless frame, a fine line. */
function frameLine(map: DoorMap, r: DoorRect, height: number): SVGTemplateResult {
  const v0 = Math.max(r.v0, 0);
  const v1 = Math.min(r.v1, height);
  return svg`
    ${line(map, r.u0, v0, r.u0, v1, "#fff", 0.45, 0.45)}
    ${line(map, r.u0 + 0.6, v0, r.u0 + 0.6, v1, "#000", 0.4, 0.14)}
    ${line(map, r.u1, v0, r.u1, v1, "#fff", 0.45, 0.35)}
    ${line(map, r.u1 - 0.6, v0, r.u1 - 0.6, v1, "#000", 0.4, 0.14)}
    ${r.v1 <= height ? line(map, r.u0, r.v1, r.u1, r.v1, "#fff", 0.45, 0.42) : nothing}
    ${r.v1 <= height ? line(map, r.u0, r.v1 - 0.6, r.u1, r.v1 - 0.6, "#000", 0.4, 0.12) : nothing}
  `;
}

function glassEdges(map: DoorMap, r: DoorRect): SVGTemplateResult {
  return svg`
    ${line(map, r.u0, r.v0 + 0.4, r.u1, r.v0 + 0.4, "#000", 0.8, 0.5)}
    ${line(map, r.u0, r.v0 + 1.1, r.u1, r.v0 + 1.1, "#fff", 0.5, 0.18)}
    ${line(map, r.u0, r.v1 - 0.3, r.u1, r.v1 - 0.3, "#fff", 0.6, 0.22)}
  `;
}

/**
 * The window: dark charcoal glass, lighter in the middle as in the photos, and behind it, when the
 * cavity is lit, the cavity itself, dimmed by the tinted glass and shaded toward the window's edges.
 */
function windowPane(o: DoorOptions): SVGTemplateResult {
  const { m, map, design } = o;
  const r = design.window;
  const black = o.style !== "professional";
  const clipId = `${m.uid}-win-${o.key}`;
  const vignetteId = `${m.uid}-vignette-${o.key}`;
  const [x0, y0] = map.at(r.u0, r.v0);
  return svg`
    <clipPath id=${clipId}>
      <rect x=${round(x0)} y=${round(y0)} width=${round(r.u1 - r.u0)} height=${round(r.v1 - r.v0)} />
    </clipPath>
    <g clip-path=${url(clipId)}>
      ${black ? nothing : area(map, r, url(m.glass))}
      ${isLit(o.look)
        ? svg`${cavityScene(m, interiorCamera(o.top, o.height), cavityBox(o.top, o.height), o.look, o.key)}
            <radialGradient id=${vignetteId} cx="0.5" cy="0.45" r="0.72">
              <stop offset="0.55" stop-color="#000" stop-opacity="0" />
              <stop offset="1" stop-color="#000" stop-opacity="0.7" />
            </radialGradient>
            ${area(map, r, url(vignetteId))}
            ${area(map, r, "#000", black ? 0.24 : 0.1)}
            ${area(map, r, url(black ? m.blackGlass : m.glass), black ? 0.26 : 0.16)}`
        : nothing}
    </g>
  `;
}

/**
 * The M Series window's stainless bevel, a picture frame sloping into the glass. As in the photos,
 * its faces sit close to the door's tone, lighten toward the glass, and end in a bright edge where
 * they meet it; the outer edge has no line.
 */
function bevel(m: Materials, map: DoorMap, r: DoorRect, width: number): SVGTemplateResult {
  const o = { u0: r.u0 - width, u1: r.u1 + width, v0: r.v0 - width, v1: r.v1 + width };
  const face = (pts: Array<[number, number]>, fill: string) =>
    svg`<polygon points=${points(pts.map(([u, v]) => map.at(u, v)))} fill=${fill} />`;
  return svg`
    ${face([[o.u0, o.v0], [o.u1, o.v0], [r.u1, r.v0], [r.u0, r.v0]], url(m.bevelTop))}
    ${face([[o.u0, o.v0], [r.u0, r.v0], [r.u0, r.v1], [o.u0, o.v1]], url(m.bevelLeft))}
    ${face([[r.u1, r.v0], [o.u1, o.v0], [o.u1, o.v1], [r.u1, r.v1]], url(m.bevelRight))}
    ${face([[r.u0, r.v1], [r.u1, r.v1], [o.u1, o.v1], [o.u0, o.v1]], url(m.bevelBottom))}
    ${line(map, o.u0, o.v1, o.u1, o.v1, "#fff", 0.6, 0.12)}
    ${line(map, r.u0 - 0.3, r.v0 - 0.3, r.u1 + 0.3, r.v0 - 0.3, "#fff", 0.6, 0.55)}
    ${line(map, r.u0 - 0.3, r.v0, r.u0 - 0.3, r.v1, "#fff", 0.6, 0.45)}
    ${line(map, r.u1 + 0.3, r.v0, r.u1 + 0.3, r.v1, "#fff", 0.6, 0.5)}
    ${line(map, r.u0 - 0.3, r.v1 + 0.3, r.u1 + 0.3, r.v1 + 0.3, "#fff", 0.6, 0.35)}
  `;
}

/**
 * The E Series window: the glass sits in a soft recess, lit along its right and bottom sides and
 * fading into the door, with the glass's top and left edges in a little shadow. No lines.
 */
function recess(m: Materials, map: DoorMap, r: DoorRect, width: number): SVGTemplateResult {
  const poly = (pts: Array<[number, number]>, fill: string) =>
    svg`<polygon points=${points(pts.map(([u, v]) => map.at(u, v)))} fill=${fill} />`;
  return svg`
    ${poly([[r.u1, r.v0], [r.u1 + width, r.v0], [r.u1 + width, r.v1 + width], [r.u1, r.v1]], url(m.recessRight))}
    ${poly([[r.u0, r.v1], [r.u1, r.v1], [r.u1 + width, r.v1 + width], [r.u0, r.v1 + width]], url(m.recessBottom))}
    ${line(map, r.u0, r.v0 + 0.25, r.u1, r.v0 + 0.25, "#000", 0.5, 0.3)}
    ${line(map, r.u0 + 0.25, r.v0, r.u0 + 0.25, r.v1, "#000", 0.5, 0.3)}
  `;
}

/** The Professional handle's end caps, as measured: their width and half their height. */
const CAP_WIDTH = 10.2;
const CAP_HALF = 8.3;

/** A shut door's handle: Professional bar on barrel end caps, a slim bar, or a flush strip. */
function handle(m: Materials, map: DoorMap, h: Handle): SVGTemplateResult {
  if (h.kind === "strip") return stripHandle(m, map, h);
  const r = h.size / 2;
  const [x0, y] = map.at(h.u0, h.v);
  const [x1] = map.at(h.u1, h.v);
  if (h.kind === "slim") {
    // Flat ends with a slight chamfer, and a crisp shadow line on the glass just under the bar.
    return svg`
      <rect x=${round(x0 + 4)} y=${round(y + r + 0.4)} width=${round(x1 - x0 - 8)} height="0.9" fill="#000"
        opacity="0.45" filter=${url(m.blurFine)} />
      <rect x=${round(x0)} y=${round(y - r)} width=${round(x1 - x0)} height=${round(r * 2)} rx=${round(r * 0.25)}
        fill=${url(m.chrome)} />
    `;
  }
  return svg`
    <rect x=${round(x0 + 4)} y=${round(y + r)} width=${round(x1 - x0 - 8)} height=${round(r * 0.9)}
      fill=${url(m.dropShadow)} opacity="0.45" />
    <rect x=${round(x0 + CAP_WIDTH)} y=${round(y - r)} width=${round(x1 - x0 - CAP_WIDTH * 2)}
      height=${round(r * 2)} fill=${url(m.chrome)} />
    ${proCap(m, x0, y, "left")}
    ${proCap(m, x1 - CAP_WIDTH, y, "right")}
  `;
}

/**
 * A Professional handle's end cap: a satin barrel whose outer end rounds away from the light,
 * with a seam where it meets the bar.
 */
function proCap(m: Materials, x: number, cy: number, side: "left" | "right"): SVGTemplateResult {
  const w = CAP_WIDTH;
  const top = cy - CAP_HALF;
  const bottom = cy + CAP_HALF;
  // The barrel's outer end is only slightly rounded at its corners, as in the photos.
  const k = 1.8;
  const d =
    side === "left"
      ? `M${round(x + k)} ${round(top)}H${round(x + w)}V${round(bottom)}H${round(x + k)}` +
        `A${k} ${k} 0 0 1 ${round(x)} ${round(bottom - k)}V${round(top + k)}A${k} ${k} 0 0 1 ${round(x + k)} ${round(top)}Z`
      : `M${round(x)} ${round(top)}H${round(x + w - k)}A${k} ${k} 0 0 1 ${round(x + w)} ${round(top + k)}` +
        `V${round(bottom - k)}A${k} ${k} 0 0 1 ${round(x + w - k)} ${round(bottom)}H${round(x)}Z`;
  const seam = side === "left" ? x + w : x;
  return svg`
    <path d=${d} transform="translate(0 1.2)" fill="#000" opacity="0.08" />
    <path d=${d} fill=${url(m.chrome)} />
    <path d=${d} fill="#000" opacity="0.07" />
    <path d=${d} fill=${url(side === "left" ? m.capEndLeft : m.capEndRight)} />
    <line x1=${round(seam)} y1=${round(top + 0.5)} x2=${round(seam)} y2=${round(bottom - 0.5)} stroke="#000"
      stroke-width="0.4" opacity="0.25" />
  `;
}

/** M Series Contemporary: the door's top edge is a brushed stainless pull strip. */
function stripHandle(m: Materials, map: DoorMap, h: Handle): SVGTemplateResult {
  const r = { u0: h.u0, u1: h.u1, v0: 0, v1: h.size };
  return svg`
    ${area(map, r, url(m.metal))}
    ${line(map, 0, 0.6, WIDTH, 0.6, "#fff", 1.1, 0.7)}
    ${line(map, 0, 2.2, WIDTH, 2.2, "#fff", 0.6, 0.25)}
    ${line(map, 0, h.size - 0.5, WIDTH, h.size - 0.5, "#000", 1, 0.55)}
  `;
}

/* ---------------------------------------------------------------------------------------------
 * The cavity: cobalt porcelain, chrome racks on six-position ladders, halogen lights high on each
 * side. Heated, it's a dark warm key: amber light at the top, gold glints along the rack fronts.
 */

export interface CavityBox {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  /** The oven's face behind the door, and the back wall. */
  zFront: number;
  zBack: number;
}

/** The cavity behind a door: about 25 1/2″ wide and 18 1/2″ deep, opening 2″ in from the sides. */
export function cavityBox(doorTop: number, doorHeight: number): CavityBox {
  return {
    x0: 20,
    x1: WIDTH - 20,
    y0: doorTop + 20,
    y1: doorTop + doorHeight - 7,
    zFront: -DOOR_THICKNESS,
    zBack: -DOOR_THICKNESS - 190,
  };
}

interface CavityColors {
  backTop: string;
  backBottom: string;
  wall: string;
  /** The side walls near the lamps, where the porcelain catches their light. */
  wallLit: string;
  floor: string;
  /** The light filling the cavity: warm white from the lamps, amber from the elements. */
  glow: string;
  /** Rack wires running back, the racks' front bars, and the glints beading along them. */
  wire: string;
  bar: string;
  glint: string;
  /** How strongly the chrome catches the light, 0 to 1. */
  shine: number;
  /** How much of the wire shows: all of it under the lamp, mostly glints in the heat's glow. */
  weight: number;
  bulb: string;
}

/**
 * Wolf's cobalt porcelain as the photos show it under the halogen lamps: mostly a dark, warm
 * gray, blue only on the floor and in the shadowed corners, with the bright chrome carrying the
 * light. Heating, seen through the tinted glass, the blue gives way to a dark warm brown, so the
 * amber glow and the gold glints read; the lamp then adds brightness, not color. With the door
 * open the porcelain stays cobalt and only the chrome warms, as in the open-door photos.
 * Self-clean runs redder.
 */
function cavityColors(look: CavityLook, open = false): CavityColors {
  const heat = look.selfClean ? 1 : look.heat;
  const lamp = look.lamp;
  const blue = heat > 0 && !open ? 0 : lamp;
  const warmth = heat * (1 + 0.3 * lamp) * (open ? 0.3 : 1);
  const ember = look.selfClean ? "#5a1806" : "#4a1e0a";
  const lit = (unlit: string, lamped: string, heated: string, share: number) =>
    mix(mix(unlit, lamped, blue), heated, warmth * share);
  const chrome = (dim: string, hot: string, bright: string, warm: string) =>
    mix(mix(dim, hot, heat), mix(bright, warm, heat), lamp);
  return {
    backTop: lit("#06080f", "#2b2a3c", "#b4521a", 0.43),
    backBottom: lit("#030409", "#10133a", ember, 0.24),
    wall: lit("#04060c", "#1d1a2c", ember, 0.27),
    wallLit: lit("#080a12", "#3d3035", "#b45a20", 0.33),
    floor: lit("#030409", "#181a57", ember, 0.3),
    glow: mix("#ffe2b4", look.selfClean ? "#ff6a22" : "#ff8f2e", heat / Math.max(lamp + heat, 0.001)),
    wire: chrome("#24180f", "#9a6a38", "#ddd3c4", "#e2b47c"),
    bar: chrome("#3a2a1c", "#ffb862", "#f6eee2", "#ffd9a0"),
    glint: chrome("#5a4030", "#ffe0b0", "#ffffff", "#fff3d6"),
    shine: clamp(lamp + 0.9 * heat ** 1.2),
    weight: lamp,
    bulb: lit("#34312c", "#fbfbf5", "#ffd391", 0.35),
  };
}

type Projector = (x: number, y: number, z: number) => Pt;

const segment = (P: Projector, a: readonly [number, number, number], b: readonly [number, number, number]) => {
  const [ax, ay] = P(a[0], a[1], a[2]);
  const [bx, by] = P(b[0], b[1], b[2]);
  return `M${round(ax)} ${round(ay)}L${round(bx)} ${round(by)}`;
};

export function cavityScene(
  m: Materials,
  camera: Camera,
  box: CavityBox,
  look: CavityLook,
  key: string,
  open = false,
): SVGTemplateResult {
  const P: Projector = (x, y, z) => project(camera, x, y, z);
  const { x0, x1, y0, y1, zFront: zf, zBack: zb } = box;
  const c = cavityColors(look, open);
  const fTL = P(x0, y0, zf);
  const fTR = P(x1, y0, zf);
  const fBR = P(x1, y1, zf);
  const fBL = P(x0, y1, zf);
  const bTL = P(x0, y0, zb);
  const bTR = P(x1, y0, zb);
  const bBR = P(x1, y1, zb);
  const bBL = P(x0, y1, zb);
  const id = (name: string) => `${m.uid}-${name}-${key}`;
  const height = y1 - y0;
  const heat = look.selfClean ? 1 : look.heat;
  const ledges = [0.16, 0.3, 0.44, 0.58, 0.72, 0.86].map((t) => y0 + height * t);
  // Wolf has the racks taken out for self-clean.
  const racks = look.selfClean ? [] : [0.3, 0.58, 0.86].map((t) => y0 + height * t);
  const lampY = y0 + height * 0.14;
  const lampZ = zf - 38;
  // Side walls: lit near the front, where the lamps are, fading into the back corners.
  const sideGradient = (gid: string, front: Pt, back: Pt) => svg`
    <linearGradient id=${gid} gradientUnits="userSpaceOnUse" x1=${round(front[0])} y1="0" x2=${round(back[0])} y2="0">
      <stop offset="0" stop-color=${c.wallLit} />
      <stop offset="0.45" stop-color=${c.wall} />
      <stop offset="1" stop-color=${mix(c.wall, "#000000", 0.45)} />
    </linearGradient>`;
  const backTop = bTL[1];
  const backBottom = bBL[1];
  const walls = svg`
    ${sideGradient(id("side"), fTL, bTL)}
    ${sideGradient(id("side-r"), fTR, bTR)}
    <linearGradient id=${id("back")} gradientUnits="userSpaceOnUse" x1="0" y1=${round(backTop)} x2="0" y2=${round(backBottom)}>
      <stop offset="0" stop-color=${c.backTop} />
      <stop offset="0.55" stop-color=${mix(c.backTop, c.backBottom, 0.6)} />
      <stop offset="1" stop-color=${c.backBottom} />
    </linearGradient>
    <linearGradient id=${id("floor")} gradientUnits="userSpaceOnUse" x1="0" y1=${round(bBL[1])} x2="0" y2=${round(fBL[1])}>
      <stop offset="0" stop-color=${mix(c.floor, "#000000", 0.5)} />
      <stop offset="1" stop-color=${c.floor} />
    </linearGradient>
    <polygon points=${points([bTL, bTR, bBR, bBL])} fill=${url(id("back"))} />
    <polygon points=${points([fTL, bTL, bBL, fBL])} fill=${url(id("side"))} />
    <polygon points=${points([bTR, fTR, fBR, bBR])} fill=${url(id("side-r"))} />
    ${y0 < camera.cy ? svg`<polygon points=${points([fTL, fTR, bTR, bTL])} fill=${mix(c.wall, "#000000", 0.3)} />` : nothing}
    ${y1 > camera.cy ? svg`<polygon points=${points([bBL, bBR, fBR, fBL])} fill=${url(id("floor"))} />` : nothing}
  `;
  // The convection fan's cover: a broad panel standing off the back wall, barely a shade darker,
  // with its intake slots; in the photos it all but disappears into the porcelain.
  const [ax, ay] = P(x0 + (x1 - x0) * 0.22, y0 + height * 0.17, zb);
  const [bx, by] = P(x1 - (x1 - x0) * 0.22, y1 - height * 0.17, zb);
  const cw = bx - ax;
  const ch = by - ay;
  const slots = [0, 1, 2].flatMap((row) =>
    [0, 1].map(
      (col) => svg`<rect x=${round(ax + cw * (0.14 + col * 0.42))} y=${round(ay + ch * (0.3 + row * 0.17))}
        width=${round(cw * 0.3)} height=${round(Math.max(ch * 0.05, 1))} rx=${round(Math.max(ch * 0.025, 0.5))}
        fill="#000" opacity="0.16" />`,
    ),
  );
  const fanCover = svg`
    <rect x=${round(ax)} y=${round(ay)} width=${round(cw)} height=${round(ch)} rx="6" fill=${url(id("back"))} />
    <rect x=${round(ax)} y=${round(ay)} width=${round(cw)} height=${round(ch)} rx="6" fill="#000" opacity="0.1" />
    ${slots}
    <line x1=${round(ax + 6)} y1=${round(ay + 0.4)} x2=${round(bx - 6)} y2=${round(ay + 0.4)} stroke="#fff" stroke-width="0.5"
      opacity="0.06" />
    <line x1=${round(ax + 6)} y1=${round(by)} x2=${round(bx - 6)} y2=${round(by)} stroke="#000" stroke-width="0.8"
      opacity="0.15" />`;
  const rackPaths = racks.map((y) => rack(P, x0 + 4, x1 - 4, y, zf - 10, zb + 14, c));
  const bloom = svg`<radialGradient id=${id("bloom")}>
    <stop offset="0" stop-color="#fff8ea" stop-opacity="0.9" />
    <stop offset="0.3" stop-color=${c.glow} stop-opacity="0.45" />
    <stop offset="1" stop-color=${c.glow} stop-opacity="0" />
  </radialGradient>`;
  const lamps = [x0, x1].map((x) => {
    const [lx, ly] = P(x, lampY, lampZ);
    const inward = x === x0 ? 1.2 : -1.2;
    return svg`
      <ellipse cx=${round(lx + inward * 3)} cy=${round(ly)} rx="13" ry="16" fill=${url(id("bloom"))}
        opacity=${round(0.75 * look.lamp + 0.15 * heat)} />
      <ellipse cx=${round(lx + inward)} cy=${round(ly)} rx="1.2" ry="3" fill=${c.bulb} />`;
  });
  // The heat glows from the top, around the broil element, and falls off fast; it grows faster
  // than linearly, so a part-way preheat reads clearly dimmer than a finished one. With the door
  // open the lamps light the cavity and the glow is only a warm touch at the top.
  const [gx] = P((x0 + x1) / 2, y0, zb);
  const glowStrength = clamp(0.08 * look.lamp + (open ? 0.3 : 0.85) * heat ** 1.5);
  const glow = svg`
    <radialGradient id=${id("glow")} gradientUnits="userSpaceOnUse" cx=${round(gx)} cy=${round(backTop)}
      r=${round((x1 - x0) * 0.42)}>
      <stop offset="0" stop-color=${c.glow} stop-opacity="0.95" />
      <stop offset="0.25" stop-color=${c.glow} stop-opacity="0.5" />
      <stop offset="0.6" stop-color=${c.glow} stop-opacity="0.08" />
      <stop offset="1" stop-color=${c.glow} stop-opacity="0" />
    </radialGradient>
    <rect x=${round(fTL[0])} y=${round(fTL[1])} width=${round(fTR[0] - fTL[0])} height=${round(fBL[1] - fTL[1])}
      fill=${url(id("glow"))} opacity=${round(glowStrength)} />`;
  // With the light on as well, warm white fills the upper cavity over the heat's amber.
  const wash =
    look.lamp > 0 && heat > 0
      ? svg`
        <linearGradient id=${id("wash")} gradientUnits="userSpaceOnUse" x1="0" y1=${round(fTL[1])} x2="0"
          y2=${round((fTL[1] + fBL[1]) / 2)}>
          <stop offset="0" stop-color="#fff1d6" stop-opacity=${round(0.2 * look.lamp * Math.min(1, heat * 2))} />
          <stop offset="1" stop-color="#fff1d6" stop-opacity="0" />
        </linearGradient>
        <rect x=${round(fTL[0])} y=${round(fTL[1])} width=${round(fTR[0] - fTL[0])}
          height=${round((fBL[1] - fTL[1]) / 2)} fill=${url(id("wash"))} />`
      : nothing;
  return svg`
    ${bloom}
    ${walls}
    ${fanCover}
    ${glow}
    ${wash}
    ${heat > 0 && y0 < camera.cy ? element(m, P, box, heat, look.selfClean) : nothing}
    ${ladders(P, box, ledges, c)}
    ${rackPaths}
    ${look.probe && !look.selfClean ? probeCable(P, box, racks[1] ?? y0 + height * 0.58, c) : nothing}
    ${lamps}
  `;
}

/**
 * The broil element along the cavity's ceiling, a serpentine tube that glows orange as the oven
 * heats, with a soft bloom around it.
 */
function element(m: Materials, P: Projector, box: CavityBox, heat: number, selfClean: boolean): SVGTemplateResult {
  const y = box.y0 + 3;
  const xa = box.x0 + 26;
  const xb = box.x1 - 26;
  const passes = [box.zFront - 34, (box.zFront + box.zBack) / 2, box.zBack + 30];
  const route: Pt[] = [];
  passes.forEach((z, index) => {
    const [from, to] = index % 2 ? [xb, xa] : [xa, xb];
    route.push(P(from, y, z), P(to, y, z));
  });
  const hot = mix("#3a1609", selfClean ? "#ff6326" : "#ff7d22", heat);
  const core = mix("#4a1c0b", selfClean ? "#ffb070" : "#ffc06a", heat);
  return svg`
    <polyline points=${points(route)} fill="none" stroke=${hot} stroke-width="5" stroke-linejoin="round"
      opacity=${round(0.75 * heat)} filter=${url(m.blur)} />
    <polyline points=${points(route)} fill="none" stroke=${hot} stroke-width="1.9" stroke-linejoin="round" />
    <polyline points=${points(route)} fill="none" stroke=${core} stroke-width="0.6" stroke-linejoin="round" />
  `;
}

/**
 * The rack ladders on each side wall: two chrome rails, front and back, joined by a support at
 * each of the six positions, with the loop the rack's front rests in.
 */
function ladders(P: Projector, box: CavityBox, ledges: number[], c: CavityColors): SVGTemplateResult {
  const zFront = box.zFront - 12;
  const zBack = box.zBack + 20;
  const top = ledges[0] - 8;
  const bottom = ledges[ledges.length - 1] + 5;
  let d = "";
  for (const x of [box.x0 + 2.5, box.x1 - 2.5]) {
    d += segment(P, [x, top, zFront], [x, bottom, zFront]) + segment(P, [x, top, zBack], [x, bottom, zBack]);
    for (const y of ledges) {
      d += segment(P, [x, y, zFront], [x, y, zBack]);
      d += segment(P, [x, y, zFront - 7], [x, y + 2.6, zFront - 7]);
      d += segment(P, [x, y + 2.6, zFront - 7], [x, y + 2.6, zFront]);
    }
  }
  return svg`<path d=${d} fill="none" stroke=${c.wire} stroke-width=${round(0.9 + 0.3 * c.weight)}
    stroke-linejoin="round" opacity=${round(0.3 + 0.55 * c.shine)} />`;
}

/** A chrome wire rack seen in perspective: dense wires running back, and a glinting front bar. */
function rack(P: Projector, x0: number, x1: number, y: number, zf: number, zb: number, c: CavityColors): SVGTemplateResult {
  const wires = 26;
  let d = "";
  for (let i = 0; i <= wires; i++) {
    const x = x0 + ((x1 - x0) * i) / wires;
    d += segment(P, [x, y, zf], [x, y, zb]);
  }
  const bar = (z: number) => segment(P, [x0, y, z], [x1, y, z]);
  return svg`
    <path d=${bar(zb) + bar((zf + zb) / 2)} fill="none" stroke=${c.wire} stroke-width="0.6" opacity="0.5" />
    <path d=${d} fill="none" stroke=${c.wire} stroke-width=${round(0.35 + 0.3 * c.weight)}
      opacity=${round(0.32 + 0.4 * c.weight)} />
    <path d=${bar(zf)} fill="none" stroke="#000" stroke-width="1.3" opacity="0.35" transform="translate(0 1.2)" />
    <path d=${bar(zf)} fill="none" stroke=${c.bar} stroke-width=${round(1.3 + 0.4 * c.weight)}
      opacity=${round(0.35 + 0.65 * c.shine)} />
    <path d=${bar(zf)} fill="none" stroke=${c.glint} stroke-width="0.7" stroke-linecap="round" stroke-dasharray="0.5 2"
      opacity=${round(c.shine)} />
  `;
}

/** The probe's cable, from its jack high on the left wall down to the middle rack. */
function probeCable(P: Projector, box: CavityBox, rackY: number, c: CavityColors): SVGTemplateResult {
  const [sx, sy] = P(box.x0, box.y0 + (box.y1 - box.y0) * 0.24, box.zFront - 30);
  const [ex, ey] = P((box.x0 + box.x1) / 2 - 12, rackY - 6, (box.zFront + box.zBack) / 2);
  const d =
    `M${round(sx)} ${round(sy)}C${round(sx + 22)} ${round(sy + 30)} ` +
    `${round(ex - 34)} ${round(ey + 6)} ${round(ex)} ${round(ey)}`;
  return svg`<path d=${d} fill="none" stroke=${c.wire} stroke-width="0.5" stroke-linecap="round"
    opacity=${round(0.3 + 0.4 * c.shine)} />`;
}

/** The opening an open door leaves, in drawing coordinates: the cavity's front edge. */
export function openingRect(top: number, height: number): { x0: number; y0: number; x1: number; y1: number } {
  const box = cavityBox(top, height);
  const camera = interiorCamera(top, height, true);
  const [x0, y0] = project(camera, box.x0, box.y0, box.zFront);
  const [x1, y1] = project(camera, box.x1, box.y1, box.zFront);
  return { x0, y0, x1, y1 };
}

/**
 * The view into an open oven: the oven's stainless face around the opening, in the door's shadow,
 * the lit cavity, and the woven gray gasket lining the opening's rounded edge.
 */
export function openCavity(m: Materials, top: number, height: number, look: CavityLook, key: string): SVGTemplateResult {
  const box = cavityBox(top, height);
  const camera = interiorCamera(top, height, true);
  const clipId = `${m.uid}-opening-${key}`;
  const { x0: ox0, y0: oy0, x1: ox1, y1: oy1 } = openingRect(top, height);
  const radius = 22;
  const w = ox1 - ox0;
  const h = oy1 - oy0;
  const ring = (inset: number, stroke: string, width: number, opacity: number, dash?: string) =>
    svg`<rect x=${round(ox0 + inset)} y=${round(oy0 + inset)} width=${round(w - inset * 2)} height=${round(h - inset * 2)}
      rx=${round(radius - inset)} fill="none" stroke=${stroke} stroke-width=${width} opacity=${opacity}
      stroke-dasharray=${dash ?? nothing} />`;
  return svg`
    <rect x="0" y=${round(top)} width=${WIDTH} height=${round(height)} fill=${url(m.metal)} />
    <rect x="0" y=${round(top)} width=${WIDTH} height=${round(height)} fill="#000" opacity="0.2" />
    <rect x="0" y=${round(top)} width=${WIDTH} height="5" fill=${url(m.dropShadow)} />
    <clipPath id=${clipId}>
      <rect x=${round(ox0)} y=${round(oy0)} width=${round(w)} height=${round(h)} rx=${radius} />
    </clipPath>
    <g clip-path=${url(clipId)}>${cavityScene(m, camera, box, look, key, true)}</g>
    ${ring(0, "#8e8f90", 5.5, 1)}
    ${ring(0, "#b4b5b6", 5.5, 0.3, "0.5 0.7")}
    ${ring(2.4, "#c3c4c5", 0.7, 0.55)}
    ${ring(-2.6, "#000", 0.8, 0.35)}
  `;
}

/**
 * A door dropped open, as Wolf's open-door photos show it: its inner glass facing up in a
 * stainless frame, reflecting the lit racks, its top edge toward you with the five cooling
 * slots, and the handle hanging below.
 */
export function droppedDoor(o: DoorOptions): SVGTemplateResult {
  const { m, map } = o;
  const t = DOOR_THICKNESS;
  const H = o.height;
  const c = cavityColors(o.look, true);
  const glass: DoorRect = { u0: 26, u1: WIDTH - 26, v0: 16, v1: H - 24 };
  const glassId = `${m.uid}-inner-glass-${o.key}`;
  const slotId = `${m.uid}-slot-${o.key}`;
  const band: Pt[] = [map.at(0, 0, -t), map.at(WIDTH, 0, -t), map.at(WIDTH, 0, 0), map.at(0, 0, 0)];
  const [, gy0] = map.at(0, glass.v1, -t);
  const [, gy1] = map.at(0, glass.v0, -t);
  // The glass mirrors the lit cavity above it: its racks, brightest by the hinge.
  const reflections = [0.18, 0.42, 0.7].map((f) =>
    line(map, glass.u0 + 6, glass.v1 - (glass.v1 - glass.v0) * f, glass.u1 - 6, glass.v1 - (glass.v1 - glass.v0) * f,
      c.bar, 0.8, round(0.62 - f * 0.3), -t),
  );
  return svg`
    <linearGradient id=${glassId} gradientUnits="userSpaceOnUse" x1="0" y1=${round(gy0)} x2="0" y2=${round(gy1)}>
      <stop offset="0" stop-color=${mix("#2c2a2a", c.glow, 0.42)} />
      <stop offset="0.55" stop-color=${mix("#222224", c.glow, 0.12)} />
      <stop offset="1" stop-color="#191a1c" />
    </linearGradient>
    <linearGradient id=${slotId} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2b2c2e" />
      <stop offset="1" stop-color="#3d3e40" />
    </linearGradient>
    <g filter=${url(m.grain)}>
      <polygon points=${points(quad(map, { u0: 0, u1: WIDTH, v0: 0, v1: H }, -t))} fill=${url(m.metal)} />
      <polygon points=${points(band)} fill=${url(m.metal)} />
    </g>
    ${area(map, { u0: 0, u1: WIDTH, v0: 0, v1: H }, "#fff", 0.1, -t)}
    ${area(map, glass, url(glassId), 1, -t)}
    ${reflections}
    ${line(map, glass.u0, glass.v0, glass.u1, glass.v0, "#fff", 0.5, 0.35, -t)}
    ${line(map, 0, H, WIDTH, H, "#000", 0.8, 0.45, -t)}
    <polygon points=${points(band)} fill="#000" opacity="0.28" />
    ${doorEdge(map, slotId)}
    ${droppedHandle(m, map, o.design.handle)}
  `;
}

/**
 * A dropped door's top edge, facing you: the door's thickness, with the five cooling slots the
 * photos show along it.
 */
function doorEdge(map: DoorMap, slotFill: string): SVGTemplateResult {
  const t = DOOR_THICKNESS;
  const slots: SVGTemplateResult[] = [];
  const count = 5;
  const margin = 14;
  const gap = 7;
  const slotWidth = (WIDTH - margin * 2 - gap * (count - 1)) / count;
  const [, top] = map.at(0, 0, -t * 0.73);
  const [, bottom] = map.at(0, 0, -t * 0.27);
  const h = bottom - top;
  for (let i = 0; i < count; i++) {
    const u0 = margin + i * (slotWidth + gap);
    const [x0] = map.at(u0, 0, -t * 0.5);
    const [x1] = map.at(u0 + slotWidth, 0, -t * 0.5);
    const w = x1 - x0;
    slots.push(svg`
      <rect x=${round(x0 - 0.7)} y=${round(top - 0.7)} width=${round(w + 1.4)} height=${round(h + 1.4)}
        rx=${round(h / 2 + 0.7)} fill="#cfd0d1" opacity="0.45" />
      <rect x=${round(x0)} y=${round(top)} width=${round(w)} height=${round(h)} rx=${round(h / 2)}
        fill=${url(slotFill)} />`);
  }
  return svg`
    ${slots}
    <polyline points=${points([map.at(0, 0, -t), map.at(WIDTH, 0, -t)])} stroke="#fff" stroke-width="0.9" opacity="0.75" />
    <polyline points=${points([map.at(0, 0, 0), map.at(WIDTH, 0, 0)])} stroke="#000" stroke-width="0.8" opacity="0.35" />
  `;
}

/**
 * A dropped door's handle, hanging below its top edge: the bar on its caps (Professional) or posts
 * (slim). A Contemporary's pull strip faces the floor, out of sight.
 */
function droppedHandle(m: Materials, map: DoorMap, h: Handle): SVGTemplateResult {
  if (h.kind === "strip") return svg``;
  const n = standoff(h);
  const r = h.size / 2;
  const capWidth = h.kind === "pro" ? CAP_WIDTH : 0;
  const [bx0, by] = map.at(h.u0 + capWidth, h.v, n);
  const [bx1] = map.at(h.u1 - capWidth, h.v, n);
  const scale = (bx1 - bx0) / (h.u1 - h.u0 - capWidth * 2);
  const rr = r * scale;
  // Under the dropped door the handle hangs in its shadow: darker on top, lit from the front.
  const bar = svg`
    <rect x=${round(bx0)} y=${round(by - rr)} width=${round(bx1 - bx0)} height=${round(rr * 2)}
      rx=${h.kind === "slim" ? round(rr * 0.25) : 0} fill=${url(m.chrome)} />
    <rect x=${round(bx0)} y=${round(by - rr)} width=${round(bx1 - bx0)} height=${round(rr)} fill="#000"
      opacity="0.22" />`;
  if (h.kind === "slim") {
    const posts = [h.u0 + 6, h.u1 - 6].map((u) => {
      const [px0, py0] = map.at(u - 1.8, h.v, 0);
      const [px1, py1] = map.at(u + 1.8, h.v, n);
      return svg`<rect x=${round(px0)} y=${round(py0)} width=${round(px1 - px0)} height=${round(py1 - py0)}
        fill=${url(m.chrome)} />
        <rect x=${round(px0)} y=${round(py0)} width=${round(px1 - px0)} height=${round(py1 - py0)} fill="#000"
          opacity="0.4" />`;
    });
    return svg`${posts}${bar}`;
  }
  // Each cap's face toward you runs from the door's face down past the bar.
  const caps = [h.u0, h.u1 - capWidth].map((u, index) => {
    const face: Pt[] = [
      map.at(u, h.v - CAP_HALF, 0),
      map.at(u + capWidth, h.v - CAP_HALF, 0),
      map.at(u + capWidth, h.v - CAP_HALF, n + r),
      map.at(u, h.v - CAP_HALF, n + r),
    ];
    return svg`
      <polygon points=${points(face)} fill=${url(m.chrome)} />
      <polygon points=${points(face)} fill=${url(index ? m.capEndRight : m.capEndLeft)} />
      <polygon points=${points(face)} fill="#000" opacity="0.42" />`;
  });
  return svg`${bar}${caps}`;
}

/** The lowest point of a dropped door, its handle, so the drawing can make room for it. */
export function droppedExtent(o: DoorOptions): number {
  const h = o.design.handle;
  if (h.kind === "strip") return o.map.at(0, 0, 0)[1];
  const n = standoff(h);
  const r = h.size / 2;
  const bar = o.map.at(h.u0, h.v, n + r)[1];
  const cap = h.kind === "pro" ? o.map.at(h.u0, h.v - CAP_HALF, n + r)[1] : bar;
  return Math.max(bar, cap) + 1;
}

/** How far a handle's bar stands off the door, to its center: the slim bar sits closer. */
const standoff = (h: Handle): number => (h.kind === "pro" ? HANDLE_STANDOFF : HANDLE_STANDOFF * 0.75);
