import type { OvenState } from "../../src/drawings/types";
import type { Appearance, KnobColor, OvenSlot, RangeSpec, RangetopSurface } from "../../src/types";
import type { GalleryVariant } from "../types";

// Wolf ranges. Reference photos (render.mjs --refs) are the product pages' front views,
// cropped to the range, kept outside the repository.

function spec(
  width: number,
  burners: number,
  surfaces: RangetopSurface[] = [],
  fuel: RangeSpec["fuel"] = "dual_fuel",
): RangeSpec {
  const ovens: OvenSlot[] =
    width >= 48
      ? [
          { prefix: "cav2", position: "left", width: width >= 60 ? 30 : 18 },
          { prefix: "cav", position: "right", width: 30 },
        ]
      : [{ prefix: "cav", position: "single", width }];
  return {
    family: "range",
    form: "range",
    width,
    fuel,
    burners,
    surfaces,
    ovens,
    style: fuel === "induction" ? "transitional" : "professional",
    generic: false,
  };
}

function appearance(knobs: KnobColor = "red"): Appearance {
  return { finish: "stainless", panel_color: null, knobs, handle: "pro", style: null, form: null };
}

const OFF: OvenState = {
  on: false,
  preheated: false,
  progress: null,
  light: false,
  door_open: false,
  probe: false,
  remote_ready: false,
  self_clean: false,
  temp: null,
  mode: null,
};

const oven = (changes: Partial<OvenState>): OvenState => ({ ...OFF, ...changes });

function state(
  ovens: { cav?: Partial<OvenState>; cav2?: Partial<OvenState> } = {},
  extra: { available?: boolean; display?: string | null } = {},
) {
  return {
    available: extra.available ?? true,
    doors: {},
    readouts: {},
    ovens: { cav: oven(ovens.cav ?? {}), cav2: oven(ovens.cav2 ?? {}) },
    display: extra.display ?? null,
  };
}

const DF48850 = spec(48, 8);

