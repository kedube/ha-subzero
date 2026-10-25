import { LitElement, css, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { DrawingSize } from "../card/drawing-size";
import { partStyles, renderConfirmBar } from "../card/parts";
import { attempt, drawingInput, safeDrawing } from "../card/view";
import { icon, icons } from "../controls/base";
import {
  appearanceChanges,
  formChoices,
  isHexColor,
  panelColorName,
  previewSpec,
  sameAppearance,
} from "../data/appearance";
import { panelHelpers } from "../data/helpers";
import { errorMessage, translatorFor } from "../data/locale";
import type { DrawingState } from "../drawings/types";
import { familyModel, makeContext } from "../families/index";
import type { HomeAssistant } from "../hass";
import type { Translate } from "../i18n";
import { buttonStyles, syncTheme, tokens } from "../styles";
import type { Appearance, Finish, PanelAppliance } from "../types";

let editors = 0;

const ARROW_STEPS: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

interface Choice<T extends string> {
  value: T;
  label: string;
  /** A swatch's fill, for color choices. */
  swatch?: string;
}

/**
 * How an appliance is drawn: finish, panel color, knobs, handle, style and form, with a live
 * preview. The integration stores it per appliance for every user, and only admins may change
 * it. The full view embeds it in its Appearance section, for admins.
 */
export class AppearanceEditor extends LitElement {
  static override properties = {
    hass: { attribute: false },
    appliance: { attribute: false },
    pending: { state: true },
    saving: { state: true },
    message: { state: true },
    askingReset: { state: true },
  };

  declare hass: HomeAssistant | undefined;
  declare appliance: PanelAppliance | undefined;
  declare pending: Appearance | undefined;
  declare saving: boolean;
  declare message: { kind: "error" | "saved"; text: string } | null;
  /** Reset changes the look for everyone, so it asks first. */
  declare askingReset: boolean;

  // The saved Appearance that `pending` started from; changes are measured against it.
  private saved: Appearance | undefined;
  private readonly uid = `sza${++editors}`;
  private readonly size = new DrawingSize(this, ".preview .drawing > svg");

  constructor() {
    super();
    this.saving = false;
    this.message = null;
    this.askingReset = false;
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    syncTheme(this, this.hass);
    const appliance = this.appliance;
    if (!changed.has("appliance") || !appliance) return;
    const other = changed.get("appliance")?.appliance_id !== appliance.appliance_id;
    // A save, or another admin's, arrives as a new appliance. Unsaved edits survive it.
    if (other || !this.pending || !this.saved || sameAppearance(this.pending, this.saved)) {
      this.pending = { ...appliance.appearance };
      if (other) this.message = null;
    }
    this.saved = appliance.appearance;
  }

  protected override render() {
    const { hass, appliance, pending } = this;
    if (!hass || !appliance || !pending) return nothing;
    const t = translatorFor(hass);
    const admin = hass.user?.is_admin === true;
    const options = appliance.appearance_options;
    const finishes = options.finish ?? [];
    const changes = this.saved ? appearanceChanges(this.saved, pending, options) : {};
    const dirty = Object.keys(changes).length > 0;
    const locked = !admin || this.saving;
    return html`
      <div class="layout">
        <div class="preview stage" aria-label=${t("appearance.preview")} role="img">
          <div class="drawing">${this.renderPreview(appliance, pending)}</div>
        </div>
        <div class="fields">
          <p class="note">${t(admin ? "appearance.hint" : "appearance.admin_only")}</p>
          ${finishes.length > 1
            ? this.radios(
                "finish",
                t("appearance.finish"),
                finishes.map((value) => ({ value, label: t(`finish.${value}`) })),
                pending.finish,
                (value) => this.setFinish(value, options.panel_colors),
                locked,
              )
            : nothing}
          ${pending.finish === "panel" ? this.panelColors(t, options.panel_colors ?? [], locked) : nothing}
          ${options.knobs
            ? this.radios(
                "knobs",
                t("appearance.knobs"),
                options.knobs.map((value) => ({
                  value,
                  label: t(`knobs.${value}`),
                  swatch: `var(--sz-knob-${value})`,
                })),
                pending.knobs,
                (knobs) => this.edit({ knobs }),
                locked,
                "swatches",
              )
            : nothing}
          ${options.handle
            ? this.radios(
                "handle",
                t("appearance.handle"),
                options.handle.map((value) => ({ value, label: t(`handle.${value}`) })),
                pending.handle,
                (handle) => this.edit({ handle }),
                locked,
              )
            : nothing}
          ${options.style
            ? this.radios(
                "style",
                t("appearance.style"),
                options.style.map((value) => ({ value, label: t(`style.${value}`) })),
                pending.style ?? this.modelStyle() ?? options.style[0] ?? null,
                (style) => this.edit({ style }),
                locked,
              )
            : nothing}
          ${this.formSelect(t, appliance, pending, locked)}
          <div class="actions">
            <button
              type="button"
              class="sz-button reset"
              aria-expanded=${this.askingReset ? "true" : "false"}
              ?disabled=${locked || this.askingReset}
              @click=${() => this.askReset()}
            >
              ${t("appearance.reset")}
            </button>
            <button
              type="button"
              class="sz-button primary"
              ?disabled=${locked || !dirty}
              @click=${() => this.save(changes)}
            >
              ${this.saving ? t("appearance.saving") : t("appearance.save")}
            </button>
          </div>
          ${this.askingReset && admin
            ? html`<div class="ask" @keydown=${this.onAskKey}>
                ${renderConfirmBar({
                  text: t("appearance.reset_confirm"),
                  confirm: t("appearance.reset_action"),
                  cancel: t("ctl.not_now"),
                  onConfirm: () => this.answerReset(true),
                  onCancel: () => this.answerReset(false),
                })}
              </div>`
            : nothing}
          ${this.message
            ? html`<p
                class="message ${this.message.kind}"
                role=${this.message.kind === "error" ? "alert" : "status"}
              >
                ${this.message.text}
              </p>`
            : nothing}
        </div>
      </div>
    `;
  }

  private renderPreview(appliance: PanelAppliance, pending: Appearance) {
    // The appliance as it is now, in the pending look, with its doors shut so the look shows.
    const hass = this.hass!;
    const live = attempt(
      `${appliance.spec.family} preview state`,
      () =>
        familyModel(appliance).drawingState(
          makeContext(appliance, hass, translatorFor(hass), Date.now(), panelHelpers),
        ),
      null as DrawingState | null,
    );
    const state: DrawingState = { ...(live ?? { readouts: {} }), available: true, doors: {} };
    const preview = { ...appliance, available: true };
    return safeDrawing(
      drawingInput(preview, state, hass, this.uid, {
        appearance: pending,
        spec: previewSpec(appliance, pending),
        pixelHeight: this.size.height,
      }),
    );
  }

  /** The style the model number gives (wall ovens, ranges), which a null style keeps. */
  private modelStyle(): string | null {
    const spec = this.appliance?.spec;
    return spec && (spec.family === "wall_oven" || spec.family === "range") ? spec.style : null;
  }

  private radios<T extends string>(
    id: string,
    label: string,
    choices: Array<Choice<T>>,
    value: string | null,
    select: (value: T) => void,
    disabled: boolean,
    kind: "segmented" | "swatches" = "segmented",
  ): TemplateResult {
    const labelId = `${this.uid}-${id}`;
    const current = choices.some((choice) => choice.value === value) ? value : choices[0]?.value;
    return html`<div class="field">
      <span class="label" id=${labelId}>${label}</span>
      <div class=${kind} role="radiogroup" aria-labelledby=${labelId} @keydown=${this.onRadioKey}>
        ${choices.map(
          (choice) => html`<button
            type="button"
            role="radio"
            class=${choice.swatch ? "swatch" : "segment"}
            aria-checked=${choice.value === value ? "true" : "false"}
            aria-label=${choice.swatch ? choice.label : nothing}
            title=${choice.swatch ? choice.label : nothing}
            tabindex=${choice.value === current ? 0 : -1}
            style=${choice.swatch ? `--swatch: ${choice.swatch}` : nothing}
            ?disabled=${disabled}
            @click=${() => select(choice.value)}
          >
            ${choice.swatch ? nothing : choice.label}
          </button>`,
        )}
      </div>
    </div>`;
  }

  private panelColors(t: Translate, colors: string[], disabled: boolean): TemplateResult {
    const value = this.pending?.panel_color ?? null;
    const custom = value !== null && !colors.some((color) => color.toLowerCase() === value.toLowerCase());
    const labelId = `${this.uid}-panel`;
    const choices = colors.filter(isHexColor);
    const current = custom || !value ? null : value.toLowerCase();
    // The colors by name, so a screen reader says "Sage", not a hex code; any other color by its code.
    const nameOf = (color: string) => {
      const named = panelColorName(color);
      return named ? t(`panel_color.${named}`) : t("appearance.panel_color_value", { color: color.toUpperCase() });
    };
    const chosen = current ? nameOf(current) : custom ? t("appearance.custom_color") : null;
    return html`<div class="field">
      <span class="field-head">
        <span class="label" id=${labelId}>${t("appearance.panel_color")}</span>
        ${chosen ? html`<span class="chosen" aria-hidden="true">${chosen}</span>` : nothing}
      </span>
      <div class="swatches" role="radiogroup" aria-labelledby=${labelId} @keydown=${this.onRadioKey}>
        ${choices.map((color, index) => {
          const checked = color.toLowerCase() === current;
          const name = nameOf(color);
          return html`<button
            type="button"
            role="radio"
            class="swatch"
            aria-checked=${checked ? "true" : "false"}
            aria-label=${name}
            title=${name}
            tabindex=${checked || (current === null && !custom && index === 0) ? 0 : -1}
            style="--swatch: ${color}"
            ?disabled=${disabled}
            @click=${() => this.edit({ panel_color: color })}
          ></button>`;
        })}
        <label
          class="swatch custom ${custom ? "checked" : ""}"
          title=${t("appearance.custom_color")}
          style=${custom ? `--swatch: ${value}` : nothing}
        >
          <input
            type="color"
            aria-label=${t("appearance.custom_color")}
            .value=${isHexColor(value) ? value : "#d9d4c7"}
            ?disabled=${disabled}
            @input=${(event: Event) => {
              const color = (event.target as HTMLInputElement).value;
              if (isHexColor(color)) this.edit({ panel_color: color.toLowerCase() });
            }}
          />
        </label>
      </div>
    </div>`;
  }

  private formSelect(t: Translate, appliance: PanelAppliance, pending: Appearance, disabled: boolean) {
    const forms = formChoices(appliance);
    if (forms.length < 2) return nothing;
    const selected = pending.form ?? appliance.detected_form;
    const id = `${this.uid}-form`;
    return html`<div class="field">
      <label class="label" for=${id}>${t("appearance.form")}</label>
      <span class="dropdown">
        <select
          id=${id}
          ?disabled=${disabled}
          @change=${(event: Event) => {
            const value = (event.target as HTMLSelectElement).value;
            // Choosing the detected form clears the override, so better detection later applies.
            this.edit({ form: value === appliance.detected_form ? null : value });
          }}
        >
          ${forms.map((form) => {
            const name = t(`form.${form}`);
            // The property, not the attribute: a select the user has touched ignores attributes.
            return html`<option value=${form} .selected=${form === selected}>
              ${form === appliance.detected_form ? t("appearance.detected", { form: name }) : name}
            </option>`;
          })}
        </select>
        ${icon(icons.chevron)}
      </span>
    </div>`;
  }

  private setFinish(finish: Finish, colors: string[] | undefined): void {
    const current = this.pending?.panel_color ?? null;
    const panelColor = finish === "panel" ? current ?? colors?.find(isHexColor) ?? null : null;
    this.edit({ finish, panel_color: panelColor });
  }

  private edit(change: Partial<Appearance>): void {
    if (!this.pending) return;
    this.pending = { ...this.pending, ...change };
    this.message = null;
  }

  private async askReset(): Promise<void> {
    this.askingReset = true;
    this.message = null;
    await this.updateComplete;
    // The safe choice first, so Enter or Space doesn't reset anything by accident.
    this.renderRoot.querySelector<HTMLButtonElement>(".ask .sz-button")?.focus();
  }

  private answerReset(reset: boolean): void {
    this.askingReset = false;
    if (reset) void this.save(null);
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLButtonElement>(".actions .reset")?.focus());
  }

  private readonly onAskKey = (event: KeyboardEvent): void => {
    if (event.key !== "Escape") return;
    event.stopPropagation();
    this.answerReset(false);
  };

  private async save(changes: Partial<Appearance> | null): Promise<void> {
    const { hass, appliance } = this;
    if (!hass || !appliance || this.saving) return;
    const t = translatorFor(hass);
    this.saving = true;
    this.message = null;
    try {
      const reply = await hass.callWS<{ appearance?: Appearance } | null>({
        type: "subzero/panel/set_appearance",
        appliance_id: appliance.appliance_id,
        appearance: changes,
      });
      // The subscription brings the saved Appearance too; the reply just gets here first.
      if (reply?.appearance) {
        this.saved = reply.appearance;
        this.pending = { ...reply.appearance };
      }
      this.message = { kind: "saved", text: t("appearance.saved") };
    } catch (error) {
      this.message = { kind: "error", text: t("appearance.error", { message: errorMessage(error) }) };
    } finally {
      this.saving = false;
    }
  }

  private readonly onRadioKey = (event: KeyboardEvent): void => {
    const step = ARROW_STEPS[event.key];
    if (!step) return;
    const group = event.currentTarget as HTMLElement;
    const radios = [...group.querySelectorAll<HTMLElement>('[role="radio"]:not(:disabled)')];
    const index = radios.indexOf(event.target as HTMLElement);
    if (index < 0 || radios.length < 2) return;
    event.preventDefault();
    const next = radios[(index + step + radios.length) % radios.length];
    next.focus();
    next.click();
  };

  static override styles = [
    tokens,
    buttonStyles,
    partStyles,
    css`
      :host {
        display: block;
        color: var(--sz-text);
        container-type: inline-size;
        /* The knob swatches, lit from the upper left like the drawings. */
        --sz-knob-red: radial-gradient(circle at 35% 30%, #e2564c 0%, #b01c1c 45%, #6f0d10 100%);
        --sz-knob-black: radial-gradient(circle at 35% 30%, #6b6d70 0%, #232425 48%, #0b0b0c 100%);
        --sz-knob-stainless: radial-gradient(
          circle at 35% 30%,
          #ffffff 0%,
          #d3d7db 35%,
          #9ba1a7 75%,
          #c9cdd1 100%
        );
      }
      .layout {
        display: grid;
        gap: 20px;
      }
      @container (min-width: 560px) {
        .layout {
          grid-template-columns: minmax(180px, 2fr) 3fr;
          align-items: start;
        }
      }
      .preview {
        height: 260px;
        padding: 12px;
        border-radius: 12px;
        background: var(--sz-inset-bg);
        box-shadow: inset 0 0 0 1px var(--sz-inset-edge);
      }
      .fields {
        display: grid;
        gap: 16px;
        min-width: 0;
      }
      .note {
        margin: 0;
        font-size: 14px;
        line-height: 1.45;
        color: var(--sz-muted);
      }
      .field {
        display: grid;
        gap: 8px;
      }
      /* Labels, chips and the dropdown look like the full view's controls above. */
      .label {
        font-size: 14px;
        font-weight: 500;
        color: var(--sz-text);
      }
      .field-head {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        gap: 4px 8px;
      }
      .chosen {
        font-size: 13.5px;
        color: var(--sz-muted);
      }
      .segmented {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        max-width: 100%;
      }
      .segment {
        min-height: 40px;
        padding: 6px 14px;
        border: none;
        border-radius: 999px;
        background: var(--sz-control-bg);
        color: var(--sz-text);
        font: inherit;
        font-size: 13.5px;
        font-weight: 600;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }
      .segment:hover:not(:disabled):not([aria-checked="true"]) {
        background: var(--sz-control-hover);
      }
      .segment[aria-checked="true"] {
        background: var(--sz-accent-fill, var(--sz-accent));
        color: var(--sz-on-accent);
      }
      .swatches {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .swatch {
        position: relative;
        width: 40px;
        height: 40px;
        padding: 0;
        border: none;
        border-radius: 50%;
        background: var(--swatch, transparent);
        box-shadow:
          inset 0 0 0 1px rgba(0, 0, 0, 0.18),
          0 1px 2px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }
      .swatch[aria-checked="true"],
      .swatch.checked {
        box-shadow:
          inset 0 0 0 1px rgba(0, 0, 0, 0.18),
          0 0 0 2px var(--sz-card-bg),
          0 0 0 4px var(--sz-accent);
      }
      /* A light edge on a dark card, or the black panel color disappears into it. */
      :host([dark]) .swatch {
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.22),
          0 1px 2px rgba(0, 0, 0, 0.4);
      }
      :host([dark]) .swatch[aria-checked="true"],
      :host([dark]) .swatch.checked {
        box-shadow:
          inset 0 0 0 1px rgba(255, 255, 255, 0.22),
          0 0 0 2px var(--sz-card-bg),
          0 0 0 4px var(--sz-accent);
      }
      .swatch.custom {
        display: grid;
        place-items: center;
        background: var(
          --swatch,
          conic-gradient(#e85d5d, #e8c35d, #8fd16a, #5dc3e8, #8a6de8, #e85dc3, #e85d5d)
        );
        overflow: hidden;
      }
      .swatch.custom input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
      }
      .swatch.custom:focus-within,
      .swatch:focus-visible,
      select:focus-visible {
        outline: 2px solid var(--sz-accent);
        outline-offset: 2px;
      }
      .segment:focus-visible {
        outline: 2px solid var(--sz-accent);
        outline-offset: 2px;
      }
      button:disabled,
      select:disabled {
        opacity: 0.5;
        cursor: default;
      }
      /* Its own rule: a browser without :has() would drop the whole list above. */
      .swatch.custom:has(input:disabled) {
        opacity: 0.5;
        cursor: default;
      }
      .dropdown {
        position: relative;
        display: inline-flex;
        width: fit-content;
        max-width: 100%;
      }
      select {
        max-width: 100%;
        min-height: 40px;
        padding: 7px 36px 7px 14px;
        border: none;
        border-radius: 999px;
        background: var(--sz-control-bg);
        color: var(--sz-text);
        font: inherit;
        font-size: 14px;
        font-weight: 600;
        text-overflow: ellipsis;
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
      }
      :host([dark]) select {
        color-scheme: dark;
      }
      .dropdown svg {
        position: absolute;
        top: 50%;
        right: 12px;
        width: 18px;
        height: 18px;
        margin-top: -9px;
        fill: currentColor;
        pointer-events: none;
      }
      /* Any finger, not just a main one: touch laptops report a mouse as their main pointer. */
      @media (any-pointer: coarse) {
        .segment,
        select {
          min-height: 44px;
        }
        .swatch {
          width: 44px;
          height: 44px;
        }
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 8px;
        margin-top: 4px;
      }
      .message {
        margin: 0;
        font-size: 13.5px;
      }
      .message.error {
        color: var(--sz-error-text);
      }
      .message.saved {
        color: var(--sz-muted);
      }
    `,
  ];
}

if (!customElements.get("sz-appearance-editor")) {
  customElements.define("sz-appearance-editor", AppearanceEditor);
}

declare global {
  interface HTMLElementTagNameMap {
    "sz-appearance-editor": AppearanceEditor;
  }
}
