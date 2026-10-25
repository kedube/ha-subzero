import type { DrawingState } from "../../src/drawings/types";
import type { Appearance, RefrigerationSpec } from "../../src/types";
import type { GalleryVariant } from "../types";

// Reference photos (render.mjs --refs): Sub-Zero product images, kept out of the repository.

const stainless: Appearance = { finish: "stainless", panel_color: null, knobs: "red", handle: "tubular", style: null, form: null };
const panel = (color: string, handle: Appearance["handle"] = "tubular"): Appearance => ({ ...stainless, finish: "panel", panel_color: color, handle });

function spec(fields: Partial<RefrigerationSpec> & Pick<RefrigerationSpec, "form">): RefrigerationSpec {
  return {
    family: "refrigeration",
    line: "designer",
    width: null,
    glass: false,
    dispenser: "none",
    ice: false,
    drawers: null,
    zones: 1,
    outdoor: false,
    generic: false,
    ...fields,
  };
}

function state(fields: Partial<DrawingState> = {}): DrawingState {
  return { available: true, doors: {}, readouts: {}, ...fields };
}

// The owner's CL4850SID, with the readouts from its capture: 38° / -1°, crisper 36°, ice on.
const cl4850sid = spec({ form: "side_by_side", line: "classic", width: 48, dispenser: "internal", ice: true, zones: 2 });
const cl4850sidState = (fields: Partial<DrawingState> = {}) =>
  state({ readouts: { ref: "38°", frz: "-1°", crisp: "36°" }, ice: { on: true, mode: "on" }, ...fields });

// The charcoal-oak panels in Sub-Zero's panel-ready photos.
const charcoalOak = "#5b5d5f";

