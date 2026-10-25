/**
 * The Sub-Zero sidebar panel. Home Assistant hands a panel element `hass`, `narrow`, `route`
 * and `panel`. The panel subscribes to the integration's `subzero/panel/subscribe` for the
 * appliances' structure (entity map, drawing spec, Appearance, locks), reads their live state
 * from `hass.states`, and routes between the overview and each appliance's full view.
 */
import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import type { OpenApplianceDetail } from "./card/appliance-card";
import { applianceName } from "./data/appliances";
import { panelHelpers } from "./data/helpers";
import { errorMessage, translatorFor } from "./data/locale";
import { navigate, parseRoute, routePath, type PanelRoute } from "./data/route";
import { PanelSubscription } from "./data/subscription";
import type { HomeAssistant } from "./hass";
import type { Translate } from "./i18n";
import { buttonStyles, syncTheme, tokens } from "./styles";
import type { PanelAppliance } from "./types";
import "./views/appliance-view";
import "./views/overview";

interface HassRoute {
  prefix: string;
  path: string;
}

// Material Design Icons: menu and arrow-left, as Home Assistant's own toolbars show them, and
// alert-circle-outline for the error state.
const MENU_ICON = "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z";
const BACK_ICON = "M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z";
const ALERT_ICON =
  "M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2" +
  "M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z";

class SubZeroPanel extends LitElement {
  static override properties = {
    hass: { attribute: false },
    narrow: { type: Boolean, reflect: true },
    route: { attribute: false },
    panel: { attribute: false },
    appliances: { state: true },
    error: { state: true },
    now: { state: true },
  };

  declare hass: HomeAssistant | undefined;
  declare narrow: boolean;
  declare route: HassRoute | undefined;
  declare panel: unknown;
  /** Null until the first message arrives. */
  declare appliances: PanelAppliance[] | null;
  declare error: string | null;
  declare now: number;

  private readonly subscription = new PanelSubscription(
    (message) => {
      this.appliances = Array.isArray(message?.appliances) ? message.appliances : [];
      this.error = null;
    },
    (error) => {
      this.error = errorMessage(error);
    },
  );
  private timer: ReturnType<typeof setTimeout> | undefined;
  private stopHelpers: (() => void) | undefined;
  // Back returns through history when the panel itself opened the appliance, so the browser's
  // own Back and Forward stay in step; after a direct link it replaces the entry instead.
  private openedFromOverview = false;

