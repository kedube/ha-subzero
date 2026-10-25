/** Wolf ventilation hoods: fan, task light, halo, delayed shutoff and the filter. */
import type { DrawingState } from "../drawings/types";
import type { HassEntity } from "../hass";
import {
  base,
  clamp,
  compact,
  detailsSection,
  durationControl,
  durationSeconds,
  formatDuration,
  has,
  isOn,
  join,
  needsService,
  reading,
  section,
  selectControl,
  stateValue,
  switchToggle,
  toNumber,
} from "./common";
import type { ApplianceContext, Control, FamilyModel, InfoRow, Section, StatusPill } from "./types";

interface Fan {
  entityId: string;
  entity: HassEntity | undefined;
  /** 0 is off. */
  speed: number;
  speeds: number;
}

function fan(ctx: ApplianceContext): Fan | null {
  const entityId = ctx.entityId("fan_on", "fan");
  if (!entityId) return null;
  const entity = ctx.hass.states[entityId];
  const attributes = entity?.attributes ?? {};
  // FanEntityFeature.SET_SPEED is 1; without it the fan is only on or off.
  const features = toNumber(attributes.supported_features);
  const step = toNumber(attributes.percentage_step);
  const speeds = features !== null && (features & 1) === 0 ? 1 : step && step > 0 ? Math.round(100 / step) : 4;
  const state = stateValue(entity);
  const percentage = toNumber(attributes.percentage);
  let speed = 0;
  if (state === "on") speed = percentage === null ? 1 : clamp(Math.round((percentage * speeds) / 100), 1, speeds);
  return { entityId, entity, speed, speeds };
}

interface Light {
  entityId: string;
  entity: HassEntity | undefined;
  on: boolean;
  /** 0–100; null when off or without brightness. */
  brightness: number | null;
  /** Kelvin; null when off or without white temperature. */
  kelvin: number | null;
  minKelvin: number;
  maxKelvin: number;
  hasKelvin: boolean;
}

function light(ctx: ApplianceContext): Light | null {
  const entityId = ctx.entityId("light_on", "light");
  if (!entityId) return null;
  const entity = ctx.hass.states[entityId];
  const attributes = entity?.attributes ?? {};
  const modes = Array.isArray(attributes.supported_color_modes) ? (attributes.supported_color_modes as unknown[]) : [];
  const on = stateValue(entity) === "on";
  const level = toNumber(attributes.brightness);
  const hasKelvin = modes.includes("color_temp");
  return {
    entityId,
    entity,
    on,
    brightness: on && level !== null ? Math.round((level * 100) / 255) : on && modes.some((mode) => mode !== "onoff") ? 100 : null,
    kelvin: on && hasKelvin ? toNumber(attributes.color_temp_kelvin) : null,
    minKelvin: toNumber(attributes.min_color_temp_kelvin) ?? 2700,
    maxKelvin: toNumber(attributes.max_color_temp_kelvin) ?? 5000,
    hasKelvin,
  };
}

/** How much of the filter's allowance is used, in percent. */
function filterUsed(ctx: ApplianceContext): number | null {
  const used = durationSeconds(ctx.state("filter_count", "sensor"));
  const allowed = durationSeconds(ctx.state("filter_max_count", "sensor"));
  return used === null || !allowed ? null : clamp((used * 100) / allowed, 0, 100);
}

function fanLightSection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  const blower = fan(ctx);
  const lamp = light(ctx);
  const controls: Array<Control | null> = [];
  if (blower) {
    controls.push({
      kind: "fan",
      ...base(ctx, "fan_on", t("control.fan"), blower.entity),
      action: { type: "fan", entity_id: blower.entityId, speeds: blower.speeds },
      value: blower.speed,
      speeds: blower.speeds,
    });
  }
  if (lamp) {
    controls.push({
      kind: "light",
      ...base(ctx, "light_on", t("control.task_light"), lamp.entity),
      action: { type: "light", entity_id: lamp.entityId },
      on: lamp.on,
      brightness: lamp.brightness,
      kelvin: lamp.kelvin ?? (lamp.on && lamp.hasKelvin ? Math.round((lamp.minKelvin + lamp.maxKelvin) / 2) : null),
      min_kelvin: lamp.minKelvin,
      max_kelvin: lamp.maxKelvin,
    });
  }
  controls.push(switchToggle(ctx, "halo_max_percent", t("control.halo")));
  return section("fan_light", t("section.fan_light"), controls);
}

