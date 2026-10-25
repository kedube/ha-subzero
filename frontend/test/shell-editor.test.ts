// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import type { DrawingInput } from "../src/drawings/types";
import type { ApplianceContext, FamilyModel } from "../src/families/types";
// First, so Lit finds its dev-mode notice already silenced.
import { DEFAULT_APPEARANCE, SPECS, deferred, last, makeAppliance, makeHass, settle, text } from "./shell-fixtures";

const fake = vi.hoisted(() => ({ inputs: [] as DrawingInput[] }));

vi.mock("../src/families/index", () => {
  const model: FamilyModel = {
    drawingState: () => ({ available: true, doors: { ref_door_ajar: true }, readouts: { ref: "38°" } }),
    status: () => ({ text: "Normal", tone: "neutral" }),
    infoRows: () => [],
    display: () => null,
    sections: () => [],
  };
  return {
    familyModel: () => model,
    makeContext: (appliance: unknown, hass: unknown) => ({ appliance, hass }) as unknown as ApplianceContext,
  };
});

vi.mock("../src/drawings/index", async () => {
  const { html } = await import("lit");
  return {
    renderDrawing: (input: DrawingInput) => {
      fake.inputs.push(input);
      return html`<svg class="preview-drawing" viewBox="0 0 480 840"></svg>`;
    },
  };
});

vi.mock("../src/drawings/generic", async () => {
  const { html } = await import("lit");
  return { renderGeneric: () => html`<svg viewBox="0 0 300 360"></svg>` };
});

import type { AppearanceEditor } from "../src/views/appearance-editor";
import "../src/views/appearance-editor";
import type { HomeAssistant } from "../src/hass";
import type { PanelAppliance } from "../src/types";

const FRIDGE: PanelAppliance = makeAppliance("fridge", SPECS.sideBySide, {
  appearance_options: {
    finish: ["stainless", "panel", "black"],
    panel_colors: ["#f4f2ec", "#23324a", "#5b3a29"],
    knobs: null,
    handle: ["tubular", "pro", "none"],
    style: null,
    forms: ["side_by_side", "french_door", "over_under"],
  },
});

const RANGE: PanelAppliance = makeAppliance("range", SPECS.range, {
  appearance_options: { finish: [], panel_colors: [], knobs: ["red", "black", "stainless"], handle: null, style: null, forms: ["range"] },
});

async function mount(appliance: PanelAppliance = FRIDGE, over: Partial<HomeAssistant> = {}) {
  const callWS = vi.fn(async (message: Record<string, unknown>) => ({
    appearance: { ...appliance.appearance, ...((message.appearance as object | null) ?? DEFAULT_APPEARANCE) },
  }));
  const hass = makeHass({ callWS: callWS as unknown as HomeAssistant["callWS"], ...over });
  const editor = document.createElement("sz-appearance-editor");
  editor.hass = hass;
  editor.appliance = appliance;
  document.body.append(editor);
  await settle(editor);
  return { editor, callWS, hass };
}

const root = (editor: AppearanceEditor) => editor.shadowRoot!;

function group(editor: AppearanceEditor, label: string): HTMLElement | null {
  const field = [...root(editor).querySelectorAll(".field")].find((candidate) => text(candidate.querySelector(".label")) === label);
  return field?.querySelector<HTMLElement>('[role="radiogroup"]') ?? null;
}

function radio(editor: AppearanceEditor, label: string, option: string): HTMLButtonElement {
  const radios = [...group(editor, label)!.querySelectorAll<HTMLButtonElement>('[role="radio"]')];
  const found = radios.find((candidate) => (candidate.getAttribute("aria-label") ?? text(candidate)) === option);
  if (!found) throw new Error(`No ${option} in ${label}`);
  return found;
}

function button(editor: AppearanceEditor, label: string): HTMLButtonElement {
  return [...root(editor).querySelectorAll<HTMLButtonElement>(".actions button")].find((candidate) => text(candidate) === label)!;
}

