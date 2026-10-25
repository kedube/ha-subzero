import type { OvenSlot, RangeSpec, RangetopSurface } from "../../types";

/*
 * Range geometry in tenths of an inch, the drawings' unit. Heights are measured up from the
 * floor; depth runs back from the front plane. Sizes come from Wolf's spec sheets and design
 * guide, and part proportions from the DF48850/S/P and IR36550/S/T product photos.
 *
 * The front is drawn flat, as an elevation. The rangetop is seen from a little above, as in
 * Wolf's photos: a one-point perspective from a camera centered on the range. The front plane
 * (depth 0) keeps its size, so only the top and an opened door are foreshortened.
 */

const CAMERA_HEIGHT = 500;
export const CAMERA_DISTANCE = 2160;

/** Body widths: the nominal width less 1/8″ (a 48″ range is 47 7/8″ wide). */
const BODY_WIDTH: Record<number, number> = { 30: 298.75, 36: 358.75, 48: 478.75, 60: 598.75 };

export interface Levels {
  /** Top of the feet. */
  feet: number;
  /** Top of the toe-kick plinth. */
  plinth: number;
  /** Induction ranges: top of the storage drawer under the oven door. */
  drawer: number | null;
  doorBottom: number;
  doorTop: number;
  /** Bottom of the band above the doors: the control panel, or the induction front trim. */
  bandBottom: number;
  /** Dual fuel and gas: where the control panel meets the front rail. */
  railBottom: number | null;
  /** The cooktop's front edge: top of the front rail or trim. */
  rim: number;
}

const PRO_LEVELS: Levels = {
  feet: 20,
  plinth: 42,
  drawer: null,
  doorBottom: 50,
  doorTop: 272,
  bandBottom: 279,
  railBottom: 330,
  rim: 350,
};

const INDUCTION_LEVELS: Levels = {
  feet: 24,
  plinth: 44.5,
  drawer: 92.5,
  doorBottom: 97,
  doorTop: 319,
  bandBottom: 327,
  railBottom: null,
  rim: 350,
};

/** Rangetop depths and heights (dual fuel and gas). */
export const TOP = {
  /** The grates start behind a 2.6″ landing strip and run to the island trim. */
  grateFront: 26,
  grateBack: 252,
  grateTop: 358,
  grateBottom: 354,
  /** The grate's front wall drops nearly to the burner box. */
  wallBottom: 351.6,
  burnerFront: 92,
  burnerRear: 187,
  trimFront: 254,
  trimBack: 266,
  trimTop: 362.5,
  /** Induction: the trim's top surface in front of the glass, which holds the touchscreen. */
  inductionTrim: 49,
  glassBack: 246,
  glassTop: 351,
} as const;

/** Height of the knob row's centers. */
export const KNOB_ROW = 302;

export type ModuleKind = "burners" | "filler" | RangetopSurface;

export interface CooktopModule {
  kind: ModuleKind;
  x0: number;
  x1: number;
  /** Burners on a burner grate, front then rear; 0 for other modules. */
  burners: number;
  /** Knobs the module puts on the control panel. */
  knobs: number;
  /** The first grate's rear burner is Wolf's small 9,200 Btu simmer burner. */
  small: boolean;
}

export interface KnobSlot {
  x: number;
  kind: "burner" | "surface" | "oven";
  /** The cavity an oven knob controls. */
  oven?: "cav" | "cav2";
}

export interface DoorSlot {
  x0: number;
  x1: number;
  slot: OvenSlot;
}

export interface Foot {
  x0: number;
  x1: number;
  /** The side whose edge slants in toward the floor: the inner edge of a corner foot. */
  taper: "left" | "right" | null;
}

export interface RangeLayout {
  nominal: number;
  /** Body width. */
  width: number;
  cx: number;
  induction: boolean;
  /** Transitional styling: a slim bar handle and a flat window frame. */
  transitional: boolean;
  /** Dual fuel ranges have the hidden touchscreen between the oven knobs. */
  touchscreen: boolean;
  levels: Levels;
  modules: CooktopModule[];
  knobs: KnobSlot[];
  /** Center of the touchscreen panel, or null. */
  panelX: number | null;
  doors: DoorSlot[];
  feet: Foot[];
  /** SVG y of the floor. */
  floorY: number;
  viewBox: { x: number; y: number; w: number; h: number };
}

