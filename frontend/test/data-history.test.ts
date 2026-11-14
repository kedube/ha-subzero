import { describe, expect, it, vi } from "vitest";
import { HistoryCache, lastTurnedTo, parseRows, readRows, type Change } from "../src/data/history";
import type { HomeAssistant } from "../src/hass";
import { deferred, entity, flush, makeHass } from "./shell-fixtures";

const NOW = Date.parse("2026-10-24T12:00:00.000Z");
const ID = "binary_sensor.dishwasher_wash_cycle";
const at = (iso: string) => Date.parse(iso);
const seconds = (iso: string) => at(iso) / 1000;

describe("parseRows", () => {
  it("reads compressed rows, preferring the change time", () => {
    expect(
      parseRows([
        { s: "off", a: {}, lu: seconds("2026-10-24T08:00:00Z"), lc: seconds("2026-10-24T07:00:00Z") },
        { s: "on", lu: seconds("2026-10-24T09:00:00Z") },
      ]),
    ).toEqual([
      { state: "off", at: at("2026-10-24T07:00:00Z") },
      { state: "on", at: at("2026-10-24T09:00:00Z") },
    ]);
  });

  it("reads full rows", () => {
    expect(
      parseRows([
        { state: "on", last_changed: "2026-10-24T09:00:00Z", last_updated: "2026-10-24T09:30:00Z" },
        { state: "off", last_updated: "2026-10-24T10:00:00Z" },
      ]),
    ).toEqual([
      { state: "on", at: at("2026-10-24T09:00:00Z") },
      { state: "off", at: at("2026-10-24T10:00:00Z") },
    ]);
  });

  it("skips rows it can't read", () => {
    expect(parseRows([null, 3, { s: 1, lu: 5 }, { s: "on" }, { s: "on", lu: "never" }])).toEqual([]);
    expect(parseRows(undefined)).toEqual([]);
    expect(parseRows({ s: "on" })).toEqual([]);
  });
});

describe("lastTurnedTo", () => {
  const changes = (...rows: Array<[string, number]>): Change[] => rows.map(([state, time]) => ({ state, at: time }));

  it("finds the start of the latest stretch in the state", () => {
    expect(lastTurnedTo(changes(["off", 1], ["on", 2], ["off", 3], ["on", 4], ["on", 5]), "on")).toBe(4);
  });

  it("treats a stretch that began before the window as starting with it", () => {
    expect(lastTurnedTo(changes(["on", 1], ["off", 3]), "on")).toBe(1);
  });

  it("doesn't let an unavailable spell end a stretch", () => {
    expect(lastTurnedTo(changes(["off", 1], ["on", 2], ["unavailable", 3], ["on", 4]), "on")).toBe(2);
    expect(lastTurnedTo(changes(["off", 1], ["unknown", 2], ["on", 3]), "on")).toBe(3);
  });

  it("can look for unavailable itself", () => {
    expect(lastTurnedTo(changes(["on", 1], ["unavailable", 2]), "unavailable")).toBe(2);
  });

  it("is null when the state never shows", () => {
    expect(lastTurnedTo(changes(["off", 1]), "on")).toBeNull();
    expect(lastTurnedTo([], "on")).toBeNull();
  });
});

function setup(state = "on", changed = "2026-10-24T11:00:00.000Z") {
  const reply = deferred<unknown>();
  const callWS = vi.fn(() => reply.promise);
  const hass = makeHass({
    states: { [ID]: entity(ID, state, {}, changed) },
    callWS: callWS as unknown as HomeAssistant["callWS"],
  });
  const onChange = vi.fn();
  const cache = new HistoryCache(onChange, () => NOW);
  return { reply, callWS, hass, onChange, cache };
}

