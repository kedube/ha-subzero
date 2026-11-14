import { readRows, toMs } from "../data/history";
import type { HassEntity } from "../hass";
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

/**
 * Events from the Appliance event entity's history rows, newest first. Each row's state is when
 * Home Assistant fired the event; the appliance's own timestamp, when it sent one, is when it
 * happened, which matters for events read late from the appliance's history.
 */
export function eventsFrom(rows: unknown, since: number): ApplianceEvent[] {
  const seen = new Set<string>();
  const events: ApplianceEvent[] = [];
  for (const { state, attributes, at } of readRows(rows)) {
    if (state === "unavailable" || state === "unknown") continue;
    const type = attributes.event_type;
    if (typeof type !== "string" || !type) continue;
    const time = toMs(attributes.appliance_timestamp) ?? toMs(state) ?? at;
    if (time === null || time < since) continue;
    const key = `${time}|${type}`;
    if (seen.has(key)) continue;
    seen.add(key);
    events.push({ type, time });
  }
  return events.sort((a, b) => b.time - a.time);
}

/** The event the Appliance event entity shows now, read as its history row would be; null when it has none. */
export function liveEvent(entity: HassEntity | undefined): ApplianceEvent | null {
  if (!entity) return null;
  const row = { state: entity.state, attributes: entity.attributes, last_changed: entity.last_changed };
  return eventsFrom([row], Number.NEGATIVE_INFINITY)[0] ?? null;
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
