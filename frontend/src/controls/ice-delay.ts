import { css, html, nothing } from "lit";
import type { Control } from "../families/types";
import { ControlElement, defineOnce, icon, icons } from "./base";

type IceDelay = Extract<Control, { kind: "ice_delay" }>;

/** What subzero.schedule_ice_delay takes besides the device. */
export interface IceDelayValue {
  /** Hours, 1–12. */
  duration: number;
  /** Minutes from now, 0–1439. */
  start_in: number;
  repeat: boolean;
}

const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;

/** What the clock in `timeZone` reads at the moment `at` (ms), as the UTC moment that reads the same. */
function clockIn(timeZone: string, at: number): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(at);
  const part = (type: string) => Number(parts.find((candidate) => candidate.type === type)?.value ?? 0);
  return Date.UTC(part("year"), part("month") - 1, part("day"), part("hour"), part("minute"), part("second"));
}

/** The moment the clock in `timeZone` reads `clock` (as clockIn gives it), found from a moment near it. */
function momentOf(timeZone: string, clock: number, near: number): number {
  const offsetAt = (at: number) => clockIn(timeZone, at) - Math.floor(at / 1000) * 1000;
  // The zone's offset nearby gives a first answer; the offset at that answer settles it when the
  // clocks change in between.
  const first = clock - offsetAt(near);
  return clock - offsetAt(first);
}

/** The next moment (ms) after `now` that the clock in `timeZone` reads `hours`:`minutes`. */
function nextInZone(timeZone: string, hours: number, minutes: number, now: number): number {
  const clock = clockIn(timeZone, now);
  const today = clock - (clock % DAY_MS) + (hours * 60 + minutes) * MINUTE_MS;
  const moment = momentOf(timeZone, today, now);
  return moment > now ? moment : momentOf(timeZone, today + DAY_MS, moment + DAY_MS);
}

/** The same on the browser's own clock, whose dates know its zone's clock changes. */
function nextLocal(hours: number, minutes: number, now: number): number {
  const moment = new Date(now);
  moment.setHours(hours, minutes, 0, 0);
  if (moment.getTime() <= now) moment.setDate(moment.getDate() + 1);
  return moment.getTime();
}

/**
 * Minutes from `now` until the next `time` ("HH:MM") on the clock the user reads times on: the
 * server's zone when their profile asks for it, else the browser's. Real minutes, so across a
 * clock change the delay still starts when that clock reads the time. A time that's already
 * passed today means tomorrow, which the action still takes (up to 1439 minutes).
 */
export function minutesUntil(time: string, now: Date, timeZone?: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  let moment: number | undefined;
  if (timeZone) {
    try {
      moment = nextInZone(timeZone, hours, minutes, now.getTime());
    } catch {
      // An unknown zone: the browser's clock is the better guess than none.
    }
  }
  moment ??= nextLocal(hours, minutes, now.getTime());
  return Math.min(1439, Math.max(1, Math.ceil((moment - now.getTime()) / MINUTE_MS)));
}

/** The ice delay form: how many hours, starting now or later today, once or daily. */
export class SzIceDelay extends ControlElement<IceDelay> {
  static override properties = {
    timeZone: { attribute: false },
    hours: { state: true },
    later: { state: true },
    time: { state: true },
    repeat: { state: true },
  };
  static override styles = [
    ...ControlElement.styles,
    css`
      .form {
        display: grid;
        gap: 10px;
        margin-top: 4px;
      }
      .field {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px 16px;
      }
      .field > span:first-child {
        color: var(--sz-muted, #6b7178);
      }
      .when {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
      }
      .actions .hint {
        flex: 1;
      }
    `,
  ];

  /** The zone the typed time is in, as the panel shows times; the browser's when unset. */
  declare timeZone: string | undefined;
  declare hours: number;
  declare later: boolean;
  declare time: string;
  declare repeat: boolean;

  constructor() {
    super();
    this.hours = 8;
    this.later = false;
    this.time = "22:00";
    this.repeat = false;
  }

  protected override current(): unknown {
    return undefined;
  }

  private submit(): void {
    if (this.disabled || this.pending) return;
    const start = this.later ? minutesUntil(this.time, new Date(), this.timeZone) : 0;
    if (start === null) return;
    this.emit({ duration: this.hours, start_in: start, repeat: this.repeat } satisfies IceDelayValue);
  }

  override render() {
    const control = this.control;
    if (!control) return nothing;
    const disabled = this.disabled || this.pending;
    const start = this.later ? minutesUntil(this.time, new Date(), this.timeZone) : 0;
    const startsIn =
      start === null || start === 0
        ? null
        : this.t("ctl.starts_in", {
            time: start >= 60 ? this.t("unit.hours_minutes", { h: Math.floor(start / 60), m: start % 60 }) : this.t("unit.minutes", { n: start }),
          });
    return html`
      ${this.head(nothing)}
      <div class="form" role="group" aria-labelledby="label">
        <div class="field">
          <span id="hours-label">${this.t("ctl.duration")}</span>
          <div class="stepper" role="group" aria-labelledby="hours-label">
            <button type="button" aria-label=${this.t("ctl.decrease")} ?disabled=${disabled || this.hours <= 1} @click=${() => (this.hours -= 1)}>
              ${icon(icons.minus)}
            </button>
            <output aria-live="polite">${this.t("unit.hours", { n: this.hours })}</output>
            <button type="button" aria-label=${this.t("ctl.increase")} ?disabled=${disabled || this.hours >= 12} @click=${() => (this.hours += 1)}>
              ${icon(icons.plus)}
            </button>
          </div>
        </div>
        <div class="field">
          <span id="start-label">${this.t("ctl.start")}</span>
          <div class="when">
            <div class="segmented ${disabled ? "disabled" : ""}" role="group" aria-labelledby="start-label">
              <button type="button" aria-pressed=${this.later ? "false" : "true"} ?disabled=${disabled} @click=${() => (this.later = false)}>
                ${this.t("ctl.now")}
              </button>
              <button type="button" aria-pressed=${this.later ? "true" : "false"} ?disabled=${disabled} @click=${() => (this.later = true)}>
                ${this.t("ctl.later")}
              </button>
            </div>
            ${this.later
              ? html`<input
                  type="time"
                  aria-label=${this.t("ctl.at")}
                  .value=${this.time}
                  ?disabled=${disabled}
                  @change=${(event: Event) => (this.time = (event.target as HTMLInputElement).value || this.time)}
                />`
              : nothing}
          </div>
        </div>
        <div class="field">
          <span id="repeat-label">${this.t("ctl.repeat")}</span>
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${this.repeat ? "true" : "false"}
            aria-labelledby="repeat-label"
            ?disabled=${disabled}
            @click=${() => (this.repeat = !this.repeat)}
          ></button>
        </div>
        <div class="actions">
          ${startsIn ? html`<span class="hint">${startsIn}</span>` : nothing}
          <button type="button" class="sz-button primary" ?disabled=${disabled} @click=${() => this.submit()}>
            ${this.t("ctl.schedule")}
          </button>
        </div>
      </div>
      ${this.errorLine()}
    `;
  }
}

defineOnce("sz-ice-delay", SzIceDelay);
