import type { DrawingState, OvenState } from "../../src/drawings/types";
import type { Appearance, GenericSpec } from "../../src/types";
import type { GalleryVariant } from "../types";

// The generic drawings, shown when nothing is known about an appliance but its type.
const appearance: Appearance = {
  finish: "stainless",
  panel_color: null,
  knobs: "red",
  handle: "tubular",
  style: null,
  form: null,
};

const spec = (form: GenericSpec["form"], width: number | null = null): GenericSpec => ({
  family: "generic",
  form,
  width,
  generic: true,
});

const idle: DrawingState = { available: true, doors: {}, readouts: {} };

const oven = (on: boolean, extra: Partial<OvenState> = {}): OvenState => ({
  on,
  preheated: false,
  progress: on ? 0.7 : null,
  light: false,
  door_open: false,
  probe: false,
  remote_ready: false,
  self_clean: false,
  temp: on ? "350°" : null,
  mode: on ? "Bake" : null,
  ...extra,
});

const variant = (
  id: string,
  title: string,
  form: GenericSpec["form"],
  state: DrawingState = idle,
  width: number | null = null,
): GalleryVariant => ({ id, title, input: { spec: spec(form, width), appearance, state } });

export const variants: GalleryVariant[] = [
  variant("generic-refrigerator", "Refrigerator (36″ over-and-under)", "refrigerator", {
    ...idle,
    readouts: { ref: "38°", frz: "0°" },
  }),
  variant("generic-refrigerator-column", "Refrigerator, 24″ column, door open", "refrigerator", {
    ...idle,
    doors: { ref_door_ajar: true },
  }, 24),
  variant("generic-refrigerator-wide", "Refrigerator, 48″ side-by-side", "refrigerator", idle, 48),
  variant("generic-refrigerator-wide-open", "Side-by-side, both doors open", "refrigerator", {
    ...idle,
    doors: { ref_door_ajar: true, frz_door_ajar: true },
    readouts: { ref: "38°", frz: "0°" },
  }, 48),
  variant("generic-refrigerator-open", "Over-and-under, door and freezer drawer open", "refrigerator", {
    ...idle,
    doors: { ref_door_ajar: true, frz_door_ajar: true },
    readouts: { ref: "38°", frz: "0°" },
  }),
  variant("generic-wine", "Wine storage (24″ undercounter)", "wine", { ...idle, readouts: { wine: "55°", wine2: "45°" } }),
  variant("generic-wine-open", "Wine storage, door open", "wine", {
    ...idle,
    doors: { wine_door_ajar: true },
    readouts: { wine: "55°", wine2: "45°" },
  }),
  variant("generic-wine-column", "Wine storage, 30″ column", "wine", idle, 30),
  variant("generic-ice-maker", "Ice maker (15″)", "ice_maker"),
  variant("generic-ice-maker-open", "Ice maker, door open", "ice_maker", { ...idle, doors: { ice_door_ajar: true } }),
  variant("generic-oven", "Oven (30″ wall oven)", "oven"),
  variant("generic-oven-on", "Oven heating, light on", "oven", { ...idle, ovens: { cav: oven(true, { light: true }) } }),
  variant("generic-oven-double", "Double oven, lower heating", "oven", {
    ...idle,
    ovens: { cav: oven(false), cav2: oven(true, { temp: "425°" }) },
  }),
  variant("generic-hood", "Ventilation hood (36″ chimney)", "hood"),
  variant("generic-hood-light", "Hood, light on, warm white", "hood", {
    ...idle,
    hood: { fan: 2, light: true, brightness: 80, kelvin: 2900, halo: false },
  }),
  variant("generic-dishwasher", "Dishwasher (24″)", "dishwasher"),
  variant("generic-dishwasher-running", "Dishwasher running", "dishwasher", {
    ...idle,
    dishwasher: {
      status: "running",
      progress: 0.55,
      remote_ready: false,
      door_open: false,
      rinse_aid_low: true,
      softener_low: false,
      display: "0:48",
    },
  }),
  variant("generic-appliance", "Appliance of unknown type", "appliance"),
  variant("generic-offline", "Refrigerator offline", "refrigerator", { ...idle, available: false }),
];
