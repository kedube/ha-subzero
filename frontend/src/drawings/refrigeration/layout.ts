import type { RefrigerationForm, RefrigerationSpec } from "../../types";
import { IN, type Rect } from "./geometry";

/**
 * Where everything sits on a refrigeration front, in drawing units (0.1 inch), measured
 * from Sub-Zero's spec sheets and product photos:
 * - Full-size units are 84" tall. Classic (and BI) have an 8.1" louvered grille and a 0.65"
 *   hinge band above the doors and a 3.4" toe kick (the spec allows 4" ± 1/2"; the photos show
 *   about 3"). PRO has a 10.8" grille panel with slots and a 1.2" stainless frame around the
 *   fronts. Designer (and Integrated) fronts run flush to the top over a 3.5" kick.
 * - Undercounter units are drawn as photographed: a 30.6" front over a 2.4" kick, 33" in all.
 *
 * Which state key opens which front (DrawingState.doors):
 * - side_by_side: frz_door_ajar opens the left (freezer) door, ref_door_ajar the right
 *   (refrigerator) door. PRO's lower drawers have no sensor of their own and stay closed.
 * - french_door: both doors share ref_door_ajar; the freezer drawer is frz_door_ajar.
 * - over_under: ref_door_ajar is the door, frz_door_ajar the (upper) freezer drawer.
 * - column_refrigerator, column_freezer: ref_door_ajar, frz_door_ajar.
 * - column_wine, undercounter_wine: one door; a two-zone unit reports only wine_door_ajar,
 *   so either wine key opens it.
 * - tall_over_under: ref_door_ajar is the door, frz_door_ajar the upper freezer drawer.
 *   tall_refrigerator: ref_door_ajar is the door, ref2_door_ajar (the refrigerator drawer)
 *   the upper drawer. tall_freezer: frz_door_ajar is the door.
 * - wine_over_drawers: the wine keys open the door; the drawers follow `spec.drawers`
 *   (combination: ref_door_ajar upper, frz_door_ajar lower; refrigerator: ref_door_ajar and
 *   ref2_door_ajar; freezer: frz_door_ajar upper).
 * - undercounter_refrigerator, undercounter_beverage: ref_door_ajar (a beverage center may
 *   also report wine_door_ajar).
 * - undercounter_drawers: refrigerator drawers are ref_door_ajar (upper) and ref2_door_ajar
 *   (lower); freezer drawers frz_door_ajar (upper); combination ref_door_ajar upper and
 *   frz_door_ajar lower.
 * - ice_maker: ice_door_ajar.
 */

export type Line = "classic" | "designer" | "pro";

/** What a front holds, which sets the interior drawn behind glass or when it's open. */
export type Contents = "fridge" | "freezer" | "wine" | "beverage" | "food" | "ice";

/**
 * A zone readout over a front. Doors place it at a fraction of their height (`at`); a zone
 * whose area starts partway down (a wine zone under the divider) gives that area's top, and
 * the label hangs just under it. Drawers hang theirs under the handle.
 */
export interface Zone {
  zone: string;
  at?: number;
  top?: number;
  /** Shown only while the front is open (the crisper sits inside the refrigerator). */
  openOnly?: boolean;
  /** Centered on this x instead of the front's clear area (e.g. a window). */
  x?: number;
}

export interface Front {
  kind: "door" | "drawer";
  rect: Rect;
  /** Doors swing open on this side; drawers ignore it. */
  hinge: "left" | "right";
  /** Doors carry the handle along the free edge, drawers across the top. */
  handle: "edge" | "top";
  /** Glass window, in absolute units; null for a solid front. */
  window: Rect | null;
  contents: Contents;
  /** The interior behind the front; French doors share one. */
  cavity: Rect;
  cavityId: number;
  /** State keys that show it open: any of them. */
  keys: string[];
  zones: Zone[];
  /** External ice and water dispenser in this door. */
  dispenser: boolean;
  /** The ice maker is behind this front: its readout carries the ice mark. */
  ice: boolean;
  /** Wine racks, and the rack where the second zone starts. */
  racks: { count: number; split: number | null } | null;
  /** Spoken name for the aria-label, e.g. "freezer door". */
  name: string;
}

