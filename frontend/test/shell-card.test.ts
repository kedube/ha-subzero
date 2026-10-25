// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import type { DrawingInput } from "../src/drawings/types";
import type { ApplianceContext, FamilyModel } from "../src/families/types";
// First, so Lit finds its dev-mode notice already silenced.
import { SPECS, entity, last, makeAppliance, makeHass, settle, text } from "./shell-fixtures";

// The card is tested against a stand-in family model and drawing, so it checks the card itself.
const fake = vi.hoisted(() => ({
  model: undefined as unknown as FamilyModel,
  inputs: [] as DrawingInput[],
  contexts: [] as unknown[][],
}));

vi.mock("../src/families/index", () => ({
  familyModel: () => fake.model,
  makeContext: (...args: unknown[]) => {
    fake.contexts.push(args);
    return { appliance: args[0], hass: args[1], t: args[2], now: args[3] } as unknown as ApplianceContext;
  },
}));

vi.mock("../src/drawings/index", async () => {
  const { html } = await import("lit");
  return {
    renderDrawing: (input: DrawingInput) => {
      fake.inputs.push(input);
      return html`<svg class="fake-drawing" viewBox="0 0 480 840"></svg>`;
    },
  };
});

vi.mock("../src/drawings/generic", async () => {
  const { html } = await import("lit");
  return { renderGeneric: () => html`<svg class="generic-drawing" viewBox="0 0 300 360"></svg>` };
});

import { OPEN_APPLIANCE, type ApplianceCard } from "../src/card/appliance-card";
import "../src/card/appliance-card";
import { renderConfirmBar } from "../src/card/parts";
import type { HomeAssistant } from "../src/hass";
import type { PanelAppliance } from "../src/types";
import { render } from "lit";

const FRIDGE: PanelAppliance = makeAppliance("fridge", SPECS.sideBySide, {
  entities: { ref_door_ajar: { binary_sensor: "binary_sensor.fridge_door" } },
});

function model(over: Partial<FamilyModel> = {}): FamilyModel {
  return {
    drawingState: vi.fn(() => ({ available: true, doors: { ref_door_ajar: false }, readouts: { ref: "38°" } })),
    status: vi.fn(() => ({ text: "Normal", tone: "neutral" as const })),
    infoRows: vi.fn(() => [
      { label: "Refrigerator", value: "38°" },
      { label: "Freezer", value: "0°" },
      { label: "Ice maker", value: "On" },
      { label: "Water filter", value: "74%" },
    ]),
    display: vi.fn(() => null),
    sections: vi.fn(() => []),
    ...over,
  };
}

function hassFor(over: Partial<HomeAssistant> = {}): HomeAssistant {
  return makeHass({
    states: { "binary_sensor.fridge_door": entity("binary_sensor.fridge_door", "off") },
    devices: { "dev-fridge": { id: "dev-fridge", name: "Sub-Zero CL4850SID", name_by_user: "Kitchen fridge", area_id: null } },
    ...over,
  });
}

async function mount(appliance: PanelAppliance = FRIDGE, hass = hassFor()): Promise<ApplianceCard> {
  const card = document.createElement("sz-appliance-card");
  card.hass = hass;
  card.appliance = appliance;
  card.now = Date.parse("2026-10-24T12:00:00Z");
  document.body.append(card);
  await settle(card);
  return card;
}

const shadow = (card: ApplianceCard) => card.shadowRoot!;

afterEach(() => {
  document.body.innerHTML = "";
  fake.inputs.length = 0;
  fake.contexts.length = 0;
});

