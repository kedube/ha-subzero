import type { ContextHelpers } from "../families/index";
import type { HomeAssistant } from "../hass";
import type { PanelAppliance } from "../types";
import { HistoryCache } from "./history";
import { PreheatTracker, type CavityPrefix } from "./preheat";

/**
 * What `makeContext` needs besides `hass`: history lookups and preheat start points. Both answer
 * synchronously and fill in later, so whoever draws subscribes with `onChange` to draw again.
 */
export class PanelHelpers implements ContextHelpers {
  hass: HomeAssistant | undefined;
  readonly history: HistoryCache;
  readonly preheat: PreheatTracker;
  private readonly listeners = new Set<() => void>();

  constructor(now: () => number = Date.now) {
    this.history = new HistoryCache(() => this.notify(), now);
    this.preheat = new PreheatTracker(this.history, now);
  }

  /** Keeps the helpers current. The panel calls it on every update, clock ticks included. */
  observe(hass: HomeAssistant, appliances: readonly PanelAppliance[]): void {
    this.hass = hass;
    this.preheat.observe(hass, appliances);
  }

  since(entityId: string, state = "on"): number | null {
    return this.history.since(this.hass, entityId, state);
  }

  preheatStart(appliance: PanelAppliance, prefix: CavityPrefix): number | null {
    return this.preheat.start(this.hass, appliance, prefix);
  }

  /** Calls `listener` when history arrives; returns the unsubscribe function. */
  onChange(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of [...this.listeners]) listener();
  }
}

/**
 * The page's helpers. One per page rather than per panel element, so the history cache and the
 * preheat start points outlive the element when Home Assistant swaps it out, and so any view
 * the panel shows can reach them without being handed them.
 */
export const panelHelpers = new PanelHelpers();
