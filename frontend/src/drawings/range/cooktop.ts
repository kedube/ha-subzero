import { svg, type SVGTemplateResult } from "lit";
import { CAMERA_DISTANCE, depthScale, project, TOP, type CooktopModule, type RangeLayout } from "./layout";
import { fade, type Ids } from "./materials";

/*
 * The rangetop, seen from a little above. Cast-iron grates are modeled as bars (boxes in plan)
 * so their faces foreshorten the way the photos show: the front faces read as dark bands,
 * the tops as thin lighter strips, and the burner rings peek out between them.
 */

const round = (value: number) => Math.round(value * 100) / 100;

type Plan = [number, number];

function at(layout: RangeLayout, x: number, h: number, d: number): string {
  const [px, py] = project(layout, x, h, d);
  return `${round(px)} ${round(py)}`;
}

function polygon(layout: RangeLayout, points: Plan[], h: number): string {
  return `M${points.map(([x, d]) => at(layout, x, h, d)).join("L")}Z`;
}

function rect(x0: number, x1: number, d0: number, d1: number): Plan[] {
  return [
    [x0, d0],
    [x1, d0],
    [x1, d1],
    [x0, d1],
  ];
}

/** A bar of width `w` from one plan point toward another. */
function bar(from: Plan, to: Plan, w: number): Plan[] {
  const dx = to[0] - from[0];
  const dd = to[1] - from[1];
  const length = Math.hypot(dx, dd) || 1;
  const px = (-dd / length) * (w / 2);
  const pd = (dx / length) * (w / 2);
  return [
    [from[0] + px, from[1] + pd],
    [to[0] + px, to[1] + pd],
    [to[0] - px, to[1] - pd],
    [from[0] - px, from[1] - pd],
  ];
}

interface Box {
  plan: Plan[];
  /** Height of the bar's underside: the frame stands taller than the fingers. */
  bottom: number;
}

/**
 * Faces of extruded plan polygons: the side faces that look toward the camera (dark), the tops
 * (a little lighter) and the tops' front edges (highlights). Drawing sides, then tops, then
 * edges is a correct back-to-front order here, since every top is at the same height.
 */
function extrude(layout: RangeLayout, boxes: Box[], top: number): { sides: string; tops: string; edges: string } {
  let sides = "";
  let tops = "";
  let edges = "";
  for (const { plan: box, bottom } of boxes) {
    // Wind each box the same way, so "outward" is the same side of every edge.
    const area = box.reduce((sum, [x, d], index) => {
      const [nx, nd] = box[(index + 1) % box.length];
      return sum + x * nd - nx * d;
    }, 0);
    const points = area < 0 ? [...box].reverse() : box;
    tops += polygon(layout, points, top);
    points.forEach(([x0, d0], index) => {
      const [x1, d1] = points[(index + 1) % points.length];
      // Outward normal of a counterclockwise edge in (x, d), and the way to the camera.
      const nx = d1 - d0;
      const nd = -(x1 - x0);
      const vx = layout.cx - (x0 + x1) / 2;
      const vd = -CAMERA_DISTANCE - (d0 + d1) / 2;
      if (nx * vx + nd * vd <= 0) return;
      sides += `M${at(layout, x0, bottom, d0)}L${at(layout, x1, bottom, d1)}L${at(layout, x1, top, d1)}L${at(layout, x0, top, d0)}Z`;
      // Only edges facing mostly forward catch the light along their top.
      if (Math.abs(nd) > Math.abs(nx) * 0.5) edges += `M${at(layout, x0, top, d0)}L${at(layout, x1, top, d1)}`;
    });
  }
  return { sides, tops, edges };
}

const FRAME = 5;
const FINGER = 4.4;
/** Fingers stop short of a burner's center by this much. */
const REACH = 21;

const FRAME_BOTTOM = TOP.grateBottom;
const FINGER_BOTTOM = TOP.grateTop - 3.2;
const frames = (plans: Plan[][]): Box[] => plans.map((plan) => ({ plan, bottom: FRAME_BOTTOM }));
const fingers = (plans: Plan[][]): Box[] => plans.map((plan) => ({ plan, bottom: FINGER_BOTTOM }));
/** The grate's front wall drops almost to the burner box, leaving a slot for the burner glint. */
const frontWall = (x0: number, x1: number, d0: number): Box => ({
  plan: rect(x0, x1, d0, d0 + FRAME),
  bottom: TOP.wallBottom,
});