describe("HistoryCache.since", () => {
  it("asks for the last 12 hours of the entity, in the compact form", () => {
    const { callWS, hass, cache } = setup();
    cache.since(hass, ID);
    expect(callWS).toHaveBeenCalledWith({
      type: "history/history_during_period",
      start_time: "2026-10-24T00:00:00.000Z",
      entity_ids: [ID],
      minimal_response: true,
      no_attributes: true,
    });
  });

  it("is null until the reply arrives, then asks for a redraw", async () => {
    const { reply, hass, onChange, cache } = setup();
    expect(cache.since(hass, ID)).toBeNull();
    reply.resolve({
      [ID]: [
        { s: "off", lu: seconds("2026-10-24T06:00:00Z") },
        { s: "on", lu: seconds("2026-10-24T10:15:00Z") },
      ],
    });
    await flush();
    expect(onChange).toHaveBeenCalledOnce();
    expect(cache.since(hass, ID)).toBe(at("2026-10-24T10:15:00Z"));
  });

  it("fetches once while last_changed stays put", async () => {
    const { reply, callWS, hass, cache } = setup();
    cache.since(hass, ID);
    cache.since(hass, ID);
    reply.resolve({ [ID]: [{ s: "on", lu: seconds("2026-10-24T10:15:00Z") }] });
    await flush();
    cache.since({ ...hass }, ID);
    cache.since(hass, ID, "off");
    expect(callWS).toHaveBeenCalledOnce();
  });

  it("fetches again when last_changed moves, and drops the old answer meanwhile", async () => {
    const { reply, callWS, hass, cache } = setup("off", "2026-10-24T11:00:00.000Z");
    cache.since(hass, ID);
    reply.resolve({
      [ID]: [
        { s: "on", lu: seconds("2026-10-24T09:00:00Z") },
        { s: "off", lu: seconds("2026-10-24T11:00:00Z") },
      ],
    });
    await flush();
    expect(cache.since(hass, ID)).toBe(at("2026-10-24T09:00:00Z"));

    const second = deferred<unknown>();
    callWS.mockReturnValueOnce(second.promise);
    const moved = { ...hass, states: { [ID]: entity(ID, "on", {}, "2026-10-24T11:58:00.000Z") } };
    expect(cache.since(moved, ID)).toBeNull();
    expect(callWS).toHaveBeenCalledTimes(2);
    second.resolve({
      [ID]: [
        { s: "on", lu: seconds("2026-10-24T09:00:00Z") },
        { s: "off", lu: seconds("2026-10-24T11:00:00Z") },
        { s: "on", lu: seconds("2026-10-24T11:58:00Z") },
      ],
    });
    await flush();
    expect(cache.since(moved, ID)).toBe(at("2026-10-24T11:58:00Z"));
  });

  it("ignores a reply that a newer fetch has overtaken", async () => {
    const { reply, callWS, hass, onChange, cache } = setup();
    cache.since(hass, ID);
    const second = deferred<unknown>();
    callWS.mockReturnValueOnce(second.promise);
    const moved = { ...hass, states: { [ID]: entity(ID, "on", {}, "2026-10-24T11:30:00.000Z") } };
    cache.since(moved, ID);
    reply.resolve({ [ID]: [{ s: "on", lu: seconds("2026-10-24T01:00:00Z") }] });
    await flush();
    expect(onChange).not.toHaveBeenCalled();
    expect(cache.since(moved, ID)).toBeNull();
  });

  it("uses last_changed when the recorder hasn't caught up with a new stretch", async () => {
    const { reply, hass, cache } = setup("on", "2026-10-24T11:59:58.000Z");
    cache.since(hass, ID);
    reply.resolve({
      [ID]: [
        { s: "on", lu: seconds("2026-10-24T05:00:00Z") },
        { s: "off", lu: seconds("2026-10-24T07:00:00Z") },
      ],
    });
    await flush();
    expect(cache.since(hass, ID)).toBe(at("2026-10-24T11:59:58Z"));
  });

  it("reads the full row form too", async () => {
    const { reply, hass, cache } = setup();
    cache.since(hass, ID);
    reply.resolve({
      [ID]: [
        { state: "off", last_changed: "2026-10-24T03:00:00Z" },
        { state: "on", last_changed: "2026-10-24T10:40:00Z" },
      ],
    });
    await flush();
    expect(cache.since(hass, ID)).toBe(at("2026-10-24T10:40:00Z"));
  });

  it("falls back to the live state when history fails", async () => {
    const { reply, hass, onChange, cache } = setup("on", "2026-10-24T11:00:00.000Z");
    cache.since(hass, ID);
    reply.reject({ code: "unknown_command", message: "Unknown command." });
    await flush();
    expect(onChange).toHaveBeenCalledOnce();
    expect(cache.since(hass, ID)).toBe(at("2026-10-24T11:00:00Z"));
    expect(cache.since(hass, ID, "off")).toBeNull();
  });

  it("asks again a minute after a failure, answering from the live state meanwhile", async () => {
    let now = NOW;
    const callWS = vi
      .fn()
      .mockRejectedValueOnce({ code: "not_found", message: "Connection lost" })
      .mockResolvedValue({ [ID]: [{ s: "off", lu: seconds("2026-10-24T06:00:00Z") }, { s: "on", lu: seconds("2026-10-24T10:15:00Z") }] });
    const hass = makeHass({
      states: { [ID]: entity(ID, "on", {}, "2026-10-24T11:00:00.000Z") },
      callWS: callWS as unknown as HomeAssistant["callWS"],
    });
    const cache = new HistoryCache(() => {}, () => now);
    cache.since(hass, ID);
    await flush();
    expect(cache.since(hass, ID)).toBe(at("2026-10-24T11:00:00Z"));
    now += 59_000;
    cache.since(hass, ID);
    expect(callWS).toHaveBeenCalledOnce();
    now += 1000;
    expect(cache.since(hass, ID)).toBe(at("2026-10-24T11:00:00Z"));
    expect(callWS).toHaveBeenCalledTimes(2);
    await flush();
    expect(cache.since(hass, ID)).toBe(at("2026-10-24T10:15:00Z"));
    expect(callWS).toHaveBeenCalledTimes(2);
  });

  it("is null without hass, an entity id, or the entity", () => {
    const { callWS, hass, cache } = setup();
    expect(cache.since(undefined, ID)).toBeNull();
    expect(cache.since(hass, undefined)).toBeNull();
    expect(cache.since(hass, "binary_sensor.gone")).toBeNull();
    expect(callWS).not.toHaveBeenCalled();
  });

  it("survives a hass whose callWS throws", async () => {
    const hass = makeHass({
      states: { [ID]: entity(ID, "on", {}, "2026-10-24T11:00:00.000Z") },
      callWS: (() => {
        throw new Error("no socket");
      }) as unknown as HomeAssistant["callWS"],
    });
    const cache = new HistoryCache(() => {}, () => NOW);
    expect(cache.since(hass, ID)).toBeNull();
    await flush();
    expect(cache.since(hass, ID)).toBe(at("2026-10-24T11:00:00Z"));
  });
});

