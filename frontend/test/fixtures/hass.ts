/**
 * Builds synthetic appliances for the family and view tests: a PanelAppliance whose entity map
 * matches what the integration creates for the given property keys, the hass states for them,
 * and a context to run a family model in. Values are made up.
 */
import { makeContext, type ContextHelpers } from "../../src/families/index";
import type { ApplianceContext } from "../../src/families/types";
import type { HassEntity, HomeAssistant } from "../../src/hass";
import { makeTranslate } from "../../src/i18n";
import type { Appearance, ApplianceSpec, Brand, EntityDomain, EntityMap, LockCode, PanelAppliance } from "../../src/types";

/** A state, or a state and its attributes. */
export type EntityValue = string | [string, Record<string, unknown>];

/** Entities by property key, then domain. */
export type EntityTable = Record<string, Partial<Record<EntityDomain, EntityValue>>>;

export interface Fixture {
  appliance: PanelAppliance;
  states: Record<string, HassEntity>;
}

export const APPEARANCE: Appearance = {
  finish: "stainless",
  panel_color: null,
  knobs: "red",
  handle: "tubular",
  style: null,
  form: null,
};

export const CHANGED = "2026-10-24T12:00:00+00:00";

function entityState(entityId: string, value: EntityValue): HassEntity {
  const [state, attributes] = typeof value === "string" ? [value, {}] : value;
  return { entity_id: entityId, state, attributes: { ...attributes }, last_changed: CHANGED, last_updated: CHANGED };
}

export function makeFixture(options: {
  id: string;
  name: string;
  brand: Brand;
  model: string | null;
  type: string | null;
  spec: ApplianceSpec;
  entities: EntityTable;
  locks?: Partial<Record<string, LockCode>>;
  available?: boolean;
}): Fixture {
  const entities: EntityMap = {};
  const states: Record<string, HassEntity> = {};
  for (const [key, byDomain] of Object.entries(options.entities)) {
    for (const [domain, value] of Object.entries(byDomain) as Array<[EntityDomain, EntityValue]>) {
      const entityId = `${domain}.${options.id}_${key}`;
      entities[key] = { ...entities[key], [domain]: entityId };
      states[entityId] = entityState(entityId, options.available === false ? "unavailable" : value);
    }
  }
  return {
    appliance: {
      device_id: `device_${options.id}`,
      appliance_id: `appliance_${options.id}`,
      entry_id: "entry_1",
      name: options.name,
      brand: options.brand,
      model: options.model,
      appliance_type: options.type,
      available: options.available ?? true,
      spec: options.spec,
      detected_form: options.spec.form,
      appearance: APPEARANCE,
      appearance_options: { finish: ["stainless"], panel_colors: [], knobs: null, handle: null, style: null, forms: [] },
      entities,
      locks: options.locks ?? {},
    },
    states,
  };
}

/** The fixture with some states replaced (a string keeps the entity's attributes). */
export function withStates(fixture: Fixture, changes: EntityTable): Fixture {
  const states = { ...fixture.states };
  for (const [key, byDomain] of Object.entries(changes)) {
    for (const [domain, value] of Object.entries(byDomain) as Array<[EntityDomain, EntityValue]>) {
      const entityId = fixture.appliance.entities[key]?.[domain];
      if (!entityId) throw new Error(`${key} has no ${domain} entity`);
      const before = states[entityId];
      states[entityId] =
        typeof value === "string"
          ? { ...before, state: value }
          : { ...before, state: value[0], attributes: { ...before.attributes, ...value[1] } };
    }
  }
  return { appliance: fixture.appliance, states };
}

export function withLocks(fixture: Fixture, locks: Partial<Record<string, LockCode>>): Fixture {
  return { appliance: { ...fixture.appliance, locks }, states: fixture.states };
}

export function offline(fixture: Fixture): Fixture {
  const states = Object.fromEntries(
    Object.entries(fixture.states).map(([entityId, entity]) => [entityId, { ...entity, state: "unavailable" }]),
  );
  return { appliance: { ...fixture.appliance, available: false }, states };
}

export interface ServiceCall {
  domain: string;
  service: string;
  data?: Record<string, unknown>;
  target?: Record<string, unknown>;
}

export type TestHass = HomeAssistant & { calls: ServiceCall[] };

export function makeHass(
  states: Record<string, HassEntity>,
  options: { unit?: "°F" | "°C"; language?: string; reject?: unknown } = {},
): TestHass {
  const calls: ServiceCall[] = [];
  return {
    calls,
    states,
    devices: {},
    areas: {},
    language: options.language ?? "en",
    // Times in the server's zone, so the tests read the same anywhere.
    locale: { language: options.language ?? "en", time_format: "24", time_zone: "server" } as HomeAssistant["locale"],
    themes: { darkMode: false },
    user: { is_admin: true },
    config: { unit_system: { temperature: options.unit ?? "°F" }, time_zone: "America/New_York" },
    connection: { subscribeMessage: async () => async () => {} },
    async callService(domain, service, data, target) {
      calls.push({ domain, service, data, target });
      if (options.reject) throw options.reject;
    },
    async callWS<T>(): Promise<T> {
      return {} as T;
    },
  };
}

export const NOW = Date.parse("2026-10-24T18:00:00Z");

export function context(
  fixture: Fixture,
  options: {
    now?: number;
    unit?: "°F" | "°C";
    language?: string;
    since?: ContextHelpers["since"];
    preheatStart?: ContextHelpers["preheatStart"];
  } = {},
): ApplianceContext {
  const hass = makeHass(fixture.states, options);
  const helpers: ContextHelpers = {
    since: options.since ?? (() => null),
    preheatStart: options.preheatStart ?? (() => null),
  };
  return makeContext(fixture.appliance, hass, makeTranslate(options.language ?? "en"), options.now ?? NOW, helpers);
}

/** An ISO time `minutes` from NOW. */
export function inMinutes(minutes: number): string {
  return new Date(NOW + minutes * 60_000).toISOString();
}
