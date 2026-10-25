import type { DrawingState } from "../../src/drawings/types";
import type { Appearance, DishwasherSpec } from "../../src/types";
import type { GalleryVariant } from "../types";

// The owner's Cove DW2450 (it takes a custom panel), and the stainless door panel kit that both
// Cove models accept. Reference photos are Cove's own product images, kept out of the repo.
const spec: DishwasherSpec = { family: "dishwasher", form: "dishwasher", width: 24, front: "panel", generic: false };

const stainless: Appearance = {
  finish: "stainless",
  panel_color: null,
  knobs: "red",
  handle: "pro",
  style: null,
  form: null,
};

const panel = (color: string): Appearance => ({ ...stainless, finish: "panel", panel_color: color, handle: "tubular" });

type Dishwasher = NonNullable<DrawingState["dishwasher"]>;

const idle: Dishwasher = {
  status: "idle",
  progress: null,
  remote_ready: false,
  door_open: false,
  rinse_aid_low: false,
  softener_low: false,
  display: null,
};

const state = (dishwasher: Partial<Dishwasher> = {}, available = true): DrawingState => ({
  available,
  doors: { door_ajar: !!dishwasher.door_open },
  readouts: {},
  dishwasher: { ...idle, ...dishwasher },
});

export const variants: GalleryVariant[] = [
  {
    id: "dw2450-stainless",
    title: "Stainless door, pro handle",
    input: { spec, appearance: stainless, state: state() },
    reference: "dw2450-stainless-pro.jpg",
  },
  {
    id: "dw2450-stainless-tubular",
    title: "Stainless door, tubular handle",
    input: { spec, appearance: { ...stainless, handle: "tubular" }, state: state() },
    reference: "dw2451-stainless-tubular.jpg",
  },
  {
    id: "dw2450-panel",
    title: "White custom panel",
    input: { spec, appearance: panel("#f2f1ed"), state: state() },
    reference: "dw2451-panel-tubular.jpg",
  },
  {
    id: "dw2450-panel-walnut",
    title: "Walnut custom panel",
    input: { spec, appearance: panel("#5d4030"), state: state() },
    reference: "dw2451-panel-tubular.jpg",
  },
  {
    id: "dw2450-panel-navy",
    title: "Navy custom panel, pro handle",
    input: { spec, appearance: { ...panel("#2e3a4f"), handle: "pro" }, state: state() },
  },
  {
    id: "dw2450-door-open",
    title: "Door open",
    input: { spec, appearance: stainless, state: state({ door_open: true }) },
    reference: "dw2450-door-open.jpg",
  },
  {
    id: "dw2450-door-open-panel",
    title: "Door open, walnut panel",
    input: { spec, appearance: panel("#5d4030"), state: state({ door_open: true, status: "paused", display: "0:48" }) },
  },
  {
    id: "dw2450-running",
    title: "Running, 1:12 left",
    input: { spec, appearance: stainless, state: state({ status: "running", progress: 0.4, display: "1:12" }) },
  },
  {
    id: "dw2450-drying",
    title: "Drying, white panel",
    input: { spec, appearance: panel("#f2f1ed"), state: state({ status: "drying", progress: 0.92, display: "0:09" }) },
  },
  {
    id: "dw2450-delayed",
    title: "Delayed start",
    input: { spec, appearance: stainless, state: state({ status: "delayed", display: "3:00", remote_ready: true }) },
  },
  {
    id: "dw2450-done",
    title: "Done",
    input: { spec, appearance: stainless, state: state({ status: "done", progress: 1 }) },
  },
  {
    id: "dw2450-remote-ready",
    title: "Remote Ready",
    input: { spec, appearance: panel("#f2f1ed"), state: state({ remote_ready: true }) },
  },
  {
    id: "dw2450-warnings",
    title: "Rinse aid and softener salt low",
    input: { spec, appearance: stainless, state: state({ rinse_aid_low: true, softener_low: true }) },
  },
  {
    id: "dw2450-error",
    title: "Error",
    input: { spec, appearance: stainless, state: state({ status: "error" }) },
  },
  {
    id: "dw2450-stainless-no-handle",
    title: "Stainless door, handle set to none (the kit always has one)",
    input: { spec, appearance: { ...stainless, handle: "none" }, state: state() },
  },
  {
    id: "dw2450-offline",
    title: "Offline",
    input: { spec, appearance: stainless, state: state({}, false) },
  },
];
