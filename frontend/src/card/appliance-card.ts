import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { applianceName, relevantChange } from "../data/appliances";
import { panelHelpers } from "../data/helpers";
import { translatorFor } from "../data/locale";
import type { ContextHelpers } from "../families/index";
import type { HomeAssistant } from "../hass";
import { syncTheme, tokens, toneStyles } from "../styles";
import type { PanelAppliance } from "../types";
import { DrawingSize } from "./drawing-size";
import { partStyles, renderDisplay, renderInfoPanel, renderPill } from "./parts";
import { cardView, drawingInput, safeDrawing, type CardView } from "./view";

/** Fired (bubbling, composed) when a card is chosen; the panel opens the appliance's full view. */
export const OPEN_APPLIANCE = "sz-open-appliance";

export interface OpenApplianceDetail {
  deviceId: string;
}

let cards = 0;

/**
 * One appliance on the overview, in the GE appliance card's style: the name and a status pill,
 * the live drawing, the display where the appliance has one, and a few label and value rows.
 * The whole card is a button that opens the full view.
 */
export class ApplianceCard extends LitElement {
  static override properties = {
    hass: { attribute: false },
    appliance: { attribute: false },
    now: { attribute: false },
    helpers: { attribute: false },
  };

  declare hass: HomeAssistant | undefined;
  declare appliance: PanelAppliance | undefined;
  /** The panel's clock, in ms; it ticks every second so countdowns move. */
  declare now: number;
  declare helpers: ContextHelpers;

  // Drawings prefix their SVG ids with it, which the drawing contract asks to be unique.
  private readonly uid = `szc${++cards}`;
  private readonly size = new DrawingSize(this, ".drawing > svg");
  private view: CardView | undefined;
  private name = "";

  constructor() {
    super();
    this.now = Date.now();
    this.helpers = panelHelpers;
    this.addEventListener("click", () => this.open());
    this.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && !event.repeat) {
        event.preventDefault();
        this.open();
      }
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "button");
    if (!this.hasAttribute("tabindex")) this.tabIndex = 0;
  }

  protected override shouldUpdate(changed: PropertyValues<this>): boolean {
    if (!this.hass || !this.appliance) return false;
    if (changed.size === 1 && changed.has("hass")) {
      return relevantChange(changed.get("hass"), this.hass, this.appliance);
    }
    return true;
  }

  protected override willUpdate(): void {
    const { hass, appliance } = this;
    if (!hass || !appliance) return;
    const t = translatorFor(hass);
    syncTheme(this, hass);
    this.toggleAttribute("offline", !appliance.available);
    this.name = applianceName(appliance, hass);
    this.view = cardView(appliance, hass, t, this.now, this.helpers);
    const status = this.view.status.text || t(`family.${appliance.spec.family}`);
    this.setAttribute("aria-label", t("card.label", { name: this.name, status }));
  }

  protected override render() {
    const { hass, appliance, view } = this;
    if (!hass || !appliance || !view) return nothing;
    return html`
      <div class="head">
        <span class="name">${this.name}</span>
        ${renderPill(view.status)}
      </div>
      <div class="stage ${view.display ? "has-display" : ""}">
        ${renderDisplay(view.display, view.dim)}
        <div class="drawing">
          ${safeDrawing(drawingInput(appliance, view.state, hass, this.uid, { pixelHeight: this.size.height }))}
        </div>
      </div>
      ${renderInfoPanel(view.rows.slice(0, 3))}
    `;
  }

  private open(): void {
    if (!this.appliance) return;
    this.dispatchEvent(
      new CustomEvent<OpenApplianceDetail>(OPEN_APPLIANCE, {
        detail: { deviceId: this.appliance.device_id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  static override styles = [
    tokens,
    toneStyles,
    partStyles,
    css`
      :host {
        position: relative;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        min-width: 0;
        padding: 12px 14px 14px;
        border: var(--sz-border-width) solid var(--sz-border);
        border-radius: var(--sz-radius);
        background: var(--sz-card-bg);
        box-shadow: var(--ha-card-box-shadow, none);
        color: var(--sz-text);
        cursor: pointer;
        outline: none;
        container-type: inline-size;
        -webkit-tap-highlight-color: transparent;
        transition:
          box-shadow 0.2s ease,
          border-color 0.2s ease,
          transform 0.2s ease;
      }
      /* Only where there's a pointer to hover with: on touch, the lift would stay after a tap. */
      @media (hover: hover) {
        :host(:hover) {
          border-color: color-mix(in srgb, var(--sz-text) 20%, transparent);
          box-shadow: var(--sz-lift);
        }
      }
      :host(:active) {
        transform: scale(0.98);
      }
      :host(:focus-visible) {
        outline: 2px solid var(--sz-accent);
        outline-offset: 2px;
      }
      @media (prefers-reduced-motion: reduce) {
        :host {
          transition: none;
        }
        :host(:active) {
          transform: none;
        }
      }
      .head {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 28px;
        margin-bottom: 8px;
      }
      .name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        font-size: 17px;
        font-weight: 600;
        line-height: 1.3;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      :host([offline]) .name {
        color: var(--sz-muted);
      }
      /* Every card's stage is the same height and sits right under the title, so the appliances
         in a grid row stand on one floor line; the info panel takes up any slack below. A display
         sits on the appliance's axis above it, where the real ones are, and the drawing in that
         card starts below it so it never covers the appliance. */
      .stage {
        --drawing-height: clamp(240px, 92cqw, 380px);
        height: var(--drawing-height);
        margin: 0 0 12px;
        padding-bottom: 2px;
      }
      /* Phones: about two cards to a screen rather than one. By the screen, not the card: a card
         in a desktop grid is as narrow as one on a phone. Labels keep their size, since the
         drawings size them from the height they're shown at. */
      @media (max-width: 600px) {
        .stage {
          --drawing-height: clamp(220px, 70cqw, 300px);
        }
      }
      .stage.has-display .drawing {
        box-sizing: border-box;
        padding-top: 52px;
      }
      .stage .lcd {
        position: absolute;
        top: 0;
        left: 50%;
        z-index: 1;
        height: 50px;
        transform: translateX(-50%);
      }
      /* Three rows' height whatever it holds, the rows centered, as on the GE card. */
      .info {
        min-height: 75px;
        box-sizing: border-box;
        align-content: center;
        margin: auto 4% 0;
      }
    `,
  ];
}

if (!customElements.get("sz-appliance-card")) customElements.define("sz-appliance-card", ApplianceCard);

declare global {
  interface HTMLElementTagNameMap {
    "sz-appliance-card": ApplianceCard;
  }
}
