// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DrawingInput } from "../src/drawings/types";
import type { ApplianceContext, FamilyModel } from "../src/families/types";
// First, so Lit finds its dev-mode notice already silenced.
import {
  SPECS,
  deep,
  deepAll,
  flush,
  makeAppliance,
  makeConnection,
  makeHass,
  settle,
  text,
  type FakeConnection,
} from "./shell-fixtures";

// The shell is tested with stand-ins for the parts other modules own: the family models, the
// drawings and the full view.
vi.mock("../src/families/index", () => {
  const model: FamilyModel = {
    drawingState: (ctx) => ({ available: ctx.appliance.available, doors: {}, readouts: {} }),
    status: () => ({ text: "Normal", tone: "neutral" }),
    infoRows: () => [{ label: "Mode", value: "Normal" }],
    display: () => null,
    sections: () => [],
  };
  return {
    familyModel: () => model,
    makeContext: (appliance: unknown, hass: unknown, t: unknown, now: unknown) =>
      ({ appliance, hass, t, now }) as unknown as ApplianceContext,
  };
});

vi.mock("../src/drawings/index", async () => {
  const { html } = await import("lit");
  return { renderDrawing: (_input: DrawingInput) => html`<svg viewBox="0 0 480 840"></svg>` };
});

vi.mock("../src/drawings/generic", async () => {
  const { html } = await import("lit");
  return { renderGeneric: () => html`<svg viewBox="0 0 300 360"></svg>` };
});

vi.mock("../src/views/appliance-view", () => {
  if (!customElements.get("sz-appliance-view")) {
    customElements.define("sz-appliance-view", class extends HTMLElement {});
  }
  return {};
});

import type { SubZeroPanel } from "../src/subzero-panel";
import "../src/subzero-panel";
import type { HomeAssistant } from "../src/hass";
import type { PanelAppliance } from "../src/types";

const FRIDGE = makeAppliance("fridge", SPECS.sideBySide);
const RANGE = makeAppliance("range", SPECS.range);
const DISHWASHER = makeAppliance("dishwasher", SPECS.dishwasher);

function hassWith(connection: FakeConnection, over: Partial<HomeAssistant> = {}): HomeAssistant {
  return makeHass({
    connection: connection as unknown as HomeAssistant["connection"],
    areas: { kitchen: { area_id: "kitchen", name: "Kitchen" }, scullery: { area_id: "scullery", name: "Scullery" } },
    devices: {
      "dev-fridge": { id: "dev-fridge", name: "Refrigerator", name_by_user: null, area_id: "kitchen" },
      "dev-range": { id: "dev-range", name: "Range", name_by_user: null, area_id: "kitchen" },
      "dev-dishwasher": { id: "dev-dishwasher", name: "Dishwasher", name_by_user: null, area_id: "scullery" },
    },
    ...over,
  });
}

interface Mounted {
  panel: SubZeroPanel;
  connection: FakeConnection;
  hass: HomeAssistant;
}

async function mount(
  options: { path?: string; narrow?: boolean; appliances?: PanelAppliance[] | null; hass?: Partial<HomeAssistant> } = {},
): Promise<Mounted> {
  const connection = makeConnection();
  const hass = hassWith(connection, options.hass);
  const panel = document.createElement("subzero-panel");
  panel.hass = hass;
  panel.narrow = options.narrow ?? false;
  panel.route = { prefix: "/sub-zero", path: options.path ?? "" };
  panel.panel = { url_path: "sub-zero" };
  document.body.append(panel);
  await settle(panel);
  if (options.appliances !== null) {
    connection.send({ appliances: options.appliances ?? [DISHWASHER, RANGE, FRIDGE] });
    await settle(panel);
  }
  return { panel, connection, hass };
}

async function route(panel: SubZeroPanel, path: string) {
  panel.route = { prefix: "/sub-zero", path };
  await settle(panel);
}

