import type { TemplateResult } from "lit";
import type { Translate } from "../i18n";
import type { Appearance, ApplianceSpec } from "../types";

/**
 * Everything a drawing needs. Drawings are pure: the same input gives the same picture, so
 * the gallery can render any state without Home Assistant.
 */
export interface DrawingInput {
  /**
   * Unique per rendered drawing. Prefix every SVG id (gradients, filters, clip paths,
   * masks) with it: several drawings share one shadow root, and duplicate ids resolve to the
   * wrong definition.
   */
  uid: string;
  spec: ApplianceSpec;
  appearance: Appearance;
  state: DrawingState;
  /** The page theme. The appliance looks the same in both; only the floor shadow adapts. */
  theme: "light" | "dark";
  /**
   * The panel's translator, for everything a drawing says: its screen-reader description and
   * the words on a range's touchscreen. Legends printed on the appliance stay as Wolf prints them.
   */
  t: Translate;
  /** Skip transitions and animations. */
  reducedMotion?: boolean;
  /**
   * The height in CSS pixels the drawing is shown at, when the caller knows it. Drawings size
   * their UI overlays (zone readouts, timers) from it, so a label is the same size on screen on
   * a small card and in the large full view (about 12 px text). Without it, they use a share
   * of the drawing's own height.
   */
  pixelHeight?: number;
}

export interface OvenState {
  /** The cavity is on (`cav_unit_on`). */
  on: boolean;
  /** At the setpoint (`cav_at_set_temp`). */
  preheated: boolean;
  /** Preheat progress from 0 to 1; null while off or unknown. */
  progress: number | null;
  light: boolean;
  door_open: boolean;
  probe: boolean;
  remote_ready: boolean;
  self_clean: boolean;
  /** The cavity temperature, formatted (e.g. "350°"), only while on; null while off. */
  temp: string | null;
  /** The translated cooking mode (e.g. "Bake"), only while on. */
  mode: string | null;
}

export interface DrawingState {
  /** False while the appliance can't be reached: draw it desaturated. */
  available: boolean;
  /** Door and drawer open flags by property key, e.g. `{ref_door_ajar: true}`. */
  doors: Record<string, boolean>;
  /**
   * Zone readouts by zone prefix (ref, ref2, frz, crisp, wine, wine2), already formatted
   * (e.g. "38°"). Drawn as small frosted labels over each zone, not as part of the appliance.
   */
  readouts: Record<string, string>;
  ice?: { on: boolean; mode: "off" | "on" | "max" | "night" };
  sabbath?: boolean;
  /** Ovens by property prefix. */
  ovens?: Partial<Record<"cav" | "cav2", OvenState>>;
  /** What an oven's or range's display shows besides the cavities, e.g. a kitchen timer "4:12". */
  display?: string | null;
  dishwasher?: {
    status: "idle" | "running" | "paused" | "canceling" | "drying" | "done" | "delayed" | "error";
    /** Cycle progress from 0 to 1; null when unknown. */
    progress: number | null;
    remote_ready: boolean;
    door_open: boolean;
    rinse_aid_low: boolean;
    softener_low: boolean;
    /** Time left or the delay countdown, formatted. */
    display: string | null;
  };
  hood?: {
    /** Fan speed 0–4. */
    fan: number;
    light: boolean;
    /** Light brightness 0–100. */
    brightness: number;
    /** White temperature in kelvin, 2700–5000; null when the hood has no color control. */
    kelvin: number | null;
    halo: boolean;
  };
  ice_maker?: { making: boolean; paused: boolean; cleaning: boolean };
}

/**
 * Draws an appliance as an `html` template holding one `<svg>` with a viewBox in true
 * proportions (1 unit = 0.1 inch). Returns null when it can't draw this spec, so the caller
 * falls back to the generic drawing.
 */
export type DrawingRenderer = (input: DrawingInput) => TemplateResult | null;
