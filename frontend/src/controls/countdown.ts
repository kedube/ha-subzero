import { html, nothing, type PropertyValues } from "lit";
import { formatCountdown, parseTime } from "../families/common";
import type { Control } from "../families/types";
import { ControlElement, defineOnce } from "./base";
import { readingStyles } from "./reading";

type Countdown = Extract<Control, { kind: "countdown" }>;

// Just after the second, so the countdown changes with the appliance's own.
const untilNextSecond = () => 1000 - (Date.now() % 1000) + 5;

/**
 * Time left until a moment; 0:00 once it's passed. It counts on the clock it's given, the full
 * view's, so everything on the page changes together; on its own it ticks every second itself.
 */
export class SzCountdown extends ControlElement<Countdown> {
  static override properties = { now: { attribute: false } };
  static override styles = [...ControlElement.styles, readingStyles];

  /** The time in ms, from whoever keeps the page's clock; without it the countdown keeps its own. */
  declare now: number | undefined;
  private timer: ReturnType<typeof setTimeout> | undefined;

  override connectedCallback(): void {
    super.connectedCallback();
    this.keepTime();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.keepTime();
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    if (changed.has("now")) this.keepTime();
  }

  private keepTime(): void {
    const own = this.isConnected && this.now === undefined;
    if (!own) {
      clearTimeout(this.timer);
      this.timer = undefined;
    } else if (this.timer === undefined) {
      this.timer = setTimeout(this.tick, untilNextSecond());
    }
  }

  private readonly tick = (): void => {
    this.requestUpdate();
    this.timer = setTimeout(this.tick, untilNextSecond());
  };

  override render() {
    const control = this.control;
    if (!control) return nothing;
    const end = parseTime(control.end);
    const left = end === null ? "—" : formatCountdown(end - (this.now ?? Date.now()), control.hours === true);
    return this.frame(html`<span class="reading" role="timer" aria-live="off">${left}</span>`);
  }
}

defineOnce("sz-countdown", SzCountdown);