describe("HistoryCache.lowestAfter", () => {
  const TEMP = "sensor.range_oven_temperature";
  const START = at("2026-10-24T11:40:00Z");

  it("asks for the half hour's own changes and reads the lowest number", async () => {
    const reply = deferred<unknown>();
    const callWS = vi.fn(() => reply.promise);
    const hass = makeHass({ callWS: callWS as unknown as HomeAssistant["callWS"] });
    const onChange = vi.fn();
    const cache = new HistoryCache(onChange, () => NOW);
    expect(cache.lowestAfter(hass, TEMP, START)).toBeNull();
    // From two seconds before, for a reading recorded in the same update as the turn-on.
    expect(callWS).toHaveBeenCalledWith({
      type: "history/history_during_period",
      start_time: "2026-10-24T11:39:58.000Z",
      end_time: "2026-10-24T12:10:00.000Z",
      include_start_time_state: false,
      entity_ids: [TEMP],
      minimal_response: true,
      no_attributes: true,
    });
    // The oven's stale reading from while it was off, then the real ones as it heats.
    reply.resolve({
      [TEMP]: [
        { s: "403", lu: seconds("2026-10-24T11:40:01Z") },
        { s: "unknown", lu: seconds("2026-10-24T11:40:02Z") },
        { s: "92.5", lu: seconds("2026-10-24T11:40:30Z") },
        { s: "120", lu: seconds("2026-10-24T11:41:30Z") },
      ],
    });
    await flush();
    expect(onChange).toHaveBeenCalledOnce();
    expect(cache.lowestAfter(hass, TEMP, START)).toBe(92.5);
    expect(callWS).toHaveBeenCalledOnce();
  });

  it("stays null when there's no reading, and doesn't ask again", async () => {
    const callWS = vi.fn(async () => ({ [TEMP]: [{ s: "unavailable", lu: 1 }] }));
    const hass = makeHass({ callWS: callWS as unknown as HomeAssistant["callWS"] });
    const cache = new HistoryCache(() => {}, () => NOW);
    cache.lowestAfter(hass, TEMP, START);
    await flush();
    expect(cache.lowestAfter(hass, TEMP, START)).toBeNull();
    expect(callWS).toHaveBeenCalledOnce();
  });

  it("takes what the sensor reads when it hasn't changed since before the moment", async () => {
    // Home Assistant answers with nothing for a window the sensor hasn't changed in.
    const callWS = vi.fn(async () => ({}));
    const hass = makeHass({
      states: { [TEMP]: entity(TEMP, "200", {}, "2026-10-24T11:20:00.000Z") },
      callWS: callWS as unknown as HomeAssistant["callWS"],
    });
    const onChange = vi.fn();
    const cache = new HistoryCache(onChange, () => NOW);
    expect(cache.lowestAfter(hass, TEMP, START)).toBeNull();
    await flush();
    expect(onChange).toHaveBeenCalledOnce();
    expect(cache.lowestAfter(hass, TEMP, START)).toBe(200);
    expect(callWS).toHaveBeenCalledOnce();
  });

  it("asks again when the sensor changes while the half hour is under way and nothing was found", async () => {
    // Opened just after the turn-on, before the recorder wrote that update's reading.
    let rows: unknown[] = [];
    const callWS = vi.fn(async () => ({ [TEMP]: rows }));
    const at = (state: string, changed: string) =>
      makeHass({ states: { [TEMP]: entity(TEMP, state, {}, changed) }, callWS: callWS as unknown as HomeAssistant["callWS"] });
    const cache = new HistoryCache(() => {}, () => NOW);
    cache.lowestAfter(at("118", "2026-10-24T11:40:00.000Z"), TEMP, START);
    await flush();
    expect(cache.lowestAfter(at("118", "2026-10-24T11:40:00.000Z"), TEMP, START)).toBeNull();
    expect(callWS).toHaveBeenCalledOnce();
    rows = [
      { s: "118", lu: seconds("2026-10-24T11:40:00Z") },
      { s: "131", lu: seconds("2026-10-24T11:40:40Z") },
    ];
    const later = at("131", "2026-10-24T11:40:40.000Z");
    expect(cache.lowestAfter(later, TEMP, START)).toBeNull();
    await flush();
    expect(cache.lowestAfter(later, TEMP, START)).toBe(118);
    expect(callWS).toHaveBeenCalledTimes(2);
  });

  it("keeps an empty answer for good once the half hour is over", async () => {
    const callWS = vi.fn(async () => ({}));
    const at = (state: string, changed: string) =>
      makeHass({ states: { [TEMP]: entity(TEMP, state, {}, changed) }, callWS: callWS as unknown as HomeAssistant["callWS"] });
    const cache = new HistoryCache(() => {}, () => START + 31 * 60_000);
    cache.lowestAfter(at("350", "2026-10-24T11:45:00.000Z"), TEMP, START);
    await flush();
    expect(cache.lowestAfter(at("351", "2026-10-24T12:11:00.000Z"), TEMP, START)).toBeNull();
    expect(callWS).toHaveBeenCalledOnce();
  });

  it("asks again a minute after a failure", async () => {
    let now = NOW;
    const callWS = vi.fn().mockRejectedValueOnce(new Error("Connection lost")).mockResolvedValue({ [TEMP]: [{ s: "81", lu: 1 }] });
    const hass = makeHass({ callWS: callWS as unknown as HomeAssistant["callWS"] });
    const cache = new HistoryCache(() => {}, () => now);
    cache.lowestAfter(hass, TEMP, START);
    await flush();
    now += 30_000;
    expect(cache.lowestAfter(hass, TEMP, START)).toBeNull();
    expect(callWS).toHaveBeenCalledOnce();
    now += 30_000;
    cache.lowestAfter(hass, TEMP, START);
    await flush();
    expect(callWS).toHaveBeenCalledTimes(2);
    expect(cache.lowestAfter(hass, TEMP, START)).toBe(81);
  });

  it("is null without an entity or a moment", () => {
    const cache = new HistoryCache();
    expect(cache.lowestAfter(makeHass(), undefined, START)).toBeNull();
    expect(cache.lowestAfter(makeHass(), TEMP, Number.NaN)).toBeNull();
  });
});

