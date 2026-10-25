import { html, nothing } from "lit";
import { formatCountdown, parseTime } from "../families/common";
import type { Control } from "../families/types";
import { ControlElement, defineOnce } from "./base";
import { readingStyles } from "./reading";

type Countdown = Extract<Control, { kind: "countdown" }>;

/** Time left until a moment, ticking every second; 0:00 once it's passed. */
export class SzCountdown extends ControlElement<Countdown> {
  static override styles = [...ControlElement.styles, readingStyles];

  private timer: ReturnType<typeof setTimeout> | undefined;

  override connectedCallback(): void {
    super.connectedCallback();
    this.tick();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this.timer);
    this.timer = undefined;
  }

  // On the second, so the countdown changes with the panel's clock and the appliance's own.
  private readonly tick = (): void => {
    this.requestUpdate();
    this.timer = setTimeout(this.tick, 1000 - (Date.now() % 1000) + 5);
  };

  override render() {
    const control = this.control;
    if (!control) return nothing;
    const end = parseTime(control.end);
    return this.frame(
      html`<span class="reading" role="timer" aria-live="off">${end === null ? "—" : formatCountdown(end - Date.now())}</span>`,
    );
  }
}

defineOnce("sz-countdown", SzCountdown);
