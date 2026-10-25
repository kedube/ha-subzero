import { describe, expect, it, vi } from "vitest";
import { HistoryCache } from "../src/data/history";
import { PreheatTracker } from "../src/data/preheat";
import type { HassEntity, HomeAssistant } from "../src/hass";
import type { PanelAppliance } from "../src/types";
import { SPECS, entity, flush, makeAppliance, makeHass } from "./shell-fixtures";

const ON = "binary_sensor.range_cooking";
const TEMP = "sensor.range_oven_temperature";
const ON2 = "binary_sensor.range_lower_oven_cooking";
const TEMP2 = "sensor.range_lower_oven_temperature";
const CLIMATE = "climate.range_oven";

const range: PanelAppliance = makeAppliance("range", SPECS.range, {
  entities: {
    cav_unit_on: { binary_sensor: ON },
    cav_temp: { sensor: TEMP },
    cav_set_temp: { climate: CLIMATE, sensor: "sensor.range_oven_setpoint" },
    cav2_unit_on: { binary_sensor: ON2 },
    cav2_temp: { sensor: TEMP2 },
  },
});

/** A clock and states the test moves along, as the panel would see them. */
function scene() {
  let now = Date.parse("2026-10-24T12:00:00.000Z");
  const states: Record<string, HassEntity> = {};
  const callWS = vi.fn(async (_message: Record<string, unknown>): Promise<unknown> => ({}));
  const hass = (): HomeAssistant =>
    makeHass({ states: { ...states }, callWS: callWS as unknown as HomeAssistant["callWS"] });
  const set = (id: string, state: string, attributes: Record<string, unknown> = {}) => {
    states[id] = entity(id, state, attributes, new Date(now).toISOString());
  };
  const history = new HistoryCache(() => {}, () => now);
  const tracker = new PreheatTracker(history, () => now);
  return {
    set,
    states,
    hass,
    callWS,
    tracker,
    advance: (ms: number) => {
      now += ms;
    },
    observe: () => tracker.observe(hass(), [range]),
    start: (prefix: "cav" | "cav2" = "cav") => tracker.start(hass(), range, prefix),
  };
}