const SURFACE_UNITS: Record<RangetopSurface, number> = {
  griddle: 1,
  charbroiler: 1,
  double_griddle: 2,
  french_top: 2,
};

const SURFACE_KNOBS: Record<RangetopSurface, number> = {
  griddle: 1,
  charbroiler: 1,
  double_griddle: 2,
  french_top: 1,
};

const MODULE_GAP = 2.3;
const FILLER_WIDTH = 47;
const DOOR_GAP = 3;
const KNOB_PITCH = 40.4;
/** From the touchscreen's center to the oven knob beside it. */
const PANEL_TO_KNOB = 51.4;
/** Side margin of the view box, room for the floor shadow and an opened door's top corners. */
const SIDE_MARGIN = 16;

/** Scale of a point `d` behind the front plane. */
export function depthScale(d: number): number {
  return CAMERA_DISTANCE / (CAMERA_DISTANCE + d);
}

/** Where a point at `x`, height `h` and depth `d` lands in the drawing. */
export function project(layout: RangeLayout, x: number, h: number, d: number): [number, number] {
  const s = depthScale(d);
  return [layout.cx + (x - layout.cx) * s, layout.floorY - (CAMERA_HEIGHT + (h - CAMERA_HEIGHT) * s)];
}

/** SVG y of a height on the front plane. */
export function yAt(layout: RangeLayout, h: number): number {
  return layout.floorY - h;
}

interface ModulePlan {
  kind: ModuleKind;
  burners: number;
  units: number;
  knobs: number;
}

function planModules(spec: RangeSpec): ModulePlan[] {
  if (spec.fuel === "induction") return [];
  const grates = Math.ceil(Math.max(0, spec.burners) / 2);
  const grate = (index: number): ModulePlan => {
    const burners = Math.min(2, spec.burners - index * 2);
    return { kind: "burners", burners, units: 1, knobs: burners };
  };
  const surfaces = spec.surfaces.map(
    (kind): ModulePlan => ({ kind, burners: 0, units: SURFACE_UNITS[kind] ?? 1, knobs: SURFACE_KNOBS[kind] ?? 1 }),
  );
  const plans: ModulePlan[] = [];
  // Wolf puts the griddle, charbroiler or French top between the burners, with one burner grate
  // on the right: DF48450CG is burners, griddle, charbroiler, burners; DF60650CG has two grates
  // on the left.
  const left = surfaces.length ? Math.max(0, grates - 1) : grates;
  for (let index = 0; index < left; index++) plans.push(grate(index));
  plans.push(...surfaces);
  if (surfaces.length && grates > 0) plans.push(grate(grates - 1));
  return plans;
}

function nominalWidth(spec: RangeSpec, units: number): number {
  if (spec.width && spec.width >= 24) return spec.width;
  if (spec.fuel === "induction") return spec.burners >= 5 ? 36 : 30;
  if (spec.ovens.length >= 2) return units >= 5 ? 60 : 48;
  return units >= 3 ? 36 : 30;
}

function placeModules(plans: ModulePlan[], nominal: number, width: number): CooktopModule[] {
  if (!plans.length) return [];
  const sequence: ModulePlan[] = [...plans];
  // A 30″ range's two burner grates leave a narrow plain grate between them.
  const filler = nominal <= 30 && plans.length === 2 && plans.every((plan) => plan.kind === "burners");
  if (filler) sequence.splice(1, 0, { kind: "filler", burners: 0, units: 0, knobs: 0 });
  const margin = nominal <= 36 ? 18 : 19.5;
  const units = sequence.reduce((sum, plan) => sum + plan.units, 0) || 1;
  const unit =
    (width - 2 * margin - (sequence.length - 1) * MODULE_GAP - (filler ? FILLER_WIDTH : 0)) / units;
  let x = margin;
  let firstGrate = true;
  return sequence.map((plan) => {
    const w = plan.kind === "filler" ? FILLER_WIDTH : unit * plan.units;
    const module: CooktopModule = {
      kind: plan.kind,
      x0: x,
      x1: x + w,
      burners: plan.burners,
      knobs: plan.knobs,
      small: plan.kind === "burners" && firstGrate && plan.burners === 2,
    };
    if (plan.kind === "burners") firstGrate = false;
    x += w + MODULE_GAP;
    return module;
  });
}

