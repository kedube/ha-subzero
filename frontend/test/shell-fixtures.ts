// Shared builders for the shell and data tests: appliances as the websocket API sends them, and
// a `hass` object with only the members the panel uses.
import { vi } from "vitest";
import type { HassEntity, HomeAssistant } from "../src/hass";
import type { Appearance, ApplianceSpec, PanelAppliance, PanelMessage } from "../src/types";

// Lit announces dev mode once per test file; it isn't a panel problem.
const lit = globalThis as { litIssuedWarnings?: Set<string> };
lit.litIssuedWarnings ??= new Set();
lit.litIssuedWarnings.add("dev-mode");

export const DEFAULT_APPEARANCE: Appearance = {
  finish: "stainless",
  panel_color: null,
  knobs: "red",
  handle: "tubular",
  style: null,
  form: null,
};

export const SPECS = {
  sideBySide: {
    family: "refrigeration",
    form: "side_by_side",
    line: "classic",
    width: 48,
    glass: false,
    dispenser: "internal",
    ice: true,
    drawers: null,
    zones: 2,
    outdoor: false,
    generic: false,
  },
  frenchDoor: {
    family: "refrigeration",
    form: "french_door",
    line: "classic",
    width: 36,
    glass: false,
    dispenser: "none",
    ice: true,
    drawers: null,
    zones: 2,
    outdoor: false,
    generic: false,
  },
  undercounterWine: {
    family: "refrigeration",
    form: "undercounter_wine",
    line: "designer",
    width: 24,
    glass: true,
    dispenser: "none",
    ice: false,
    drawers: null,
    zones: 2,
    outdoor: false,
    generic: false,
  },
  iceMaker: {
    family: "refrigeration",
    form: "ice_maker",
    line: "designer",
    width: 15,
    glass: false,
    dispenser: "none",
    ice: true,
    drawers: null,
    zones: 0,
    outdoor: false,
    generic: false,
  },
  range: {
    family: "range",
    form: "range",
    width: 48,
    fuel: "dual_fuel",
    burners: 8,
    surfaces: [],
    ovens: [
      { prefix: "cav2", position: "left", width: 18 },
      { prefix: "cav", position: "right", width: 30 },
    ],
    style: "professional",
    generic: false,
  },
  wallOven: {
    family: "wall_oven",
    form: "single",
    width: 30,
    series: "m",
    style: "transitional",
    ovens: [{ prefix: "cav", position: "single", width: 30 }],
    knob: false,
    generic: false,
  },
  hood: { family: "hood", form: "wall", width: 36, generic: false },
  dishwasher: { family: "dishwasher", form: "dishwasher", width: 24, front: "panel", generic: false },
  genericFridge: { family: "generic", form: "refrigerator", width: null, generic: true },
  genericAppliance: { family: "generic", form: "appliance", width: null, generic: true },
} satisfies Record<string, ApplianceSpec>;

export function makeAppliance(id: string, spec: ApplianceSpec, over: Partial<PanelAppliance> = {}): PanelAppliance {
  return {
    device_id: `dev-${id}`,
    appliance_id: `app-${id}`,
    entry_id: "entry-1",
    name: id,
    brand: spec.family === "dishwasher" ? "Cove" : spec.family === "refrigeration" ? "Sub-Zero" : "Wolf",
    model: null,
    appliance_type: null,
    available: true,
    spec,
    detected_form: spec.form,
    appearance: { ...DEFAULT_APPEARANCE },
    appearance_options: {
      finish: ["stainless", "panel", "black"],
      panel_colors: ["#f4f2ec", "#23324a", "#5b3a29"],
      knobs: null,
      handle: ["tubular", "pro", "none"],
      style: null,
      forms: [spec.form],
    },
    entities: {},
    locks: {},
    ...over,
  };
}

export function entity(
  entity_id: string,
  state: string,
  attributes: Record<string, unknown> = {},
  changed = "2026-10-24T12:00:00.000Z",
): HassEntity {
  return { entity_id, state, attributes, last_changed: changed, last_updated: changed };
}

export interface FakeConnection {
  subscribeMessage: ReturnType<typeof vi.fn>;
  /** Sends a panel message to the newest subscriber. */
  send(message: PanelMessage): void;
  unsubscribe: ReturnType<typeof vi.fn>;
}

export function makeConnection(): FakeConnection {
  let callback: ((message: PanelMessage) => void) | undefined;
  const unsubscribe = vi.fn(async () => {});
  const subscribeMessage = vi.fn(async (next: (message: PanelMessage) => void) => {
    callback = next;
    return unsubscribe;
  });
  return { subscribeMessage, unsubscribe, send: (message) => callback?.(message) };
}

export function makeHass(over: Partial<HomeAssistant> = {}): HomeAssistant {
  return {
    states: {},
    devices: {},
    areas: {},
    language: "en",
    locale: { language: "en" },
    themes: { darkMode: false },
    user: { id: "user-1", name: "Owner", is_admin: true },
    config: { unit_system: { temperature: "°F" }, time_zone: "UTC" },
    connection: makeConnection(),
    callService: vi.fn(async () => undefined),
    callWS: vi.fn(async () => ({})) as HomeAssistant["callWS"],
    ...over,
  };
}

/** A promise to resolve or reject from the test. */
export function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

/** Lets pending promise callbacks run. */
export async function flush(): Promise<void> {
  for (let index = 0; index < 5; index++) await Promise.resolve();
}

interface Updating {
  updateComplete: Promise<unknown>;
  shadowRoot: ShadowRoot | null;
}

/** Waits until an element and every Lit element in its shadow tree have rendered. */
export async function settle(element: Element): Promise<void> {
  for (let round = 0; round < 4; round++) {
    await flush();
    const pending: Array<Promise<unknown>> = [];
    const visit = (node: Element) => {
      const updating = node as unknown as Updating;
      if (updating.updateComplete) pending.push(updating.updateComplete);
      updating.shadowRoot?.querySelectorAll("*").forEach(visit);
    };
    visit(element);
    await Promise.all(pending);
  }
}

/** Finds an element through shadow roots, by a chain of selectors, one per shadow level. */
export function deep<T extends Element = HTMLElement>(root: Element, ...selectors: string[]): T | null {
  let current: Element | null = root;
  for (const selector of selectors) {
    current = current?.shadowRoot?.querySelector(selector) ?? null;
    if (!current) return null;
  }
  return current as T;
}

export function deepAll<T extends Element = HTMLElement>(root: Element, ...selectors: string[]): T[] {
  const last = selectors.pop()!;
  const parent = selectors.length ? deep(root, ...selectors) : root;
  return parent?.shadowRoot ? [...parent.shadowRoot.querySelectorAll<T>(last)] : [];
}

export function text(element: Element | null | undefined): string {
  return (element?.textContent ?? "").replace(/\s+/g, " ").trim();
}

/** The last item, which the stand-in drawings and models record per render. */
export function last<T>(items: readonly T[]): T {
  if (!items.length) throw new Error("Nothing recorded");
  return items[items.length - 1];
}