describe("PreheatTracker", () => {
  it("takes the first temperature after the panel sees the cavity turn on", () => {
    const s = scene();
    s.set(ON, "off");
    s.set(TEMP, "403");
    s.observe();
    expect(s.start()).toBeNull();

    s.advance(1000);
    s.set(ON, "on");
    s.set(TEMP, "118");
    s.observe();
    expect(s.start()).toBe(118);

    s.advance(60_000);
    s.set(TEMP, "260");
    s.observe();
    expect(s.start()).toBe(118);
  });

  it("forgets the start when the cavity turns off, and takes a new one next time", () => {
    const s = scene();
    s.set(ON, "off");
    s.set(TEMP, "75");
    s.observe();
    s.advance(1000);
    s.set(ON, "on");
    s.observe();
    expect(s.start()).toBe(75);

    s.advance(1000);
    s.set(ON, "off");
    s.set(TEMP, "340");
    s.observe();
    expect(s.start()).toBeNull();

    s.advance(1000);
    s.set(ON, "on");
    s.observe();
    expect(s.start()).toBe(340);
  });

  it("takes the coldest reading, so a stale one from while it was off doesn't count", () => {
    // Wolf ovens keep their last temperature while off, and the reading lags the on state.
    const s = scene();
    s.set(ON, "off");
    s.set(TEMP, "403");
    s.observe();
    s.advance(1000);
    s.set(ON, "on");
    s.observe();
    expect(s.start()).toBe(403);
    s.advance(2000);
    s.set(TEMP, "80");
    s.observe();
    expect(s.start()).toBe(80);
    s.advance(60_000);
    s.set(TEMP, "150");
    s.observe();
    expect(s.start()).toBe(80);
  });

  it("starts over when the oven went off and on again while the panel was away", async () => {
    const s = scene();
    s.set(ON, "off");
    s.set(TEMP, "75");
    s.observe();
    s.advance(1000);
    s.set(ON, "on");
    s.observe();
    expect(s.start()).toBe(75);
    // On another page for an hour: the oven went off, and on again ten minutes ago.
    s.advance(3600_000);
    const turnedOn = Date.parse("2026-10-24T12:51:01.000Z");
    s.set(ON, "on");
    s.states[ON] = { ...s.states[ON], last_changed: new Date(turnedOn).toISOString() };
    s.set(TEMP, "320");
    s.callWS.mockImplementation(async (message) => {
      const [id] = message.entity_ids as string[];
      if (id === ON) return { [ON]: [{ s: "off", lu: turnedOn / 1000 - 600 }, { s: "on", lu: turnedOn / 1000 }] };
      if (id === TEMP) return { [TEMP]: [{ s: "300", lu: turnedOn / 1000 + 5 }, { s: "320", lu: turnedOn / 1000 + 60 }] };
      return {};
    });
    s.observe();
    expect(s.start()).toBeNull();
    await flush();
    s.start();
    await flush();
    expect(s.start()).toBe(300);
  });

  it("keeps the session it saw while the panel stays open", () => {
    const s = scene();
    s.set(ON, "off");
    s.set(TEMP, "70");
    s.observe();
    s.advance(1000);
    s.set(ON, "on");
    s.observe();
    for (let second = 0; second < 30; second++) {
      s.advance(1000);
      s.observe();
    }
    expect(s.start()).toBe(70);
    expect(s.callWS).not.toHaveBeenCalled();
  });

  it("waits for a reading when the temperature lags the on state", () => {
    const s = scene();
    s.set(ON, "off");
    s.set(TEMP, "unknown");
    s.observe();
    s.advance(1000);
    s.set(ON, "on");
    s.observe();
    expect(s.start()).toBeNull();
    s.advance(1000);
    s.set(TEMP, "81");
    s.observe();
    expect(s.start()).toBe(81);
  });

  it("keeps the start through an unavailable spell", () => {
    const s = scene();
    s.set(ON, "off");
    s.set(TEMP, "72");
    s.observe();
    s.advance(1000);
    s.set(ON, "on");
    s.observe();
    s.advance(1000);
    s.set(ON, "unavailable");
    s.set(TEMP, "unavailable");
    s.observe();
    expect(s.start()).toBe(72);
    s.advance(1000);
    s.set(ON, "on");
    s.set(TEMP, "300");
    s.observe();
    expect(s.start()).toBe(72);
  });

  it("tracks each cavity on its own", () => {
    const s = scene();
    s.set(ON, "off");
    s.set(ON2, "off");
    s.set(TEMP, "70");
    s.set(TEMP2, "90");
    s.observe();
    s.advance(1000);
    s.set(ON2, "on");
    s.observe();
    expect(s.start("cav")).toBeNull();
    expect(s.start("cav2")).toBe(90);
  });

  it("asks history for the temperature when the cavity was already on", async () => {
    const s = scene();
    const turnedOn = Date.parse("2026-10-24T11:50:00.000Z");
    s.callWS.mockImplementation(async (message) => {
      const [id] = message.entity_ids as string[];
      if (id === ON) return { [ON]: [{ s: "off", lu: turnedOn / 1000 - 3600 }, { s: "on", lu: turnedOn / 1000 }] };
      if (id === TEMP) return { [TEMP]: [{ s: "77", lu: turnedOn / 1000 }, { s: "150", lu: turnedOn / 1000 + 60 }] };
      return {};
    });
    s.set(ON, "on");
    s.set(TEMP, "290");
    s.observe();
    expect(s.start()).toBeNull();
    await flush();
    expect(s.start()).toBeNull();
    await flush();
    expect(s.start()).toBe(77);
    expect(s.callWS).toHaveBeenCalledWith(
      expect.objectContaining({ entity_ids: [TEMP], start_time: "2026-10-24T11:49:58.000Z" }),
    );
  });

  it("starts from what the oven read as it turned on when the panel opens just after", async () => {
    // A warm oven turned on again: its temperature hasn't changed since, so the half hour has no
    // reading yet and Home Assistant's history answers with nothing.
    const s = scene();
    s.set(TEMP, "200");
    s.advance(3600_000);
    s.set(ON, "on");
    const turnedOn = Date.parse(s.states[ON].last_changed);
    s.advance(4000);
    s.callWS.mockImplementation(async (message) => {
      const [id] = message.entity_ids as string[];
      if (id === ON) return { [ON]: [{ s: "off", lu: turnedOn / 1000 - 600 }, { s: "on", lu: turnedOn / 1000 }] };
      return {};
    });
    s.observe();
    expect(s.start()).toBeNull();
    await flush();
    s.start();
    await flush();
    expect(s.start()).toBe(200);
  });

  it("doesn't count a turn-on it was away for as seen", async () => {
    const s = scene();
    s.set(ON, "off");
    s.set(TEMP, "70");
    s.observe();
    // The panel was closed for ten minutes while the oven heated.
    s.advance(10 * 60_000);
    s.set(ON, "on");
    s.set(TEMP, "310");
    s.observe();
    expect(s.start()).not.toBe(310);
    expect(s.callWS).toHaveBeenCalled();
  });

  it("reads the oven's climate entity when the Cooking sensor is disabled", () => {
    const s = scene();
    const climateOnly = makeAppliance("wall", SPECS.wallOven, { entities: { cav_set_temp: { climate: CLIMATE } } });
    s.set(CLIMATE, "off", { current_temperature: 71 });
    s.tracker.observe(s.hass(), [climateOnly]);
    s.advance(1000);
    s.set(CLIMATE, "heat", { current_temperature: 73 });
    s.tracker.observe(s.hass(), [climateOnly]);
    expect(s.tracker.start(s.hass(), climateOnly, "cav")).toBe(73);
  });

  it("has nothing for an appliance without ovens, or without hass", () => {
    const s = scene();
    const fridge = makeAppliance("fridge", SPECS.sideBySide);
    expect(s.tracker.start(s.hass(), fridge, "cav")).toBeNull();
    expect(s.tracker.start(undefined, range, "cav")).toBeNull();
  });

  it("works without a history cache, from what it saw", () => {
    let now = 0;
    const tracker = new PreheatTracker(undefined, () => now);
    const foundOn = makeHass({ states: { [ON]: entity(ON, "on"), [TEMP]: entity(TEMP, "200") } });
    expect(tracker.start(foundOn, range, "cav")).toBeNull();
    now = 1000;
    const off = makeHass({ states: { [ON]: entity(ON, "off"), [TEMP]: entity(TEMP, "200") } });
    tracker.observe(off, [range]);
    now = 2000;
    const on = makeHass({ states: { [ON]: entity(ON, "on"), [TEMP]: entity(TEMP, "205") } });
    expect(tracker.start(on, range, "cav")).toBe(205);
  });
});