export interface Layout {
  w: number;
  h: number;
  line: Line;
  undercounter: boolean;
  top: "louvers" | "slots" | "flush";
  grille: Rect | null;
  /** The dark band between the grille and the fronts, where the top hinges show. */
  band: Rect | null;
  /** The fronts' vertical extent: the stainless light bands are laid across it. */
  span: { y0: number; y1: number };
  kick: Rect;
  /** PRO's stainless frame around the fronts. */
  frame: number;
  fronts: Front[];
  /** Interior depth behind a front. */
  depth: number;
  internalDispenser: boolean;
  name: string;
}

const UNDERCOUNTER = new Set<RefrigerationForm>([
  "undercounter_refrigerator",
  "undercounter_beverage",
  "undercounter_wine",
  "undercounter_drawers",
  "ice_maker",
]);

const DEFAULT_WIDTH: Record<RefrigerationForm, number> = {
  side_by_side: 48,
  french_door: 36,
  over_under: 30,
  column_refrigerator: 30,
  column_freezer: 24,
  column_wine: 24,
  tall_refrigerator: 30,
  tall_freezer: 30,
  tall_over_under: 36,
  wine_over_drawers: 30,
  undercounter_refrigerator: 24,
  undercounter_beverage: 24,
  undercounter_wine: 24,
  undercounter_drawers: 30,
  ice_maker: 15,
};

const NAMES: Record<RefrigerationForm, string> = {
  side_by_side: "Side-by-side refrigerator",
  french_door: "French door refrigerator",
  over_under: "Over-and-under refrigerator",
  column_refrigerator: "Column refrigerator",
  column_freezer: "Column freezer",
  column_wine: "Wine column",
  tall_refrigerator: "Refrigerator",
  tall_freezer: "Freezer",
  tall_over_under: "Over-and-under refrigerator",
  wine_over_drawers: "Wine storage with drawers",
  undercounter_refrigerator: "Undercounter refrigerator",
  undercounter_beverage: "Beverage center",
  undercounter_wine: "Wine storage",
  undercounter_drawers: "Refrigerator drawers",
  ice_maker: "Ice maker",
};

/** Gap between neighboring fronts, and the wider split between side-by-side doors. */
const GAP = 2.5;
const SPLIT = 3.5;

/** Product line, normalized: BI draws as Classic and Integrated as Designer. */
function lineOf(spec: RefrigerationSpec): Line {
  const form = spec.form;
  // Only these forms exist with an exposed grille; everything else is a Designer front.
  const grilled = form === "side_by_side" || form === "french_door" || form === "over_under";
  const column = form === "column_refrigerator" || form === "column_freezer" || form === "column_wine";
  if (spec.line === "pro") return grilled ? "pro" : "classic";
  if (spec.line === "classic" || spec.line === "built_in") return grilled || column ? "classic" : "designer";
  if (spec.line === "designer" || spec.line === "integrated") return "designer";
  return grilled ? "classic" : "designer";
}

interface Frame {
  top: Layout["top"];
  grille: Rect | null;
  band: Rect | null;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  kick: Rect;
  frame: number;
}

function frameFor(line: Line, undercounter: boolean, w: number, h: number): Frame {
  if (undercounter) {
    return { top: "flush", grille: null, band: null, x0: 0, x1: w, y0: 0, y1: 306, kick: { x: 0, y: 306, w, h: h - 306 }, frame: 0 };
  }
  if (line === "classic") {
    return {
      top: "louvers",
      grille: { x: 0, y: 0, w, h: 81 },
      band: { x: 0, y: 81, w, h: 6.5 },
      x0: 0,
      x1: w,
      y0: 87.5,
      y1: 806,
      kick: { x: 0, y: 806, w, h: 34 },
      frame: 0,
    };
  }
  if (line === "pro") {
    return {
      top: "slots",
      grille: { x: 0, y: 0, w, h: 108 },
      band: { x: 0, y: 108, w, h: 3 },
      x0: 12,
      x1: w - 12,
      y0: 111,
      y1: 798,
      kick: { x: 0, y: 800, w, h: 40 },
      frame: 12,
    };
  }
  return { top: "flush", grille: null, band: null, x0: 0, x1: w, y0: 0, y1: 805, kick: { x: 0, y: 805, w, h: 35 }, frame: 0 };
}