export const variants: GalleryVariant[] = [
  {
    id: "df48850sp",
    title: "DF48850/S/P, everything off",
    input: { spec: DF48850, appearance: appearance(), state: state() },
    reference: "df48850sp-front.jpg",
  },
  {
    id: "df48850sp-right-heating",
    title: "Right oven preheating to Bake 350°, 60%",
    input: {
      spec: DF48850,
      appearance: appearance(),
      state: state({ cav: { on: true, progress: 0.6, temp: "350°", mode: "Bake" } }),
    },
    reference: "df48850sp-front.jpg",
  },
  {
    id: "df48850sp-both-on",
    title: "Left oven preheated (Convection 325°), right oven roasting",
    input: {
      spec: DF48850,
      appearance: appearance(),
      state: state({
        cav2: { on: true, preheated: true, progress: 1, temp: "325°", mode: "Convection" },
        cav: { on: true, progress: 0.3, temp: "400°", mode: "Roast" },
      }),
    },
  },
  {
    id: "df48850sp-door-open",
    title: "Right oven door open (light comes on)",
    input: {
      spec: DF48850,
      appearance: appearance(),
      state: state({ cav: { door_open: true, light: true } }),
    },
  },
  {
    id: "df48850sp-light",
    title: "Right oven light on, oven off",
    input: { spec: DF48850, appearance: appearance(), state: state({ cav: { light: true } }) },
  },
  {
    id: "df48850sp-black-knobs",
    title: "Black knobs",
    input: { spec: DF48850, appearance: appearance("black"), state: state() },
  },
  {
    id: "df48850sp-stainless-knobs",
    title: "Brushed stainless knobs",
    input: { spec: DF48850, appearance: appearance("stainless"), state: state() },
  },
  {
    id: "df48850sp-timer",
    title: "Kitchen timer 4:12",
    input: { spec: DF48850, appearance: appearance(), state: state({}, { display: "4:12" }) },
  },
  {
    id: "df48850sp-offline",
    title: "Offline",
    input: { spec: DF48850, appearance: appearance(), state: state({}, { available: false }) },
  },
  {
    id: "df48850sp-probe-remote",
    title: "Right oven cooking with the probe, left oven in Remote Ready",
    input: {
      spec: DF48850,
      appearance: appearance(),
      state: state({
        cav: { on: true, preheated: true, progress: 1, temp: "375°", mode: "Conv Roast", probe: true, light: true },
        cav2: { remote_ready: true },
      }),
    },
  },
  {
    id: "df48850sp-self-clean",
    title: "Right oven self-cleaning",
    input: {
      spec: DF48850,
      appearance: appearance(),
      state: state({ cav: { on: true, self_clean: true, temp: "880°", mode: "Clean" } }),
    },
  },
  {
    id: "df48850sp-left-door-open",
    title: "Left oven door open while the right oven bakes",
    input: {
      spec: DF48850,
      appearance: appearance(),
      state: state({
        cav2: { door_open: true, light: true },
        cav: { on: true, preheated: true, progress: 1, temp: "350°", mode: "Bake" },
      }),
    },
  },
  {
    id: "df30450",
    title: "DF30450/S/P, 30″, four burners",
    input: { spec: spec(30, 4), appearance: appearance(), state: state() },
    reference: "df30450-front.jpg",
  },
  {
    id: "df36650",
    title: "DF36650/S/P, 36″, six burners",
    input: { spec: spec(36, 6), appearance: appearance(), state: state() },
    reference: "df36650-front.jpg",
  },
  {
    id: "df36450g",
    title: "DF36450G/S/P, four burners and griddle",
    input: { spec: spec(36, 4, ["griddle"]), appearance: appearance(), state: state() },
    reference: "df36450g-front.jpg",
  },
  {
    id: "df48450cg",
    title: "DF48450CG/S/P, four burners, charbroiler and griddle",
    input: { spec: spec(48, 4, ["griddle", "charbroiler"]), appearance: appearance(), state: state() },
    reference: "df48450cg-front.jpg",
  },
  {
    id: "df48450dg",
    title: "DF48450DG/S/P, four burners and double griddle",
    input: { spec: spec(48, 4, ["double_griddle"]), appearance: appearance(), state: state() },
  },
  {
    id: "df48450f",
    title: "DF48450F/S/P, four burners and French top",
    input: { spec: spec(48, 4, ["french_top"]), appearance: appearance(), state: state() },
    reference: "df48450f-front.jpg",
  },
  {
    id: "df60650cg",
    title: "DF60650CG/S/P, 60″, two equal ovens",
    input: { spec: spec(60, 6, ["griddle", "charbroiler"]), appearance: appearance(), state: state() },
    reference: "df60650cg-front.jpg",
  },
  {
    id: "df60650cg-both-on",
    title: "60″, both ovens baking, timer running",
    input: {
      spec: spec(60, 6, ["griddle", "charbroiler"]),
      appearance: appearance(),
      state: state(
        {
          cav2: { on: true, preheated: true, progress: 1, temp: "350°", mode: "Bake", light: true },
          cav: { on: true, progress: 0.45, temp: "425°", mode: "Roast" },
        },
        { display: "12:30" },
      ),
    },
  },
  {
    id: "ir36550",
    title: "IR36550/S/T, 36″ induction, transitional",
    input: { spec: spec(36, 5, [], "induction"), appearance: appearance(), state: state() },
    reference: "ir36550st-front.jpg",
  },
  {
    id: "ir36550-heating",
    title: "Induction oven preheating, 80%",
    input: {
      spec: spec(36, 5, [], "induction"),
      appearance: appearance(),
      state: state({ cav: { on: true, progress: 0.8, temp: "375°", mode: "Bake" } }),
    },
  },
  {
    id: "ir36550-probe-remote",
    title: "Induction oven roasting with the probe, Remote Ready on",
    input: {
      spec: spec(36, 5, [], "induction"),
      appearance: appearance(),
      state: state({
        cav: { on: true, preheated: true, progress: 1, temp: "325°", mode: "Roast", probe: true, remote_ready: true },
      }),
    },
  },
  {
    id: "ir36550-door-open",
    title: "Induction oven door open",
    input: {
      spec: spec(36, 5, [], "induction"),
      appearance: appearance(),
      state: state({ cav: { door_open: true, light: true } }),
    },
  },
  {
    id: "df30450-light-heating",
    title: "30″ oven preheating with the light on",
    input: {
      spec: spec(30, 4),
      appearance: appearance(),
      state: state({ cav: { on: true, progress: 0.35, temp: "450°", mode: "Stone", light: true } }),
    },
  },
];
