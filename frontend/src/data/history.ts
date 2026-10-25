import type { HomeAssistant } from "../hass";

/** One state change from Home Assistant's history; `at` is in ms since the epoch. */
export interface Change {
  state: string;
  at: number;
}

// Long enough for any dishwasher cycle or oven session, short enough to stay a small reply.
const WINDOW_MS = 12 * 3600_000;
// How far past a moment lowestAfter looks: past the coldest reading of any preheat.
const VALUE_SPAN_MS = 30 * 60_000;
// And how far before it: a reading that came in the same update as the turn-on is recorded a few
// milliseconds earlier, because the integration sets up its sensors before its binary sensors.
const EARLY_MS = 2000;
const VALUES_KEPT = 64;
// After a failed fetch (a dropped connection, Home Assistant restarting), when to ask again.
const RETRY_MS = 60_000;
// A dropped connection doesn't end what the appliance was doing.
const GAPS = new Set(["unavailable", "unknown"]);

type Row = {
  s?: unknown;
  lu?: unknown;
  lc?: unknown;
  state?: unknown;
  last_changed?: unknown;
  last_updated?: unknown;
};

/**
 * The rows `history/history_during_period` sends for one entity, oldest first: compressed rows
 * (`{s, lu, lc}` in seconds, what the websocket API sends) or full ones (`{state, last_changed,
 * last_updated}` as ISO strings). A row's change time is `lc`, or `lu` where they're equal.
 */
export function parseRows(rows: unknown): Change[] {
  if (!Array.isArray(rows)) return [];
  const changes: Change[] = [];
  for (const row of rows as Row[]) {
    if (!row || typeof row !== "object") continue;
    const state = row.s ?? row.state;
    const at = toMs(row.lc ?? row.lu ?? row.last_changed ?? row.last_updated);
    if (typeof state === "string" && at !== null) changes.push({ state, at });
  }
  return changes;
}

function toMs(value: unknown): number | null {
  // Home Assistant sends seconds; a value this large can only already be milliseconds.
  if (typeof value === "number" && Number.isFinite(value)) return value < 1e11 ? value * 1000 : value;
  if (typeof value === "string") {
    const ms = Date.parse(value);
    return Number.isNaN(ms) ? null : ms;
  }
  return null;
}

function isGap(state: string, target: string): boolean {
  return GAPS.has(state) && !GAPS.has(target);
}

/** When the entity last turned to `target`, or null if the changes never show it. */
export function lastTurnedTo(changes: readonly Change[], target: string): number | null {
  let previous: string | undefined;
  let start: number | null = null;
  for (const change of changes) {
    if (isGap(change.state, target)) continue;
    if (change.state === target && previous !== target) start = change.at;
    previous = change.state;
  }
  return start;
}

function lastState(changes: readonly Change[], target: string): string | undefined {
  for (let index = changes.length - 1; index >= 0; index--) {
    if (!isGap(changes[index].state, target)) return changes[index].state;
  }
  return undefined;
}

function numberFrom(state: string | undefined): number | null {
  const value = Number.parseFloat(state ?? "");
  return Number.isFinite(value) ? value : null;
}

function lowestNumber(changes: readonly Change[]): number | null {
  let lowest: number | null = null;
  for (const change of changes) {
    const value = numberFrom(change.state);
    if (value !== null && (lowest === null || value < lowest)) lowest = value;
  }
  return lowest;
}

interface EntityHistory {
  /** The entity's `last_changed` when this was fetched; a newer one means fetch again. */
  lastChanged: string;
  changes: Change[] | null;
  /** The last fetch failed, so `since` answers from the live state. */
  failed: boolean;
  /** When to fetch again after a failure; null while a fetch is under way or done. */
  retryAt: number | null;
}

interface Value {
  value: number | null;
  /** When to fetch again after a failure; null otherwise. */
  retryAt: number | null;
  /** The entity's `last_changed` when this was fetched. */
  lastChanged: string;
  /** The half hour was over when this was fetched, so the answer is for good. */
  final: boolean;
}

/**
 * Reads Home Assistant's history for the family models, synchronously: a lookup returns null
 * until the reply arrives, then `onChange` asks the panel to draw again. Each entity is fetched
 * once, and again when its `last_changed` moves or a minute after a fetch failed.
 */
export class HistoryCache {
  private readonly histories = new Map<string, EntityHistory>();
  private readonly values = new Map<string, Value>();

  constructor(
    private readonly onChange: () => void = () => {},
    private readonly now: () => number = Date.now,
  ) {}

