import type { HassEntity, HomeAssistant } from "../hass";
import type { Translate } from "../i18n";
import type { EntityDomain, PanelAppliance } from "../types";
import { dishwasher } from "./dishwasher";
import { generic } from "./generic";
import { hood } from "./hood";
import { iceMaker } from "./ice-maker";
import { oven } from "./oven";
import { refrigeration } from "./refrigeration";
import type { ApplianceContext, FamilyModel } from "./types";

/**
 * The model for an appliance's family and form. A generic spec still names the kind of
 * appliance when detection knows it, so it gets that family's controls with the generic drawing.
 */
export function familyModel(appliance: PanelAppliance): FamilyModel {
  const spec = appliance.spec;
  switch (spec?.family) {
    case "refrigeration":
      return spec.form === "ice_maker" ? iceMaker : refrigeration;
    case "range":
    case "wall_oven":
      return oven;
    case "dishwasher":
      return dishwasher;
    case "hood":
      return hood;
    case "generic":
      switch (spec.form) {
        case "refrigerator":
        case "wine":
          return refrigeration;
        case "ice_maker":
          return iceMaker;
        case "oven":
          return oven;
        case "hood":
          return hood;
        case "dishwasher":
          return dishwasher;
      }
      return generic;
    default:
      return generic;
  }
}

export interface ContextHelpers {
  since(entityId: string, state?: string): number | null;
  preheatStart(appliance: PanelAppliance, prefix: "cav" | "cav2"): number | null;
}

export function makeContext(
  appliance: PanelAppliance,
  hass: HomeAssistant,
  t: Translate,
  now: number,
  helpers: ContextHelpers,
): ApplianceContext {
  const entityId = (key: string, ...domains: EntityDomain[]): string | undefined => {
    const byDomain = appliance.entities?.[key];
    if (!byDomain) return undefined;
    if (!domains.length) return Object.values(byDomain)[0];
    for (const domain of domains) if (byDomain[domain]) return byDomain[domain];
    return undefined;
  };
  return {
    appliance,
    hass,
    t,
    now,
    entityId,
    state(key: string, ...domains: EntityDomain[]): HassEntity | undefined {
      const id = entityId(key, ...domains);
      return id ? hass.states[id] : undefined;
    },
    since: (id, state) => helpers.since(id, state),
    preheatStart: (prefix) => helpers.preheatStart(appliance, prefix),
  };
}
