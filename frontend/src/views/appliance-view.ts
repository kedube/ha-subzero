/**
 * An appliance's full view: the large live drawing with its status and display, then every
 * control the appliance has, its recent events, Refresh, and (for admins) its Appearance.
 * The shell renders <sz-appliance-view .hass .appliance .narrow .isAdmin> for
 * /sub-zero/<device_id>, and passes its clock and helpers too.
 */
import { LitElement, css, html, nothing, svg, type PropertyValues } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { applyAction } from "../actions";
import { DrawingSize } from "../card/drawing-size";
import { partStyles, renderDisplay, renderPill } from "../card/parts";
import { attempt, displayIdle, drawingInput, safeDrawing } from "../card/view";
import { icon, icons } from "../controls/base";
import { renderControl, type ControlBinding } from "../controls/index";
import { relevantChange } from "../data/appliances";
import { panelHelpers } from "../data/helpers";
import { errorMessage, translatorFor } from "../data/locale";
import { formatDateTime, formatNumber, timeZone } from "../families/common";
import { eventName, fetchEvents, ovenNames, type ApplianceEvent, type OvenNames } from "../families/events";
import { familyModel, makeContext, type ContextHelpers } from "../families/index";
import type { Control, ControlAction, Section } from "../families/types";
import type { HomeAssistant } from "../hass";
import type { Translate } from "../i18n";
import { buttonStyles, syncTheme, tokens, toneStyles } from "../styles";
import type { PanelAppliance } from "../types";
import "./appearance-editor";

// The list stays readable; a busy week of door alerts can run long.
const EVENTS_SHOWN = 50;

const CHEVRON = svg`<path d="M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6z" />`;
const REFRESH = svg`<path d="M17.7 6.3A8 8 0 1 0 19.7 14h-2.1A6 6 0 1 1 12 6c1.7 0 3.1.7 4.2 1.8L13 11h7V4l-2.3 2.3Z" />`;

let views = 0;

function without<T>(record: Record<string, T>, key: string): Record<string, T> {
  const copy = { ...record };
  delete copy[key];
  return copy;
}

function sameName(a: string, b: string): boolean {
  return a.trim().toLocaleLowerCase() === b.trim().toLocaleLowerCase();
}

/** The Home Assistant action a control applies its value with. */
function actionFor(control: Control): ControlAction | null {
  if (control.kind === "ice_delay") {
    return { type: "service", domain: "subzero", service: "schedule_ice_delay", data: { device_id: control.device_id } };
  }
  return "action" in control ? control.action : null;
}

export class ApplianceView extends LitElement {
  static override properties = {
    hass: { attribute: false },
    appliance: { attribute: false },
    narrow: { type: Boolean, reflect: true },
    isAdmin: { type: Boolean },
    now: { attribute: false },
    helpers: { attribute: false },
    pending: { state: true },
    errors: { state: true },
    events: { state: true },
    eventsError: { state: true },
    refreshing: { state: true },
    refreshError: { state: true },
  };

  declare hass: HomeAssistant | undefined;
  declare appliance: PanelAppliance | undefined;
  declare narrow: boolean;
  declare isAdmin: boolean;
  /** The panel's clock in ms; without it the view keeps its own. */
  declare now: number | undefined;
  /** History and preheat helpers; the page's shared ones when not given. */
  declare helpers: ContextHelpers | undefined;
  /** Calls in flight, by section and control id. */
  declare pending: Record<string, boolean>;
  /** Home Assistant's message for the last rejected call, by section and control id. */
  declare errors: Record<string, string>;
  /** Null while loading. */
  declare events: ApplianceEvent[] | null;
  declare eventsError: string | null;
  declare refreshing: boolean;
  declare refreshError: string | null;

  // Drawings prefix their SVG ids with it, which the drawing contract asks to be unique.
  private readonly uid = `szv${++views}`;
  private readonly size = new DrawingSize(this, ".stage .drawing > svg");
  private clock = Date.now();
  private timer: ReturnType<typeof setTimeout> | undefined;
  private stopHelpers: (() => void) | undefined;
  /** What the events were last fetched for; a new event changes the entity's state. */
  private eventsFor: string | null = null;

