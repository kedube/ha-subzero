import { html, nothing } from "lit";
import { Confirmation } from "../card/confirm";
import { partStyles } from "../card/parts";
import type { Control } from "../families/types";
import { ControlElement, defineOnce } from "./base";

type Action = Extract<Control, { kind: "action" }>;

/**
 * A button. One with a question asks it first in the GE card's inline confirmation bar (the
 * question, Not now, and the action); the others act at once.
 */
export class SzAction extends ControlElement<Action> {
  static override styles = [...ControlElement.styles, partStyles];

  private readonly confirmation = new Confirmation(this, ".row .sz-button");

  private press(): void {
    if (this.disabled || this.pending) return;
    if (this.control?.confirm) void this.confirmation.ask();
    else this.emit(undefined);
  }

  override render() {
    const control = this.control;
    if (!control) return nothing;
    const tone = control.tone === "danger" ? "danger" : control.tone === "primary" ? "primary" : "";
    const asking = this.confirmation.asking && control.confirm !== null;
    // Locked, or while the call is in flight, the button is only marked unavailable: it stays
    // focusable, so its reason is read out and focus can come back to it from the bar.
    return html`
      ${this.head(html`<button
        type="button"
        class="sz-button ${asking ? "" : tone}"
        aria-expanded=${control.confirm ? (asking ? "true" : "false") : nothing}
        aria-disabled=${(this.disabled || this.pending) && !asking ? "true" : nothing}
        aria-describedby=${this.describedBy()}
        ?disabled=${asking}
        @click=${() => this.press()}
      >
        ${control.button}
      </button>`)}
      ${control.confirm
        ? this.confirmation.bar(
            {
              text: control.confirm,
              confirm: control.button,
              cancel: this.t("ctl.not_now"),
              tone: control.tone === "danger" ? "danger" : "primary",
              busy: this.pending,
            },
            () => {
              if (!this.disabled) this.emit(undefined);
            },
          )
        : nothing}
      ${this.errorLine()}
    `;
  }
}

defineOnce("sz-action", SzAction);