describe("readRows", () => {
  it("reads either form with its attributes, and keeps a row that doesn't say when", () => {
    expect(
      readRows([
        { s: "a", a: { event_type: "x" }, lu: seconds("2026-10-24T08:00:00Z") },
        { state: "b", attributes: { event_type: "y" }, last_changed: "2026-10-24T09:00:00Z" },
        { s: "c" },
        { s: 4, lu: 5 },
        null,
      ]),
    ).toEqual([
      { state: "a", attributes: { event_type: "x" }, at: at("2026-10-24T08:00:00Z") },
      { state: "b", attributes: { event_type: "y" }, at: at("2026-10-24T09:00:00Z") },
      { state: "c", attributes: {}, at: null },
    ]);
    expect(readRows("rows")).toEqual([]);
  });
});

describe("HistoryCache.states", () => {
  const EVENT = "event.dishwasher_appliance_event";
  const fired = (time: string, type: string) => entity(EVENT, time, { event_type: type }, time);
  const row = (time: string, type: string) => ({ s: time, a: { event_type: type }, lu: seconds(time) });
  const live = (time: string, type: string) => ({ state: time, attributes: { event_type: type }, last_changed: time });
  const STARTED = "2026-10-24T10:00:00.000+00:00";
  const DONE = "2026-10-24T11:58:00.000+00:00";
  const LOW = "2026-10-24T11:59:30.000+00:00";

  function setup(state = fired(DONE, "dishwasher_complete")) {
    const callWS = vi.fn();
    const hass = makeHass({ states: { [EVENT]: state }, callWS: callWS as unknown as HomeAssistant["callWS"] });
    const onChange = vi.fn();
    let now = NOW;
    const cache = new HistoryCache(onChange, () => now);
    const later = (next: HomeAssistant["states"][string]) => ({ ...hass, states: { [EVENT]: next } });
    return { callWS, hass, onChange, cache, later, wait: (ms: number) => (now += ms) };
  }

  it("asks for every state of the last days with its attributes", () => {
    const { callWS, hass, cache } = setup();
    callWS.mockReturnValue(new Promise(() => {}));
    expect(cache.states(hass, EVENT, 7)).toEqual({ rows: null, error: null });
    expect(callWS).toHaveBeenCalledWith({
      type: "history/history_during_period",
      start_time: "2026-10-17T12:00:00.000Z",
      entity_ids: [EVENT],
      include_start_time_state: false,
      significant_changes_only: false,
      minimal_response: false,
      no_attributes: false,
    });
    // Each span of days is its own question.
    cache.states(hass, EVENT, 30);
    expect(callWS.mock.calls[1][0]).toMatchObject({ start_time: "2026-09-24T12:00:00.000Z" });
    cache.states(hass, EVENT, 7);
    expect(callWS).toHaveBeenCalledTimes(2);
  });

  it("gives the rows as sent, and asks for a redraw when they arrive", async () => {
    const { callWS, hass, onChange, cache } = setup();
    const rows = [row(STARTED, "dishwasher_started"), row(DONE, "dishwasher_complete")];
    callWS.mockResolvedValue({ [EVENT]: rows });
    cache.states(hass, EVENT, 7);
    await flush();
    expect(onChange).toHaveBeenCalledOnce();
    expect(cache.states(hass, EVENT, 7)).toEqual({ rows, error: null });
    expect(callWS).toHaveBeenCalledOnce();
  });

  it("follows the rows with a live state the recorder hasn't written yet", async () => {
    const { callWS, hass, cache } = setup();
    // The recorder writes a few seconds behind: the reply ends at the event before.
    callWS.mockResolvedValue({ [EVENT]: [row(STARTED, "dishwasher_started")] });
    cache.states(hass, EVENT, 7);
    await flush();
    expect(cache.states(hass, EVENT, 7).rows).toEqual([row(STARTED, "dishwasher_started"), live(DONE, "dishwasher_complete")]);
    // Asked again, it's the same one row, not one more each time.
    expect(cache.states(hass, EVENT, 7).rows).toHaveLength(2);
  });

  it("keeps the rows it had while it asks again for a new state, and what it saw live until history holds it", async () => {
    const { callWS, hass, onChange, cache, later } = setup();
    callWS.mockResolvedValueOnce({ [EVENT]: [row(STARTED, "dishwasher_started")] });
    cache.states(hass, EVENT, 7);
    await flush();
    cache.states(hass, EVENT, 7);

    const second = deferred<unknown>();
    callWS.mockReturnValueOnce(second.promise);
    const next = later(fired(LOW, "rinse_aid_low"));
    const waiting = [row(STARTED, "dishwasher_started"), live(DONE, "dishwasher_complete"), live(LOW, "rinse_aid_low")];
    expect(cache.states(next, EVENT, 7).rows).toEqual(waiting);
    expect(callWS).toHaveBeenCalledTimes(2);
    // By now the recorder has the event before, but still not the newest.
    second.resolve({ [EVENT]: [row(STARTED, "dishwasher_started"), row(DONE, "dishwasher_complete")] });
    await flush();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(cache.states(next, EVENT, 7).rows).toEqual([
      row(STARTED, "dishwasher_started"),
      row(DONE, "dishwasher_complete"),
      live(LOW, "rinse_aid_low"),
    ]);
    expect(callWS).toHaveBeenCalledTimes(2);
  });

  it("says why it couldn't read the history, and asks again a minute later or when told to", async () => {
    const { callWS, hass, onChange, cache, wait } = setup();
    const lost = { code: "unknown_error", message: "Connection lost" };
    callWS.mockRejectedValueOnce(lost).mockRejectedValueOnce(lost).mockResolvedValue({ [EVENT]: [row(DONE, "dishwasher_complete")] });
    cache.states(hass, EVENT, 7);
    await flush();
    expect(onChange).toHaveBeenCalledOnce();
    expect(cache.states(hass, EVENT, 7)).toEqual({ rows: null, error: lost });
    wait(59_000);
    cache.states(hass, EVENT, 7);
    expect(callWS).toHaveBeenCalledOnce();
    wait(1000);
    // The error stands while it asks again.
    expect(cache.states(hass, EVENT, 7)).toEqual({ rows: null, error: lost });
    expect(callWS).toHaveBeenCalledTimes(2);
    await flush();
    // Told to forget, it starts over at once.
    cache.forgetStates(EVENT, 7);
    expect(cache.states(hass, EVENT, 7)).toEqual({ rows: null, error: null });
    expect(callWS).toHaveBeenCalledTimes(3);
    await flush();
    expect(cache.states(hass, EVENT, 7)).toEqual({ rows: [row(DONE, "dishwasher_complete")], error: null });
  });

  it("reads an entity that has no state yet, and nothing without an entity", async () => {
    const { callWS, hass, cache } = setup();
    callWS.mockResolvedValue({});
    expect(cache.states(undefined, EVENT, 7)).toEqual({ rows: null, error: null });
    expect(cache.states(hass, undefined, 7)).toEqual({ rows: null, error: null });
    expect(callWS).not.toHaveBeenCalled();
    const empty = { ...hass, states: {} };
    cache.states(empty, EVENT, 7);
    await flush();
    expect(cache.states(empty, EVENT, 7)).toEqual({ rows: [], error: null });
  });
});
