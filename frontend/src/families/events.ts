import type { HomeAssistant } from "../hass";
import type { Translate } from "../i18n";
import { cavities, cavityName } from "./oven";
import type { ApplianceContext } from "./types";

/** One appliance event: its NOTIFICATION_TYPES name and when it happened, in ms. */
export interface ApplianceEvent {
  type: string;
  time: number;
}

/** The panel's name for each oven, by property prefix. */
export type OvenNames = Partial<Record<"cav" | "cav2", string>>;

// The integration names its oven events "Oven …" for the first cavity (cav) and "Lower oven …"
// for the second (cav2).
const CAVITY_EVENT =
  /^(lower_)?oven_(cooking_timer_complete|cooking_timer_under_one_minute|door_ajar|preheated|probe_connected|probe_target_reached|probe_within_ten_degrees|self_clean_complete)$/;

const DAY_MS = 86_400_000;

type Row = {
  s?: unknown;
  a?: unknown;
  lu?: unknown;
  lc?: unknown;
  state?: unknown;
  attributes?: unknown;
  last_changed?: unknown;
};

function toMs(value: unknown): number | null {
  // Compressed history rows give seconds; full rows give ISO strings.
  if (typeof value === "number" && Number.isFinite(value)) return value < 1e11 ? value * 1000 : value;
  if (typeof value === "string" && value) {
    const ms = Date.parse(value);
    return Number.isNaN(ms) ? null : ms;
  }
  return null;
}

/**
 * Events from the Appliance event entity's history rows, newest first. Each row's state is when
 * Home Assistant fired the event; the appliance's own timestamp, when it sent one, is when it
 * happened, which matters for events read late from the appliance's history.
 */
export function eventsFrom(rows: unknown, since: number): ApplianceEvent[] {
  if (!Array.isArray(rows)) return [];
  const seen = new Set<string>();
  const events: ApplianceEvent[] = [];
  for (const row of rows as Row[]) {
    if (!row || typeof row !== "object") continue;
    const state = row.s ?? row.state;
    if (typeof state !== "string" || state === "unavailable" || state === "unknown") continue;
    const attributes = (row.a ?? row.attributes ?? {}) as Record<string, unknown>;
    const type = attributes.event_type;
    if (typeof type !== "string" || !type) continue;
    const time = toMs(attributes.appliance_timestamp) ?? toMs(state) ?? toMs(row.lc ?? row.lu ?? row.last_changed);
    if (time === null || time < since) continue;
    const key = `${time}|${type}`;
    if (seen.has(key)) continue;
    seen.add(key);
    events.push({ type, time });
  }
  return events.sort((a, b) => b.time - a.time);
}

/** The last `days` of events from Home Assistant's history, newest first. */
export async function fetchEvents(hass: HomeAssistant, entityId: string, now: number, days = 7): Promise<ApplianceEvent[]> {
  const since = now - days * DAY_MS;
  const reply = await hass.callWS<Record<string, unknown> | null>({
    type: "history/history_during_period",
    start_time: new Date(since).toISOString(),
    entity_ids: [entityId],
    include_start_time_state: false,
    significant_changes_only: false,
    minimal_response: false,
    no_attributes: false,
  });
  return eventsFrom(reply?.[entityId], since);
}

/**
 * What the panel calls each oven of an appliance with two: Right and Left oven on a range, Upper
 * and Lower on a double wall oven. Empty for one oven or none, whose events read right as they are.
 */
export function ovenNames(ctx: ApplianceContext): OvenNames {
  const spec = ctx.appliance.spec;
  const ovens = spec?.family === "range" || spec?.family === "wall_oven" || (spec?.family === "generic" && spec.form === "oven");
  const list = ovens ? cavities(ctx) : [];
  return list.length < 2 ? {} : Object.fromEntries(list.map((cavity) => [cavity.prefix, cavityName(ctx, cavity)]));
}

/**
 * The event's name in the user's language, or its type when there's no translation. With two
 * ovens, an oven's event names it as the rest of the panel does ("Left oven · Door open"), since
 * the integration's "Oven" and "Lower oven" are the right and left ovens on a range.
 */
export function eventName(t: Translate, type: string, ovens: OvenNames = {}): string {
  const match = CAVITY_EVENT.exec(type);
  const oven = match ? ovens[match[1] ? "cav2" : "cav"] : undefined;
  if (match && oven) return t("event.in_cavity", { cavity: oven, event: t(`event.cavity.${match[2]}`) });
  const key = `event.${type}`;
  const name = t(key);
  return name === key ? type : name;
}
