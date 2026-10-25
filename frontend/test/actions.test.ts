import { describe, expect, it } from "vitest";
import { applyAction } from "../src/actions";
import { makeHass } from "./fixtures/hass";

const target = (entity_id: string) => ({ entity_id });

describe("applyAction", () => {
  it("sets a climate entity's temperature, or turns it on or off", async () => {
    const hass = makeHass({});
    await applyAction(hass, { type: "climate_temperature", entity_id: "climate.oven" }, 375);
    await applyAction(hass, { type: "climate_power", entity_id: "climate.oven" }, true);
    await applyAction(hass, { type: "climate_power", entity_id: "climate.oven" }, false);
    expect(hass.calls).toEqual([
      { domain: "climate", service: "set_temperature", data: { temperature: 375 }, target: target("climate.oven") },
      { domain: "climate", service: "turn_on", data: {}, target: target("climate.oven") },
      { domain: "climate", service: "turn_off", data: {}, target: target("climate.oven") },
    ]);
  });

  it("sets numbers, options, switches and presses buttons", async () => {
    const hass = makeHass({});
    await applyAction(hass, { type: "number", entity_id: "number.ref" }, 37);
    await applyAction(hass, { type: "select", entity_id: "select.mode" }, "High use");
    await applyAction(hass, { type: "switch", entity_id: "switch.light" }, true);
    await applyAction(hass, { type: "switch", entity_id: "switch.light" }, false);
    await applyAction(hass, { type: "button", entity_id: "button.start" });
    expect(hass.calls).toEqual([
      { domain: "number", service: "set_value", data: { value: 37 }, target: target("number.ref") },
      { domain: "select", service: "select_option", data: { option: "High use" }, target: target("select.mode") },
      { domain: "switch", service: "turn_on", data: {}, target: target("switch.light") },
      { domain: "switch", service: "turn_off", data: {}, target: target("switch.light") },
      { domain: "button", service: "press", data: {}, target: target("button.start") },
    ]);
  });

  it("turns a fan off at 0 and sets its percentage from the speed", async () => {
    const hass = makeHass({});
    await applyAction(hass, { type: "fan", entity_id: "fan.hood", speeds: 4 }, 0);
    await applyAction(hass, { type: "fan", entity_id: "fan.hood", speeds: 4 }, 1);
    await applyAction(hass, { type: "fan", entity_id: "fan.hood", speeds: 4 }, 3);
    await applyAction(hass, { type: "fan", entity_id: "fan.hood", speeds: 3 }, 2);
    // A fan without speeds only turns on.
    await applyAction(hass, { type: "fan", entity_id: "fan.plain", speeds: 1 }, 1);
    expect(hass.calls).toEqual([
      { domain: "fan", service: "turn_off", data: {}, target: target("fan.hood") },
      { domain: "fan", service: "set_percentage", data: { percentage: 25 }, target: target("fan.hood") },
      { domain: "fan", service: "set_percentage", data: { percentage: 75 }, target: target("fan.hood") },
      { domain: "fan", service: "set_percentage", data: { percentage: 67 }, target: target("fan.hood") },
      { domain: "fan", service: "turn_on", data: {}, target: target("fan.plain") },
    ]);
  });

  it("turns a light on with what changed, or off", async () => {
    const hass = makeHass({});
    await applyAction(hass, { type: "light", entity_id: "light.task" }, { on: true });
    await applyAction(hass, { type: "light", entity_id: "light.task" }, { on: true, brightness: 60.4, kelvin: null });
    await applyAction(hass, { type: "light", entity_id: "light.task" }, { on: true, kelvin: 4100 });
    await applyAction(hass, { type: "light", entity_id: "light.task" }, { on: false, brightness: 50 });
    expect(hass.calls).toEqual([
      { domain: "light", service: "turn_on", data: {}, target: target("light.task") },
      { domain: "light", service: "turn_on", data: { brightness_pct: 60 }, target: target("light.task") },
      { domain: "light", service: "turn_on", data: { color_temp_kelvin: 4100 }, target: target("light.task") },
      { domain: "light", service: "turn_off", data: {}, target: target("light.task") },
    ]);
  });

  it("calls an integration action with its data and the value", async () => {
    const hass = makeHass({});
    await applyAction(
      hass,
      { type: "service", domain: "subzero", service: "schedule_ice_delay", data: { device_id: "abc" } },
      { duration: 8, start_in: 90, repeat: true },
    );
    await applyAction(hass, { type: "service", domain: "subzero", service: "refresh", data: { device_id: ["abc"] } });
    expect(hass.calls).toEqual([
      { domain: "subzero", service: "schedule_ice_delay", data: { device_id: "abc", duration: 8, start_in: 90, repeat: true }, target: undefined },
      { domain: "subzero", service: "refresh", data: { device_id: ["abc"] }, target: undefined },
    ]);
  });

  it("lets Home Assistant's error through for the view to show", async () => {
    const refusal = { code: "service_validation_error", message: "Close the oven door before starting it." };
    const hass = makeHass({}, { reject: refusal });
    await expect(applyAction(hass, { type: "button", entity_id: "button.start" })).rejects.toBe(refusal);
  });
});
