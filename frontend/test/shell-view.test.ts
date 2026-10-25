// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import type { DrawingInput, DrawingState } from "../src/drawings/types";
import type { ApplianceContext, Control, DisplayText, FamilyModel, Section } from "../src/families/types";
// First, so Lit finds its dev-mode notice already silenced.
import { SPECS, entity, flush, last, makeAppliance, makeHass, settle, text } from "./shell-fixtures";

// The full view is tested against a stand-in family model and drawing, so it checks the view.
const fake = vi.hoisted(() => ({
  sections: [] as Section[],
  renders: 0,
  display: null as DisplayText | null,
  ovens: undefined as DrawingState["ovens"],
  inputs: [] as DrawingInput[],
}));

vi.mock("../src/families/index", () => ({
  familyModel: () =>
    ({
      drawingState: (ctx: ApplianceContext) => ({ available: ctx.appliance.available, doors: {}, readouts: {}, ovens: fake.ovens }),
      status: () => ({ text: "Normal", tone: "neutral" }),
      infoRows: () => [],
      display: () => fake.display,
      sections: () => {
        fake.renders++;
        return fake.sections;
      },
    }) satisfies FamilyModel,
  makeContext: (appliance: PanelAppliance, hass: unknown, t: unknown, now: unknown) =>
    ({
      appliance,
      hass,
      t,
      now,
      entityId: (key: string) => Object.values(appliance.entities?.[key] ?? {})[0],
    }) as unknown as ApplianceContext,
}));

vi.mock("../src/drawings/index", async () => {
  const { html } = await import("lit");
  return {
    renderDrawing: (input: DrawingInput) => {
      fake.inputs.push(input);
      return html`<svg viewBox="0 0 480 840"></svg>`;
    },
  };
});

vi.mock("../src/drawings/generic", async () => {
  const { html } = await import("lit");
  return { renderGeneric: () => html`<svg viewBox="0 0 300 360"></svg>` };
});

import type { ApplianceView } from "../src/views/appliance-view";
import "../src/views/appliance-view";
import type { HomeAssistant } from "../src/hass";
import type { PanelAppliance } from "../src/types";

const EVENT = "event.dishwasher_appliance_event";
const DISHWASHER = makeAppliance("dishwasher", SPECS.dishwasher, {
  entities: { wash_status: { sensor: "sensor.dishwasher_wash_status" }, appliance_event: { event: EVENT } },
});

const BUSY = "Wash options can change only while the dishwasher is idle.";

function toggle(id: string, label: string, over: Partial<Control> = {}): Control {
  return { kind: "toggle", id, label, action: { type: "switch", entity_id: `switch.${id}` }, value: false, ...over } as Control;
}

function hassWith(over: Partial<HomeAssistant> = {}): HomeAssistant {
  return makeHass({
    states: {
      "sensor.dishwasher_wash_status": entity("sensor.dishwasher_wash_status", "Running"),
      [EVENT]: entity(EVENT, "2026-10-24T11:00:00.000+00:00"),
    },
    callWS: vi.fn(async () => ({})) as HomeAssistant["callWS"],
    ...over,
  });
}

async function mount(hass = hassWith(), appliance: PanelAppliance = DISHWASHER): Promise<ApplianceView> {
  const view = document.createElement("sz-appliance-view");
  view.hass = hass;
  view.appliance = appliance;
  view.now = Date.parse("2026-10-24T12:00:00Z");
  document.body.append(view);
  await settle(view);
  return view;
}

const shadow = (view: ApplianceView) => view.shadowRoot!;

afterEach(() => {
  document.body.innerHTML = "";
  fake.sections = [];
  fake.renders = 0;
  fake.display = null;
  fake.ovens = undefined;
  fake.inputs.length = 0;
});