beforeEach(() => {
  history.replaceState(null, "", "/sub-zero");
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("subzero-panel", () => {
  it("shows a loading state until the first message, subscribing once", async () => {
    const { panel, connection } = await mount({ appliances: null });
    expect(connection.subscribeMessage).toHaveBeenCalledOnce();
    expect(connection.subscribeMessage.mock.calls[0][1]).toEqual({ type: "subzero/panel/subscribe" });
    expect(deep(panel, ".spinner")).not.toBeNull();
    expect(text(deep(panel, ".state"))).toContain("Loading appliances");

    panel.hass = { ...panel.hass! };
    await settle(panel);
    expect(connection.subscribeMessage).toHaveBeenCalledOnce();
  });

  it("shows the overview by area once the appliances arrive", async () => {
    const { panel } = await mount();
    expect(deep(panel, ".spinner")).toBeNull();
    const headings = deepAll(panel, "sz-overview", "h2").map(text);
    expect(headings).toEqual(["Kitchen", "Scullery"]);
    const cards = deepAll(panel, "sz-overview", "sz-appliance-card");
    expect(cards.map((card) => text(card.shadowRoot!.querySelector(".name")))).toEqual([
      "Refrigerator",
      "Range",
      "Dishwasher",
    ]);
    expect(text(deep(panel, ".toolbar .title"))).toBe("Sub-Zero");
  });

  it("opens an appliance from its card, the way Home Assistant navigates", async () => {
    const { panel } = await mount();
    const heard = vi.fn();
    window.addEventListener("location-changed", heard);
    deepAll(panel, "sz-overview", "sz-appliance-card")[1].click();
    window.removeEventListener("location-changed", heard);
    expect(location.pathname).toBe("/sub-zero/dev-range");
    expect(heard).toHaveBeenCalledOnce();
  });

  it("shows the full view with the toolbar's back arrow and the appliance's name", async () => {
    const { panel, hass } = await mount({ narrow: true });
    await route(panel, "/dev-range");
    const view = deep(panel, "sz-appliance-view") as HTMLElement & Record<string, unknown>;
    expect(view).not.toBeNull();
    expect(view.appliance).toBe(RANGE);
    expect(view.hass).toBe(hass);
    expect(view.narrow).toBe(true);
    expect(view.isAdmin).toBe(true);
    expect(typeof view.now).toBe("number");
    expect(view.helpers).toHaveProperty("since");
    expect(text(deep(panel, ".toolbar .title"))).toBe("Range");
    const buttons = deepAll(panel, ".toolbar button");
    expect(buttons.map((button) => button.getAttribute("aria-label"))).toEqual(["Back"]);
  });

  it("goes back through history after opening from the overview", async () => {
    const { panel } = await mount();
    const back = vi.spyOn(history, "back").mockImplementation(() => {});
    deepAll(panel, "sz-overview", "sz-appliance-card")[0].click();
    await route(panel, "/dev-fridge");
    deep(panel, ".toolbar button")!.click();
    expect(back).toHaveBeenCalledOnce();
  });

  it("replaces the entry when going back from a direct link", async () => {
    const { panel } = await mount({ path: "/dev-fridge" });
    const back = vi.spyOn(history, "back").mockImplementation(() => {});
    const before = history.length;
    deep(panel, ".toolbar button")!.click();
    expect(back).not.toHaveBeenCalled();
    expect(location.pathname).toBe("/sub-zero");
    expect(history.length).toBe(before);
  });

  it("says when an appliance isn't there, with a way back", async () => {
    const { panel } = await mount({ path: "/dev-gone" });
    expect(text(deep(panel, ".state h2"))).toBe("Appliance not found");
    expect(text(deep(panel, ".toolbar .title"))).toBe("Sub-Zero");
    deep(panel, ".state button")!.click();
    expect(location.pathname).toBe("/sub-zero");
  });

  it("offers Home Assistant's sidebar menu on narrow screens", async () => {
    const { panel } = await mount();
    expect(deep(panel, ".toolbar button")).toBeNull();
    panel.narrow = true;
    await settle(panel);
    const toggled = vi.fn((event: Event) => [event.bubbles, event.composed]);
    document.addEventListener("hass-toggle-menu", toggled);
    deep(panel, ".toolbar button")!.click();
    document.removeEventListener("hass-toggle-menu", toggled);
    expect(toggled).toHaveBeenCalledOnce();
    expect(toggled.mock.results[0].value).toEqual([true, true]);
  });

  it("subscribes again on a new connection and unsubscribes when removed", async () => {
    const { panel, connection } = await mount();
    const next = makeConnection();
    panel.hass = { ...panel.hass!, connection: next as unknown as HomeAssistant["connection"] };
    await settle(panel);
    expect(connection.unsubscribe).toHaveBeenCalledOnce();
    expect(next.subscribeMessage).toHaveBeenCalledOnce();
    // The old connection's messages no longer count.
    connection.send({ appliances: [] });
    await settle(panel);
    expect(deepAll(panel, "sz-overview", "sz-appliance-card")).toHaveLength(3);

    panel.remove();
    await flush();
    expect(next.unsubscribe).toHaveBeenCalledOnce();
    document.body.append(panel);
    await settle(panel);
    expect(next.subscribeMessage).toHaveBeenCalledTimes(2);
  });

  it("shows a subscription error with a retry", async () => {
    const connection = makeConnection();
    connection.subscribeMessage.mockRejectedValueOnce({ code: "unknown_command", message: "Unknown command." });
    const panel = document.createElement("subzero-panel");
    panel.hass = hassWith(connection);
    panel.route = { prefix: "/sub-zero", path: "" };
    document.body.append(panel);
    await settle(panel);
    // Laid out like the other states: a heading, Home Assistant's message, then the action.
    expect(text(deep(panel, ".state h2"))).toBe("Couldn't load the appliances");
    expect(text(deep(panel, ".state p"))).toBe("Unknown command.");
    expect(deep(panel, ".state")!.getAttribute("role")).toBe("alert");
    deep(panel, ".state button")!.click();
    await settle(panel);
    expect(connection.subscribeMessage).toHaveBeenCalledTimes(2);
    expect(deep(panel, ".spinner")).not.toBeNull();
    connection.send({ appliances: [FRIDGE] });
    await settle(panel);
    expect(deepAll(panel, "sz-overview", "sz-appliance-card")).toHaveLength(1);
  });

  it("links admins to the integration when there are no appliances", async () => {
    const { panel } = await mount({ appliances: [] });
    const link = deep<HTMLAnchorElement>(panel, "sz-overview", ".empty a")!;
    expect(link.getAttribute("href")).toBe("/config/integrations/integration/subzero");
    expect(text(deep(panel, "sz-overview", ".empty h2"))).toBe("No appliances yet");

    const user = await mount({ appliances: [], hass: { user: { is_admin: false } } });
    expect(deep(user.panel, "sz-overview", ".empty a")).toBeNull();
  });

  it("leaves out the heading when every appliance is in no area", async () => {
    const { panel } = await mount({ hass: { devices: {} } });
    expect(deepAll(panel, "sz-overview", "h2")).toHaveLength(0);
    expect(deepAll(panel, "sz-overview", "sz-appliance-card")).toHaveLength(3);
  });

  it("ticks its clock every second while connected", async () => {
    vi.useFakeTimers({ now: Date.parse("2026-10-24T12:00:00.000Z"), toFake: ["setTimeout", "clearTimeout", "Date"] });
    const { panel } = await mount();
    const first = panel.now;
    // It ticks just after each whole second.
    await vi.advanceTimersByTimeAsync(1010);
    expect(panel.now).toBe(first + 1005);
    await vi.advanceTimersByTimeAsync(1000);
    expect(panel.now).toBe(first + 2005);
    const card = deepAll(panel, "sz-overview", "sz-appliance-card")[0] as HTMLElement & { now: number };
    await settle(panel);
    expect(card.now).toBe(panel.now);

    panel.remove();
    const stopped = panel.now;
    await vi.advanceTimersByTimeAsync(3000);
    expect(panel.now).toBe(stopped);
  });

  it("moves focus to Back after opening an appliance, and back to its card on return", async () => {
    const { panel } = await mount();
    const card = deepAll(panel, "sz-overview", "sz-appliance-card")[1];
    card.focus();
    card.click();
    await route(panel, "/dev-range");
    const back = deep(panel, ".toolbar .icon-button")!;
    expect(panel.shadowRoot!.activeElement).toBe(back);
    await route(panel, "");
    await settle(panel);
    const overview = deep(panel, "sz-overview")!;
    const range = deepAll(panel, "sz-overview", "sz-appliance-card")[1];
    expect(text(range.shadowRoot!.querySelector(".name"))).toBe("Range");
    expect(overview.shadowRoot!.activeElement).toBe(range);
  });

  it("leaves focus alone on the first route, and when it's elsewhere in Home Assistant", async () => {
    const { panel } = await mount({ path: "/dev-range" });
    expect(panel.shadowRoot!.activeElement).toBeNull();
    const search = document.createElement("input");
    document.body.append(search);
    search.focus();
    await route(panel, "");
    expect(document.activeElement).toBe(search);
  });

  it("reaches over the padding Home Assistant puts around a custom panel", async () => {
    const { panel } = await mount();
    expect(panel.hasAttribute("framed")).toBe(false);
    // ha-panel-custom pads itself by the safe-area insets unless the panel handles them.
    const frame = document.createElement("div");
    frame.style.paddingTop = "47px";
    document.body.append(frame);
    frame.append(panel);
    await settle(panel);
    expect(panel.hasAttribute("framed")).toBe(true);
  });

  it("reflects the dark theme", async () => {
    const { panel } = await mount({ hass: { themes: { darkMode: true } } });
    expect(panel.hasAttribute("dark")).toBe(true);
  });
});
