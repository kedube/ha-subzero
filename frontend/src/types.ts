/**
 * What the integration's websocket API sends the panel.
 *
 * `custom_components/subzero/panel_api.py` builds these, and `appliance_spec.py` builds the
 * `spec`. Keep the two sides in step: this file is the contract.
 *
 * Commands:
 * - `{type: "subzero/panel/subscribe"}`: any user. Replies with a result, then sends a
 *   `PanelMessage` event at once and again whenever anything in it changes.
 * - `{type: "subzero/panel/set_appearance", appliance_id, appearance}`: admins only.
 *   `appearance` is a partial `Appearance`; a field set to null returns to its default, and
 *   `appearance: null` resets them all. Replies with `{appearance}` (the effective one).
 */

export type Brand = "Sub-Zero" | "Wolf" | "Cove";

export type Family = "refrigeration" | "range" | "wall_oven" | "hood" | "dishwasher" | "generic";

export type RefrigerationForm =
  | "side_by_side"
  | "french_door"
  | "over_under"
  | "column_refrigerator"
  | "column_freezer"
  | "column_wine"
  | "tall_refrigerator"
  | "tall_freezer"
  | "tall_over_under"
  | "wine_over_drawers"
  | "undercounter_refrigerator"
  | "undercounter_beverage"
  | "undercounter_wine"
  | "undercounter_drawers"
  | "ice_maker";

/**
 * The product line, which sets the styling: Classic and PRO have an exposed top grille,
 * Designer and Integrated are flush. `built_in` is the older BI series (Classic's
 * predecessor), `integrated` the older IC/IT/ID/IW series (Designer's predecessor).
 */
export type RefrigerationLine = "classic" | "designer" | "pro" | "built_in" | "integrated" | null;

export interface RefrigerationSpec {
  family: "refrigeration";
  form: RefrigerationForm;
  line: RefrigerationLine;
  /** Inches, from the model number; null when unknown. */
  width: number | null;
  /** Glass door(s), e.g. CL3650UG, PRO3650G, beverage centers, wine storage. */
  glass: boolean;
  /** "external" is through the freezer door (D), "internal" inside the refrigerator (ID). */
  dispenser: "none" | "external" | "internal";
  /** Has an ice maker. */
  ice: boolean;
  /** What the drawers hold on drawer units and wine-over-drawer units. */
  drawers: "refrigerator" | "freezer" | "combination" | null;
  /** Temperature zones the appliance reports (setpoint keys present). */
  zones: number;
  /** Outdoor-rated undercounter models (DEU…O). */
  outdoor: boolean;
  /** True when the form came from properties or the series, not a recognized model. */
  generic: boolean;
}

export type RangetopSurface = "griddle" | "double_griddle" | "charbroiler" | "french_top";

export interface OvenSlot {
  /** The cavity's property prefix. */
  prefix: "cav" | "cav2";
  /** Ranges: left and right; wall ovens: upper and lower; one cavity: single. */
  position: "left" | "right" | "upper" | "lower" | "single";
  /** Nominal oven width in inches (e.g. 30 and 18 on a 48″ range); null when unknown. */
  width: number | null;
}

export interface RangeSpec {
  family: "range";
  form: "range";
  width: number | null;
  fuel: "dual_fuel" | "induction" | "gas";
  /** Burners, or induction zones. */
  burners: number;
  /** Rangetop surfaces besides the burners, left to right as on the model. */
  surfaces: RangetopSurface[];
  /**
   * Ovens left to right. 30″ and 36″ ranges have one; 48″ have two with the larger on the
   * right (`cav`, "Right oven"); 60″ have two of the same size.
   */
  ovens: OvenSlot[];
  style: "professional" | "transitional" | null;
  generic: boolean;
}

export interface WallOvenSpec {
  family: "wall_oven";
  form: "single" | "double";
  width: number | null;
  /** Wolf L, E, or M series. */
  series: "l" | "e" | "m" | null;
  style: "professional" | "transitional" | "contemporary" | null;
  /** Ovens top to bottom. */
  ovens: OvenSlot[];
  /** Has a control knob (the integration's KNOB_OVEN_TYPES). */
  knob: boolean;
  generic: boolean;
}

