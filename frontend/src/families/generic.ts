/**
 * An appliance the panel couldn't place in a family. It shows whatever the families find among
 * its entities: one family's model when only one fits, all of them merged when several do, and
 * the details every appliance has when none does.
 */
import type { DrawingState } from "../drawings/types";
import { anyOpen, compact, detailsSection, has, isOn, needsService } from "./common";
import { dishwasher } from "./dishwasher";
import { hood } from "./hood";
import { iceMaker } from "./ice-maker";
import { hasOven, oven } from "./oven";
import { REFRIGERATION_DOORS, refrigeration } from "./refrigeration";
import type { ApplianceContext, Control, FamilyModel, Section } from "./types";

const FAMILIES: Array<{ model: FamilyModel; fits: (ctx: ApplianceContext) => boolean }> = [
  {
    model: iceMaker,
    fits: (ctx) => has(ctx, "ice_maker_status", "sensor") || has(ctx, "ice_door_ajar", "binary_sensor"),
  },
  {
    model: refrigeration,
    fits: (ctx) => ["ref", "ref2", "frz", "wine", "wine2"].some((zone) => has(ctx, `${zone}_set_temp`)),
  },
  { model: oven, fits: hasOven },
  { model: dishwasher, fits: (ctx) => ["wash_cycle", "wash_status", "wash_cycle_on"].some((key) => has(ctx, key)) },
  { model: hood, fits: (ctx) => has(ctx, "fan_on", "fan") || has(ctx, "light_on", "light") },
];

const DOORS = [...REFRIGERATION_DOORS, "ice_door_ajar", "door_ajar", "cav_door_ajar", "cav2_door_ajar"];

function fitting(ctx: ApplianceContext): FamilyModel[] {
  return FAMILIES.filter((family) => family.fits(ctx)).map((family) => family.model);
}

/** Sections of several families, joined by id, each control once. */
function mergeSections(lists: Section[][]): Section[] {
  const merged = new Map<string, Section>();
  for (const list of lists) {
    for (const part of list) {
      const known = merged.get(part.id);
      if (!known) {
        merged.set(part.id, { ...part, controls: [...part.controls] });
        continue;
      }
      const ids = new Set(known.controls.map((control: Control) => control.id));
      known.controls.push(...part.controls.filter((control) => !ids.has(control.id)));
    }
  }
  // Details last, as in every family.
  const details = merged.get("details");
  merged.delete("details");
  return details ? [...merged.values(), details] : [...merged.values()];
}

export const generic: FamilyModel = {
  drawingState(ctx): DrawingState {
    const state: DrawingState = { available: ctx.appliance.available, doors: {}, readouts: {} };
    for (const model of fitting(ctx)) {
      const part = model.drawingState(ctx);
      Object.assign(state.doors, part.doors);
      Object.assign(state.readouts, part.readouts);
      for (const key of ["ice", "sabbath", "ovens", "display", "dishwasher", "hood", "ice_maker"] as const) {
        if (part[key] !== undefined && state[key] === undefined) (state as unknown as Record<string, unknown>)[key] = part[key];
      }
    }
    return state;
  },

  status(ctx) {
    const [first] = fitting(ctx);
    if (first) return first.status(ctx);
    const t = ctx.t;
    if (!ctx.appliance.available) return { text: t("pill.offline"), tone: "gray" };
    if (anyOpen(ctx, DOORS)) return { text: t("pill.door_open"), tone: "amber" };
    if (needsService(ctx)) return { text: t("pill.service"), tone: "red" };
    if (isOn(ctx, "sabbath_on", "binary_sensor")) return { text: t("pill.sabbath"), tone: "gray" };
    return { text: t("pill.normal"), tone: "neutral" };
  },

  infoRows(ctx) {
    const rows = fitting(ctx).flatMap((model) => model.infoRows(ctx));
    if (!rows.length && ctx.appliance.model) rows.push({ label: ctx.t("info.model"), value: ctx.appliance.model });
    return rows.slice(0, 3);
  },

  display(ctx) {
    for (const model of fitting(ctx)) {
      const display = model.display(ctx);
      if (display) return display;
    }
    return null;
  },

  sections(ctx) {
    const models = fitting(ctx);
    if (!models.length) return compact([detailsSection(ctx)]);
    return mergeSections(models.map((model) => model.sections(ctx)));
  },
};