function shutoffSection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  return section("delayed_shutoff", t("section.delayed_shutoff"), [
    switchToggle(ctx, "delay_enabled", t("control.delayed_shutoff")),
    durationControl(ctx, "delay_off_duration", t("control.shutoff_after"), [1, 3, 5, 10, 15]),
  ]);
}

function settingsSection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  return section(
    "settings",
    t("section.settings"),
    [
      selectControl(ctx, "auto_sensivity", t("control.fan_sensitivity")),
      switchToggle(ctx, "key_tone_on", t("control.key_tones")),
      switchToggle(ctx, "user_lock_on", t("control.control_lock")),
    ],
    true,
  );
}

function filterSection(ctx: ApplianceContext): Section | null {
  const t = ctx.t;
  const used = durationSeconds(ctx.state("filter_count", "sensor"));
  const allowed = durationSeconds(ctx.state("filter_max_count", "sensor"));
  const share = filterUsed(ctx);
  return section("filters", t("section.filters"), [
    has(ctx, "filter_count", "sensor")
      ? reading("filter_count", t("control.filter_usage"), used === null ? null : formatDuration(t, used, "hours"), {
          hint: share === null ? null : t("value.percent_used", { pct: Math.round(share) }),
          tone: share !== null && share >= 100 ? "warning" : "normal",
        })
      : null,
    has(ctx, "filter_max_count", "sensor")
      ? reading("filter_max_count", t("control.filter_allowance"), allowed === null ? null : formatDuration(t, allowed, "hours"))
      : null,
  ]);
}

export const hood: FamilyModel = {
  drawingState(ctx): DrawingState {
    const blower = fan(ctx);
    const lamp = light(ctx);
    return {
      available: ctx.appliance.available,
      doors: {},
      readouts: {},
      hood: {
        fan: blower?.speed ?? 0,
        light: lamp?.on ?? false,
        brightness: lamp?.on ? (lamp.brightness ?? 100) : 0,
        kelvin: lamp?.hasKelvin ? (lamp.kelvin ?? Math.round((lamp.minKelvin + lamp.maxKelvin) / 2)) : null,
        halo: isOn(ctx, "halo_max_percent", "switch") === true,
      },
    };
  },

  status(ctx): StatusPill {
    const t = ctx.t;
    if (!ctx.appliance.available) return { text: t("pill.offline"), tone: "gray" };
    const speed = fan(ctx)?.speed ?? 0;
    if (speed > 0) return { text: t("pill.fan", { speed }), tone: "accent" };
    if (light(ctx)?.on) return { text: t("pill.light"), tone: "neutral" };
    if (needsService(ctx)) return { text: t("pill.service"), tone: "red" };
    if (isOn(ctx, "delay_enabled", "switch")) return { text: t("pill.delayed_shutoff"), tone: "neutral" };
    return { text: t("pill.off"), tone: "neutral" };
  },

  infoRows(ctx): InfoRow[] {
    const t = ctx.t;
    const rows: InfoRow[] = [];
    const blower = fan(ctx);
    if (blower) rows.push({ label: t("info.fan"), value: blower.speed ? t("value.speed", { speed: blower.speed }) : t("value.off") });
    const lamp = light(ctx);
    if (lamp) {
      rows.push({
        label: t("info.light"),
        value: lamp.on ? (join([lamp.brightness === null ? null : `${lamp.brightness}%`, lamp.kelvin === null ? null : `${Math.round(lamp.kelvin)} K`]) ?? t("value.on")) : t("value.off"),
      });
    }
    const share = filterUsed(ctx);
    if (share !== null) {
      // Uncolored on the card, so a used-up filter says so in words, as the full view colors it.
      const used = t("value.percent_used", { pct: Math.round(share) });
      rows.push({ label: t("info.filter"), value: share >= 100 ? `${used} · ${t("value.replace")}` : used });
    }
    return rows.slice(0, 3);
  },

  // The hood has buttons and lights, not a display.
  display: () => null,

  sections(ctx): Section[] {
    return compact([fanLightSection(ctx), shutoffSection(ctx), settingsSection(ctx), filterSection(ctx), detailsSection(ctx)]);
  },
};
