// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../src/controls/index";
import { VALUE_EVENT } from "../src/controls/index";
import { COMMIT_DELAY_MS } from "../src/controls/setpoint";
import { minutesUntil } from "../src/controls/ice-delay";
import type { Control } from "../src/families/types";
import { makeTranslate } from "../src/i18n";

type Mounted = HTMLElement & {
  control: Control;
  pending: boolean;
  error: string | null;
  updateComplete: Promise<boolean>;
};

const tags: Record<Control["kind"], string> = {
  setpoint: "sz-setpoint",
  select: "sz-select",
  toggle: "sz-toggle",
  action: "sz-action",
  duration: "sz-duration",
  fan: "sz-fan",
  light: "sz-light",
  reading: "sz-reading",
  countdown: "sz-countdown",
  ice_delay: "sz-ice-delay",
};

async function mount(control: Control, language = "en"): Promise<{ element: Mounted; sent: unknown[] }> {
  const element = document.createElement(tags[control.kind]) as Mounted;
  Object.assign(element, { control, t: makeTranslate(language) });
  const sent: unknown[] = [];
  element.addEventListener(VALUE_EVENT, (event) => sent.push((event as CustomEvent<{ value: unknown }>).detail.value));
  document.body.append(element);
  await element.updateComplete;
  return { element, sent };
}

const root = (element: HTMLElement) => element.shadowRoot!;
const buttons = (element: HTMLElement) => [...root(element).querySelectorAll("button")];
const byText = (element: HTMLElement, text: string) => {
  const found = buttons(element).find((button) => button.textContent?.trim() === text);
  if (!found) throw new Error(`no button "${text}" in ${buttons(element).map((button) => button.textContent?.trim()).join(" | ")}`);
  return found;
};
const text = (element: HTMLElement) => root(element).textContent?.replace(/\s+/g, " ").trim() ?? "";

async function settle(element: Mounted): Promise<void> {
  await element.updateComplete;
  await element.updateComplete;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
});

const setpoint: Control = {
  kind: "setpoint",
  id: "ref_set_temp",
  label: "Refrigerator",
  action: { type: "number", entity_id: "number.ref" },
  value: 38,
  min: 34,
  max: 42,
  step: 1,
  unit: "°F",
};

