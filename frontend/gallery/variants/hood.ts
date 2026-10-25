import type { DrawingState } from "../../src/drawings/types";
import type { Appearance, HoodSpec } from "../../src/types";
import type { GalleryVariant } from "../types";

const appearance: Appearance = {
  finish: "stainless",
  panel_color: null,
  knobs: "red",
  handle: "tubular",
  style: null,
  form: null,
};

const hood = (form: HoodSpec["form"], width: number | null = 36): HoodSpec => ({
  family: "hood",
  form,
  width,
  generic: false,
});

type HoodState = NonNullable<DrawingState["hood"]>;
const off: HoodState = { fan: 0, light: false, brightness: 100, kelvin: 3500, halo: false };
const state = (hoodState: Partial<HoodState> = {}, available = true): DrawingState => ({
  available,
  doors: {},
  readouts: {},
  hood: { ...off, ...hoodState },
});

export const variants: GalleryVariant[] = [
  {
    id: "hood-wall",
    title: "Pro wall chimney hood, 36″, off",
    reference: "vwc3650p.jpg",
    input: { spec: hood("wall"), appearance, state: state() },
  },
  {
    id: "hood-wall-light-warm",
    title: "Task light at 2700 K, 100%",
    input: { spec: hood("wall"), appearance, state: state({ light: true, brightness: 100, kelvin: 2700 }) },
  },
  {
    id: "hood-wall-light-cool",
    title: "Task light at 5000 K, 60%",
    input: { spec: hood("wall"), appearance, state: state({ light: true, brightness: 60, kelvin: 5000 }) },
  },
  {
    id: "hood-wall-fan-3",
    title: "Fan on speed 3: vapor drawn up into the baffles, the paddle turned",
    input: { spec: hood("wall"), appearance, state: state({ fan: 3 }) },
  },
  {
    id: "hood-wall-halo",
    title: "Halo on, task light off",
    input: { spec: hood("wall"), appearance, state: state({ halo: true }) },
  },
  {
    id: "hood-wall-48-unknown",
    title: "A 48″ hood whose form isn't known, fan 1 and light at 3500 K",
    input: { spec: hood("hood", 48), appearance, state: state({ fan: 1, light: true, brightness: 80 }) },
  },
  {
    id: "hood-wall-30-light",
    title: "A 30″ wall hood, light at 4000 K: its two lights outboard of the knobs",
    input: { spec: hood("wall", 30), appearance, state: state({ light: true, brightness: 70, kelvin: 4000 }) },
  },
  {
    id: "hood-island",
    title: "Pro island hood, 36″, with its chimney",
    reference: "vi3650p.jpg",
    input: { spec: hood("island"), appearance, state: state() },
  },
  {
    id: "hood-insert",
    title: "Pro hood liner in a custom surround, light on",
    reference: "vl362250p.jpg",
    input: { spec: hood("insert"), appearance, state: state({ light: true, brightness: 90, kelvin: 4000, fan: 2 }) },
  },
  {
    id: "hood-offline",
    title: "Offline, width unknown",
    input: { spec: hood("wall", null), appearance, state: state({}, false) },
  },
];