const POSITION_ORDER: Record<OvenSlot["position"], number> = {
  left: 0,
  upper: 1,
  single: 1,
  lower: 1,
  right: 2,
};

function placeDoors(spec: RangeSpec, nominal: number, width: number): DoorSlot[] {
  const slots: OvenSlot[] = spec.ovens.length
    ? [...spec.ovens].sort((a, b) => POSITION_ORDER[a.position] - POSITION_ORDER[b.position])
    : [{ prefix: "cav", position: "single", width: null }];
  const fallback = (index: number): number => {
    if (slots.length === 1) return nominal;
    // 48″ ranges pair an 18″ oven on the left with a 30″ one; 60″ ranges have two 30″ ovens.
    if (slots.length === 2 && nominal < 54) return index === 0 ? 18 : nominal - 18;
    return nominal / slots.length;
  };
  const widths = slots.map((slot, index) => (slot.width && slot.width > 0 ? slot.width : fallback(index)));
  const total = widths.reduce((sum, w) => sum + w, 0);
  const room = width - DOOR_GAP * (slots.length - 1);
  let x = 0;
  return slots.map((slot, index) => {
    const w = (room * widths[index]) / total;
    const door = { x0: x, x1: x + w, slot };
    x += w + DOOR_GAP;
    return door;
  });
}

function placeFeet(doors: DoorSlot[], width: number): Foot[] {
  const feet: Foot[] = [
    { x0: 13, x1: 55.5, taper: "right" },
    { x0: width - 55.5, x1: width - 13, taper: "left" },
  ];
  // Two-oven ranges have a third foot under the wall between the ovens.
  for (let index = 1; index < doors.length; index++) {
    const center = (doors[index - 1].x1 + doors[index].x0) / 2;
    feet.push({ x0: center - 20, x1: center + 20, taper: null });
  }
  return feet;
}

/**
 * Knobs and the touchscreen, laid out the way Wolf does: oven knobs flank the touchscreen. On
 * 48″ and 60″ ranges the touchscreen is centered and each half's knobs start about 4″ from the
 * side; on 30″ and 36″ ranges the oven knob sits right of the touchscreen with the right-hand
 * grate's two knobs after it, and the whole row is centered.
 */