  constructor() {
    super();
    this.narrow = false;
    this.isAdmin = false;
    this.pending = {};
    this.errors = {};
    this.events = null;
    this.eventsError = null;
    this.refreshing = false;
    this.refreshError = null;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.stopHelpers = panelHelpers.onChange(() => this.requestUpdate());
    this.tick();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this.timer);
    this.timer = undefined;
    this.stopHelpers?.();
    this.stopHelpers = undefined;
  }

  // Countdowns and the preheat ring move every second, on the panel's clock when it passes one.
  private readonly tick = (): void => {
    this.clock = Date.now();
    if (this.now === undefined) this.requestUpdate();
    this.timer = setTimeout(this.tick, 1000 - (this.clock % 1000) + 5);
  };

  // Home Assistant hands panels a new hass for any state change in the house, many times a
  // second on a busy system; the view redraws only for its own appliance and the user's settings.
  protected override shouldUpdate(changed: PropertyValues<this>): boolean {
    if (changed.size === 1 && changed.has("hass") && this.hass && this.appliance) {
      return relevantChange(changed.get("hass"), this.hass, this.appliance);
    }
    return true;
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    syncTheme(this, this.hass);
    const before = changed.get("appliance") as PanelAppliance | undefined;
    if (changed.has("appliance") && before?.device_id !== this.appliance?.device_id) {
      this.pending = {};
      this.errors = {};
      this.events = null;
      this.eventsError = null;
      this.refreshError = null;
      this.eventsFor = null;
    }
    // On its own (without the panel's helpers), the view keeps the shared ones current itself.
    if (!this.helpers && this.hass && this.appliance) panelHelpers.observe(this.hass, [this.appliance]);
  }

  protected override updated(): void {
    this.fetchEventsIfNeeded();
  }

  private fetchEventsIfNeeded(): void {
    const { hass, appliance } = this;
    if (!hass || !appliance) return;
    const entityId = appliance.entities?.appliance_event?.event;
    if (!entityId) return;
    const marker = `${appliance.device_id}|${entityId}|${hass.states[entityId]?.state ?? ""}`;
    if (marker === this.eventsFor) return;
    this.eventsFor = marker;
    fetchEvents(hass, entityId, Date.now()).then(
      (events) => {
        if (this.eventsFor !== marker) return;
        this.events = events;
        this.eventsError = null;
      },
      (error) => {
        if (this.eventsFor !== marker) return;
        this.eventsError = errorMessage(error);
      },
    );
  }

  private async apply(key: string, control: Control, value: unknown): Promise<void> {
    const hass = this.hass;
    const action = actionFor(control);
    if (!hass || !action) return;
    this.pending = { ...this.pending, [key]: true };
    this.errors = without(this.errors, key);
    try {
      await applyAction(hass, action, value);
    } catch (error) {
      this.errors = { ...this.errors, [key]: errorMessage(error) || translatorFor(hass)("full.failed") };
    } finally {
      this.pending = without(this.pending, key);
    }
  }

  private async refresh(): Promise<void> {
    const { hass, appliance } = this;
    if (!hass || !appliance || this.refreshing) return;
    this.refreshing = true;
    this.refreshError = null;
    try {
      await hass.callService("subzero", "refresh", { device_id: [appliance.device_id] });
    } catch (error) {
      this.refreshError = errorMessage(error) || translatorFor(hass)("full.failed");
    } finally {
      this.refreshing = false;
    }
  }

  protected override render() {
    const { hass, appliance } = this;
    if (!hass || !appliance) return nothing;
    const t = translatorFor(hass);
    const now = this.now ?? this.clock;
    const model = familyModel(appliance);
    const ctx = makeContext(appliance, hass, t, now, this.helpers ?? panelHelpers);
    const what = (part: string) => `${appliance.spec?.family} ${part} for ${appliance.device_id}`;
    // A model that trips over an appliance's state shows less, never a broken page.
    const state = attempt(what("drawing state"), () => model.drawingState(ctx), {
      available: appliance.available,
      doors: {},
      readouts: {},
    });
    const status = attempt(what("status"), () => model.status(ctx), { text: "", tone: "neutral" as const });
    const display = appliance.available ? attempt(what("display"), () => model.display(ctx), null) : null;
    const sections = attempt(what("sections"), () => model.sections(ctx), [] as Section[]);
    const ovens = attempt(what("oven names"), () => ovenNames(ctx), {} as OvenNames);
    const binding = {
      timeZone: timeZone(hass),
      formatNumber: (value: number, decimals: number) => formatNumber(hass, value, decimals, decimals),
    };
    return html`<div class="layout">
      <section class="hero" aria-label=${t("full.appliance")}>
        <div class="hero-head">
          <!-- Not a live region: preheat and timer pills change every second. -->
          <div>${renderPill(status)}</div>
          ${renderDisplay(display, displayIdle(state))}
        </div>
        <div class="stage">
          <div class="drawing">
            ${safeDrawing(drawingInput(appliance, state, hass, this.uid, { pixelHeight: this.size.height }))}
          </div>
        </div>
      </section>
      <div class="sections">
        ${repeat(
          sections,
          (section) => section.id,
          (section) => this.renderSection(section, t, binding),
        )}
        ${this.renderEvents(t, hass, now, ovens)} ${this.renderRefresh(t)} ${this.isAdmin ? this.renderAppearance(t) : nothing}
      </div>
    </div>`;
  }

  private card(title: string, body: unknown, open: boolean) {
    return html`<details class="card" ?open=${open}>
      <summary>
        <h2>${title}</h2>
        <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true">${CHEVRON}</svg>
      </summary>
      <div class="body">${body}</div>
    </details>`;
  }

  private renderSection(section: Section, t: Translate, binding: Pick<ControlBinding, "timeZone" | "formatNumber">) {
    // A reason that two or more locked controls share (a cycle running, Sabbath, the oven being
    // off) shows once at the top instead of under each of them; a one-off stays with its control.
    // Each control keeps it for screen readers, so the note at the top is only for the eye.
    const counts = new Map<string, number>();
    for (const control of section.controls) {
      if (control.disabled && control.reason) counts.set(control.reason, (counts.get(control.reason) ?? 0) + 1);
    }
    const shared = [...counts].filter(([, count]) => count > 1).map(([reason]) => reason);
    const note = (reason: string, hidden: boolean) =>
      html`<p class="note shared" aria-hidden=${hidden ? "true" : nothing}>${icon(icons.lock)}<span>${reason}</span></p>`;
    // Switches that are all locked with no state to show (a dishwasher's options while it runs)
    // say only why, rather than a column of dashes.
    const blank =
      shared.length === 1 &&
      section.controls.every(
        (control) => control.kind === "toggle" && control.value === null && control.disabled && control.reason === shared[0],
      );
    if (blank) return this.card(section.title, note(shared[0], false), !section.collapsed);
    // A section's only control, named like the section, doesn't repeat the name on its own line.
    const quiet = section.controls.length === 1 && sameName(section.controls[0].label, section.title);
    return this.card(
      section.title,
      html`${shared.map((reason) => note(reason, true))}
      ${repeat(
        section.controls,
        (control) => control.id,
        (control) => {
          const key = `${section.id}/${control.id}`;
          return html`<div class="control">
            ${renderControl(control, {
              t,
              pending: Boolean(this.pending[key]),
              error: this.errors[key] ?? null,
              onValue: (event) => void this.apply(key, control, event.detail.value),
              quiet,
              sharedReason: Boolean(control.disabled && control.reason && shared.includes(control.reason)),
              ...binding,
            })}
          </div>`;
        },
      )}`,
      !section.collapsed,
    );
  }

  private renderEvents(t: Translate, hass: HomeAssistant, now: number, ovens: OvenNames) {
    if (!this.appliance?.entities?.appliance_event?.event) return nothing;
    let body: unknown;
    if (!this.events && this.eventsError) {
      body = html`<p class="note error" role="alert">${t("full.events_error", { error: this.eventsError })}</p>
        <button type="button" class="sz-button" @click=${() => this.retryEvents()}>${t("overview.retry")}</button>`;
    } else if (!this.events) {
      body = html`<p class="note">${t("full.events_loading")}</p>`;
    } else if (!this.events.length) {
      body = html`<p class="note">${t("full.no_events")}</p>`;
    } else {
      body = html`<ol class="events">
        ${this.events.slice(0, EVENTS_SHOWN).map(
          (event) => html`<li>
            <span>${eventName(t, event.type, ovens)}</span>
            <time datetime=${new Date(event.time).toISOString()}>${formatDateTime(hass, event.time, now)}</time>
          </li>`,
        )}
      </ol>`;
    }
    return this.card(t("full.recent_events"), body, true);
  }

  // A failed fetch is otherwise tried again only when a new event arrives.
  private retryEvents(): void {
    this.eventsFor = null;
    this.eventsError = null;
  }

  private renderRefresh(t: Translate) {
    return html`<div class="refresh">
      <button type="button" class="sz-button" ?disabled=${this.refreshing} @click=${() => void this.refresh()}>
        <svg class="${this.refreshing ? "spinning" : ""}" viewBox="0 0 24 24" aria-hidden="true">${REFRESH}</svg>
        ${t(this.refreshing ? "full.refreshing" : "full.refresh")}
      </button>
      ${this.refreshError
        ? html`<span class="error" role="alert">${this.refreshError}</span>`
        : html`<span class="note">${t("full.refresh_hint")}</span>`}
    </div>`;
  }

  private renderAppearance(t: Translate) {
    return this.card(
      t("full.appearance"),
      html`<sz-appearance-editor .hass=${this.hass} .appliance=${this.appliance}></sz-appearance-editor>`,
      false,
    );
  }

  static override styles = [
    tokens,
    toneStyles,
    buttonStyles,
    partStyles,
    css`
      :host {
        display: block;
        color: var(--sz-text);
        container-type: inline-size;
      }
      :host([dark]) {
        color-scheme: dark;
      }
      .layout {
        display: grid;
        grid-template-columns: minmax(300px, 5fr) minmax(0, 7fr);
        align-items: start;
        gap: 20px;
        max-width: 1240px;
        margin: 0 auto;
      }
      .hero,
      .card {
        box-sizing: border-box;
        border: var(--sz-border-width) solid var(--sz-border);
        border-radius: var(--sz-radius);
        background: var(--sz-card-bg);
        box-shadow: var(--ha-card-box-shadow, none);
      }
      /* The page scrolls under the panel's sticky toolbar; the drawing stays in view below it. */
      .hero {
        position: sticky;
        top: calc(var(--sz-toolbar-height, 0px) + 16px);
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 14px 16px 18px;
      }
      .hero-head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        min-height: 32px;
      }
      .hero-head .pill {
        max-width: none;
        padding: 4px 12px;
        font-size: 13px;
      }
      /* The drawing takes its own proportions, up to a height that keeps a tall column in
         view; a wide range is then no taller than it needs to be. */
      .stage,
      .stage .drawing {
        height: auto;
      }
      .stage .drawing > svg {
        max-height: min(68vh, 640px);
      }
      .sections {
        display: flex;
        flex-direction: column;
        gap: 12px;
        min-width: 0;
      }
      summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        min-height: 52px;
        padding: 0 16px;
        box-sizing: border-box;
        border-radius: var(--sz-radius);
        cursor: pointer;
        list-style: none;
        -webkit-tap-highlight-color: transparent;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      summary:focus-visible {
        outline: 2px solid var(--sz-accent);
        outline-offset: -2px;
      }
      summary h2 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      .chevron {
        flex: none;
        width: 22px;
        height: 22px;
        fill: var(--sz-muted);
        transition: transform 0.2s;
      }
      details[open] > summary .chevron {
        transform: rotate(180deg);
      }
      .body {
        padding: 0 16px 10px;
      }
      .control {
        padding: 10px 0;
        border-top: 1px solid var(--sz-divider);
      }
      /* Values to read sit closer than controls to use, like Home Assistant's device info. */
      .control:has(> sz-reading, > sz-countdown) {
        padding: 7px 0;
      }
      .control:first-child {
        padding-top: 0;
        border-top: none;
      }
      .note {
        margin: 0 0 6px;
        color: var(--sz-muted);
      }
      .note.shared {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        margin-bottom: 10px;
        font-size: 13px;
      }
      .note.shared svg {
        flex: none;
        width: 14px;
        height: 14px;
        margin-top: 2px;
        fill: currentColor;
      }
      .error {
        color: var(--sz-error-text);
      }
      .events {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .events li {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 2px 16px;
        padding: 9px 0;
        border-top: 1px solid var(--sz-divider);
      }
      .events li:first-child {
        padding-top: 0;
        border-top: none;
      }
      .events time {
        color: var(--sz-muted);
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }
      .refresh {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 14px;
        padding: 4px 2px;
      }
      .refresh svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
      }
      .refresh .note {
        margin: 0;
        font-size: 13px;
      }
      .spinning {
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .chevron {
          transition: none;
        }
        .spinning {
          animation: none;
        }
      }
      /* Narrow: the drawing on top, short enough that the first controls show under it. */
      @container (max-width: 760px) {
        .layout {
          grid-template-columns: minmax(0, 1fr);
          gap: 12px;
        }
        .hero {
          position: static;
        }
        .stage .drawing > svg {
          max-height: min(42vh, 360px);
        }
      }
      :host([narrow]) .layout {
        grid-template-columns: minmax(0, 1fr);
        gap: 12px;
      }
      :host([narrow]) .hero {
        position: static;
      }
      :host([narrow]) .stage .drawing > svg {
        max-height: min(42vh, 360px);
      }
    `,
  ];
}

if (!customElements.get("sz-appliance-view")) customElements.define("sz-appliance-view", ApplianceView);

declare global {
  interface HTMLElementTagNameMap {
    "sz-appliance-view": ApplianceView;
  }
}