function burnerGrateBars(module: CooktopModule): Box[] {
  const x0 = module.x0 + 0.6;
  const x1 = module.x1 - 0.6;
  const d0 = TOP.grateFront;
  const d1 = TOP.grateBack;
  const xm = (x0 + x1) / 2;
  const mid = (TOP.burnerFront + TOP.burnerRear) / 2;
  const outline = [
    frontWall(x0, x1, d0),
    ...frames([rect(x0, x1, d1 - FRAME, d1), rect(x0, x0 + FRAME, d0, d1), rect(x1 - FRAME, x1, d0, d1)]),
  ];
  const boxes: Plan[][] = [];
  const burners = module.burners === 1 ? [mid] : [TOP.burnerFront, TOP.burnerRear];
  if (module.burners !== 1) boxes.push(rect(x0, x1, mid - FINGER / 2, mid + FINGER / 2));
  // The center bar runs front to back, broken at each burner.
  const stops = [d0 + FRAME, ...burners.flatMap((d) => [d - REACH, d + REACH]), d1 - FRAME];
  for (let index = 0; index < stops.length; index += 2) {
    const a = stops[index];
    const b = stops[index + 1];
    if (b - a > 2) boxes.push(rect(xm - FINGER / 2, xm + FINGER / 2, a, b));
  }
  for (const d of burners) {
    boxes.push(rect(x0 + FRAME, xm - REACH, d - FINGER / 2, d + FINGER / 2));
    boxes.push(rect(xm + REACH, x1 - FRAME, d - FINGER / 2, d + FINGER / 2));
    // Diagonal fingers from the corners of the burner's square, as on Wolf's grates.
    const near = module.burners === 1 ? d0 + FRAME : d === burners[0] ? d0 + FRAME : mid + FINGER / 2;
    const far = module.burners === 1 ? d1 - FRAME : d === burners[0] ? mid - FINGER / 2 : d1 - FRAME;
    for (const corner of [
      [x0 + FRAME, near],
      [x1 - FRAME, near],
      [x0 + FRAME, far],
      [x1 - FRAME, far],
    ] as Plan[]) {
      const dx = xm - corner[0];
      const dd = d - corner[1];
      const length = Math.hypot(dx, dd);
      const stop = Math.max(0.15, (length - REACH * 1.3) / length);
      boxes.push(bar(corner, [corner[0] + dx * stop, corner[1] + dd * stop], FINGER));
    }
  }
  return [...outline, ...fingers(boxes)];
}

function fillerGrateBars(module: CooktopModule): Box[] {
  const x0 = module.x0 + 0.6;
  const x1 = module.x1 - 0.6;
  const d0 = TOP.grateFront;
  const d1 = TOP.grateBack;
  const third = (x1 - x0) / 3;
  return [
    frontWall(x0, x1, d0),
    ...frames([rect(x0, x1, d1 - FRAME, d1), rect(x0, x0 + FRAME, d0, d1), rect(x1 - FRAME, x1, d0, d1)]),
    ...fingers([
      rect(x0 + third - FINGER / 2, x0 + third + FINGER / 2, d0, d1),
      rect(x1 - third - FINGER / 2, x1 - third + FINGER / 2, d0, d1),
      ...[0.22, 0.5, 0.78].map((f) => d0 + (d1 - d0) * f).map((d) => rect(x0, x1, d - FINGER / 2, d + FINGER / 2)),
    ]),
  ];
}

function charbroilerBars(module: CooktopModule): Box[] {
  const x0 = module.x0 + 0.6;
  const x1 = module.x1 - 0.6;
  const d0 = TOP.grateFront;
  const d1 = TOP.grateBack;
  const outline = [
    frontWall(x0, x1, d0),
    ...frames([rect(x0, x1, d1 - FRAME, d1), rect(x0, x0 + FRAME, d0, d1), rect(x1 - FRAME, x1, d0, d1)]),
  ];
  const boxes: Plan[][] = [];
  const count = Math.max(6, Math.round((x1 - x0 - 2 * FRAME) / 8.6));
  const pitch = (x1 - x0 - 2 * FRAME) / count;
  for (let index = 0; index < count - 1; index++) {
    const x = x0 + FRAME + pitch * (index + 1);
    boxes.push(rect(x - 1.9, x + 1.9, d0 + FRAME, d1 - FRAME));
  }
  return [...outline, ...fingers(boxes)];
}

