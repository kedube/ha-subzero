import type { Appearance, WallOvenSpec } from "../../types";
import { clamp } from "../materials-core";

/**
 * Wolf 30″ built-in oven geometry in drawing units (0.1 inch), measured from Wolf's front photos
 * of the SO3050PM, DO3050PM, SO3050TM, SO3050CM, SO3050PE and SO3050TE and the spec sheets
 * (29 7/8″ wide; single 28 1/2″ high, double 50 7/8″ high). E and M Series share the outline,
 * the control panel height and the door; they differ in controls, windows and handles.
 *
 * A 24″ or 36″ oven is the 30″ one made narrower or wider (`ovenWidth`): its door keeps the 30″
 * door's margins (`across`) and its panel's controls close up or spread out around the screen
 * (`onPanel`), so handles, knobs and legends stay their own size.
 */

/** The 30″ oven's width, which every measurement below is taken on. */
export const WIDTH = 298.75;
export const SINGLE_HEIGHT = 285;
export const DOUBLE_HEIGHT = 508.75;

export const PANEL_HEIGHT = 49.5;
export const DOOR_HEIGHT = 221.5;
/** The dark reveal between the control panel and the upper door. */
export const PANEL_GAP = 1.3;
/** The reveal between the two doors of a double oven. */
export const DOOR_GAP = 1.7;
/**
 * How far the Professional handle's bar stands off the door, to its center, as the open-door
 * photos show it hanging; and the door's thickness.
 */
export const HANDLE_STANDOFF = 18;
export const DOOR_THICKNESS = 24;

/**
 * An oven's width from its nominal width in inches, a little under it in the 30″ oven's
 * proportion. Wolf's built-in ovens are 24″ to 36″ wide; a width that isn't known is drawn as 30″.
 */
export function ovenWidth(inches: number | null): number {
  return (WIDTH * clamp(inches ?? 30, 24, 36)) / 30;
}

/**
 * Where a measurement across the 30″ oven lands on an oven `width` wide. The door keeps its
 * margins: what's left of the middle stays as far from the left side, what's right of it as far
 * from the right side, and the window and the handle between them take up the difference.
 */
export function across(u: number, width: number): number {
  return u > WIDTH / 2 ? u + (width - WIDTH) : u;
}

export type OvenStyle = "professional" | "transitional" | "contemporary";
export type OvenSeries = "l" | "e" | "m";

/** The style an oven is drawn in: the Appearance setting's, else the model's, else Professional. */
export function ovenStyle(spec: WallOvenSpec, appearance: Pick<Appearance, "style">): OvenStyle {
  return appearance.style ?? spec.style ?? "professional";
}

/**
 * Whether an oven is drawn with knobs, and so takes the Appearance setting's knob color: a
 * Professional oven that the integration knows has a knob, or of the M Series, or of a series
 * that isn't known (drawn as an M).
 */
export function hasKnobs(spec: WallOvenSpec, appearance: Pick<Appearance, "style">): boolean {
  const style = ovenStyle(spec, appearance);
  return style === "professional" && (spec.knob || spec.series === "m" || spec.series === null);
}

export interface Span {
  top: number;
  height: number;
}

export interface OvenLayout {
  width: number;
  height: number;
  panel: Span;
  doors: Span[];
  vent: Span;
}

export function ovenLayout(double: boolean, width = WIDTH): OvenLayout {
  const panel = { top: 0, height: PANEL_HEIGHT };
  const first = { top: PANEL_HEIGHT + PANEL_GAP, height: DOOR_HEIGHT };
  const doors = double
    ? [first, { top: first.top + DOOR_HEIGHT + DOOR_GAP, height: DOOR_HEIGHT }]
    : [first];
  const height = double ? DOUBLE_HEIGHT : SINGLE_HEIGHT;
  const last = doors[doors.length - 1];
  const ventTop = last.top + last.height;
  return { width, height, panel, doors, vent: { top: ventTop, height: height - ventTop } };
}

/** Horizontal extents are symmetric about the middle: `half` is the distance to each side. */
export const centered = (half: number): [number, number] => [WIDTH / 2 - half, WIDTH / 2 + half];

/** A rectangle on a door, in door coordinates (u across from the left, v down from the top). */
export interface DoorRect {
  u0: number;
  u1: number;
  v0: number;
  v1: number;
}

export type HandleKind = "pro" | "slim" | "strip";

export interface Handle {
  kind: HandleKind;
  /** Bar ends (pro: the outer edges of the end caps). */
  u0: number;
  u1: number;
  /** Bar center, down from the door's top. */
  v: number;
  /** Bar diameter (strip: its height from the door's top). */
  size: number;
}

export interface DoorDesign {
  /** The glass surface; contemporary doors are glass all over, so theirs is the whole face. */
  glass: DoorRect;
  /** The see-through part of the glass, where the cavity shows when it's lit. */
  window: DoorRect;
  /** Width of the stainless bevel framing the window (M Series Professional), 0 for none. */
  bevel: number;
  /** Width of the soft recess the glass sits in (E Series Professional), 0 for none. */
  recess: number;
  handle: Handle;
  /** M Series Transitional: a raised stainless frame line around the glass. */
  frameLine: DoorRect | null;
}