describe("setpoint", () => {
  beforeEach(() => vi.useFakeTimers());

  it("sends once, 600 ms after the last press", async () => {
    const { element, sent } = await mount(setpoint);
    expect(text(element)).toContain("38°F");
    const plus = buttons(element)[1];
    plus.click();
    plus.click();
    await settle(element);
    vi.advanceTimersByTime(COMMIT_DELAY_MS - 1);
    plus.click();
    await settle(element);
    expect(text(element)).toContain("41°F");
    vi.advanceTimersByTime(COMMIT_DELAY_MS - 1);
    expect(sent).toEqual([]);
    vi.advanceTimersByTime(1);
    expect(sent).toEqual([41]);
  });

  it("stays within the limits and sends nothing for no change", async () => {
    const { element, sent } = await mount({ ...setpoint, value: 41 });
    const [minus, plus] = buttons(element);
    plus.click();
    plus.click();
    await settle(element);
    expect(text(element)).toContain("42°F");
    // Only marked at the limit, so a keyboard user's focus stays on it.
    expect(plus.disabled).toBe(false);
    expect(plus.getAttribute("aria-disabled")).toBe("true");
    expect(minus.hasAttribute("aria-disabled")).toBe(false);
    minus.click();
    vi.advanceTimersByTime(COMMIT_DELAY_MS);
    await settle(element);
    expect(sent).toEqual([]);
  });

  it("keeps focus on a button that reaches its limit, and a press there does nothing", async () => {
    const { element, sent } = await mount({ ...setpoint, value: 42 });
    const plus = buttons(element)[1];
    plus.focus();
    plus.click();
    await settle(element);
    expect(root(element).activeElement).toBe(plus);
    expect(root(element).querySelector(".stepper.draft")).toBeNull();
    vi.advanceTimersByTime(COMMIT_DELAY_MS);
    expect(sent).toEqual([]);
  });

  it("sends a pending change when it's taken away before the delay", async () => {
    const { element, sent } = await mount(setpoint);
    buttons(element)[1].click();
    element.remove();
    expect(sent).toEqual([39]);
    vi.advanceTimersByTime(COMMIT_DELAY_MS);
    expect(sent).toEqual([39]);
  });

  it("starts from the middle of the range when there's no value, and steps by the entity's step", async () => {
    const { element, sent } = await mount({ ...setpoint, value: null, min: 200, max: 550, step: 5, unit: "°F" });
    // A blank display, not a dash between the minus and plus.
    expect(root(element).querySelector("output.empty")?.textContent?.replace(/\s+/g, "")).toBe("--°F");
    buttons(element)[1].click();
    vi.advanceTimersByTime(COMMIT_DELAY_MS);
    expect(sent).toEqual([375]);
  });

  it("writes decimals in the user's number format", async () => {
    const { element } = await mount({ ...setpoint, value: 3.5, min: 1, max: 6, step: 0.5, unit: "°C" });
    const german = element as Mounted & { formatNumber: (value: number, decimals: number) => string };
    german.formatNumber = (value, decimals) => value.toFixed(decimals).replace(".", ",");
    await settle(element);
    expect(text(element)).toContain("3,5°C");
  });

  it("goes back to the entity's value when the call fails", async () => {
    const { element } = await mount(setpoint);
    buttons(element)[1].click();
    vi.advanceTimersByTime(COMMIT_DELAY_MS);
    element.pending = true;
    await settle(element);
    expect(text(element)).toContain("39°F");
    element.pending = false;
    element.error = "The temperature is outside the appliance's range.";
    await settle(element);
    expect(text(element)).toContain("38°F");
    expect(root(element).querySelector("[role=alert]")?.textContent).toBe("The temperature is outside the appliance's range.");
  });

  it("is locked with its reason, which it's read out with", async () => {
    const { element, sent } = await mount({ ...setpoint, disabled: true, reason: "Sabbath mode is on. Turn it off to change this." });
    // Marked, not disabled, so the keyboard reaches it and hears why.
    expect(buttons(element).every((button) => !button.disabled && button.getAttribute("aria-disabled") === "true")).toBe(true);
    const reason = root(element).querySelector(".reason")!;
    expect(reason.textContent?.trim()).toBe("Sabbath mode is on. Turn it off to change this.");
    expect(buttons(element).every((button) => button.getAttribute("aria-describedby") === reason.id)).toBe(true);
    buttons(element)[1].click();
    vi.advanceTimersByTime(COMMIT_DELAY_MS);
    expect(sent).toEqual([]);
  });

  it("keeps a reason the section shows for several controls, for screen readers only", async () => {
    const { element } = await mount({ ...setpoint, disabled: true, reason: "Sabbath mode is on. Turn it off to change this." });
    (element as Mounted & { sharedReason: boolean }).sharedReason = true;
    await settle(element);
    const reason = root(element).querySelector(".reason")!;
    expect(reason.classList.contains("visually-hidden")).toBe(true);
    expect(buttons(element)[0].getAttribute("aria-describedby")).toBe(reason.id);
  });
});