function grate(layout: RangeLayout, ids: Ids, boxes: Box[]): SVGTemplateResult {
  const faces = extrude(layout, boxes, TOP.grateTop);
  return svg`
    <path d=${faces.sides} fill=${ids.url("iron")} />
    <path d=${faces.tops} fill="#3b3b3b" />
    <path d=${faces.edges} fill="none" stroke="#5e5e5e" stroke-opacity="0.45" stroke-width="0.35" stroke-linecap="round" />
  `;
}

/** A flat ellipse on the cooktop: a circle of radius `r` around (x, d) at height h. */
function ellipse(layout: RangeLayout, x: number, h: number, d: number, r: number) {
  const [cx] = project(layout, x, h, d);
  const [, front] = project(layout, x, h, d - r);
  const [, back] = project(layout, x, h, d + r);
  return { cx, cy: (front + back) / 2, rx: r * depthScale(d), ry: Math.max(0.2, (front - back) / 2) };
}

function burners(layout: RangeLayout, ids: Ids, module: CooktopModule): SVGTemplateResult {
  const xm = (module.x0 + module.x1) / 2;
  // The burner base glints softly through the slot under the grate's front wall.
  const [, gy] = project(layout, xm, 351.4, TOP.grateFront);
  const glints = [xm - 7.5, xm + 7.5].map((x) => project(layout, x, 351.4, TOP.grateFront)[0]);
  const list =
    module.kind !== "burners"
      ? []
      : module.burners === 1
        ? [{ d: (TOP.burnerFront + TOP.burnerRear) / 2, r: 21.5 }]
        : [
            { d: TOP.burnerFront, r: 21.5 },
            { d: TOP.burnerRear, r: module.small ? 16 : 21.5 },
          ];
  return svg`
    ${glints.map(
      (x) => svg`<line x1=${round(x - 5.5)} y1=${round(gy)} x2=${round(x + 5.5)} y2=${round(gy)} stroke="#fff" stroke-opacity="0.4"
        stroke-width="0.9" stroke-linecap="round" filter=${ids.url("soft")} />`,
    )}
    ${list.map(({ d, r }) => {
      // Seen from this high, the black burner caps all but vanish in the shade of the grate;
      // the photos show only the fingers over them.
      const ring = ellipse(layout, xm, 354, d, r);
      const cap = ellipse(layout, xm, 355.6, d, r - 2.4);
      return svg`
        <ellipse cx=${round(ring.cx)} cy=${round(ring.cy)} rx=${round(ring.rx)} ry=${round(ring.ry + 0.5)} fill="#3e3e3e" />
        <ellipse cx=${round(ring.cx)} cy=${round(ring.cy - 0.25)} rx=${round(ring.rx - 0.9)} ry=${round(ring.ry + 0.2)} fill="#2c2c2c" />
        <ellipse cx=${round(cap.cx)} cy=${round(cap.cy)} rx=${round(cap.rx)} ry=${round(cap.ry + 0.4)} fill="#1f1f1f" />
      `;
    })}
  `;
}

function plate(
  layout: RangeLayout,
  module: CooktopModule,
  top: number,
  fill: string,
  extra: SVGTemplateResult | null,
): SVGTemplateResult {
  const x0 = module.x0 + 1;
  const x1 = module.x1 - 1;
  const d0 = TOP.grateFront + 2;
  const d1 = TOP.grateBack - 1;
  const bottom = layout.levels.rim + 0.5;
  const front = `M${at(layout, x0, bottom, d0)}L${at(layout, x1, bottom, d0)}L${at(layout, x1, top, d0)}L${at(layout, x0, top, d0)}Z`;
  const [lx, ly] = project(layout, x0, top, d0);
  const [rx] = project(layout, x1, top, d0);
  return svg`
    <path d=${polygon(layout, rect(x0, x1, d0, d1), top)} fill=${fill} />
    ${extra}
    <path d=${front} fill="#2b2c2d" />
    <line x1=${round(lx)} y1=${round(ly + 0.2)} x2=${round(rx)} y2=${round(ly + 0.2)} stroke="#c9cbcd" stroke-width="0.5" stroke-opacity="0.8" />
  `;
}

