import { html, nothing, type PropertyValues } from "lit";
import { Confirmation } from "../card/confirm";
import { partStyles } from "../card/parts";
import type { Control } from "../families/types";
import { ControlElement, defineOnce } from "./base";

type Toggle = Extract<Control, { kind: "toggle" }>;

/**
 * An on/off switch. One with a question for turning off (an oven that's cooking) asks it first
 * in the inline confirmation bar, as a button with a question does.
 */
export class SzToggle extends ControlElement<Toggle> {
  static override styles = [...ControlElement.styles, partStyles];

  private readonly confirmation = new Confirmation(this, ".switch");

  private value(): boolean | null {
    return typeof this.optimistic === "boolean" ? this.optimistic : (this.control?.value ?? null);
  }

  private flip(): void {
    if (this.disabled) return;
    const on = !this.value();
    if (!on && this.control?.confirmOff) void this.confirmation.ask();
    else this.send(on);
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    super.willUpdate(changed);
    // The question is about a switch that's on. Once it's off or locked (the oven was turned off
    // at the appliance, say), there's nothing left to ask.
    if (this.confirmation.asking && !(this.control?.confirmOff && this.value() === true && !this.disabled)) this.confirmation.drop();
  }

  override render() {
    const control = this.control;
    if (!control) return nothing;
    const value = this.value();
    // A locked or unavailable entity has no state to show, so it reads as unknown, never as off.
    if (value === null && this.disabled) return this.frame(html`<span class="reading">—</span>`);
    const question = control.confirmOff;
    const asking = this.confirmation.asking && question !== undefined;
    return html`
      ${this.head(html`<button
        type="button"
        class="switch ${value === null ? "unknown" : ""}"
        role="switch"
        aria-checked=${value === true ? "true" : "false"}
        aria-labelledby="label"
        aria-disabled=${this.locked}
        aria-describedby=${this.describedBy()}
        ?disabled=${asking}
        @click=${() => this.flip()}
      ></button>`)}
      ${asking
        ? this.confirmation.bar({ text: question.text, confirm: question.button, cancel: this.t("ctl.not_now"), tone: "danger", busy: this.pending }, () =>
            this.send(false),
          )
        : nothing}
      ${this.errorLine()}
    `;
  }
}

defineOnce("sz-toggle", SzToggle);
