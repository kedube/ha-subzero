import type { OvenState } from "../../src/drawings/types";
import type { Appearance, WallOvenSpec } from "../../src/types";
import type { GalleryVariant } from "../types";

const appearance: Appearance = {
  finish: "stainless",
  panel_color: null,
  knobs: "red",
  handle: "tubular",
  style: null,
  form: null,
};

const single = (style: WallOvenSpec["style"], series: WallOvenSpec["series"], knob: boolean): WallOvenSpec => ({
  family: "wall_oven",
  form: "single",
  width: 30,
  series,
  style,
  ovens: [{ prefix: "cav", position: "single", width: 30 }],
  knob,
  generic: false,
});

const double = (style: WallOvenSpec["style"], series: WallOvenSpec["series"], knob: boolean): WallOvenSpec => ({
  ...single(style, series, knob),
  form: "double",
  ovens: [
    { prefix: "cav", position: "upper", width: 30 },
    { prefix: "cav2", position: "lower", width: 30 },
  ],
});

const off: OvenState = {
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

const idle = { available: true, doors: {}, readouts: {} };

export const variants: GalleryVariant[] = [
  {
    id: "so3050pm",
    title: "M Series Professional single oven, off",
    reference: "so3050pm.jpg",
    input: { spec: single("professional", "m", true), appearance, state: { ...idle, ovens: { cav: off } } },
  },
  {
    id: "so3050pm-heating",
    title: "Preheating to Bake 350°, halfway",
    reference: "do3050pm-heating.jpg",
    input: {
      spec: single("professional", "m", true),
      appearance,
      state: {
        ...idle,
        ovens: { cav: { ...off, on: true, progress: 0.5, temp: "350°", mode: "Bake" } },
        display: "12:30",
      },
    },
  },
  {
    id: "so3050pm-light",
    title: "Off with the light on",
    input: {
      spec: single("professional", "m", true),
      appearance,
      state: { ...idle, ovens: { cav: { ...off, light: true } } },
    },
  },
  {
    id: "so3050pm-door-open",
    title: "Door open, light on",
    reference: "so3050pm-open.jpg",
    input: {
      spec: single("professional", "m", true),
      appearance,
      state: { ...idle, ovens: { cav: { ...off, door_open: true, light: true } } },
    },
  },
  {
    id: "so3050pm-open-baking",
    title: "Door open while baking at 350°, with the probe: the readout moves to the opening",
    input: {
      spec: single("professional", "m", true),
      appearance,
      state: {
        ...idle,
        ovens: { cav: { ...off, on: true, preheated: true, progress: 1, door_open: true, probe: true, temp: "350°", mode: "Bake" } },
      },
    },
  },
  {
    id: "do3050pm",
    title: "M Series Professional double oven, off",
    reference: "do3050pm.jpg",
    input: { spec: double("professional", "m", true), appearance, state: { ...idle, ovens: { cav: off, cav2: off } } },
  },
  {
    id: "do3050pm-both-on",
    title: "Upper preheated at Convection Roast 375° with the probe, lower preheating Bake 325°",
    input: {
      spec: double("professional", "m", true),
      appearance,
      state: {
        ...idle,
        ovens: {
          cav: { ...off, on: true, preheated: true, progress: 1, light: true, probe: true, temp: "375°", mode: "Conv Roast" },
          cav2: { ...off, on: true, progress: 0.3, remote_ready: true, temp: "325°", mode: "Bake" },
        },
      },
    },
  },
  {
    id: "do3050pm-upper-open",
    title: "Upper door open over the lower door, the lower oven baking",
    input: {
      spec: double("professional", "m", true),
      appearance,
      state: {
        ...idle,
        ovens: {
          cav: { ...off, door_open: true, light: true },
          cav2: { ...off, on: true, preheated: true, progress: 1, temp: "350°", mode: "Bake" },
        },
      },
    },
  },
  {
    id: "so3050tm",
    title: "M Series Transitional single oven",
    reference: "so3050tm.jpg",
    input: { spec: single("transitional", "m", false), appearance, state: { ...idle, ovens: { cav: off } } },
  },
  {
    id: "so3050cm",
    title: "M Series Contemporary single oven",
    reference: "so3050cm.jpg",
    input: { spec: single("contemporary", "m", false), appearance, state: { ...idle, ovens: { cav: off } } },
  },
  {
    id: "so3050pe",
    title: "E Series Professional single oven",
    reference: "so3050pe.jpg",
    input: { spec: single("professional", "e", false), appearance, state: { ...idle, ovens: { cav: off } } },
  },
  {
    id: "do3050te-lower-open",
    title: "E Series Transitional double oven, lower door open while the upper bakes",
    input: {
      spec: double("transitional", "e", false),
      appearance,
      state: {
        ...idle,
        ovens: {
          cav: { ...off, on: true, preheated: true, progress: 1, temp: "350°", mode: "Bake" },
          cav2: { ...off, door_open: true, light: true },
        },
      },
    },
  },
  {
    id: "wall-oven-black-finish",
    title: "M Series Professional in the black finish, black knobs",
    input: {
      spec: single("professional", "m", true),
      appearance: { ...appearance, finish: "black", knobs: "black" },
      state: { ...idle, ovens: { cav: { ...off, on: true, preheated: true, progress: 1, temp: "425°", mode: "Roast" } } },
    },
  },
  {
    id: "wall-oven-carbon-contemporary",
    title: "M Series Contemporary double oven, carbon strips, self-clean",
    input: {
      spec: double("contemporary", "m", false),
      appearance: { ...appearance, finish: "carbon" },
      state: {
        ...idle,
        ovens: { cav: { ...off, on: true, self_clean: true, temp: "880°", mode: "Self clean" }, cav2: off },
      },
    },
  },
  {
    id: "wall-oven-offline",
    title: "Offline",
    input: {
      spec: single("professional", "m", true),
      appearance,
      state: { available: false, doors: {}, readouts: {}, ovens: { cav: off } },
    },
  },
];