/** Splits [y0, y1] into fronts of the given heights, plus one more that takes the rest. */
function stack(y0: number, y1: number, heights: number[]): Array<[number, number]> {
  const rows: Array<[number, number]> = [];
  let y = y0;
  for (const height of heights) {
    rows.push([y, y + height]);
    y += height + GAP;
  }
  rows.push([y, y1]);
  return rows;
}

type WindowKind = "classic" | "pro" | "column" | "over_drawers" | "undercounter";

/** Window insets (left/right, top, bottom) measured from the photos of each door type. */
const WINDOW_INSETS: Record<WindowKind, [number, number, number]> = {
  classic: [32, 45, 55],
  pro: [36, 42, 45],
  column: [34, 80, 92],
  over_drawers: [34, 81, 47],
  undercounter: [33.5, 36, 44],
};

function windowIn(r: Rect, kind: WindowKind): Rect {
  const [side, top, bottom] = WINDOW_INSETS[kind];
  return { x: r.x + side, y: r.y + top, w: r.w - 2 * side, h: r.h - top - bottom };
}

/** The opening behind a front: the front less the cabinet's face flange. */
function cavityOf(r: Rect, undercounter: boolean): Rect {
  const side = undercounter ? 9 : 10;
  return { x: r.x + side, y: r.y + (undercounter ? 9 : 12), w: r.w - 2 * side, h: r.h - (undercounter ? 18 : 22) };
}

/**
 * Wine racks across a window (or the cavity behind a solid door): the top of each rack's maple
 * front, and the divider between two zones, which holds a small display.
 */
export function wineRacks(span: [number, number], racks: { count: number; split: number | null }) {
  const divider = racks.split !== null ? 22 : 0;
  const pitch = (span[1] - span[0] - 6 - divider) / racks.count;
  const bars = Array.from(
    { length: racks.count },
    (_, i) => span[0] + 6 + (racks.split !== null && i >= racks.split ? divider : 0) + (i + 1) * pitch - 16,
  );
  const split = racks.split !== null ? bars[racks.split - 1] + 17 : null;
  return { pitch, bars, divider: split === null ? null : { y: split, h: divider - 2 } };
}

/** Readout zones for a wine window: the upper zone from its top, the lower from under the divider. */
function wineZones(win: Rect, racks: { count: number; split: number | null }): Zone[] {
  const x = win.x + win.w / 2;
  const { divider } = wineRacks([win.y, win.y + win.h], racks);
  return [{ zone: "wine", top: win.y + 4, x }, ...(divider ? [{ zone: "wine2", top: divider.y + divider.h, x }] : [])];
}

