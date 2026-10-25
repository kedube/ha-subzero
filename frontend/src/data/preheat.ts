import type { HomeAssistant } from "../hass";
import type { PanelAppliance } from "../types";
import type { HistoryCache } from "./history";

export type CavityPrefix = "cav" | "cav2";

const PREFIXES: readonly CavityPrefix[] = ["cav", "cav2"];
// Observations closer together than this mean the panel was watching when the cavity turned on.
// The panel observes on every update, and its clock updates it every second.
const WATCHING_MS = 5000;

interface Cavity {
  on: boolean;
  /** When the panel last read the cavity's on/off state, by its own clock. */
  seenAt: number;
  /** When the panel last looked, whether or not the cavity was available. */
  lookedAt: number;
  /** The panel saw the cavity turn on, so the temperatures it read since are the preheat's. */
  witnessed: boolean;
  /** The coldest temperature the panel read since the cavity turned on. */
  coldest: number | null;
}

interface CavityReading {
  on: boolean;
  /** The entity and state that say the cavity is on, for looking it up in history. */
  entityId: string;
  onState: string;
  /** That entity's last_changed, in ms. */
  changedAt: number;
}

function cavityReading(
  hass: HomeAssistant,
  appliance: PanelAppliance,
  prefix: CavityPrefix,
): CavityReading | undefined {
  // The Cooking binary sensor is the plain answer; the oven's climate entity says the same
  // thing ("heat" or "off") when the sensor is disabled.
  const sensorId = appliance.entities[`${prefix}_unit_on`]?.binary_sensor;
  const sensor = sensorId ? hass.states[sensorId] : undefined;
  if (sensorId && sensor && (sensor.state === "on" || sensor.state === "off")) {
    return { on: sensor.state === "on", entityId: sensorId, onState: "on", changedAt: Date.parse(sensor.last_changed) };
  }
  const climateId = appliance.entities[`${prefix}_set_temp`]?.climate;
  const climate = climateId ? hass.states[climateId] : undefined;
  if (!climateId || !climate || climate.state === "unavailable" || climate.state === "unknown") {
    return undefined;
  }
  return {
    on: climate.state !== "off",
    entityId: climateId,
    onState: climate.state,
    changedAt: Date.parse(climate.last_changed),
  };
}

function cavityTemperature(
  hass: HomeAssistant,
  appliance: PanelAppliance,
  prefix: CavityPrefix,
): number | null {
  const sensorId = appliance.entities[`${prefix}_temp`]?.sensor;
  const reading = Number.parseFloat(sensorId ? (hass.states[sensorId]?.state ?? "") : "");
  if (Number.isFinite(reading)) return reading;
  const climateId = appliance.entities[`${prefix}_set_temp`]?.climate;
  const current = Number(climateId ? hass.states[climateId]?.attributes.current_temperature : NaN);
  return Number.isFinite(current) ? current : null;
}

/**
 * Where each oven cavity's preheat started, in the unit Home Assistant shows it in: the coldest
 * temperature read since it turned on, forgotten when it turns off. Wolf ovens keep reporting
 * their last temperature while off, and the reading can lag the on state, so the first reading
 * after the oven turns on may be that stale, hot one. When the panel wasn't watching as the
 * cavity turned on (opened mid-preheat, say), history supplies the readings from then instead,
 * since the ones read now would put the start too high.
 */
export class PreheatTracker {
  private readonly cavities = new Map<string, Cavity>();

  constructor(
    private readonly history?: HistoryCache,
    private readonly now: () => number = Date.now,
  ) {}

  /** Reads every cavity's state; the panel calls it on every update. */
  observe(hass: HomeAssistant, appliances: readonly PanelAppliance[]): void {
    for (const appliance of appliances) {
      for (const prefix of PREFIXES) this.observeCavity(hass, appliance, prefix);
    }
  }

  /** The cavity's start temperature; null while it's off, or before any reading. */
  start(hass: HomeAssistant | undefined, appliance: PanelAppliance, prefix: CavityPrefix): number | null {
    if (!hass) return null;
    const cavity = this.observeCavity(hass, appliance, prefix);
    if (!cavity?.on) return null;
    if (cavity.witnessed) return cavity.coldest;
    if (!this.history) return null;
    const reading = cavityReading(hass, appliance, prefix);
    const onAt = reading ? this.history.since(hass, reading.entityId, reading.onState) : null;
    const sensorId = appliance.entities[`${prefix}_temp`]?.sensor;
    const recorded = onAt === null ? null : this.history.lowestAfter(hass, sensorId, onAt);
    if (recorded === null) return null;
    return cavity.coldest === null ? recorded : Math.min(recorded, cavity.coldest);
  }

  private observeCavity(
    hass: HomeAssistant,
    appliance: PanelAppliance,
    prefix: CavityPrefix,
  ): Cavity | undefined {
    const key = `${appliance.appliance_id}:${prefix}`;
    const known = this.cavities.get(key);
    const reading = cavityReading(hass, appliance, prefix);
    const now = this.now();
    // Unavailable or missing: keep what was known. If it's still on once it's back, the panel
    // takes it for the same session, as it can't tell otherwise.
    if (!reading) {
      if (known) known.lookedAt = now;
      return known;
    }
    if (!reading.on) {
      const off: Cavity = { on: false, seenAt: now, lookedAt: now, witnessed: false, coldest: null };
      this.cavities.set(key, off);
      return off;
    }
    let cavity = known;
    // Still on, but its on state changed while the panel was away (on another page): it went
    // off and on again unseen, so this is a new session the panel didn't see begin.
    const missed = cavity?.on === true && now - cavity.lookedAt > WATCHING_MS && reading.changedAt > cavity.seenAt;
    if (!cavity?.on || missed) {
      const witnessed = !missed && cavity !== undefined && now - cavity.seenAt <= WATCHING_MS;
      cavity = { on: true, seenAt: now, lookedAt: now, witnessed, coldest: null };
      this.cavities.set(key, cavity);
    }
    cavity.seenAt = now;
    cavity.lookedAt = now;
    const temperature = cavityTemperature(hass, appliance, prefix);
    if (temperature !== null && (cavity.coldest === null || temperature < cavity.coldest)) {
      cavity.coldest = temperature;
    }
    return cavity;
  }
}