describe("sz-appliance-view", () => {
  it("shows a lock reason that several controls share once, and a one-off under its control", async () => {
    const REMOTE = "Turn on Remote Ready at the oven to start it from here.";
    fake.sections = [
      {
        id: "options",
        title: "Options",
        controls: [
          toggle("heated_dry_on", "Extra dry", { disabled: true, reason: BUSY }),
          toggle("power", "Power", { disabled: true, reason: REMOTE }),
          toggle("sani_rinse_on", "Sani-rinse", { disabled: true, reason: BUSY }),
        ],
      },
    ];
    const view = await mount();
    const notes = [...shadow(view).querySelectorAll(".note.shared")];
    expect(notes.map(text)).toEqual([BUSY]);
    // The note is for the eye; each control still carries the reason for screen readers.
    expect(notes[0].getAttribute("aria-hidden")).toBe("true");
    const reasons = [...shadow(view).querySelectorAll("sz-toggle")].map((element) => element.shadowRoot!.querySelector(".reason")!);
    expect(reasons.map(text)).toEqual([BUSY, REMOTE, BUSY]);
    expect(reasons.map((reason) => reason.classList.contains("visually-hidden"))).toEqual([true, false, true]);
  });

  it("says only why when every switch in a section is locked with no state to show", async () => {
    // A dishwasher's options while it runs: the integration makes them unavailable.
    fake.sections = [
      {
        id: "options",
        title: "Options",
        controls: [
          toggle("heated_dry_on", "Extra dry", { disabled: true, reason: BUSY, value: null }),
          toggle("sani_rinse_on", "Sani-rinse", { disabled: true, reason: BUSY, value: null }),
        ],
      },
    ];
    const view = await mount();
    expect(shadow(view).querySelector("sz-toggle")).toBeNull();
    const note = shadow(view).querySelector(".note.shared")!;
    expect(text(note)).toBe(BUSY);
    expect(note.hasAttribute("aria-hidden")).toBe(false);
  });

  it("names a range's oven events after its Right and Left ovens", async () => {
    const event = "event.range_appliance_event";
    const range = makeAppliance("range", SPECS.range, {
      entities: {
        appliance_event: { event },
        cav_unit_on: { binary_sensor: "binary_sensor.range_cooking" },
        cav2_unit_on: { binary_sensor: "binary_sensor.range_lower_oven_cooking" },
      },
    });
    const callWS = vi.fn(async () => ({
      [event]: [
        { s: "2026-10-24T11:00:00.000+00:00", a: { event_type: "lower_oven_door_ajar" }, lu: 1 },
        { s: "2026-10-24T11:30:00.000+00:00", a: { event_type: "oven_preheated" }, lu: 2 },
      ],
    }));
    const hass = makeHass({
      states: { [event]: entity(event, "2026-10-24T11:30:00.000+00:00") },
      callWS: callWS as unknown as HomeAssistant["callWS"],
    });
    const view = await mount(hass, range);
    await flush();
    await settle(view);
    const names = [...shadow(view).querySelectorAll(".events li span")].map(text);
    expect(names).toEqual(["Right oven · Preheat complete", "Left oven · Door open"]);
  });

  it("greys the display while it has nothing live to show", async () => {
    fake.display = { text: "Off", caption: null };
    fake.ovens = { cav: { on: false } as NonNullable<DrawingState["ovens"]>["cav"] };
    const view = await mount();
    expect(shadow(view).querySelector(".lcd")!.classList.contains("dim")).toBe(true);
    fake.display = { text: "350°", caption: "Bake" };
    fake.ovens = { cav: { on: true } as NonNullable<DrawingState["ovens"]>["cav"] };
    view.now = view.now! + 1000;
    await settle(view);
    expect(shadow(view).querySelector(".lcd")!.classList.contains("dim")).toBe(false);
  });

  it("tells the drawing the height it's shown at", async () => {
    const original = globalThis.ResizeObserver;
    let report: ((height: number) => void) | undefined;
    globalThis.ResizeObserver = class {
      constructor(private readonly callback: ResizeObserverCallback) {}
      observe() {
        report = (height) => this.callback([{ contentRect: { height } } as ResizeObserverEntry], this as unknown as ResizeObserver);
      }
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    try {
      const view = await mount();
      expect(last(fake.inputs).pixelHeight).toBeUndefined();
      report!(512.4);
      await settle(view);
      expect(last(fake.inputs).pixelHeight).toBe(512);
    } finally {
      globalThis.ResizeObserver = original;
    }
  });

  it("doesn't repeat a section's name on its only control", async () => {
    const select: Control = {
      kind: "select",
      id: "ice_maker_mode",
      label: "Ice maker",
      action: { type: "select", entity_id: "select.ice" },
      value: "On",
      options: ["Off", "On", "Max ice", "Night ice"].map((value) => ({ value, label: value })),
    };
    fake.sections = [
      { id: "ice", title: "Ice maker", controls: [select] },
      { id: "modes", title: "Modes", controls: [{ ...select, id: "operating_mode", label: "Mode" }] },
    ];
    const view = await mount();
    const [ice, mode] = [...shadow(view).querySelectorAll("sz-select")];
    expect(ice.hasAttribute("quiet")).toBe(true);
    expect(mode.hasAttribute("quiet")).toBe(false);
  });

  it("redraws for its own appliance and the clock, not for the rest of the house", async () => {
    fake.sections = [{ id: "options", title: "Options", controls: [toggle("heated_dry_on", "Extra dry")] }];
    const hass = hassWith();
    const view = await mount(hass);
    const before = fake.renders;
    view.hass = { ...hass, states: { ...hass.states, "sensor.outdoor": entity("sensor.outdoor", "61") } };
    await settle(view);
    expect(fake.renders).toBe(before);
    view.hass = {
      ...hass,
      states: { ...hass.states, "sensor.dishwasher_wash_status": entity("sensor.dishwasher_wash_status", "Drying") },
    };
    await settle(view);
    expect(fake.renders).toBe(before + 1);
    view.now = view.now! + 1000;
    await settle(view);
    expect(fake.renders).toBe(before + 2);
  });

  it("offers to load the events again after a failure", async () => {
    const callWS = vi.fn().mockRejectedValueOnce({ code: "unknown_error", message: "Connection lost" }).mockResolvedValue({
      [EVENT]: [{ s: "2026-10-24T11:00:00.000+00:00", a: { event_type: "dishwasher_complete" }, lu: 1 }],
    });
    const view = await mount(hassWith({ callWS: callWS as unknown as HomeAssistant["callWS"] }));
    await flush();
    await settle(view);
    const events = () => [...shadow(view).querySelectorAll("details")].find((card) => text(card.querySelector("h2")) === "Recent events")!;
    expect(text(events().querySelector("[role=alert]"))).toBe("Couldn't load the events: Connection lost");
    events().querySelector<HTMLButtonElement>("button")!.click();
    await settle(view);
    await flush();
    await settle(view);
    expect(callWS).toHaveBeenCalledTimes(2);
    expect(text(events().querySelector(".events"))).toContain("Wash cycle complete");
  });
});