export function buildLayout(spec: RefrigerationSpec): Layout {
  const line = lineOf(spec);
  const form = spec.form;
  const undercounter = UNDERCOUNTER.has(form);
  const defaultWidth = form === "over_under" && line === "pro" ? 36 : DEFAULT_WIDTH[form];
  const w = Math.min(Math.max(spec.width ?? defaultWidth, 12), 72) * IN;
  const h = (undercounter ? 33 : 84) * IN;
  const f = frameFor(line, undercounter, w, h);
  const twoZones = spec.zones >= 2;
  const fronts: Front[] = [];
  let cavityId = 0;

  const add = (
    front: Omit<Front, "cavity" | "cavityId" | "window" | "dispenser" | "ice" | "racks" | "zones"> &
      Partial<Pick<Front, "window" | "dispenser" | "ice" | "racks" | "zones" | "cavity">>,
  ): Front => {
    const full: Front = {
      window: null,
      dispenser: false,
      ice: false,
      racks: null,
      zones: [],
      ...front,
      cavity: front.cavity ?? cavityOf(front.rect, undercounter),
      cavityId: cavityId++,
    };
    fronts.push(full);
    return full;
  };
  const rect = (x0: number, x1: number, y0: number, y1: number): Rect => ({ x: x0, y: y0, w: x1 - x0, h: y1 - y0 });
  const glassKind: WindowKind = line === "pro" ? "pro" : line === "classic" ? "classic" : "column";

  /** Drawers under a door, by what they hold. */
  const drawerPair = (rows: Array<[number, number]>, x0: number, x1: number, kinds: Array<[Contents, string[], string | null]>) => {
    rows.forEach(([top, bottom], index) => {
      const [contents, keys, zone] = kinds[Math.min(index, kinds.length - 1)];
      add({
        kind: "drawer",
        rect: rect(x0, x1, top, bottom),
        hinge: "left",
        handle: "top",
        contents,
        keys,
        zones: zone ? [{ zone }] : [],
        ice: spec.ice && contents === "freezer" && index === kinds.findIndex(([c]) => c === "freezer"),
        name: contents === "freezer" ? "freezer drawer" : "refrigerator drawer",
      });
    });
  };

  switch (form) {
    case "side_by_side": {
      // The freezer column, measured on the CL4850SID photo (19" of 48"), scales with width.
      const split = line === "pro" ? f.x0 + 184 : Math.round(w * 0.398);
      const doorsBottom = line === "pro" ? 534 : f.y1;
      const freezer = add({
        kind: "door",
        rect: rect(f.x0, split - SPLIT / 2, f.y0, doorsBottom),
        hinge: "left",
        handle: "edge",
        contents: "freezer",
        keys: ["frz_door_ajar"],
        zones: [{ zone: "frz", at: line === "pro" ? 0.2 : 0.15 }],
        dispenser: spec.dispenser === "external",
        ice: spec.ice,
        name: "freezer door",
      });
      const fridgeRect = rect(split + SPLIT / 2, f.x1, f.y0, doorsBottom);
      const fridgeWindow = spec.glass ? windowIn(fridgeRect, glassKind) : null;
      add({
        kind: "door",
        rect: fridgeRect,
        hinge: "right",
        handle: "edge",
        window: fridgeWindow,
        contents: spec.glass ? "food" : "fridge",
        keys: ["ref_door_ajar"],
        zones: [
          { zone: "ref", at: line === "pro" ? 0.2 : 0.15, x: fridgeWindow ? fridgeWindow.x + fridgeWindow.w / 2 : undefined },
          ...(spec.glass ? [] : [{ zone: "crisp", openOnly: true }]),
        ],
        name: "refrigerator door",
      });
      if (line === "pro") {
        const rows = stack(doorsBottom + GAP + 0.5, f.y1, [143]);
        drawerPair(rows, freezer.rect.x, freezer.rect.x + freezer.rect.w, [["freezer", [], null]]);
        drawerPair(rows, fridgeRect.x, fridgeRect.x + fridgeRect.w, [["fridge", [], null]]);
      }
      break;
    }
    case "french_door": {
      const [[top, doorsBottom], [drawerTop, bottom]] = stack(f.y0, f.y1, [line === "designer" ? 544 : 515]);
      const cavity = cavityOf(rect(f.x0, f.x1, top, doorsBottom), undercounter);
      const left = rect(f.x0, w / 2 - GAP / 2, top, doorsBottom);
      const right = rect(w / 2 + GAP / 2, f.x1, top, doorsBottom);
      const shared = cavityId;
      for (const [r, hinge] of [
        [left, "left"],
        [right, "right"],
      ] as const) {
        const front = add({
          kind: "door",
          rect: r,
          hinge,
          handle: "edge",
          window: spec.glass ? windowIn(r, glassKind) : null,
          contents: spec.glass ? "food" : "fridge",
          cavity,
          keys: ["ref_door_ajar"],
          zones:
            hinge === "left"
              ? [
                  { zone: "ref", at: 0.15 },
                  { zone: "crisp", openOnly: true },
                ]
              : [],
          dispenser: hinge === "left" && spec.dispenser === "external",
          name: "refrigerator door",
        });
        front.cavityId = shared;
      }
      cavityId = shared + 1;
      add({
        kind: "drawer",
        rect: rect(f.x0, f.x1, drawerTop, bottom),
        hinge: "left",
        handle: "top",
        contents: "freezer",
        keys: ["frz_door_ajar"],
        zones: [{ zone: "frz" }],
        ice: spec.ice,
        name: "freezer drawer",
      });
      break;
    }
    case "over_under": {
      if (line === "pro") {
        const [[top, doorBottom], ...rows] = stack(f.y0, f.y1, [423, 143]);
        const r = rect(f.x0, f.x1, top, doorBottom);
        add({
          kind: "door",
          rect: r,
          hinge: "right",
          handle: "edge",
          window: spec.glass ? windowIn(r, "pro") : null,
          contents: spec.glass ? "food" : "fridge",
          keys: ["ref_door_ajar"],
          zones: [{ zone: "ref", at: 0.18 }],
          name: "refrigerator door",
        });
        drawerPair(rows, f.x0, f.x1, [
          ["freezer", ["frz_door_ajar"], "frz"],
          ["freezer", [], null],
        ]);
        break;
      }
      const [[top, doorBottom], [drawerTop, bottom]] = stack(f.y0, f.y1, [line === "designer" ? 544 : 515]);
      const r = rect(f.x0, f.x1, top, doorBottom);
      add({
        kind: "door",
        rect: r,
        hinge: "right",
        handle: "edge",
        window: spec.glass ? windowIn(r, glassKind) : null,
        contents: spec.glass ? "food" : "fridge",
        keys: ["ref_door_ajar"],
        zones: [{ zone: "ref", at: 0.16 }, ...(spec.glass ? [] : [{ zone: "crisp", openOnly: true }])],
        name: "refrigerator door",
      });
      add({
        kind: "drawer",
        rect: rect(f.x0, f.x1, drawerTop, bottom),
        hinge: "left",
        handle: "top",
        contents: "freezer",
        keys: ["frz_door_ajar"],
        zones: [{ zone: "frz" }],
        ice: spec.ice,
        name: "freezer drawer",
      });
      break;
    }
    case "column_refrigerator":
    case "column_freezer":
    case "column_wine": {
      const r = rect(f.x0, f.x1, f.y0, f.y1);
      const wine = form === "column_wine";
      const freezer = form === "column_freezer";
      const glass = wine || (spec.glass && !freezer);
      const win = glass ? windowIn(r, line === "classic" ? "classic" : "column") : null;
      const racks = Math.max(6, Math.round((win?.h ?? 600) / 46));
      const split = twoZones ? Math.round(racks * 0.36) : null;
      const zones: Zone[] = wine
        ? wineZones(win!, { count: racks, split })
        : [{ zone: freezer ? "frz" : "ref", at: 0.13, x: win ? win.x + win.w / 2 : undefined }];
      add({
        kind: "door",
        rect: r,
        hinge: form === "column_refrigerator" ? "right" : "left",
        handle: "edge",
        window: win,
        contents: wine ? "wine" : freezer ? "freezer" : glass ? "food" : "fridge",
        keys: wine ? ["wine_door_ajar", "wine2_door_ajar"] : freezer ? ["frz_door_ajar"] : ["ref_door_ajar"],
        zones: [...zones, ...(!wine && !freezer && !glass ? [{ zone: "crisp", openOnly: true }] : [])],
        ice: freezer && spec.ice,
        racks: wine ? { count: racks, split } : null,
        name: wine ? "wine door" : freezer ? "freezer door" : "refrigerator door",
      });
      break;
    }
    case "tall_refrigerator":
    case "tall_freezer":
    case "tall_over_under":
    case "wine_over_drawers": {
      const [[top, doorBottom], ...rows] = stack(f.y0, f.y1, [499, 133.5]);
      const r = rect(f.x0, f.x1, top, doorBottom);
      const wine = form === "wine_over_drawers";
      const win = wine || (spec.glass && form !== "tall_freezer") ? windowIn(r, "over_drawers") : null;
      const racks = 8;
      const split = wine && twoZones ? 6 : null;
      const doorContents: Contents = wine ? "wine" : form === "tall_freezer" ? "freezer" : win ? "food" : "fridge";
      const doorZone = form === "tall_freezer" ? "frz" : "ref";
      add({
        kind: "door",
        rect: r,
        hinge: "left",
        handle: "edge",
        window: win,
        contents: doorContents,
        keys: wine ? ["wine_door_ajar", "wine2_door_ajar"] : [form === "tall_freezer" ? "frz_door_ajar" : "ref_door_ajar"],
        zones: wine ? wineZones(win!, { count: racks, split }) : [{ zone: doorZone, at: 0.2, x: win ? win.x + win.w / 2 : undefined }],
        ice: form === "tall_freezer" && spec.ice,
        racks: wine ? { count: racks, split } : null,
        name: wine ? "wine door" : form === "tall_freezer" ? "freezer door" : "refrigerator door",
      });
      const kinds: Array<[Contents, string[], string | null]> =
        form === "tall_refrigerator"
          ? [
              ["fridge", ["ref2_door_ajar"], "ref2"],
              ["fridge", [], null],
            ]
          : form === "tall_freezer"
            ? [["freezer", [], null]]
            : form === "tall_over_under"
              ? [
                  ["freezer", ["frz_door_ajar"], "frz"],
                  ["freezer", [], null],
                ]
              : spec.drawers === "refrigerator"
                ? [
                    ["fridge", ["ref_door_ajar"], "ref"],
                    ["fridge", ["ref2_door_ajar"], "ref2"],
                  ]
                : spec.drawers === "freezer"
                  ? [
                      ["freezer", ["frz_door_ajar"], "frz"],
                      ["freezer", [], null],
                    ]
                  : [
                      ["fridge", ["ref_door_ajar"], "ref"],
                      ["freezer", ["frz_door_ajar"], "frz"],
                    ];
      drawerPair(rows, f.x0, f.x1, kinds);
      break;
    }
    case "undercounter_refrigerator":
    case "undercounter_beverage":
    case "undercounter_wine":
    case "ice_maker": {
      const r = rect(f.x0, f.x1, f.y0, f.y1);
      const wine = form === "undercounter_wine";
      const beverage = form === "undercounter_beverage";
      // Wine storage always has glass; beverage centers mostly do, but the DEU1550B is solid.
      const glass = wine || ((beverage || form === "undercounter_refrigerator") && spec.glass);
      const win = glass ? windowIn(r, "undercounter") : null;
      const split = wine && twoZones ? 2 : null;
      const center = win ? win.x + win.w / 2 : undefined;
      add({
        kind: "door",
        rect: r,
        // As photographed: beverage and wine units hinged left, refrigerator and ice maker right.
        hinge: wine || beverage ? "left" : "right",
        handle: "edge",
        window: win,
        contents: wine ? "wine" : beverage ? "beverage" : form === "ice_maker" ? "ice" : glass ? "food" : "fridge",
        keys: wine
          ? ["wine_door_ajar", "wine2_door_ajar"]
          : beverage
            ? ["ref_door_ajar", "wine_door_ajar"]
            : form === "ice_maker"
              ? ["ice_door_ajar"]
              : ["ref_door_ajar"],
        zones: wine
          ? wineZones(win!, { count: 6, split })
          : form === "ice_maker"
            ? []
            : [win ? { zone: "ref", top: win.y + 4, x: center } : { zone: "ref", at: 0.2 }],
        racks: wine ? { count: 6, split } : null,
        name: form === "ice_maker" ? "ice maker door" : wine ? "wine door" : "door",
      });
      break;
    }
    case "undercounter_drawers": {
      const rows = stack(f.y0, f.y1, [134]);
      const kinds: Array<[Contents, string[], string | null]> =
        spec.drawers === "freezer"
          ? [
              ["freezer", ["frz_door_ajar"], "frz"],
              ["freezer", [], null],
            ]
          : spec.drawers === "combination"
            ? [
                ["fridge", ["ref_door_ajar"], "ref"],
                ["freezer", ["frz_door_ajar"], "frz"],
              ]
            : [
                ["fridge", ["ref_door_ajar"], "ref"],
                ["fridge", ["ref2_door_ajar"], "ref2"],
              ];
      drawerPair(rows, f.x0, f.x1, kinds);
      break;
    }
  }

  const name =
    form === "undercounter_drawers" && spec.drawers === "freezer"
      ? "Freezer drawers"
      : form === "undercounter_drawers" && spec.drawers === "combination"
        ? "Refrigerator and freezer drawers"
        : NAMES[form];
  return {
    w,
    h,
    line,
    undercounter,
    top: f.top,
    grille: f.grille,
    band: f.band,
    span: { y0: f.y0, y1: f.y1 },
    kick: f.kick,
    frame: f.frame,
    fronts,
    depth: undercounter ? 200 : 225,
    internalDispenser: spec.dispenser === "internal",
    name,
  };
}