  constructor() {
    super();
    this.narrow = false;
    this.appliances = null;
    this.error = null;
    this.now = Date.now();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Home Assistant pads a custom panel's container by the safe-area insets unless the panel
    // registers with handle_safe_area. The toolbar and content pad themselves, so the toolbar
    // reaches the screen's edge and stays clear of the status bar while it sticks; when the
    // container pads too, the panel reaches out over that padding instead of doubling it.
    this.toggleAttribute("framed", Boolean(this.parentElement?.style.paddingTop));
    this.tick();
    this.stopHelpers = panelHelpers.onChange(() => this.requestUpdate());
    this.subscription.connect(this.hass?.connection);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this.timer);
    this.timer = undefined;
    this.stopHelpers?.();
    this.stopHelpers = undefined;
    this.subscription.disconnect();
  }

  // Ticks on the second, so countdowns change together with the appliances' own clocks.
  private readonly tick = (): void => {
    this.now = Date.now();
    this.timer = setTimeout(this.tick, 1000 - (this.now % 1000) + 5);
  };

  protected override willUpdate(changed: PropertyValues<this>): void {
    syncTheme(this, this.hass);
    if (changed.has("hass") && this.isConnected) this.subscription.connect(this.hass?.connection);
    // Every update, clock ticks included, so preheat tracking sees a cavity turn on promptly.
    if (this.hass && this.appliances) panelHelpers.observe(this.hass, this.appliances);
  }

  protected override updated(changed: PropertyValues<this>): void {
    // The page itself scrolls, so the browser keeps and restores each view's scroll position.
    if (!changed.has("route")) return;
    const previous = changed.get("route");
    const before = parseRoute(previous?.path);
    const after = parseRoute(this.route?.path);
    if (after.view === "overview") this.openedFromOverview = false;
    // Not on the first route, which a page load or a link chose.
    if (!previous || before.view === after.view) return;
    void this.restoreFocus(before);
  }

  /**
   * Where keyboard focus goes after the view changes, since the element that had it is gone:
   * the toolbar's Back button in a full view, and back on the overview, the appliance's card.
   * Only when focus was in the panel or lost, never taken from the rest of Home Assistant.
   */
  private async restoreFocus(before: PanelRoute): Promise<void> {
    const active = document.activeElement;
    if (active && active !== document.body && !this.shadowRoot?.activeElement) return;
    let target: HTMLElement | null | undefined;
    if (before.view === "overview") {
      target = this.renderRoot.querySelector<HTMLElement>(".toolbar .icon-button");
    } else {
      const overview = this.renderRoot.querySelector("sz-overview");
      await overview?.updateComplete;
      target = [...(overview?.shadowRoot?.querySelectorAll("sz-appliance-card") ?? [])].find(
        (card) => card.appliance?.device_id === before.deviceId,
      );
    }
    target?.focus({ preventScroll: true });
  }

  protected override render() {
    const t = translatorFor(this.hass);
    const route = parseRoute(this.route?.path);
    const appliance =
      route.view === "appliance"
        ? this.appliances?.find((candidate) => candidate.device_id === route.deviceId)
        : undefined;
    return html`
      ${this.renderToolbar(t, route, appliance)}
      <div class="content">${this.renderContent(t, route, appliance)}</div>
    `;
  }

  private renderToolbar(t: Translate, route: PanelRoute, appliance: PanelAppliance | undefined) {
    const full = route.view === "appliance";
    let button: unknown = nothing;
    if (full) button = this.iconButton(BACK_ICON, t("panel.back"), () => this.showOverview());
    // Home Assistant's own panels also show the menu button when the sidebar is hidden.
    else if (this.narrow || this.hass?.dockedSidebar === "always_hidden") {
      button = this.iconButton(MENU_ICON, t("panel.menu"), () => this.toggleMenu());
    }
    const title = full && appliance ? applianceName(appliance, this.hass) : t("panel.title");
    return html`<header class="toolbar ${button === nothing ? "" : "with-button"}">
      ${button}
      <h1 class="title">${title}</h1>
    </header>`;
  }

  private iconButton(icon: string, label: string, action: () => void) {
    return html`<button type="button" class="icon-button" aria-label=${label} title=${label} @click=${action}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d=${icon}></path></svg>
    </button>`;
  }

  private renderContent(t: Translate, route: PanelRoute, appliance: PanelAppliance | undefined) {
    if (!this.appliances) {
      if (this.error) {
        return html`<div class="state" role="alert">
          <svg class="state-icon" viewBox="0 0 24 24" aria-hidden="true"><path d=${ALERT_ICON}></path></svg>
          <h2>${t("overview.error_title")}</h2>
          <p>${this.error}</p>
          <button type="button" class="sz-button primary" @click=${() => this.retry()}>
            ${t("overview.retry")}
          </button>
        </div>`;
      }
      return html`<div class="state">
        <div class="spinner" role="progressbar" aria-label=${t("overview.loading")}></div>
        <p>${t("overview.loading")}</p>
      </div>`;
    }
    if (route.view === "overview") {
      return html`<sz-overview
        .hass=${this.hass}
        .appliances=${this.appliances}
        .now=${this.now}
        .helpers=${panelHelpers}
        @sz-open-appliance=${this.onOpen}
      ></sz-overview>`;
    }
    if (!appliance) {
      return html`<div class="state">
        <h2>${t("overview.not_found_title")}</h2>
        <p>${t("overview.not_found_text")}</p>
        <button type="button" class="sz-button primary" @click=${() => this.showOverview()}>
          ${t("overview.back")}
        </button>
      </div>`;
    }
    // The full view takes the clock and helpers too, for countdowns and history, when it
    // declares them; panelHelpers reaches it either way.
    return html`<sz-appliance-view
      .hass=${this.hass}
      .appliance=${appliance}
      .narrow=${this.narrow}
      .isAdmin=${this.hass?.user?.is_admin === true}
      .now=${this.now}
      .helpers=${panelHelpers}
    ></sz-appliance-view>`;
  }

  private readonly onOpen = (event: CustomEvent<OpenApplianceDetail>): void => {
    this.openedFromOverview = true;
    navigate(routePath(this.route?.prefix, { view: "appliance", deviceId: event.detail.deviceId }));
  };

  private showOverview(): void {
    if (this.openedFromOverview) {
      this.openedFromOverview = false;
      history.back();
      return;
    }
    navigate(routePath(this.route?.prefix, { view: "overview" }), { replace: true });
  }

  private toggleMenu(): void {
    this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }));
  }

  private retry(): void {
    this.error = null;
    this.subscription.retry();
  }

  static override styles = [
    tokens,
    buttonStyles,
    css`
      /* The page scrolls, not the panel: Home Assistant gives a custom panel no fixed height.
         The toolbar sticks to the top instead, and the full view's drawing below it. */
      :host {
        --sz-inset-top: var(--safe-area-inset-top, 0px);
        --sz-inset-bottom: var(--safe-area-inset-bottom, 0px);
        --sz-inset-left: var(--safe-area-content-inset-left, var(--safe-area-inset-left, 0px));
        --sz-inset-right: var(--safe-area-content-inset-right, var(--safe-area-inset-right, 0px));
        --sz-toolbar-height: calc(var(--header-height, 56px) + var(--sz-inset-top));
        display: flex;
        flex-direction: column;
        min-height: 100%;
        background: var(--sz-page-bg);
        color: var(--sz-text);
        -webkit-font-smoothing: antialiased;
      }
      :host([framed]) {
        margin: calc(-1 * var(--sz-inset-top)) calc(-1 * var(--sz-inset-right)) calc(-1 * var(--sz-inset-bottom))
          calc(-1 * var(--sz-inset-left));
      }
      .toolbar {
        position: sticky;
        top: 0;
        z-index: 2;
        display: flex;
        flex: none;
        align-items: center;
        box-sizing: border-box;
        height: var(--sz-toolbar-height);
        padding: var(--sz-inset-top) calc(12px + var(--sz-inset-right)) 0 calc(12px + var(--sz-inset-left));
        background: var(--app-header-background-color, var(--sz-page-bg));
        color: var(--app-header-text-color, var(--sz-text));
        border-bottom: var(--app-header-border-bottom, none);
      }
      .title {
        flex: 1;
        min-width: 0;
        margin: 0 0 0 12px;
        overflow: hidden;
        font-size: 20px;
        font-weight: 400;
        line-height: 1.4;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .with-button .title {
        margin-inline-start: 24px;
      }
      .icon-button {
        display: grid;
        flex: none;
        place-items: center;
        width: 48px;
        height: 48px;
        padding: 0;
        border: none;
        border-radius: 50%;
        background: none;
        color: inherit;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }
      .icon-button:hover {
        background: var(--sz-control-bg);
      }
      .icon-button:focus-visible {
        outline: 2px solid var(--sz-accent);
        outline-offset: -2px;
      }
      .icon-button svg {
        width: 24px;
        height: 24px;
        fill: currentColor;
      }
      .content {
        flex: 1;
        box-sizing: border-box;
        padding: 16px calc(16px + var(--sz-inset-right)) calc(16px + var(--sz-inset-bottom))
          calc(16px + var(--sz-inset-left));
      }
      :host([narrow]) .content {
        padding: 12px calc(12px + var(--sz-inset-right)) calc(12px + var(--sz-inset-bottom))
          calc(12px + var(--sz-inset-left));
      }
      .state {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 420px;
        margin: 12vh auto 0;
        text-align: center;
        color: var(--sz-muted);
      }
      /* As the overview's empty state draws its icon. */
      .state-icon {
        width: 56px;
        height: 56px;
        margin-bottom: 16px;
        fill: var(--sz-muted);
        opacity: 0.6;
      }
      .state h2 {
        margin: 0 0 4px;
        font-size: 20px;
        font-weight: 500;
        color: var(--sz-text);
      }
      .state p {
        margin: 8px 0 20px;
        line-height: 1.5;
      }
      .spinner {
        width: 36px;
        height: 36px;
        box-sizing: border-box;
        border: 3px solid var(--sz-control-bg);
        border-top-color: var(--sz-accent);
        border-radius: 50%;
        animation: spin 0.9s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .spinner {
          animation: none;
        }
      }
    `,
  ];
}

if (!customElements.get("subzero-panel")) customElements.define("subzero-panel", SubZeroPanel);

declare global {
  interface HTMLElementTagNameMap {
    "subzero-panel": SubZeroPanel;
  }
}

export type { SubZeroPanel };
