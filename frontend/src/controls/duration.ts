import { html, nothing } from "lit";
import type { Control } from "../families/types";
import { ControlElement, defineOnce } from "./base";

type Duration = Extract<Control, { kind: "duration" }>;

/** Minutes: an Off pill when the range starts at zero, the presets, and a custom value. */
export class SzDuration extends ControlElement<Duration> {
  static override properties = { custom: { state: true } };

  declare custom: boolean;
  /**
   * What the custom input starts from, read once as it opens. A running timer's value moves on
   * every minute, and binding it would replace whatever is being typed.
   */
  private draft = "";

  constructor() {
    super();
    this.custom = false;
  }

  private value(): number | null {
    return typeof this.optimistic === "number" ? this.optimistic : (this.control?.value ?? null);
  }

  private choose(minutes: number): void {
    const control = this.control;
    if (!control || this.disabled || !Number.isFinite(minutes)) return;
    const value = Math.min(control.max, Math.max(control.min, Math.round(minutes)));
    this.custom = false;
    // A running timer reads the minutes it has left, so choosing that number is still a change:
    // it sets the timer to it again.
    if (control.remaining || value !== this.value()) this.send(value);
  }

  private toggleCustom(): void {
    if (this.disabled) return;
    this.custom = !this.custom;
    const value = this.value();
    this.draft = value === null || value === 0 ? "" : String(value);
  }

  private readonly onSubmit = (event: Event): void => {
    event.preventDefault();
    const input = this.renderRoot.querySelector<HTMLInputElement>("input[type=number]");
    if (input && input.value !== "" && input.checkValidity()) this.choose(Number(input.value));
    else input?.reportValidity();
  };

  private minutes(value: number): string {
    return value === 0 ? this.t("ctl.off") : this.t("unit.minutes", { n: value });
  }

  override render() {
    const control = this.control;
    if (!control) return nothing;
    const value = this.value();
    const presets = [...new Set([...(control.min === 0 ? [0] : []), ...control.presets])].filter(
      (minutes) => minutes >= control.min && minutes <= control.max,
    );
    const custom = value !== null && !presets.includes(value);
    const disabled = this.disabled;
    const describedBy = this.describedBy();
    return this.frame(
      html`<div class="chips" role="group" aria-labelledby="label">
          ${presets.map(
            (minutes) => html`<button
              type="button"
              class="sz-button"
              aria-pressed=${minutes === value ? "true" : "false"}
              aria-disabled=${this.locked}
              aria-describedby=${describedBy}
              @click=${() => this.choose(minutes)}
            >
              ${this.minutes(minutes)}
            </button>`,
          )}
          <button
            type="button"
            class="sz-button"
            aria-pressed=${custom ? "true" : "false"}
            aria-expanded=${this.custom && !disabled ? "true" : "false"}
            aria-disabled=${this.locked}
            aria-describedby=${describedBy}
            @click=${() => this.toggleCustom()}
          >
            ${this.t("ctl.custom")}
          </button>
        </div>
        ${this.custom && !disabled
          ? html`<form class="chips" @submit=${this.onSubmit}>
              <input
                type="number"
                inputmode="numeric"
                min=${control.min}
                max=${control.max}
                step="1"
                required
                .value=${this.draft}
                aria-label=${this.t("ctl.minutes")}
              />
              <button type="submit" class="sz-button primary">${this.t("ctl.set")}</button>
            </form>`
          : nothing}`,
      { stacked: true, aside: value === null ? null : this.minutes(value) },
    );
  }
}

defineOnce("sz-duration", SzDuration);
