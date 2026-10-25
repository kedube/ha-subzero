import type { TemplateResult } from "lit";
import { renderDishwasher } from "./dishwasher";
import { renderGeneric } from "./generic";
import { renderHood } from "./hood";
import { renderRange } from "./range";
import { renderRefrigeration } from "./refrigeration";
import type { DrawingInput, DrawingRenderer } from "./types";
import { renderWallOven } from "./wall-oven";

const RENDERERS: Partial<Record<DrawingInput["spec"]["family"], DrawingRenderer>> = {
  refrigeration: renderRefrigeration,
  range: renderRange,
  wall_oven: renderWallOven,
  hood: renderHood,
  dishwasher: renderDishwasher,
};

/** The appliance's drawing, or the generic drawing for its type when no module can draw it. */
export function renderDrawing(input: DrawingInput): TemplateResult {
  return RENDERERS[input.spec.family]?.(input) ?? renderGeneric(input);
}