export interface HoodSpec {
  family: "hood";
  form: "wall" | "island" | "insert" | "hood";
  width: number | null;
  generic: boolean;
}

export interface DishwasherSpec {
  family: "dishwasher";
  form: "dishwasher";
  width: number | null;
  /**
   * The front when the model tells; null otherwise. No Cove model does: the DW2450 and the
   * DW2450WS (WS is its water softener) both take a custom panel or the stainless door kit,
   * so the Appearance setting decides.
   */
  front: "panel" | "stainless" | null;
  generic: boolean;
}

/** An appliance whose family couldn't be told from its model or properties. */
export interface GenericSpec {
  family: "generic";
  form: "refrigerator" | "wine" | "ice_maker" | "oven" | "hood" | "dishwasher" | "appliance";
  width: number | null;
  generic: true;
}

export type ApplianceSpec =
  | RefrigerationSpec
  | RangeSpec
  | WallOvenSpec
  | HoodSpec
  | DishwasherSpec
  | GenericSpec;

export type Finish = "stainless" | "panel" | "black" | "carbon" | "white";
export type KnobColor = "red" | "black" | "stainless";
export type HandleStyle = "tubular" | "pro" | "none";

/**
 * How an appliance is drawn, set per appliance by an admin. Defaults: stainless, red knobs,
 * tubular handles (pro handles on PRO refrigeration).
 */
export interface Appearance {
  finish: Finish;
  /** "#rrggbb" for a panel-ready front (finish "panel"); null otherwise. */
  panel_color: string | null;
  /** Ranges and knob wall ovens. */
  knobs: KnobColor;
  /** Refrigeration and dishwashers. */
  handle: HandleStyle;
  /** Wall ovens: overrides the style from the model number. */
  style: "professional" | "transitional" | "contemporary" | null;
  /** Overrides the detected form with another form of the same family; null keeps it. */
  form: string | null;
}

/** The values the Appearance editor offers for this appliance; null hides a field. */
export interface AppearanceOptions {
  finish: Finish[];
  panel_colors: string[];
  knobs: KnobColor[] | null;
  handle: HandleStyle[] | null;
  style: Array<"professional" | "transitional" | "contemporary"> | null;
  forms: string[];
}

export type EntityDomain =
  | "sensor"
  | "binary_sensor"
  | "number"
  | "select"
  | "switch"
  | "climate"
  | "button"
  | "fan"
  | "light"
  | "event";

/**
 * Entity ids by property key, then domain, e.g. `{"ref_set_temp": {"number": "number.…",
 * "climate": "climate.…", "sensor": "sensor.…"}}`. Keys are the part of each entity's unique id
 * after the appliance id (`<appliance_id>_<key>`), so buttons appear under their own keys
 * (`remote_start_cav_unit_on`, `cancel_wash_cycle`, …), the faults sensor under `active_faults`,
 * and the event entity under `appliance_event`. Disabled entities are left out.
 */
export type EntityMap = Record<string, Partial<Record<EntityDomain, string>>>;

/** Why a control is locked, from `control_lock()` in controls.py. */
export type LockCode =
  | "sabbath"
  | "self_clean"
  | "proof_light"
  | "wash_not_idle"
  | "cycle_no_option"
  | "delay_not_idle"
  | "cycle_no_delay";

export interface PanelAppliance {
  /** Home Assistant device registry id; the panel's route uses it. */
  device_id: string;
  /** Sub-Zero's id for the appliance; set_appearance takes it. */
  appliance_id: string;
  entry_id: string;
  /** The integration's name for it; the panel prefers the device registry's name. */
  name: string;
  brand: Brand;
  model: string | null;
  appliance_type: string | null;
  /** False while the appliance can't be reached. */
  available: boolean;
  /** The effective spec: detection, then the Appearance form override. */
  spec: ApplianceSpec;
  /** The form detection found, before any override. */
  detected_form: string;
  /** The effective Appearance, defaults filled in. */
  appearance: Appearance;
  appearance_options: AppearanceOptions;
  entities: EntityMap;
  /** Lock reasons by property key, only for keys with entities on this appliance. */
  locks: Partial<Record<string, LockCode>>;
}

export interface PanelMessage {
  appliances: PanelAppliance[];
}