afterEach(() => {
  document.body.innerHTML = "";
  fake.inputs.length = 0;
});

describe("sz-appearance-editor", () => {
  it("shows the fields the appliance offers and hides the rest", async () => {
    const { editor } = await mount();
    expect(group(editor, "Finish")).not.toBeNull();
    expect(group(editor, "Handles")).not.toBeNull();
    expect(group(editor, "Knobs")).toBeNull();
    expect(group(editor, "Style")).toBeNull();
    expect(group(editor, "Panel color")).toBeNull();
    expect(radio(editor, "Finish", "Stainless steel").getAttribute("aria-checked")).toBe("true");
    expect(radio(editor, "Handles", "Tubular").getAttribute("aria-checked")).toBe("true");
    expect(text(root(editor).querySelector(".note"))).toBe("How this appliance is drawn in the panel, for everyone who uses it.");
  });

  it("previews the pending look with the doors shut", async () => {
    const { editor } = await mount();
    radio(editor, "Handles", "Pro").click();
    await settle(editor);
    const input = last(fake.inputs)!;
    expect(input.appearance.handle).toBe("pro");
    expect(input.state.doors).toEqual({});
    expect(input.state.readouts).toEqual({ ref: "38°" });
    expect(input.state.available).toBe(true);
  });

  it("offers panel colors with a panel-ready finish, starting with the first", async () => {
    const { editor } = await mount();
    radio(editor, "Finish", "Panel-ready").click();
    await settle(editor);
    // The integration's colors by name; any other by its code.
    const swatch = radio(editor, "Panel color", "White");
    expect(swatch.getAttribute("aria-checked")).toBe("true");
    expect(swatch.title).toBe("White");
    expect(text(root(editor).querySelector(".chosen"))).toBe("White");
    expect(last(fake.inputs)!.appearance).toMatchObject({ finish: "panel", panel_color: "#f4f2ec" });

    radio(editor, "Panel color", "Panel color #23324A").click();
    await settle(editor);
    expect(last(fake.inputs)!.appearance.panel_color).toBe("#23324a");
    radio(editor, "Panel color", "Walnut").click();
    await settle(editor);
    expect(last(fake.inputs)!.appearance.panel_color).toBe("#5b3a29");

    const custom = root(editor).querySelector<HTMLInputElement>('input[type="color"]')!;
    custom.value = "#7A9E7E";
    custom.dispatchEvent(new Event("input"));
    await settle(editor);
    expect(last(fake.inputs)!.appearance.panel_color).toBe("#7a9e7e");
    expect(root(editor).querySelector(".swatch.custom.checked")).not.toBeNull();

    radio(editor, "Finish", "Black").click();
    await settle(editor);
    expect(group(editor, "Panel color")).toBeNull();
    expect(last(fake.inputs)!.appearance).toMatchObject({ finish: "black", panel_color: null });
  });

  it("saves only what changed", async () => {
    const { editor, callWS } = await mount();
    const save = button(editor, "Save");
    expect(save.disabled).toBe(true);
    radio(editor, "Handles", "None").click();
    await settle(editor);
    expect(button(editor, "Save").disabled).toBe(false);
    button(editor, "Save").click();
    await settle(editor);
    expect(callWS).toHaveBeenCalledWith({
      type: "subzero/panel/set_appearance",
      appliance_id: "app-fridge",
      appearance: { handle: "none" },
    });
    expect(text(root(editor).querySelector(".message.saved"))).toBe("Saved.");
    expect(button(editor, "Save").disabled).toBe(true);
  });

  it("waits while saving", async () => {
    const reply = deferred<unknown>();
    const { editor, callWS } = await mount();
    callWS.mockReturnValueOnce(reply.promise as never);
    radio(editor, "Handles", "Pro").click();
    await settle(editor);
    button(editor, "Save").click();
    await settle(editor);
    expect(text(button(editor, "Saving…"))).toBe("Saving…");
    expect(button(editor, "Saving…").disabled).toBe(true);
    expect(radio(editor, "Handles", "Tubular").disabled).toBe(true);
    reply.resolve({ appearance: { ...DEFAULT_APPEARANCE, handle: "pro" } });
    await settle(editor);
    expect(button(editor, "Save").disabled).toBe(true);
    expect(radio(editor, "Handles", "Pro").getAttribute("aria-checked")).toBe("true");
  });

  it("resets to the defaults once asked, since it changes the look for everyone", async () => {
    const { editor, callWS } = await mount({ ...FRIDGE, appearance: { ...DEFAULT_APPEARANCE, finish: "black" } });
    button(editor, "Reset to defaults").click();
    await settle(editor);
    expect(callWS).not.toHaveBeenCalled();
    const bar = root(editor).querySelector(".confirm")!;
    expect(text(bar.querySelector(".question"))).toBe("Reset how this appliance looks to the defaults, for everyone?");
    // The safe choice has focus.
    expect(root(editor).activeElement).toBe(bar.querySelector(".sz-button:not(.primary)"));
    bar.querySelector<HTMLButtonElement>(".sz-button.primary")!.click();
    await settle(editor);
    expect(callWS).toHaveBeenCalledWith({ type: "subzero/panel/set_appearance", appliance_id: "app-fridge", appearance: null });
    expect(root(editor).querySelector(".confirm")).toBeNull();
    expect(radio(editor, "Finish", "Stainless steel").getAttribute("aria-checked")).toBe("true");
  });

  it("keeps the look when the reset is called off", async () => {
    const { editor, callWS } = await mount({ ...FRIDGE, appearance: { ...DEFAULT_APPEARANCE, finish: "black" } });
    button(editor, "Reset to defaults").click();
    await settle(editor);
    root(editor).querySelector<HTMLButtonElement>(".confirm .sz-button:not(.primary)")!.click();
    await settle(editor);
    expect(root(editor).querySelector(".confirm")).toBeNull();
    expect(root(editor).activeElement).toBe(button(editor, "Reset to defaults"));
    button(editor, "Reset to defaults").click();
    await settle(editor);
    root(editor).querySelector(".confirm")!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true }));
    await settle(editor);
    expect(root(editor).querySelector(".confirm")).toBeNull();
    expect(callWS).not.toHaveBeenCalled();
    expect(radio(editor, "Finish", "Black").getAttribute("aria-checked")).toBe("true");
  });

  it("tells the preview's drawing the height it's shown at", async () => {
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
      const { editor } = await mount();
      expect(last(fake.inputs)!.pixelHeight).toBeUndefined();
      report!(235.6);
      await settle(editor);
      expect(last(fake.inputs)!.pixelHeight).toBe(236);
    } finally {
      globalThis.ResizeObserver = original;
    }
  });

  it("shows a failed save inline", async () => {
    const { editor, callWS } = await mount();
    callWS.mockRejectedValueOnce({ code: "unauthorized", message: "Unauthorized" });
    radio(editor, "Handles", "Pro").click();
    await settle(editor);
    button(editor, "Save").click();
    await settle(editor);
    const message = root(editor).querySelector(".message.error")!;
    expect(message.getAttribute("role")).toBe("alert");
    expect(text(message)).toBe("Couldn't save: Unauthorized");
    // The edit is kept, so it can be saved again.
    expect(button(editor, "Save").disabled).toBe(false);
  });

  it("marks the detected form, and choosing it clears the override", async () => {
    const { editor, callWS } = await mount();
    const select = root(editor).querySelector("select")!;
    expect([...select.options].map((option) => text(option))).toEqual([
      "Side-by-side (detected)",
      "French door",
      "Over-and-under",
    ]);
    select.value = "french_door";
    select.dispatchEvent(new Event("change"));
    await settle(editor);
    expect(last(fake.inputs)!.spec.form).toBe("french_door");
    button(editor, "Save").click();
    await settle(editor);
    expect(last(callWS.mock.calls)![0]).toMatchObject({ appearance: { form: "french_door" } });

    const overridden = { ...FRIDGE, spec: { ...SPECS.sideBySide, form: "french_door" as const }, appearance: { ...DEFAULT_APPEARANCE, form: "french_door" } };
    editor.appliance = overridden;
    await settle(editor);
    const again = root(editor).querySelector("select")!;
    again.value = "side_by_side";
    again.dispatchEvent(new Event("change"));
    await settle(editor);
    expect(last(fake.inputs)!.spec.form).toBe("side_by_side");
    button(editor, "Save").click();
    await settle(editor);
    expect(last(callWS.mock.calls)![0]).toMatchObject({ appearance: { form: null } });
  });

  it("shows a form another admin saved after a save of its own", async () => {
    const { editor } = await mount();
    const select = root(editor).querySelector("select")!;
    select.value = "french_door";
    select.dispatchEvent(new Event("change"));
    await settle(editor);
    button(editor, "Save").click();
    await settle(editor);
    // Another admin picks a different form; the pushed appliance brings it.
    editor.appliance = { ...FRIDGE, appearance: { ...DEFAULT_APPEARANCE, form: "over_under" } };
    await settle(editor);
    expect(root(editor).querySelector("select")!.value).toBe("over_under");
  });

  it("offers knob colors as swatches on a range", async () => {
    const { editor } = await mount(RANGE);
    expect(group(editor, "Finish")).toBeNull();
    expect(root(editor).querySelector("select")).toBeNull();
    const black = radio(editor, "Knobs", "Black");
    expect(black.classList.contains("swatch")).toBe(true);
    black.click();
    await settle(editor);
    expect(last(fake.inputs)!.appearance.knobs).toBe("black");
  });

  it("moves through a group with the arrow keys", async () => {
    const { editor } = await mount();
    const tubular = radio(editor, "Handles", "Tubular");
    expect(tubular.tabIndex).toBe(0);
    expect(radio(editor, "Handles", "Pro").tabIndex).toBe(-1);
    tubular.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
    await settle(editor);
    expect(radio(editor, "Handles", "Pro").getAttribute("aria-checked")).toBe("true");
    radio(editor, "Handles", "Pro").dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    await settle(editor);
    expect(radio(editor, "Handles", "Tubular").getAttribute("aria-checked")).toBe("true");
  });

  it("lets only admins change it", async () => {
    const { editor } = await mount(FRIDGE, { user: { is_admin: false } });
    expect(text(root(editor).querySelector(".note"))).toBe("Only administrators can change how an appliance is drawn.");
    expect(radio(editor, "Finish", "Black").disabled).toBe(true);
    expect(button(editor, "Reset to defaults").disabled).toBe(true);
    expect(root(editor).querySelector("select")!.disabled).toBe(true);
  });

  it("follows a saved change from elsewhere, but keeps unsaved edits", async () => {
    const { editor } = await mount();
    editor.appliance = { ...FRIDGE, appearance: { ...DEFAULT_APPEARANCE, finish: "black" } };
    await settle(editor);
    expect(radio(editor, "Finish", "Black").getAttribute("aria-checked")).toBe("true");

    radio(editor, "Handles", "Pro").click();
    await settle(editor);
    editor.appliance = { ...FRIDGE, appearance: { ...DEFAULT_APPEARANCE, finish: "stainless" } };
    await settle(editor);
    expect(radio(editor, "Handles", "Pro").getAttribute("aria-checked")).toBe("true");
    expect(radio(editor, "Finish", "Black").getAttribute("aria-checked")).toBe("true");
  });

  it("starts over for a different appliance", async () => {
    const { editor } = await mount();
    radio(editor, "Handles", "Pro").click();
    await settle(editor);
    editor.appliance = makeAppliance("other", SPECS.frenchDoor, { appearance_options: FRIDGE.appearance_options });
    await settle(editor);
    expect(radio(editor, "Handles", "Tubular").getAttribute("aria-checked")).toBe("true");
  });
});
