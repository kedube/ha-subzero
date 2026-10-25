import { html, nothing } from "lit";
import type { Control } from "../families/types";
import { ControlElement, defineOnce } from "./base";

type Fan = Extract<Control, { kind: "fan" }>;

/** Fan speed: Off, then each speed. */
export class SzFan extends ControlElement<Fan> {
  private value(): number {
    return typeof this.optimistic === "number" ? this.optimistic : (this.control?.value ?? 0);
  }

  private pick(speed: number): void {
    if (this.disabled || speed === this.value()) return;
    this.send(speed);
  }

  override render() {
    const control = this.control;
    if (!control) return nothing;
    const value = this.value();
    const speeds = Array.from({ length: Math.max(1, control.speeds) + 1 }, (_, speed) => speed);
    const describedBy = this.describedBy();
    return this.frame(html`<div class="segmented ${this.disabled ? "disabled" : ""}" role="group" aria-labelledby="label">
      ${speeds.map(
        (speed) => html`<button
          type="button"
          aria-pressed=${speed === value ? "true" : "false"}
          aria-label=${speed === 0 ? this.t("ctl.off") : control.speeds === 1 ? this.t("ctl.on") : this.t("ctl.speed", { n: speed })}
          aria-disabled=${this.locked}
          aria-describedby=${describedBy}
          @click=${() => this.pick(speed)}
        >
          ${speed === 0 ? this.t("ctl.off") : control.speeds === 1 ? this.t("ctl.on") : String(speed)}
        </button>`,
      )}
    </div>`);
  }
}

defineOnce("sz-fan", SzFan);