describe("sz-appliance-card", () => {
  it("shows the name, the status, the drawing and up to three info rows", async () => {
    fake.model = model();
    const card = await mount();
    expect(text(shadow(card).querySelector(".name"))).toBe("Kitchen fridge");
    const pill = shadow(card).querySelector(".pill")!;
    expect(text(pill)).toBe("Normal");
    expect(pill.getAttribute("data-tone")).toBe("neutral");
    expect(shadow(card).querySelector(".stage .drawing svg.fake-drawing")).not.toBeNull();
    const rows = [...shadow(card).querySelectorAll(".info .row")].map((row) => [
      text(row.querySelector("dt")),
      text(row.querySelector("dd")),
    ]);
    expect(rows).toEqual([
      ["Refrigerator", "38°"],
      ["Freezer", "0°"],
      ["Ice maker", "On"],
    ]);
  });

  it("builds the drawing from the model, the spec, the Appearance and the theme", async () => {
    fake.model = model();
    await mount();
    const input = last(fake.inputs)!;
    expect(input.spec).toBe(FRIDGE.spec);
    expect(input.appearance).toBe(FRIDGE.appearance);
    expect(input.state.readouts).toEqual({ ref: "38°" });
    expect(input.theme).toBe("light");
    expect(input.uid).toMatch(/^szc\d+$/);
    expect(typeof input.reducedMotion).toBe("boolean");
    // The context gets the card's clock and the panel's helpers.
    const [appliance, , , now, helpers] = last(fake.contexts)!;
    expect(appliance).toBe(FRIDGE);
    expect(now).toBe(Date.parse("2026-10-24T12:00:00Z"));
    expect(helpers).toHaveProperty("since");
    expect(helpers).toHaveProperty("preheatStart");
  });

  it("tells the drawing the height it's shown at, once it's laid out", async () => {
    const observers: Array<{ callback: ResizeObserverCallback; targets: Element[] }> = [];
    const original = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      private readonly entry: { callback: ResizeObserverCallback; targets: Element[] };
      constructor(callback: ResizeObserverCallback) {
        this.entry = { callback, targets: [] };
        observers.push(this.entry);
      }
      observe(target: Element) {
        this.entry.targets.push(target);
      }
      unobserve() {}
      disconnect() {
        this.entry.targets.length = 0;
      }
    } as unknown as typeof ResizeObserver;
    try {
      fake.model = model();
      const card = await mount();
      expect(last(fake.inputs)!.pixelHeight).toBeUndefined();
      const [observer] = observers;
      expect(observer.targets).toEqual([shadow(card).querySelector(".drawing > svg")]);
      const report = (height: number) =>
        observer.callback([{ contentRect: { height } } as ResizeObserverEntry], observer as unknown as ResizeObserver);
      report(347.6);
      await settle(card);
      expect(last(fake.inputs)!.pixelHeight).toBe(348);
      // The same height again doesn't draw again.
      const drawn = fake.inputs.length;
      report(347.8);
      await settle(card);
      expect(fake.inputs.length).toBe(drawn);
    } finally {
      globalThis.ResizeObserver = original;
    }
  });

  it("gives every card its own drawing id prefix", async () => {
    fake.model = model();
    await mount();
    await mount(makeAppliance("other", SPECS.range));
    const [first, second] = fake.inputs.map((input) => input.uid);
    expect(first).not.toBe(second);
  });

  it("shows the display only where the model has one", async () => {
    fake.model = model({ display: vi.fn(() => ({ text: "350°", caption: "Bake" })) });
    const card = await mount(makeAppliance("range", SPECS.range));
    const lcd = shadow(card).querySelector(".stage.has-display .lcd")!;
    expect(text(lcd.querySelector(".digits"))).toBe("350°");
    expect(text(lcd.querySelector(".caption"))).toBe("Bake");

    fake.model = model();
    const plain = await mount();
    expect(shadow(plain).querySelector(".lcd")).toBeNull();
    expect(shadow(plain).querySelector(".stage.has-display")).toBeNull();
  });

  it("greys the display while it has nothing live to show, as the GE card does when it's ready", async () => {
    const oven = (on: boolean) => ({ on, preheated: false, progress: null, light: false, door_open: false, probe: false, remote_ready: false, self_clean: false, temp: null, mode: null });
    const state = (ovens: Record<string, unknown>, display: string | null = null) =>
      vi.fn(() => ({ available: true, doors: {}, readouts: {}, ovens, display }));
    const dim = async (over: Partial<FamilyModel>) => {
      fake.model = model({ display: vi.fn(() => ({ text: "Off" })), ...over });
      const card = await mount(makeAppliance("range", SPECS.range));
      return shadow(card).querySelector(".lcd")!.classList.contains("dim");
    };
    expect(await dim({ drawingState: state({ cav: oven(false), cav2: oven(false) }) })).toBe(true);
    expect(await dim({ drawingState: state({ cav: oven(true), cav2: oven(false) }) })).toBe(false);
    // A kitchen timer counting down is live.
    expect(await dim({ drawingState: state({ cav: oven(false) }, "4:12") })).toBe(false);
    const dishwasher = (status: string) => vi.fn(() => ({ available: true, doors: {}, readouts: {}, dishwasher: { status } }));
    expect(await dim({ drawingState: dishwasher("idle") as unknown as FamilyModel["drawingState"] })).toBe(true);
    expect(await dim({ drawingState: dishwasher("running") as unknown as FamilyModel["drawingState"] })).toBe(false);
  });

  it("greys out an offline appliance and leaves its display dark", async () => {
    fake.model = model({ display: vi.fn(() => ({ text: "4:12" })) });
    const card = await mount({ ...makeAppliance("range", SPECS.range), available: false });
    const pill = shadow(card).querySelector(".pill")!;
    expect(text(pill)).toBe("Offline");
    expect(pill.getAttribute("data-tone")).toBe("gray");
    expect(card.hasAttribute("offline")).toBe(true);
    expect(shadow(card).querySelector(".lcd")).toBeNull();
    expect(last(fake.inputs)!.state.available).toBe(false);
  });

  it("opens the full view on click, Enter and Space", async () => {
    fake.model = model();
    const card = await mount();
    const opened = vi.fn();
    document.addEventListener(OPEN_APPLIANCE, opened);
    card.click();
    card.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    const space = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    card.dispatchEvent(space);
    card.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", repeat: true, bubbles: true }));
    card.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true }));
    document.removeEventListener(OPEN_APPLIANCE, opened);
    expect(opened).toHaveBeenCalledTimes(3);
    expect((opened.mock.calls[0][0] as CustomEvent).detail).toEqual({ deviceId: "dev-fridge" });
    expect(space.defaultPrevented).toBe(true);
  });

  it("is a focusable button labeled with the name and status", async () => {
    fake.model = model();
    const card = await mount();
    expect(card.getAttribute("role")).toBe("button");
    expect(card.tabIndex).toBe(0);
    expect(card.getAttribute("aria-label")).toBe("Kitchen fridge, Normal. Show all controls");
  });

  it("names the family in the label when the model has no status", async () => {
    fake.model = model({ status: vi.fn(() => ({ text: "", tone: "neutral" as const })) });
    const card = await mount();
    expect(shadow(card).querySelector(".pill")).toBeNull();
    expect(card.getAttribute("aria-label")).toBe("Kitchen fridge, Refrigeration. Show all controls");
  });

  it("follows the dark theme and the user's language", async () => {
    fake.model = model({ display: vi.fn(() => null) });
    const card = await mount({ ...FRIDGE, available: false }, hassFor({ themes: { darkMode: true }, language: "fr", locale: { language: "fr" } }));
    expect(card.hasAttribute("dark")).toBe(true);
    expect(last(fake.inputs)!.theme).toBe("dark");
    expect(text(shadow(card).querySelector(".pill"))).toBe("Hors ligne");
  });

  it("still shows a card when the family model fails", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    fake.model = model({
      status: vi.fn(() => {
        throw new Error("unexpected state");
      }),
      drawingState: vi.fn(() => {
        throw new Error("unexpected state");
      }),
    });
    const card = await mount();
    expect(text(shadow(card).querySelector(".name"))).toBe("Kitchen fridge");
    expect(shadow(card).querySelector(".fake-drawing")).not.toBeNull();
    expect(last(fake.inputs)!.state).toEqual({ available: true, doors: {}, readouts: {} });
    // Logged once per failure, not on every redraw.
    card.now += 1000;
    await settle(card);
    expect(error.mock.calls.filter(([message]) => String(message).includes("status")).length).toBe(1);
    error.mockRestore();
  });

  it("redraws for its own entities and the clock, not for the rest of the house", async () => {
    fake.model = model();
    const hass = hassFor();
    const card = await mount(FRIDGE, hass);
    const status = fake.model.status as ReturnType<typeof vi.fn>;
    const before = status.mock.calls.length;

    card.hass = { ...hass, states: { ...hass.states, "sensor.outdoor": entity("sensor.outdoor", "61") } };
    await settle(card);
    expect(status.mock.calls.length).toBe(before);

    card.hass = { ...hass, states: { ...hass.states, "binary_sensor.fridge_door": entity("binary_sensor.fridge_door", "on") } };
    await settle(card);
    expect(status.mock.calls.length).toBe(before + 1);

    card.now += 1000;
    await settle(card);
    expect(status.mock.calls.length).toBe(before + 2);
  });
});

describe("renderConfirmBar", () => {
  it("asks the question and offers Cancel and the action", () => {
    const host = document.createElement("div");
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      renderConfirmBar({ text: "Start the right oven?", confirm: "Start", cancel: "Cancel", onConfirm, onCancel }),
      host,
    );
    const [cancel, start] = host.querySelectorAll("button");
    expect(text(host.querySelector(".question"))).toBe("Start the right oven?");
    expect(start.className).toContain("primary");
    // The two buttons wrap together, and the bar takes the action's color.
    expect(host.querySelectorAll(".actions button")).toHaveLength(2);
    expect(host.querySelector(".confirm")!.classList.contains("primary")).toBe(true);
    cancel.click();
    start.click();
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onConfirm).toHaveBeenCalledOnce();

    render(
      renderConfirmBar({ text: "Cancel the cycle?", confirm: "Yes", cancel: "No", onConfirm, onCancel, tone: "danger", busy: true }),
      host,
    );
    const buttons = host.querySelectorAll("button");
    expect(buttons[1].className).toContain("danger");
    expect(host.querySelector(".confirm")!.classList.contains("danger")).toBe(true);
    expect([...buttons].every((button) => button.disabled)).toBe(true);
  });
});
