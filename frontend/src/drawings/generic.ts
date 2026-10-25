import { html, nothing, type TemplateResult } from "lit";
import type { ApplianceSpec, GenericSpec, RefrigerationSpec } from "../types";
import * as forms from "./generic/forms";
import { Defs, floorShadow, materialDefs } from "./generic/materials";
import type { DrawingInput } from "./types";

/**
 * The drawing for an appliance no detailed module can draw: a plain but realistic drawing of
 * its type (refrigerator, wine storage, ice maker, oven, range, hood, dishwasher), or of a
 * built-in appliance when even the type is unknown. Always returns a drawing.
 */

/** Inches, from the spec when it's known, kept to sizes a kitchen appliance can be. */
function inches(width: number | null, fallback: number): number {
  return width && Number.isFinite(width) ? Math.min(72, Math.max(12, width)) : fallback;
}

function fromRefrigeration(spec: RefrigerationSpec, c: forms.FormContext): forms.Drawn {
  switch (spec.form) {
    case "column_wine":
    case "wine_over_drawers":
      return forms.wine(c, inches(spec.width, 24), true);
    case "undercounter_wine":
    case "undercounter_beverage":
      return forms.wine(c, inches(spec.width, 24), false);
    case "ice_maker":
      return forms.iceMaker(c, inches(spec.width, 15));
    case "undercounter_refrigerator":
      return forms.refrigerator(c, inches(spec.width, 24), "undercounter");
    case "undercounter_drawers":
      return forms.refrigerator(c, inches(spec.width, 24), "drawers");
    case "side_by_side":
      return forms.refrigerator(c, inches(spec.width, 48), "side_by_side");
    case "french_door":
      return forms.refrigerator(c, inches(spec.width, 36), "french_door");
    case "over_under":
    case "tall_over_under":
      return forms.refrigerator(c, inches(spec.width, spec.form === "tall_over_under" ? 30 : 36), "over_under");
    default:
      return forms.refrigerator(c, inches(spec.width, 30), "column");
  }
}

function fromGeneric(spec: GenericSpec, c: forms.FormContext): forms.Drawn {
  switch (spec.form) {
    case "refrigerator": {
      // Narrow units are columns, mid widths over-and-under, wide ones side-by-side.
      const width = inches(spec.width, 36);
      return forms.refrigerator(c, width, width <= 30 ? "column" : width < 42 ? "over_under" : "side_by_side");
    }
    case "wine": {
      // Sub-Zero's 18″ and 30″ wine units are full-height columns; 15″ and 24″ default to undercounter.
      const width = inches(spec.width, 24);
      return forms.wine(c, width, width === 18 || width >= 30);
    }
    case "ice_maker":
      return forms.iceMaker(c, inches(spec.width, 15));
    case "oven":
      return forms.wallOven(c, inches(spec.width, 30), !!c.state.ovens?.cav2, []);
    case "hood":
      return forms.hood(c, inches(spec.width, 36), "wall");
    case "dishwasher":
      return forms.dishwasher(c, inches(spec.width, 24));
    default:
      return forms.appliance(c, inches(spec.width, 24));
  }
}

function draw(spec: ApplianceSpec, c: forms.FormContext): forms.Drawn {
  switch (spec.family) {
    case "refrigeration":
      return fromRefrigeration(spec, c);
    case "range":
      return forms.range(c, inches(spec.width, 30), spec.burners || 4, spec.ovens ?? []);
    case "wall_oven":
      return forms.wallOven(c, inches(spec.width, 30), spec.form === "double", spec.ovens ?? []);
    case "hood":
      return forms.hood(c, inches(spec.width, 36), spec.form);
    case "dishwasher":
      return forms.dishwasher(c, inches(spec.width, 24));
    default:
      return fromGeneric(spec as GenericSpec, c);
  }
}

export function renderGeneric(input: DrawingInput): TemplateResult {
  const d = new Defs(input.uid);
  const { state } = input;
  const drawn = draw(input.spec, {
    d,
    state,
    knobs: input.appearance?.knobs ?? "red",
    reducedMotion: !!input.reducedMotion,
    pixelHeight: input.pixelHeight,
  });
  const margin = 14;
  const label = state.available ? drawn.label.join(", ") : `${drawn.label[0]}, offline`;
  return html`<svg
    viewBox=${`${-margin} ${-forms.HEADROOM} ${drawn.width + 2 * margin} ${forms.viewHeight(drawn)}`}
    role="img"
    aria-label=${label}
  >
    <defs>${materialDefs(d)}</defs>
    ${drawn.floor ? floorShadow(d, 0, drawn.width, drawn.height, input.theme) : nothing}
    <g filter=${state.available ? nothing : d.url("offline")}>${drawn.body}</g>
    ${state.available ? (drawn.over ?? nothing) : nothing}
  </svg>`;
}
