import { css, html, nothing } from "lit";
import type { LightValue } from "../actions";
import type { Control } from "../families/types";
import { ControlElement, defineOnce } from "./base";

type Light = Extract<Control, { kind: "light" }>;

// The hood's task light doesn't go below 5% (light.py).
const MIN_BRIGHTNESS = 5;

/** A light: on or off, then brightness and white temperature sliders while it's on. */
export class SzLight extends ControlElement<Light> {
  static override properties = { sliding: { state: true } };
  static override styles = [
    ...ControlElement.styles,
    css`
      /* One set of columns for both sliders, so their tracks start and end together. */
      .sliders {
        display: grid;
        grid-template-columns: max-content minmax(0, 1fr) 4.2em;
        gap: 10px 12px;
        margin-top: 8px;
      }
      .sliders .slider {
        grid-column: 1 / -1;
        grid-template-columns: subgrid;
      }
    `,
  ];

  /** A slider's value while it's being dragged, before it's sent. */
  declare sliding: { brightness?: number; kelvin?: number };

  constructor() {
    super();
    this.sliding = {};
  }

  protected override current(): unknown {
    const control = this.control;
    return control ? { on: control.on, brightness: control.brightness, kelvin: control.kelvin } : undefined;
  }

  private state(): { on: boolean; brightness: number | null; kelvin: number | null } {
    const control = this.control;
    const sent = this.optimistic as LightValue | undefined;
    return {
      on: sent?.on ?? control?.on ?? false,
      brightness: sent?.brightness ?? control?.brightness ?? null,
      kelvin: sent?.kelvin ?? control?.kelvin ?? null,
    };
  }

  private change(value: LightValue): void {
    if (this.disabled) return;
    this.sliding = {};
    this.send(value);
  }

  override render() {
    const control = this.control;
    if (!control) return nothing;
    const now = this.state();
    const brightness = this.sliding.brightness ?? now.brightness;
    const kelvin = this.sliding.kelvin ?? now.kelvin;
    const level = brightness === null ? 0 : Math.max(MIN_BRIGHTNESS, brightness);
    // How far along its track the brightness is, which the track fills up to.
    const filled = ((level - MIN_BRIGHTNESS) * 100) / (100 - MIN_BRIGHTNESS);
    return html`
      ${this.head(html`<button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${now.on ? "true" : "false"}
        aria-labelledby="label"
        aria-disabled=${this.locked}
        aria-describedby=${this.describedBy()}
        @click=${() => this.change({ on: !now.on })}
      ></button>`)}
      ${now.on && (brightness !== null || kelvin !== null)
        ? html`<div class="sliders">
            ${brightness !== null
              ? html`<label class="slider">
                  <span>${this.t("ctl.brightness")}</span>
                  <input
                    class="level"
                    type="range"
                    min=${MIN_BRIGHTNESS}
                    max="100"
                    step="1"
                    style="--filled: ${filled}%"
                    .value=${String(level)}
                    ?disabled=${this.disabled}
                    @input=${(event: Event) => (this.sliding = { ...this.sliding, brightness: Number((event.target as HTMLInputElement).value) })}
                    @change=${(event: Event) => this.change({ on: true, brightness: Number((event.target as HTMLInputElement).value) })}
                  />
                  <output>${Math.round(level)}%</output>
                </label>`
              : nothing}
            ${kelvin !== null
              ? html`<label class="slider">
                  <span>${this.t("ctl.white")}</span>
                  <input
                    class="kelvin"
                    type="range"
                    min=${control.min_kelvin}
                    max=${control.max_kelvin}
                    step="50"
                    .value=${String(kelvin)}
                    ?disabled=${this.disabled}
                    @input=${(event: Event) => (this.sliding = { ...this.sliding, kelvin: Number((event.target as HTMLInputElement).value) })}
                    @change=${(event: Event) => this.change({ on: true, kelvin: Number((event.target as HTMLInputElement).value) })}
                  />
                  <output>${Math.round(kelvin)} K</output>
                </label>`
              : nothing}
          </div>`
        : nothing}
      ${this.errorLine()}
    `;
  }
}

defineOnce("sz-light", SzLight);