export const variants: GalleryVariant[] = [
  {
    id: "cl4850sid",
    title: "CL4850SID · stainless, tubular handles",
    reference: "cl4850sid-main.jpg",
    input: { spec: cl4850sid, appearance: stainless, state: cl4850sidState() },
  },
  {
    id: "cl4850sid-freezer-open",
    title: "CL4850SID · freezer door open",
    reference: "cl4850sid-open.jpg",
    input: { spec: cl4850sid, appearance: stainless, state: cl4850sidState({ doors: { frz_door_ajar: true } }) },
  },
  {
    id: "cl4850sid-fridge-open",
    title: "CL4850SID · refrigerator door open",
    reference: "cl4850sid-open.jpg",
    input: { spec: cl4850sid, appearance: stainless, state: cl4850sidState({ doors: { ref_door_ajar: true } }) },
  },
  {
    id: "cl4850sid-both-open",
    title: "CL4850SID · both doors open, as in the open photo",
    reference: "cl4850sid-open.jpg",
    input: { spec: cl4850sid, appearance: stainless, state: cl4850sidState({ doors: { frz_door_ajar: true, ref_door_ajar: true } }) },
  },
  {
    id: "cl4850sid-pro-handle",
    title: "CL4850SID/S/P · pro handles, max ice",
    reference: "cl4850sid-main.jpg",
    input: { spec: cl4850sid, appearance: { ...stainless, handle: "pro" }, state: cl4850sidState({ ice: { on: true, mode: "max" } }) },
  },
  {
    id: "cl4850sid-panel-walnut",
    title: "CL4850SID/O · walnut panels",
    reference: "cl4850sid-panel.jpg",
    input: { spec: cl4850sid, appearance: panel("#5d4130"), state: cl4850sidState() },
  },
  {
    id: "cl4850sid-offline",
    title: "CL4850SID · offline",
    input: { spec: cl4850sid, appearance: stainless, state: cl4850sidState({ available: false }) },
  },
  {
    id: "deu2450bg",
    title: "DEU2450BG · undercounter beverage center",
    reference: "deu2450bg-front.jpg",
    input: {
      spec: spec({ form: "undercounter_beverage", width: 24, glass: true }),
      appearance: stainless,
      state: state({ readouts: { ref: "41°" } }),
    },
  },
  {
    id: "deu2450bg-open",
    title: "DEU2450BG · door open",
    reference: "deu2450bg-front.jpg",
    input: {
      spec: spec({ form: "undercounter_beverage", width: 24, glass: true }),
      appearance: stainless,
      state: state({ readouts: { ref: "41°" }, doors: { ref_door_ajar: true } }),
    },
  },
  {
    id: "deu1550b",
    title: "DEU1550B · 15″ beverage center with a solid door",
    input: {
      spec: spec({ form: "undercounter_beverage", width: 15, glass: false }),
      appearance: stainless,
      state: state({ readouts: { ref: "38°" } }),
    },
  },
  {
    id: "deu2450wdz",
    title: "DEU2450WDZ · undercounter wine, two zones",
    reference: "deu2450wdz-front.jpg",
    input: {
      spec: spec({ form: "undercounter_wine", width: 24, glass: true, zones: 2 }),
      appearance: stainless,
      state: state({ readouts: { wine: "40°", wine2: "55°" } }),
    },
  },
  {
    id: "deu2450wdz-open",
    title: "DEU2450WDZ · door open",
    reference: "deu2450wdz-front.jpg",
    input: {
      spec: spec({ form: "undercounter_wine", width: 24, glass: true, zones: 2 }),
      appearance: stainless,
      state: state({ readouts: { wine: "40°", wine2: "55°" }, doors: { wine_door_ajar: true } }),
    },
  },
  {
    id: "cl3650ufd",
    title: "CL3650UFD · French door",
    reference: "cl3650ufd.jpg",
    input: {
      spec: spec({ form: "french_door", line: "classic", width: 36, ice: true, zones: 2 }),
      appearance: stainless,
      state: state({ readouts: { ref: "37°", frz: "0°" }, ice: { on: true, mode: "night" } }),
    },
  },
  {
    id: "cl3650ufd-open",
    title: "CL3650UFD · doors and drawer open",
    reference: "cl3650ufd.jpg",
    input: {
      spec: spec({ form: "french_door", line: "classic", width: 36, ice: true, zones: 2 }),
      appearance: stainless,
      state: state({ readouts: { ref: "37°", frz: "0°", crisp: "35°" }, doors: { ref_door_ajar: true, frz_door_ajar: true } }),
    },
  },
  {
    id: "cl3050u",
    title: "CL3050U · over-and-under",
    reference: "cl3050u.jpg",
    input: {
      spec: spec({ form: "over_under", line: "classic", width: 30, ice: true, zones: 2 }),
      appearance: stainless,
      state: state({ readouts: { ref: "38°", frz: "0°" }, ice: { on: false, mode: "off" } }),
    },
  },
  {
    id: "dec3050r",
    title: "DEC3050R · column refrigerator, panel-ready",
    reference: "dec3050r.jpg",
    input: {
      spec: spec({ form: "column_refrigerator", width: 30 }),
      appearance: panel(charcoalOak),
      state: state({ readouts: { ref: "37°" } }),
    },
  },
  {
    id: "dec2450fi",
    title: "DEC2450FI · column freezer with ice",
    reference: "dec2450fi.jpg",
    input: {
      spec: spec({ form: "column_freezer", width: 24, ice: true }),
      appearance: stainless,
      state: state({ readouts: { frz: "0°" }, ice: { on: true, mode: "on" } }),
    },
  },
  {
    id: "dec2450w",
    title: "DEC2450W · wine column, two zones",
    reference: "dec2450w.jpg",
    input: {
      spec: spec({ form: "column_wine", width: 24, glass: true, zones: 2 }),
      appearance: panel(charcoalOak),
      state: state({ readouts: { wine: "45°", wine2: "55°" } }),
    },
  },
  {
    id: "dec2450w-open",
    title: "DEC2450W · door open",
    reference: "dec2450w.jpg",
    input: {
      spec: spec({ form: "column_wine", width: 24, glass: true, zones: 2 }),
      appearance: panel(charcoalOak),
      state: state({ readouts: { wine: "45°", wine2: "55°" }, doors: { wine_door_ajar: true } }),
    },
  },
  {
    id: "det3650ci",
    title: "DET3650CI · tall over-and-under with ice",
    reference: "det3650ci.jpg",
    input: {
      spec: spec({ form: "tall_over_under", width: 36, ice: true, drawers: "freezer", zones: 2 }),
      appearance: panel(charcoalOak),
      state: state({ readouts: { ref: "38°", frz: "-2°" }, ice: { on: true, mode: "on" } }),
    },
  },
  {
    id: "det3650ci-drawer-open",
    title: "DET3650CI · freezer drawer open",
    reference: "det3650ci.jpg",
    input: {
      spec: spec({ form: "tall_over_under", width: 36, ice: true, drawers: "freezer", zones: 2 }),
      appearance: panel(charcoalOak),
      state: state({ readouts: { ref: "38°", frz: "-2°" }, ice: { on: true, mode: "on" }, doors: { frz_door_ajar: true } }),
    },
  },
  {
    id: "det3050r",
    title: "DET3050R · tall all-refrigerator",
    input: {
      spec: spec({ form: "tall_refrigerator", width: 30, drawers: "refrigerator", zones: 2 }),
      appearance: stainless,
      state: state({ readouts: { ref: "37°", ref2: "34°" } }),
    },
  },
  {
    id: "det3050fi",
    title: "DET3050FI · tall all-freezer with ice, door open",
    input: {
      spec: spec({ form: "tall_freezer", width: 30, drawers: "freezer", ice: true }),
      appearance: panel("#e9e6df"),
      state: state({ readouts: { frz: "0°" }, ice: { on: true, mode: "on" }, doors: { frz_door_ajar: true } }),
    },
  },
  {
    id: "deu3050dci",
    title: "DEU3050DCI · refrigerator/freezer drawers",
    reference: "deu3050dci.jpg",
    input: {
      spec: spec({ form: "undercounter_drawers", width: 30, drawers: "combination", ice: true, zones: 2 }),
      appearance: { ...stainless, handle: "pro" },
      state: state({ readouts: { ref: "36°", frz: "0°" }, ice: { on: true, mode: "on" } }),
    },
  },
  {
    id: "deu3050dci-open",
    title: "DEU3050DCI · refrigerator drawer open",
    reference: "deu3050dci.jpg",
    input: {
      spec: spec({ form: "undercounter_drawers", width: 30, drawers: "combination", ice: true, zones: 2 }),
      appearance: { ...stainless, handle: "pro" },
      state: state({ readouts: { ref: "36°", frz: "0°" }, ice: { on: true, mode: "on" }, doors: { ref_door_ajar: true } }),
    },
  },
  {
    id: "deu2450r",
    title: "DEU2450R · undercounter refrigerator",
    reference: "deu2450r.jpg",
    input: {
      spec: spec({ form: "undercounter_refrigerator", width: 24 }),
      appearance: panel(charcoalOak),
      state: state({ readouts: { ref: "37°" } }),
    },
  },
  {
    id: "deu2450r-open",
    title: "DEU2450R · door open",
    reference: "deu2450r.jpg",
    input: {
      spec: spec({ form: "undercounter_refrigerator", width: 24 }),
      appearance: panel(charcoalOak),
      state: state({ readouts: { ref: "37°" }, doors: { ref_door_ajar: true } }),
    },
  },
  {
    id: "deu1550i",
    title: "DEU1550I · ice maker, making ice",
    reference: "deu1550i.jpg",
    input: {
      spec: spec({ form: "ice_maker", width: 15, ice: true, zones: 0 }),
      appearance: stainless,
      state: state({ ice_maker: { making: true, paused: false, cleaning: false } }),
    },
  },
  {
    id: "deu1550i-open",
    title: "DEU1550I · door open, paused",
    reference: "deu1550i.jpg",
    input: {
      spec: spec({ form: "ice_maker", width: 15, ice: true, zones: 0 }),
      appearance: stainless,
      state: state({ ice_maker: { making: false, paused: true, cleaning: false }, doors: { ice_door_ajar: true } }),
    },
  },
  {
    id: "pro4850g",
    title: "PRO4850G · PRO 48 with glass door",
    reference: "pro4850g-front.jpg",
    input: {
      spec: spec({ form: "side_by_side", line: "pro", width: 48, glass: true, ice: true, zones: 2 }),
      appearance: { ...stainless, handle: "pro" },
      state: state({ readouts: { ref: "38°", frz: "0°" }, ice: { on: true, mode: "on" } }),
    },
  },
  {
    id: "det3050wci",
    title: "DET3050WCI · wine over refrigerator/freezer drawers",
    reference: "det3050w.jpg",
    input: {
      spec: spec({ form: "wine_over_drawers", width: 30, glass: true, drawers: "combination", ice: true, zones: 3 }),
      appearance: stainless,
      state: state({ readouts: { wine: "45°", wine2: "55°", ref: "38°", frz: "0°" }, ice: { on: true, mode: "on" } }),
    },
  },
  {
    id: "bi48sd-black",
    title: "BI-48SD · external dispenser, black finish",
    input: {
      spec: spec({ form: "side_by_side", line: "built_in", width: 48, dispenser: "external", ice: true, zones: 2 }),
      appearance: { ...stainless, finish: "black" },
      state: state({ readouts: { ref: "38°", frz: "0°" }, ice: { on: true, mode: "on" } }),
    },
  },
];