function surface(layout: RangeLayout, ids: Ids, module: CooktopModule): SVGTemplateResult {
  const xm = (module.x0 + module.x1) / 2;
  switch (module.kind) {
    case "griddle":
    case "double_griddle":
      // A polished steel plate; the dark front face is its grease trough.
      return plate(layout, module, 358.5, ids.url("steel"), null);
    case "french_top": {
      // Concentric rings around the center plate, highest heat in the middle.
      const middle = (TOP.grateFront + TOP.grateBack) / 2;
      const rings = [26, 50, 76].map((r) => ellipse(layout, xm, 358, middle, r));
      const center = ellipse(layout, xm, 358, middle, 1.6);
      return plate(
        layout,
        module,
        358,
        ids.url("ftop"),
        // Fine grooves cut into the plate, faint in the photo: dark, with the far wall catching
        // the light just below.
        svg`${rings.map(
          (ring) =>
            svg`<ellipse cx=${round(ring.cx)} cy=${round(ring.cy)} rx=${round(ring.rx)} ry=${round(ring.ry)} fill="none" stroke="#4a4c4f" stroke-opacity="0.32" stroke-width="0.45" />
              <ellipse cx=${round(ring.cx)} cy=${round(ring.cy + 0.4)} rx=${round(ring.rx)} ry=${round(ring.ry)} fill="none" stroke="#c8cacc" stroke-opacity="0.22" stroke-width="0.35" />`,
        )}<ellipse cx=${round(center.cx)} cy=${round(center.cy)} rx=${round(center.rx)} ry=${round(center.ry + 0.3)} fill="#5a5c5f" />`,
      );
    }
    case "charbroiler": {
      // Glints of the infrared burner under the cast-iron grate.
      const [gx0, gy] = project(layout, module.x0 + 6, layout.levels.rim - 1, TOP.grateFront + 16);
      const [gx1] = project(layout, module.x1 - 6, layout.levels.rim - 1, TOP.grateFront + 16);
      return svg`
        <line x1=${round(gx0)} y1=${round(gy)} x2=${round(gx1)} y2=${round(gy)} stroke="#a2a2a2" stroke-width="0.7" stroke-dasharray="0.9 2.6" stroke-opacity="0.7" />
        ${grate(layout, ids, charbroilerBars(module))}
      `;
    }
    default:
      return svg``;
  }
}

/** The burner box under the grates: black, so the gaps between the bars read dark. */
function backdrop(layout: RangeLayout, ids: Ids): SVGTemplateResult {
  if (!layout.modules.length) return svg``;
  const x0 = layout.modules[0].x0;
  const x1 = layout.modules[layout.modules.length - 1].x1;
  const low = layout.levels.rim - 2.5;
  const d =
    `M${at(layout, x0, low, TOP.grateFront - 3)}L${at(layout, x1, low, TOP.grateFront - 3)}` +
    `L${at(layout, x1, TOP.grateTop, TOP.grateBack + 2)}L${at(layout, x0, TOP.grateTop, TOP.grateBack + 2)}Z`;
  return svg`<path d=${d} fill=${ids.url("pan")} />`;
}

/** The dual fuel or gas rangetop: island trim, deck, grates and any griddle or French top. */
export function gasTop(layout: RangeLayout, ids: Ids): SVGTemplateResult {
  const w = layout.width;
  const rim = layout.levels.rim;
  const { trimFront, trimBack, trimTop } = TOP;
  const trimFace = `M${at(layout, 0, rim, trimFront)}L${at(layout, w, rim, trimFront)}L${at(layout, w, trimTop, trimFront)}L${at(layout, 0, trimTop, trimFront)}Z`;
  const trimLid = polygon(layout, rect(0, w, trimFront, trimBack), trimTop);
  const deck = polygon(layout, rect(0, w, 0, trimFront), rim);
  const [vx0, vy] = project(layout, 8, trimTop, (trimFront + trimBack) / 2);
  const [vx1] = project(layout, w - 8, trimTop, (trimFront + trimBack) / 2);
  const [bx0, by] = project(layout, 0, trimTop, trimBack);
  const [bx1] = project(layout, w, trimTop, trimBack);
  const [tx0, ty] = project(layout, 0, trimTop, trimFront);
  const [tx1] = project(layout, w, trimTop, trimFront);
  const rimY = layout.floorY - rim;
  return svg`
    <g>
      <path d=${trimFace} fill=${ids.url("ss")} />
      <path d=${trimLid} fill=${ids.url("ss-rail")} />
      <line x1=${round(vx0)} y1=${round(vy)} x2=${round(vx1)} y2=${round(vy)} stroke="#2a2b2c" stroke-opacity="0.35" stroke-width="0.7" stroke-dasharray="1 0.8" />
      <line x1=${round(bx0)} y1=${round(by)} x2=${round(bx1)} y2=${round(by)} stroke="#fff" stroke-opacity="0.7" stroke-width="0.5" />
      <line x1=${round(tx0)} y1=${round(ty)} x2=${round(tx1)} y2=${round(ty)} stroke="#fff" stroke-opacity="0.45" stroke-width="0.4" />
      <path d=${deck} fill=${ids.url("ss-deck")} />
      <path d=${deck} fill=${ids.url("grain")} opacity="0.5" />
      ${backdrop(layout, ids)}
      ${layout.modules.map((module) =>
        module.kind === "burners"
          ? svg`${burners(layout, ids, module)}${grate(layout, ids, burnerGrateBars(module))}`
          : module.kind === "filler"
            ? grate(layout, ids, fillerGrateBars(module))
            : surface(layout, ids, module),
      )}
      <line x1="0" y1=${rimY + 0.35} x2=${w} y2=${rimY + 0.35} stroke="#fff" stroke-opacity="0.85" stroke-width="0.8" />
    </g>
  `;
}