const [proGlass0, proGlass1] = centered(97.25);
const [proCap0, proCap1] = centered(116.5);
const [eGlass0, eGlass1] = centered(127.4);
const [eCap0, eCap1] = centered(127.9);
const [slimE0, slimE1] = centered(136.5);
const [tmGlass0, tmGlass1] = centered(105.9);
const [tmFrame0, tmFrame1] = centered(112.5);
const [slimM0, slimM1] = centered(102.3);

/** A door's design on an oven `width` wide: the 30″ door's, keeping its margins. */
export function doorDesign(style: OvenStyle, series: OvenSeries, width = WIDTH): DoorDesign {
  const design = measuredDesign(style, series);
  if (width === WIDTH) return design;
  const fit = <T extends { u0: number; u1: number }>(part: T): T => ({
    ...part,
    u0: across(part.u0, width),
    u1: across(part.u1, width),
  });
  return {
    ...design,
    glass: fit(design.glass),
    window: fit(design.window),
    handle: fit(design.handle),
    frameLine: design.frameLine && fit(design.frameLine),
  };
}

/** The 30″ door's design, as measured. */
function measuredDesign(style: OvenStyle, series: OvenSeries): DoorDesign {
  const m = series === "m";
  if (style === "contemporary") {
    return {
      glass: { u0: 0, u1: WIDTH, v0: 15.8, v1: DOOR_HEIGHT },
      window: { u0: proGlass0, u1: proGlass1, v0: 43.5, v1: 178.2 },
      bevel: 0,
      recess: 0,
      handle: { kind: "strip", u0: 0, u1: WIDTH, v: 7.9, size: 15.8 },
      frameLine: null,
    };
  }
  if (style === "transitional") {
    return m
      ? {
          glass: { u0: tmGlass0, u1: tmGlass1, v0: 1, v1: 178.5 },
          window: { u0: tmGlass0 + 9, u1: tmGlass1 - 9, v0: 43.5, v1: 172 },
          bevel: 0,
          recess: 0,
          handle: { kind: "slim", u0: slimM0, u1: slimM1, v: 16.9, size: 6 },
          frameLine: { u0: tmFrame0, u1: tmFrame1, v0: -42.7, v1: 185.4 },
        }
      : {
          glass: { u0: 0, u1: WIDTH, v0: 44.2, v1: 178.5 },
          window: { u0: eGlass0, u1: eGlass1, v0: 44.2, v1: 178.5 },
          bevel: 0,
          recess: 0,
          handle: { kind: "slim", u0: slimE0, u1: slimE1, v: 16.5, size: 6 },
          frameLine: null,
        };
  }
  return m
    ? {
        glass: { u0: proGlass0, u1: proGlass1, v0: 43.5, v1: 178.2 },
        window: { u0: proGlass0, u1: proGlass1, v0: 43.5, v1: 178.2 },
        bevel: 9.4,
        recess: 0,
        handle: { kind: "pro", u0: proCap0, u1: proCap1, v: 17, size: 12.8 },
        frameLine: null,
      }
    : {
        glass: { u0: eGlass0, u1: eGlass1, v0: 44.2, v1: 178.5 },
        window: { u0: eGlass0, u1: eGlass1, v0: 44.2, v1: 178.5 },
        bevel: 0,
        recess: 4.5,
        handle: { kind: "pro", u0: eCap0, u1: eCap1, v: 16.5, size: 12.8 },
        frameLine: null,
      };
}

/** The touchscreen (M Professional, E) or where the display shows through black glass. */
const SCREEN = { x: 120.4, y: 10.7, width: 58, height: 27.3 };
/** The brushed bezel around a framed touchscreen. */
export const SCREEN_BEZEL = 2.3;

/** The screen on an oven `width` wide: the same screen, in the middle of the panel. */
export function screenRect(width: number): typeof SCREEN {
  return { ...SCREEN, x: SCREEN.x + (width - WIDTH) / 2 };
}

/**
 * How much room the panel has either side of the screen, against the 30″ panel's: 1 on a 30″
 * oven, less on a narrower one.
 */
export function panelRoom(width: number): number {
  const side = SCREEN.x - SCREEN_BEZEL;
  return (side + (width - WIDTH) / 2) / side;
}

/**
 * Where a control on the 30″ panel lands on a panel `width` wide. The screen stays in the middle
 * at its own size; the knobs and legends either side of it close up or spread out evenly between
 * it and the panel's ends.
 */
export function onPanel(x: number, width: number): number {
  const room = panelRoom(width);
  return x < WIDTH / 2 ? x * room : x + (width - WIDTH) + (WIDTH - x) * (1 - room);
}

/** M Professional knob centers: two on a single oven, four on a double. */
export const KNOB_Y = 24.3;
export const KNOB_RADIUS = 10.5;
export const BEZEL_RADIUS = 15.2;
export const SINGLE_KNOBS = [74.3, 224.45];
export const DOUBLE_KNOBS = [44.2, 88.2, 210.55, 254.55];

/** M Series Transitional: the black glass strip of the control panel, inside the frame line. */
export function panelGlass(width: number): { u0: number; u1: number; top: number } {
  return { u0: tmGlass0, u1: across(tmGlass1, width), top: 12.6 };
}

/**
 * The bottom vent: two louvered openings either side of a center divider. The divider stays in
 * the middle at its own width, and the openings run out to the same margins.
 */
export function ventOpenings(width: number): Array<[number, number]> {
  const grow = width - WIDTH;
  return [
    [19.6, 141.7 + grow / 2],
    [157.05 + grow / 2, 279.15 + grow],
  ];
}
