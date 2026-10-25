import type { ControlAction } from "./families/types";
import type { HomeAssistant } from "./hass";

/** What the light control sends: on or off, and the brightness or white temperature it changed. */
export interface LightValue {
  on: boolean;
  /** 0–100. */
  brightness?: number | null;
  kelvin?: number | null;
}

/**
 * Applies a control's new value through the entity's own Home Assistant action, with the
 * entity as the target, so the integration validates it exactly as it would from a dashboard.
 * A rejected call throws Home Assistant's error, for the view to show under the control.
 */
export async function applyAction(hass: HomeAssistant, action: ControlAction, value?: unknown): Promise<void> {
  if (action.type === "service") {
    const extra = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
    await hass.callService(action.domain, action.service, { ...action.data, ...extra });
    return;
  }
  const target = { entity_id: action.entity_id };
  switch (action.type) {
    case "climate_temperature":
      await hass.callService("climate", "set_temperature", { temperature: Number(value) }, target);
      return;
    case "climate_power":
      await hass.callService("climate", value ? "turn_on" : "turn_off", {}, target);
      return;
    case "number":
      await hass.callService("number", "set_value", { value: Number(value) }, target);
      return;
    case "select":
      await hass.callService("select", "select_option", { option: String(value) }, target);
      return;
    case "switch":
      await hass.callService("switch", value ? "turn_on" : "turn_off", {}, target);
      return;
    case "button":
      await hass.callService("button", "press", {}, target);
      return;
    case "fan": {
      const speed = Number(value);
      if (!speed) {
        await hass.callService("fan", "turn_off", {}, target);
      } else if (action.speeds <= 1) {
        // A fan without speeds rejects fan.set_percentage; it only turns on.
        await hass.callService("fan", "turn_on", {}, target);
      } else {
        await hass.callService("fan", "set_percentage", { percentage: Math.round((speed / action.speeds) * 100) }, target);
      }
      return;
    }
    case "light": {
      const light = (value ?? {}) as LightValue;
      if (!light.on) {
        await hass.callService("light", "turn_off", {}, target);
        return;
      }
      const data: Record<string, unknown> = {};
      if (typeof light.brightness === "number") data.brightness_pct = Math.round(light.brightness);
      if (typeof light.kelvin === "number") data.color_temp_kelvin = Math.round(light.kelvin);
      await hass.callService("light", "turn_on", data, target);
      return;
    }
  }
}