function placeKnobs(
  modules: CooktopModule[],
  doors: DoorSlot[],
  width: number,
  touchscreen: boolean,
): { knobs: KnobSlot[]; panelX: number | null } {
  if (!modules.length) return { knobs: [], panelX: null };
  // Each knob belongs to its part of the module, so a double griddle's two controls fall either
  // side of the middle, as on DF48450DG.
  const controls = modules.flatMap((module) =>
    Array.from({ length: module.knobs }, (_, index) => ({
      kind: module.kind === "burners" ? ("burner" as const) : ("surface" as const),
      center: module.x0 + ((module.x1 - module.x0) * (index + 0.5)) / module.knobs,
    })),
  );
  const cx = width / 2;

  if (doors.length >= 2) {
    const reach = touchscreen ? PANEL_TO_KNOB : KNOB_PITCH / 2;
    const left = controls.filter((control) => control.center < cx - 0.5);
    const right = controls.filter((control) => control.center >= cx - 0.5);
    const fromEdge = (count: number): number[] => {
      if (!count) return [];
      const room = cx - reach;
      let pitch = KNOB_PITCH;
      let start = 40;
      const innermost = room - pitch;
      if (start + (count - 1) * pitch > innermost) start = innermost - (count - 1) * pitch;
      if (start < 24) {
        start = 24;
        pitch = (room - 24) / count;
      }
      return Array.from({ length: count }, (_, index) => start + index * pitch);
    };
    const leftX = fromEdge(left.length);
    const rightX = fromEdge(right.length).map((x) => width - x).reverse();
    const knobs: KnobSlot[] = [
      ...left.map((control, index) => ({ x: leftX[index], kind: control.kind })),
      { x: cx - reach, kind: "oven", oven: doors[0].slot.prefix },
      { x: cx + reach, kind: "oven", oven: doors[doors.length - 1].slot.prefix },
      ...right.map((control, index) => ({ x: rightX[index], kind: control.kind })),
    ];
    return { knobs, panelX: touchscreen ? cx : null };
  }

  const last = modules[modules.length - 1];
  const rightCount = last.kind === "burners" ? last.knobs : 0;
  const leftControls = controls.slice(0, controls.length - rightCount);
  const rightControls = controls.slice(controls.length - rightCount);
  // With a griddle or charbroiler there's one knob fewer on the left, and Wolf spreads the
  // groups apart to fill the panel (DF36450G: 3.4″, 7.4″, 11.5″ | screen 18″ | 23.1″ | 28.5″, 32.6″).
  const surface = modules.some((module) => module.kind !== "burners" && module.kind !== "filler");
  const row: KnobSlot[] = [];
  let x = 0;
  leftControls.forEach((control, index) => {
    if (index) x += KNOB_PITCH;
    row.push({ x, kind: control.kind });
  });
  let panel: number | null = null;
  if (touchscreen) {
    if (leftControls.length) x += surface ? 65.2 : PANEL_TO_KNOB;
    panel = x;
    x += PANEL_TO_KNOB;
  } else if (leftControls.length) {
    x += KNOB_PITCH;
  }
  row.push({ x, kind: "oven", oven: doors[0]?.slot.prefix ?? "cav" });
  rightControls.forEach((control, index) => {
    x += index === 0 && surface && touchscreen ? 54 : KNOB_PITCH;
    row.push({ x, kind: control.kind });
  });
  const xs = row.map((knob) => knob.x).concat(panel === null ? [] : [panel]);
  const first = Math.min(...xs);
  const lastX = Math.max(...xs);
  const middle = (first + lastX) / 2;
  const span = lastX - first;
  const squeeze = span > width - 54 ? (width - 54) / span : 1;
  const place = (value: number) => cx + (value - middle) * squeeze;
  return {
    knobs: row.map((knob) => ({ ...knob, x: place(knob.x) })),
    panelX: panel === null ? null : place(panel),
  };
}

export function rangeLayout(spec: RangeSpec): RangeLayout {
  const induction = spec.fuel === "induction";
  const plans = planModules(spec);
  const units = plans.reduce((sum, plan) => sum + plan.units, 0);
  const nominal = nominalWidth(spec, units);
  const width = BODY_WIDTH[nominal] ?? nominal * 10 - 1.25;
  const touchscreen = spec.fuel === "dual_fuel";
  const modules = placeModules(plans, nominal, width);
  const doors = placeDoors(spec, nominal, width);
  const { knobs, panelX } = placeKnobs(modules, doors, width, touchscreen);
  const levels = induction ? INDUCTION_LEVELS : PRO_LEVELS;
  // The highest point drawn: the island trim's back edge, or the back of the induction glass.
  const top = induction
    ? CAMERA_HEIGHT + (TOP.glassTop - CAMERA_HEIGHT) * depthScale(TOP.glassBack)
    : CAMERA_HEIGHT + (TOP.trimTop - CAMERA_HEIGHT) * depthScale(TOP.trimBack);
  const floorY = Math.ceil(top + 6);
  return {
    nominal,
    width,
    cx: width / 2,
    induction,
    transitional: spec.style === "transitional" || (induction && spec.style !== "professional"),
    touchscreen,
    levels,
    modules,
    knobs,
    panelX,
    doors,
    feet: placeFeet(doors, width),
    floorY,
    viewBox: { x: -SIDE_MARGIN, y: 0, w: width + 2 * SIDE_MARGIN, h: floorY + 12 },
  };
}
