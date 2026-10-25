import type { DrawingState } from "../drawings/types";
import type { HassEntity, HomeAssistant } from "../hass";
import type { Translate } from "../i18n";
import type { EntityDomain, PanelAppliance } from "../types";

/** Status pill colors; the card maps each to a theme-aware color. */
export type Tone = "neutral" | "accent" | "warm" | "amber" | "green" | "red" | "gray";

export interface StatusPill {
  text: string;
  tone: Tone;
}

/** One label/value row in the card's info panel. */
export interface InfoRow {
  label: string;
  value: string;
}

/** The amber digits on the card's display, with a small caption under them. */
export interface DisplayText {
  text: string;
  caption?: string | null;
}

/** What a family model reads an appliance through. `makeContext` in families/index.ts builds it. */
export interface ApplianceContext {
  appliance: PanelAppliance;
  hass: HomeAssistant;
  t: Translate;
  /** Milliseconds since the epoch, for countdowns and progress. */
  now: number;
  /** The entity id for a property key, trying the domains in order (any domain if none given). */
  entityId(key: string, ...domains: EntityDomain[]): string | undefined;
  /** The state object for a property key, trying the domains in order (any domain if none). */
  state(key: string, ...domains: EntityDomain[]): HassEntity | undefined;
  /**
   * When an entity last turned to `state` ("on" by default), in ms, from Home Assistant's
   * history. Synchronous: returns null until the history arrives, and the panel re-renders
   * when it does. Used for a dishwasher cycle's start.
   */
  since(entityId: string, state?: string): number | null;
  /**
   * The first temperature the panel saw since a cavity turned on, for the preheat ring's
   * start point; null when it hasn't seen one (the model then assumes room temperature).
   */
  preheatStart(prefix: "cav" | "cav2"): number | null;
}

/** How a control applies a new value; `applyAction` in actions.ts makes the service call. */
export type ControlAction =
  | { type: "climate_temperature"; entity_id: string }
  | { type: "climate_power"; entity_id: string }
  | { type: "number"; entity_id: string }
  | { type: "select"; entity_id: string }
  | { type: "switch"; entity_id: string }
  | { type: "button"; entity_id: string }
  | { type: "fan"; entity_id: string; speeds: number }
  | { type: "light"; entity_id: string }
  | { type: "service"; domain: string; service: string; data: Record<string, unknown> };

interface ControlBase {
  /** Stable within the view, e.g. the property key. */
  id: string;
  label: string;
  /** Disabled with a translated reason, e.g. a lock or an unavailable entity. */
  disabled?: boolean;
  reason?: string | null;
  /** Small secondary text under the control. */
  hint?: string | null;
}

export type Control =
  | (ControlBase & {
      kind: "setpoint";
      action: ControlAction;
      value: number | null;
      min: number;
      max: number;
      step: number;
      /** "°F" or "°C". */
      unit: string;
    })
  | (ControlBase & {
      kind: "select";
      action: ControlAction;
      value: string | null;
      /** `value` is what the entity takes; `label` is translated. */
      options: Array<{ value: string; label: string }>;
    })
  | (ControlBase & { kind: "toggle"; action: ControlAction; value: boolean | null })
  | (ControlBase & {
      kind: "action";
      action: ControlAction;
      /** Asked in the inline confirmation bar first; null acts at once. */
      confirm: string | null;
      /** The button's text, e.g. "Start". */
      button: string;
      tone?: "primary" | "danger";
    })
  | (ControlBase & {
      kind: "duration";
      action: ControlAction;
      /** Minutes. */
      value: number | null;
      min: number;
      max: number;
      presets: number[];
    })
  | (ControlBase & { kind: "fan"; action: ControlAction; value: number; speeds: number })
  | (ControlBase & {
      kind: "light";
      action: ControlAction;
      on: boolean;
      /** 0–100. */
      brightness: number | null;
      kelvin: number | null;
      min_kelvin: number;
      max_kelvin: number;
    })
  /** A read-only value, already formatted. */
  | (ControlBase & { kind: "reading"; value: string; tone?: "normal" | "warning" | "alert" })
  /** A read-only time left until an ISO timestamp, ticking. */
  | (ControlBase & { kind: "countdown"; end: string | null })
  /** The ice delay form, calling subzero.schedule_ice_delay. */
  | (ControlBase & { kind: "ice_delay"; device_id: string });

export interface Section {
  id: string;
  title: string;
  controls: Control[];
  /** Collapsed until opened, for settings and details. */
  collapsed?: boolean;
}

export interface FamilyModel {
  drawingState(ctx: ApplianceContext): DrawingState;
  status(ctx: ApplianceContext): StatusPill;
  /** Two or three rows for the overview card. */
  infoRows(ctx: ApplianceContext): InfoRow[];
  /** The card's display, only where the real appliance has one (ovens, dishwasher). */
  display(ctx: ApplianceContext): DisplayText | null;
  /** The full view's sections, everyday controls first. */
  sections(ctx: ApplianceContext): Section[];
}
