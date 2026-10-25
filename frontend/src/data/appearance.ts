import type {
  Appearance,
  AppearanceOptions,
  ApplianceSpec,
  OvenSlot,
  PanelAppliance,
  WallOvenSpec,
} from "../types";

const FIELDS: ReadonlyArray<keyof Appearance> = [
  "finish",
  "panel_color",
  "knobs",
  "handle",
  "style",
  "form",
];

export function sameAppearance(a: Appearance, b: Appearance): boolean {
  return FIELDS.every((field) => a[field] === b[field]);
}

/** A "#rrggbb" color, as the Appearance store takes it. */
export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

// The integration's panel colors (PANEL_COLORS in panel_api.py), by the name the editor gives them.
const PANEL_COLOR_NAMES: Record<string, string> = {
  "#f4f2ec": "white",
  "#ece4d2": "cream",
  "#9aa0a6": "gray",
  "#2f3b52": "navy",
  "#9caf88": "sage",
  "#1f2022": "black",
  "#5b3a29": "walnut",
  "#b08955": "oak",
};

/** The name of one of the integration's panel colors ("sage"), for its `panel_color.*` text; null for any other. */
export function panelColorName(color: string): string | null {
  return PANEL_COLOR_NAMES[color.toLowerCase()] ?? null;
}

/**
 * The fields to send to `subzero/panel/set_appearance`: only those that changed, and only
 * those the appliance offers, since the integration checks each against the family.
 */
export function appearanceChanges(
  saved: Appearance,
  pending: Appearance,
  options: AppearanceOptions,
): Partial<Appearance> {
  const offered = new Set<keyof Appearance>();
  const finishes = options.finish ?? [];
  if (finishes.length) offered.add("finish");
  if (finishes.includes("panel")) offered.add("panel_color");
  if (options.knobs) offered.add("knobs");
  if (options.handle) offered.add("handle");
  if (options.style) offered.add("style");
  if (options.forms?.length) offered.add("form");
  const changes: Partial<Record<keyof Appearance, unknown>> = {};
  for (const field of FIELDS) {
    if (offered.has(field) && pending[field] !== saved[field]) changes[field] = pending[field];
  }
  return changes as Partial<Appearance>;
}

/** The forms the editor offers, the detected one first if the list somehow lacks it. */
export function formChoices(appliance: PanelAppliance): string[] {
  const forms = appliance.appearance_options?.forms ?? [];
  return forms.includes(appliance.detected_form) ? [...forms] : [appliance.detected_form, ...forms];
}

/**
 * The spec the preview draws with a pending form: the detected form when the form override is
 * cleared. A wall oven's cavities follow its form, as they do when the integration applies it.
 */
export function previewSpec(appliance: PanelAppliance, appearance: Appearance): ApplianceSpec {
  const spec = appliance.spec;
  const form = appearance.form ?? appliance.detected_form;
  if (spec.form === form) return spec;
  if (spec.family === "wall_oven" && (form === "single" || form === "double")) {
    return wallOvenAs(spec, form);
  }
  // The form comes from appearance_options.forms, which only lists this family's forms.
  return { ...spec, form } as ApplianceSpec;
}

function wallOvenAs(spec: WallOvenSpec, form: "single" | "double"): WallOvenSpec {
  const first: OvenSlot = spec.ovens[0] ?? { prefix: "cav", position: "single", width: spec.width };
  if (form === "single") return { ...spec, form, ovens: [{ ...first, position: "single" }] };
  const second: OvenSlot = spec.ovens[1] ?? { prefix: "cav2", position: "lower", width: first.width };
  return { ...spec, form, ovens: [{ ...first, position: "upper" }, { ...second, position: "lower" }] };
}