describe("select", () => {
  const options = ["Normal", "Sabbath", "High use", "Short vacation", "Long vacation"].map((value) => ({ value, label: value }));
  const select: Control = {
    kind: "select",
    id: "operating_mode",
    label: "Mode",
    action: { type: "select", entity_id: "select.mode" },
    value: "Normal",
    options,
  };

  it("shows up to five options side by side and sends the one chosen", async () => {
    const { element, sent } = await mount(select);
    expect(root(element).querySelector("select")).toBeNull();
    expect(byText(element, "Normal").getAttribute("aria-pressed")).toBe("true");
    byText(element, "High use").click();
    await settle(element);
    expect(sent).toEqual(["High use"]);
    expect(byText(element, "High use").getAttribute("aria-pressed")).toBe("true");
    byText(element, "High use").click();
    expect(sent).toEqual(["High use"]);
  });

  it("says what it's set to when none of the choices is", async () => {
    // With no value, nothing is lit and there's no stray dash beside the choices.
    const { element } = await mount({ ...select, options: options.slice(0, 3), value: null, disabled: true });
    expect(root(element).querySelector(".aside")).toBeNull();
    expect(root(element).querySelector(".hint")).toBeNull();
    expect(buttons(element).every((button) => button.getAttribute("aria-pressed") === "false")).toBe(true);
    // A value outside the choices shows under the label.
    const other = await mount({ ...select, options: options.slice(0, 3), value: "Long vacation" }, "de");
    expect(root(other.element).querySelector(".hint")?.textContent).toBe("Aktuell Langer Urlaub");
    expect(byText(other.element, "Normal").getAttribute("aria-describedby")).toBe("hint");
    const chosen = await mount(select);
    expect(root(chosen.element).querySelector(".hint")).toBeNull();
  });

  const cycles = ["Auto", "Normal", "Heavy", "Quick", "Pots and pans", "Light"].map((value) => ({ value, label: value }));

  it("uses a dropdown for more", async () => {
    const { element, sent } = await mount({ ...select, options: cycles, value: "Auto" });
    const dropdown = root(element).querySelector("select")!;
    expect(dropdown.options).toHaveLength(6);
    expect(dropdown.value).toBe("Auto");
    dropdown.value = "Heavy";
    dropdown.dispatchEvent(new Event("change"));
    expect(sent).toEqual(["Heavy"]);
  });

  it("opens the dropdown for keys that would change it closed, so a key press never acts", async () => {
    const { element, sent } = await mount({ ...select, options: cycles, value: "Auto" });
    const dropdown = root(element).querySelector("select")! as HTMLSelectElement & { showPicker: () => void };
    dropdown.showPicker = vi.fn();
    const press = (key: string, init: KeyboardEventInit = {}) => {
      const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
      dropdown.dispatchEvent(event);
      return event.defaultPrevented;
    };
    // A typed letter or an arrow would pick an option at once (typing "o" in Cooking mode, Off).
    expect(["o", "ArrowDown", "ArrowUp", "Home", "End", "PageDown", "é"].map((key) => press(key))).toEqual([
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ]);
    expect(dropdown.showPicker).toHaveBeenCalledTimes(7);
    // The keys that open it, move focus, or belong to the browser, pass.
    expect([press(" "), press("Enter"), press("Tab"), press("ArrowDown", { altKey: true }), press("r", { ctrlKey: true })]).toEqual([
      false,
      false,
      false,
      false,
      false,
    ]);
    expect(sent).toEqual([]);
  });

  it("keeps a locked dropdown focusable but shut", async () => {
    const { element, sent } = await mount({ ...select, options: cycles, value: "Auto", disabled: true, reason: "Can change only while the dishwasher is idle." });
    const dropdown = root(element).querySelector("select")!;
    expect(dropdown.disabled).toBe(false);
    expect(dropdown.getAttribute("aria-disabled")).toBe("true");
    expect(dropdown.getAttribute("aria-describedby")).toBe("reason");
    const press = (key: string) => {
      const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
      dropdown.dispatchEvent(event);
      return event.defaultPrevented;
    };
    expect([press(" "), press("Enter"), press("ArrowDown"), press("x")]).toEqual([true, true, true, true]);
    // Moving on, and the browser's own shortcuts, still work from it.
    expect([press("Tab"), press("F5"), press("Escape")]).toEqual([false, false, false]);
    dropdown.value = "Heavy";
    dropdown.dispatchEvent(new Event("change"));
    expect(sent).toEqual([]);
  });
});

describe("toggle", () => {
  const toggle: Control = { kind: "toggle", id: "air_filter_on", label: "Air purification", action: { type: "switch", entity_id: "switch.air" }, value: false };

  it("flips, showing the new state until the entity reports it", async () => {
    const { element, sent } = await mount(toggle);
    const button = root(element).querySelector<HTMLButtonElement>("[role=switch]")!;
    expect(button.getAttribute("aria-checked")).toBe("false");
    button.click();
    await settle(element);
    expect(sent).toEqual([true]);
    expect(root(element).querySelector("[role=switch]")!.getAttribute("aria-checked")).toBe("true");
    element.error = "Nope";
    await settle(element);
    expect(root(element).querySelector("[role=switch]")!.getAttribute("aria-checked")).toBe("false");
  });

  it("shows a locked switch without a state as unknown, not as off", async () => {
    const { element } = await mount({ ...toggle, value: null, disabled: true, reason: "Wash options can change only while the dishwasher is idle." });
    expect(root(element).querySelector("[role=switch]")).toBeNull();
    expect(root(element).querySelector(".reading")?.textContent).toBe("—");
    // One that can still be used shows its thumb between off and on.
    const usable = await mount({ ...toggle, value: null });
    const button = root(usable.element).querySelector<HTMLButtonElement>("[role=switch]")!;
    expect(button.classList.contains("unknown")).toBe(true);
    button.click();
    expect(usable.sent).toEqual([true]);
  });

  it("shows a spinner while pending", async () => {
    const { element } = await mount(toggle);
    element.pending = true;
    await settle(element);
    expect(root(element).querySelector(".spinner")).not.toBeNull();
  });
});