/** Induction cooking zones in plan, as fractions of the width and depths behind the front. */
const ZONES_36: Array<[number, number, number, number]> = [
  [0.054, 0.274, 59, 138],
  [0.054, 0.274, 147, 227],
  [0.347, 0.653, 88, 198],
  [0.729, 0.949, 59, 138],
  [0.729, 0.949, 147, 227],
];
const ZONES_30: Array<[number, number, number, number]> = [
  [0.07, 0.42, 59, 150],
  [0.13, 0.36, 166, 227],
  [0.6, 0.9, 59, 138],
  [0.6, 0.9, 150, 227],
];

/** The induction top: black ceramic glass with zone outlines, and the trim with its screen. */
export function inductionTop(
  layout: RangeLayout,
  ids: Ids,
  screenOn: boolean,
  reducedMotion: boolean,
): SVGTemplateResult {
  const w = layout.width;
  const rim = layout.levels.rim;
  const trim = polygon(layout, rect(0, w, 0, TOP.inductionTrim), rim);
  const glass = polygon(layout, rect(1.5, w - 1.5, TOP.inductionTrim, TOP.glassBack), TOP.glassTop);
  const zones = (layout.nominal >= 36 ? ZONES_36 : ZONES_30).map(([f0, f1, d0, d1]) =>
    polygon(layout, rect(w * f0, w * f1, d0, d1), TOP.glassTop),
  );
  // The touchscreen lies in the trim, seen almost edge-on: a dark sliver that lights up.
  const screen = polygon(layout, rect(layout.cx - 48, layout.cx + 48, 8, 38), rim + 0.2);
  const [gx0, gy] = project(layout, 1.5, TOP.glassTop, TOP.inductionTrim);
  const [gx1] = project(layout, w - 1.5, TOP.glassTop, TOP.inductionTrim);
  const rimY = layout.floorY - rim;
  return svg`
    <g>
      <path d=${trim} fill=${ids.url("ss-deck")} />
      <path d=${trim} fill=${ids.url("grain")} opacity="0.5" />
      <path d=${glass} fill=${ids.url("ceramic")} />
      <path d=${zones.join("")} fill="none" stroke="#8a8e92" stroke-opacity="0.22" stroke-width="0.35" />
      <line x1=${round(gx0)} y1=${round(gy)} x2=${round(gx1)} y2=${round(gy)} stroke="#000" stroke-opacity="0.6" stroke-width="0.6" />
      <line x1=${round(gx0)} y1=${round(gy - 0.5)} x2=${round(gx1)} y2=${round(gy - 0.5)} stroke="#fff" stroke-opacity="0.25" stroke-width="0.3" />
      <path d=${screen} fill="#0b0c0e" />
      <path d=${screen} fill="#fff1e0" style=${fade(screenOn ? 0.35 : 0, reducedMotion)} />
      <line x1="0" y1=${rimY + 0.35} x2=${w} y2=${rimY + 0.35} stroke="#fff" stroke-opacity="0.85" stroke-width="0.8" />
    </g>
  `;
}
