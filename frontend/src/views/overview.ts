import { LitElement, css, html, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";
import "../card/appliance-card";
import { groupByArea, type AreaGroup } from "../data/appliances";
import { panelHelpers } from "../data/helpers";
import { translatorFor } from "../data/locale";
import { followLink } from "../data/route";
import type { ContextHelpers } from "../families/index";
import type { HomeAssistant } from "../hass";
import type { Translate } from "../i18n";
import { buttonStyles, syncTheme, tokens } from "../styles";
import type { PanelAppliance } from "../types";

const INTEGRATION_PAGE = "/config/integrations/integration/subzero";
// A refrigerator outline, like the panel's sidebar icon (drawn with fill-rule evenodd).
const FRIDGE =
  "M8,2H16A2,2 0 0 1 18,4V20A2,2 0 0 1 16,22H8A2,2 0 0 1 6,20V4A2,2 0 0 1 8,2Z" +
  "M8,4V9H16V4ZM8,11V20H16V11ZM9,5H10.5V8H9ZM9,12H10.5V16H9Z";

/** Every appliance as a card, in sections by area. */
export class Overview extends LitElement {
  static override properties = {
    hass: { attribute: false },
    appliances: { attribute: false },
    now: { attribute: false },
    helpers: { attribute: false },
  };

  declare hass: HomeAssistant | undefined;
  declare appliances: PanelAppliance[];
  declare now: number;
  declare helpers: ContextHelpers;

  // Grouping sorts on every render, and the clock renders every second; the inputs rarely change.
  private grouped: { key: unknown[]; groups: AreaGroup[] } | undefined;

  constructor() {
    super();
    this.appliances = [];
    this.now = Date.now();
    this.helpers = panelHelpers;
  }

  protected override willUpdate(): void {
    syncTheme(this, this.hass);
  }

  protected override render() {
    const t = translatorFor(this.hass);
    if (!this.appliances.length) return this.renderEmpty(t);
    const groups = this.groups();
    // A heading for a lone "No area" section would only say what's missing.
    const headings = groups.length > 1 || groups[0]?.areaId !== null;
    return groups.map(
      (group) => html`
        <section class="area">
          ${headings ? html`<h2>${group.name ?? t("overview.no_area")}</h2>` : nothing}
          <div class="grid">
            ${repeat(
              group.appliances,
              (entry) => entry.appliance.device_id,
              (entry) => html`<sz-appliance-card
                .hass=${this.hass}
                .appliance=${entry.appliance}
                .now=${this.now}
                .helpers=${this.helpers}
              ></sz-appliance-card>`,
            )}
          </div>
        </section>
      `,
    );
  }

  private groups(): AreaGroup[] {
    const hass = this.hass;
    const key = [this.appliances, hass?.devices, hass?.areas, hass?.language, hass?.locale];
    if (!this.grouped || key.some((part, index) => part !== this.grouped!.key[index])) {
      this.grouped = { key, groups: groupByArea(this.appliances, hass) };
    }
    return this.grouped.groups;
  }

  private renderEmpty(t: Translate) {
    const admin = this.hass?.user?.is_admin === true;
    return html`<div class="empty">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d=${FRIDGE}></path></svg>
      <h2>${t("overview.empty_title")}</h2>
      <p>${t(admin ? "overview.empty_text" : "overview.empty_text_user")}</p>
      ${admin
        ? html`<a class="sz-button primary" href=${INTEGRATION_PAGE} @click=${followLink}>
            ${t("overview.empty_link")}
          </a>`
        : nothing}
    </div>`;
  }

  static override styles = [
    tokens,
    buttonStyles,
    css`
      :host {
        display: block;
        color: var(--sz-text);
      }
      .area + .area {
        margin-top: 28px;
      }
      /* A section title over the cards, not a caption: as strong as the card names under it. */
      h2 {
        margin: 0 4px 10px;
        font-size: 18px;
        font-weight: 500;
        line-height: 1.4;
        color: var(--sz-text);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
        gap: 16px;
        align-items: stretch;
      }
      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 420px;
        margin: 10vh auto 0;
        padding: 0 16px;
        text-align: center;
      }
      .empty svg {
        width: 56px;
        height: 56px;
        fill: var(--sz-muted);
        opacity: 0.6;
      }
      .empty h2 {
        margin: 16px 0 4px;
        font-size: 20px;
        color: var(--sz-text);
      }
      .empty p {
        margin: 0 0 20px;
        color: var(--sz-muted);
        line-height: 1.5;
      }
    `,
  ];
}

if (!customElements.get("sz-overview")) customElements.define("sz-overview", Overview);

declare global {
  interface HTMLElementTagNameMap {
    "sz-overview": Overview;
  }
}