describe("action", () => {
  const start: Control = {
    kind: "action",
    id: "remote_start_cav_unit_on",
    label: "Remote start",
    action: { type: "button", entity_id: "button.start" },
    confirm: "Start the right oven at Bake 350°?",
    button: "Start",
    tone: "primary",
  };

  it("asks in the confirmation bar before acting", async () => {
    const { element, sent } = await mount(start);
    byText(element, "Start").click();
    await settle(element);
    expect(root(element).querySelector(".confirm .question")?.textContent).toBe("Start the right oven at Bake 350°?");
    byText(element, "Not now").click();
    await settle(element);
    expect(root(element).querySelector(".confirm")).toBeNull();
    expect(sent).toEqual([]);
    byText(element, "Start").click();
    await settle(element);
    const go = root(element).querySelector<HTMLButtonElement>(".confirm .sz-button.primary")!;
    go.click();
    await settle(element);
    expect(sent).toEqual([undefined]);
    expect(root(element).querySelector(".confirm")).toBeNull();
  });

  it("puts focus back on its button after confirming, marked busy while the call runs", async () => {
    const { element } = await mount(start);
    byText(element, "Start").click();
    await settle(element);
    root(element).querySelector<HTMLButtonElement>(".confirm .sz-button.primary")!.click();
    element.pending = true;
    await settle(element);
    const button = byText(element, "Start");
    expect(root(element).activeElement).toBe(button);
    expect(button.disabled).toBe(false);
    expect(button.getAttribute("aria-disabled")).toBe("true");
  });

  it("closes the bar with Escape", async () => {
    const { element, sent } = await mount(start);
    byText(element, "Start").click();
    await settle(element);
    root(element).querySelector(".confirm")!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true }));
    await settle(element);
    expect(root(element).querySelector(".confirm")).toBeNull();
    expect(sent).toEqual([]);
  });

  it("acts at once without a question, and not while locked", async () => {
    const { element, sent } = await mount({ ...start, confirm: null, button: "Reset" });
    byText(element, "Reset").click();
    expect(sent).toEqual([undefined]);
    const locked = await mount({ ...start, disabled: true, reason: "Close the oven door first." });
    const button = byText(locked.element, "Start");
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.getAttribute("aria-describedby")).toBe("reason");
    expect(text(locked.element)).toContain("Close the oven door first.");
    button.click();
    await settle(locked.element);
    expect(root(locked.element).querySelector(".confirm")).toBeNull();
    expect(locked.sent).toEqual([]);
  });

  it("translates its own words", async () => {
    const { element } = await mount(start, "de");
    byText(element, "Start").click();
    await settle(element);
    expect(byText(element, "Nicht jetzt")).toBeTruthy();
  });
});

describe("duration", () => {
  const timer: Control = {
    kind: "duration",
    id: "kitchen_timer_duration",
    label: "Duration",
    action: { type: "number", entity_id: "number.timer" },
    value: 0,
    min: 0,
    max: 719,
    presets: [5, 10, 15],
  };

  it("offers Off, the presets and a custom value in minutes", async () => {
    const { element, sent } = await mount(timer);
    expect(buttons(element).map((button) => button.textContent?.trim())).toEqual(["Off", "5 min", "10 min", "15 min", "Custom"]);
    byText(element, "10 min").click();
    expect(sent).toEqual([10]);
    await settle(element);
    byText(element, "Custom").click();
    await settle(element);
    const input = root(element).querySelector<HTMLInputElement>("input[type=number]")!;
    input.value = "25";
    root(element).querySelector("form")!.dispatchEvent(new Event("submit", { cancelable: true }));
    expect(sent).toEqual([10, 25]);
  });
});

describe("fan", () => {
  it("sends the speed, 0 for off", async () => {
    const { element, sent } = await mount({
      kind: "fan",
      id: "fan_on",
      label: "Fan",
      action: { type: "fan", entity_id: "fan.hood", speeds: 4 },
      value: 2,
      speeds: 4,
    });
    expect(buttons(element).map((button) => button.textContent?.trim())).toEqual(["Off", "1", "2", "3", "4"]);
    expect(byText(element, "2").getAttribute("aria-pressed")).toBe("true");
    byText(element, "3").click();
    byText(element, "Off").click();
    expect(sent).toEqual([3, 0]);
  });
});

describe("light", () => {
  const lamp: Control = {
    kind: "light",
    id: "light_on",
    label: "Task light",
    action: { type: "light", entity_id: "light.task" },
    on: true,
    brightness: 80,
    kelvin: 3850,
    min_kelvin: 2700,
    max_kelvin: 5000,
  };

  it("turns off, and sends a slider's value when it's let go", async () => {
    const { element, sent } = await mount(lamp);
    const [brightness, kelvin] = [...root(element).querySelectorAll<HTMLInputElement>("input[type=range]")];
    expect(brightness.value).toBe("80");
    expect(kelvin.min).toBe("2700");
    brightness.value = "60";
    brightness.dispatchEvent(new Event("input"));
    brightness.dispatchEvent(new Event("change"));
    kelvin.value = "4100";
    kelvin.dispatchEvent(new Event("change"));
    root(element).querySelector<HTMLButtonElement>("[role=switch]")!.click();
    expect(sent).toEqual([{ on: true, brightness: 60 }, { on: true, kelvin: 4100 }, { on: false }]);
  });

  it("hides the sliders while off", async () => {
    const { element } = await mount({ ...lamp, on: false, brightness: null, kelvin: null });
    expect(root(element).querySelector("input[type=range]")).toBeNull();
  });
});

