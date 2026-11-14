// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import type { DrawingInput, DrawingState } from "../src/drawings/types";
import type { ApplianceContext, Control, DisplayText, FamilyModel, Section } from "../src/families/types";
// First, so Lit finds its dev-mode notice already silenced.
import { SPECS, deferred, entity, flush, last, makeAppliance, makeHass, settle, text } from "./shell-fixtures";

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

  it("lists an event that has just fired, which history doesn't hold yet", async () => {
    // The recorder writes a few seconds behind, so each reply ends at the event before.
    const started = { s: "2026-10-24T10:00:00.000+00:00", a: { event_type: "dishwasher_started" }, lu: 1 };
    const complete = { s: "2026-10-24T11:58:00.000+00:00", a: { event_type: "dishwasher_complete" }, lu: 2 };
    const later = deferred<unknown>();
    const callWS = vi.fn().mockResolvedValueOnce({ [EVENT]: [started] }).mockReturnValueOnce(later.promise);
    const fired = entity(EVENT, complete.s, complete.a, complete.s);
    const view = await mount(hassWith({ states: { [EVENT]: fired }, callWS: callWS as unknown as HomeAssistant["callWS"] }));
    await flush();
    await settle(view);
    const names = () => [...shadow(view).querySelectorAll(".events li span")].map(text);
    expect(names()).toEqual(["Wash cycle complete", "Wash cycle started"]);
    // The next one shows at once, over the list from before, and stays once history is read again.
    const at = "2026-10-24T11:59:30.000+00:00";
    view.hass = { ...view.hass!, states: { [EVENT]: entity(EVENT, at, { event_type: "dishwasher_service_required" }, at) } };
    await settle(view);
    expect(callWS).toHaveBeenCalledTimes(2);
    expect(names()).toEqual(["Dishwasher service required", "Wash cycle complete", "Wash cycle started"]);
    later.resolve({ [EVENT]: [started, complete] });
    await flush();
    await settle(view);
    expect(names()).toEqual(["Dishwasher service required", "Wash cycle complete", "Wash cycle started"]);
  });

  it("keeps a control busy until the last of its overlapping calls returns", async () => {
    fake.sections = [{ id: "options", title: "Options", controls: [toggle("heated_dry_on", "Extra dry")] }];
    const first = deferred<unknown>();
    const second = deferred<unknown>();
    const callService = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const view = await mount(hassWith({ callService: callService as unknown as HomeAssistant["callService"] }));
    const control = shadow(view).querySelector("sz-toggle") as HTMLElement & { pending: boolean };
    const flip = async () => {
      control.shadowRoot!.querySelector<HTMLButtonElement>("[role=switch]")!.click();
      await settle(view);
    };
    await flip();
    await flip();
    expect(callService).toHaveBeenCalledTimes(2);
    expect(control.pending).toBe(true);
    first.resolve(undefined);
    await settle(view);
    expect(control.pending).toBe(true);
    second.resolve(undefined);
    await settle(view);
    expect(control.pending).toBe(false);
  });

  it("opens more-info for a control's entity from its label, and for a reading's by its property key", async () => {
    const rinse: Control = { kind: "reading", id: "rinse_aid_low", label: "Rinse aid", value: "OK" };
    const model: Control = { kind: "reading", id: "model", label: "Model", value: "DW2450" };
    fake.sections = [{ id: "options", title: "Options", controls: [toggle("heated_dry_on", "Extra dry"), rinse, model] }];
    const appliance = makeAppliance("dishwasher", SPECS.dishwasher, {
      entities: { ...DISHWASHER.entities, rinse_aid_low: { binary_sensor: "binary_sensor.dishwasher_rinse_aid_low" } },
    });
    const view = await mount(hassWith(), appliance);
    const heard: unknown[] = [];
    // As Home Assistant hears it: on its root element, above the panel.
    const listen = (event: Event) => heard.push((event as CustomEvent).detail);
    document.body.addEventListener("hass-more-info", listen);
    const label = (tag: string, nth = 0) => shadow(view).querySelectorAll(tag)[nth].shadowRoot!.querySelector<HTMLButtonElement>("button.more");
    label("sz-toggle")!.click();
    label("sz-reading")!.click();
    document.body.removeEventListener("hass-more-info", listen);
    expect(heard).toEqual([{ entityId: "switch.heated_dry_on" }, { entityId: "binary_sensor.dishwasher_rinse_aid_low" }]);
    // The model number isn't an entity's, so its label is only a label.
    expect(label("sz-reading", 1)).toBeNull();
  });

  it("shows a week of events, and a month once asked", async () => {
    const recent = { s: "2026-10-24T11:00:00.000+00:00", a: { event_type: "dishwasher_complete" }, lu: 2 };
    const older = { s: "2026-10-03T09:00:00.000+00:00", a: { event_type: "rinse_aid_low" }, lu: 1 };
    const callWS = vi.fn(async (message: Record<string, unknown>) => ({
      [EVENT]: Date.parse(String(message.start_time)) < Date.parse("2026-10-10T00:00:00Z") ? [older, recent] : [recent],
    }));
    const view = await mount(hassWith({ callWS: callWS as unknown as HomeAssistant["callWS"] }));
    await flush();
    await settle(view);
    const names = () => [...shadow(view).querySelectorAll(".events li span")].map(text);
    const more = () => shadow(view).querySelector<HTMLButtonElement>(".more-events");
    expect(names()).toEqual(["Wash cycle complete"]);
    expect(text(more())).toBe("Show 30 days");
    more()!.click();
    await settle(view);
    await flush();
    await settle(view);
    expect(callWS).toHaveBeenCalledTimes(2);
    expect(callWS.mock.calls[1][0]).toMatchObject({ start_time: "2026-09-24T12:00:00.000Z" });
    expect(names()).toEqual(["Wash cycle complete", "Rinse aid low"]);
    expect(more()).toBeNull();
  });

  it("says how far back it looked when there are no events, and still offers the month", async () => {
    const view = await mount();
    await flush();
    await settle(view);
    const events = () => [...shadow(view).querySelectorAll("details")].find((card) => text(card.querySelector("h2")) === "Recent events")!;
    expect(text(events().querySelector(".note"))).toBe("No events in the last 7 days.");
    events().querySelector<HTMLButtonElement>(".more-events")!.click();
    await settle(view);
    await flush();
    await settle(view);
    expect(text(events().querySelector(".note"))).toBe("No events in the last 30 days.");
    expect(events().querySelector(".more-events")).toBeNull();
  });

  it("runs on the panel's clock when it has one, and keeps its own only without", async () => {
    vi.useFakeTimers({ now: Date.parse("2026-10-24T12:00:00.000Z"), toFake: ["setTimeout", "clearTimeout", "Date"] });
    try {
      fake.sections = [{ id: "options", title: "Options", controls: [toggle("heated_dry_on", "Extra dry")] }];
      const view = await mount();
      const before = fake.renders;
      await vi.advanceTimersByTimeAsync(3500);
      await settle(view);
      expect(fake.renders).toBe(before);
      expect(vi.getTimerCount()).toBe(0);
      // Without the panel's clock, the view ticks every second itself.
      view.now = undefined;
      await settle(view);
      const own = fake.renders;
      await vi.advanceTimersByTimeAsync(2100);
      await settle(view);
      expect(fake.renders).toBe(own + 2);
      view.remove();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
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