  /**
   * When `entityId` last turned to `target` ("on" by default), in ms: the start of its latest
   * stretch in that state, which a brief unavailable spell doesn't break. Null until the
   * history arrives, or when the last 12 hours never show the state. Meant for entities that
   * change state rarely, such as on/off sensors: each new `last_changed` fetches again.
   */
  since(hass: HomeAssistant | undefined, entityId: string | undefined, target = "on"): number | null {
    const current = entityId ? hass?.states[entityId] : undefined;
    if (!hass || !entityId || !current) return null;
    const history = this.history(hass, entityId, current.last_changed);
    const changedAt = toMs(current.last_changed);
    // Without history (the recorder off or excluding it), the live state still says when the
    // current stretch began.
    if (history.failed) return current.state === target ? changedAt : null;
    if (!history.changes) return null;
    // The recorder writes a few seconds behind the live state, so a stretch that has only just
    // begun may not be in the reply yet.
    if (current.state === target && lastState(history.changes, target) !== target) return changedAt;
    return lastTurnedTo(history.changes, target);
  }

  /**
   * The lowest number `entityId` read in the half hour from `at` (ms); null until the history
   * arrives, or while it shows none. An oven's preheat starts at its coldest reading after it
   * turned on: the state it already had may be the stale temperature it kept while off, so that
   * one counts only while the sensor still reads it, when it's the only reading there is. A half
   * hour that's over never changes, so it's fetched once; one still under way that showed nothing
   * is fetched again once the sensor changes.
   */
  lowestAfter(hass: HomeAssistant | undefined, entityId: string | undefined, at: number): number | null {
    if (!hass || !entityId || !Number.isFinite(at)) return null;
    const key = `${entityId}@${at}`;
    const known = this.values.get(key);
    const current = hass.states[entityId];
    const lastChanged = current?.last_changed ?? "";
    if (known && !this.outdated(known, lastChanged)) return known.value;
    const start = at - EARLY_MS;
    const end = at + VALUE_SPAN_MS;
    // While it asks again, the last answer stands.
    const fresh: Value = { value: known?.value ?? null, retryAt: null, lastChanged, final: this.now() >= end };
    this.values.delete(key);
    this.values.set(key, fresh);
    if (this.values.size > VALUES_KEPT) this.values.delete(this.values.keys().next().value!);
    // Home Assistant sends nothing for a window the sensor hasn't changed in, which means what it
    // reads now it has read since before the window began.
    const changedAt = toMs(lastChanged);
    const held = changedAt !== null && changedAt <= start ? numberFrom(current?.state) : null;
    this.fetch(hass, entityId, start, end).then(
      (changes) => {
        if (this.values.get(key) !== fresh) return;
        const value = lowestNumber(changes) ?? held;
        if (value === fresh.value) return;
        fresh.value = value;
        this.onChange();
      },
      () => {
        if (this.values.get(key) !== fresh) return;
        fresh.retryAt = this.now() + RETRY_MS;
      },
    );
    return fresh.value;
  }

  private outdated(known: Value, lastChanged: string): boolean {
    if (known.retryAt !== null) return this.now() >= known.retryAt;
    return known.value === null && !known.final && known.lastChanged !== lastChanged;
  }

  private history(hass: HomeAssistant, entityId: string, lastChanged: string): EntityHistory {
    const known = this.histories.get(entityId);
    const same = known?.lastChanged === lastChanged;
    if (known && same && (known.retryAt === null || this.now() < known.retryAt)) return known;
    // Trying again after a failure keeps answering from the live state until the reply.
    const fresh: EntityHistory = { lastChanged, changes: null, failed: Boolean(same && known?.failed), retryAt: null };
    this.histories.set(entityId, fresh);
    this.fetch(hass, entityId, this.now() - WINDOW_MS).then(
      (changes) => {
        if (this.histories.get(entityId) !== fresh) return;
        fresh.changes = changes;
        fresh.failed = false;
        this.onChange();
      },
      () => {
        if (this.histories.get(entityId) !== fresh) return;
        fresh.failed = true;
        fresh.retryAt = this.now() + RETRY_MS;
        this.onChange();
      },
    );
    return fresh;
  }

  private async fetch(hass: HomeAssistant, entityId: string, start: number, end?: number): Promise<Change[]> {
    const reply = await hass.callWS<Record<string, unknown> | null>({
      type: "history/history_during_period",
      start_time: new Date(start).toISOString(),
      // A window's own changes only: the state before it can be long stale.
      ...(end === undefined ? {} : { end_time: new Date(end).toISOString(), include_start_time_state: false }),
      entity_ids: [entityId],
      minimal_response: true,
      no_attributes: true,
    });
    return parseRows(reply?.[entityId]);
  }
}