describe("reading and countdown", () => {
  it("shows a value in its tone", async () => {
    const { element } = await mount({ kind: "reading", id: "rinse_aid_low", label: "Rinse aid", value: "Low", tone: "warning" });
    expect(root(element).querySelector(".reading")?.getAttribute("data-tone")).toBe("warning");
    expect(text(element)).toContain("Rinse aid");
  });

  it("ticks every second", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(Date.parse("2026-10-24T18:00:00Z"));
    const { element } = await mount({ kind: "countdown", id: "t", label: "Time left", end: "2026-10-24T18:04:12Z" });
    expect(root(element).querySelector(".reading")?.textContent).toBe("4:12");
    // It ticks just after each second, with the panel's clock.
    vi.advanceTimersByTime(1010);
    await settle(element);
    expect(root(element).querySelector(".reading")?.textContent).toBe("4:11");
    const none = await mount({ kind: "countdown", id: "u", label: "Time left", end: null });
    expect(root(none.element).querySelector(".reading")?.textContent).toBe("—");
  });
});

describe("ice delay form", () => {
  it("counts minutes until a time later today, or tomorrow once it's passed", () => {
    const now = new Date(2026, 9, 24, 18, 30, 20);
    expect(minutesUntil("22:00", now)).toBe(210);
    expect(minutesUntil("18:31", now)).toBe(1);
    expect(minutesUntil("08:00", now)).toBe(810);
    expect(minutesUntil("18:30", now)).toBe(1439);
    expect(minutesUntil("nope", now)).toBeNull();
  });

  it("reads the time on the server's clock when the user's profile asks for it", () => {
    // 18:30:20 UTC is 14:30:20 in New York and 03:30:20 the next day in Tokyo.
    const now = new Date(Date.UTC(2026, 9, 24, 18, 30, 20));
    expect(minutesUntil("22:00", now, "America/New_York")).toBe(450);
    expect(minutesUntil("04:00", now, "Asia/Tokyo")).toBe(30);
    expect(minutesUntil("22:00", now, "UTC")).toBe(210);
  });

  it("schedules from the zone it's given", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(Date.UTC(2026, 9, 24, 18, 30, 20));
    const { element, sent } = await mount({ kind: "ice_delay", id: "schedule_ice_delay", label: "New ice delay", device_id: "device_ice" });
    (element as unknown as { timeZone: string }).timeZone = "America/New_York";
    byText(element, "Later today").click();
    await settle(element);
    byText(element, "Schedule").click();
    expect(sent).toEqual([{ duration: 8, start_in: 450, repeat: false }]);
  });

  it("sends hours, minutes from now and whether it repeats", async () => {
    const { element, sent } = await mount({ kind: "ice_delay", id: "schedule_ice_delay", label: "New ice delay", device_id: "device_ice" });
    byText(element, "Schedule").click();
    expect(sent).toEqual([{ duration: 8, start_in: 0, repeat: false }]);
    buttons(element)[1].click(); // plus an hour
    root(element).querySelector<HTMLButtonElement>("[role=switch]")!.click();
    await settle(element);
    expect(text(element)).toContain("9 h");
    byText(element, "Schedule").click();
    expect(sent[1]).toEqual({ duration: 9, start_in: 0, repeat: true });
    byText(element, "Later today").click();
    await settle(element);
    expect(root(element).querySelector("input[type=time]")).not.toBeNull();
    byText(element, "Schedule").click();
    expect((sent[2] as { start_in: number }).start_in).toBe(minutesUntil("22:00", new Date()));
  });

  it("waits while disabled", async () => {
    const { element, sent } = await mount({
      kind: "ice_delay",
      id: "schedule_ice_delay",
      label: "New ice delay",
      device_id: "device_ice",
      disabled: true,
      reason: "Sabbath mode is on. Turn it off to change this.",
    });
    expect(byText(element, "Schedule").disabled).toBe(true);
    expect(sent).toEqual([]);
    expect(text(element)).toContain("Sabbath mode is on.");
  });
});
