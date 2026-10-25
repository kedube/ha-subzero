/**
 * The full view's controls, in the GE card's style. Each shows one Control from a family model
 * and fires `sz-value` with the value to apply; the view applies it and sets `pending` and
 * `error` around the call.
 */
import { html, type TemplateResult } from "lit";
import type { Control } from "../families/types";
import type { Translate } from "../i18n";
import type { ValueDetail } from "./base";
import type { NumberFormatter } from "./setpoint";
import "./action";
import "./countdown";
import "./duration";
import "./fan";
import "./ice-delay";
import "./light";
import "./reading";
import "./select";
import "./setpoint";
import "./toggle";

export { VALUE_EVENT, type ValueDetail } from "./base";

export interface ControlBinding {
  t: Translate;
  pending: boolean;
  error: string | null;
  onValue: (event: CustomEvent<ValueDetail>) => void;
  /** Hides the label when the widget goes under it, for a lone control named like its section. */
  quiet?: boolean;
  /** The zone the user reads times in (see timeZone in families/common.ts); the browser's if unset. */
  timeZone?: string;
  /** Numbers in the user's format, for the setpoint's decimals; plain digits if unset. */
  formatNumber?: NumberFormatter;
  /** The section shows the control's lock reason once for several controls (see ControlElement). */
  sharedReason?: boolean;
}

/** The element for a control's kind. */
export function renderControl(control: Control, binding: ControlBinding): TemplateResult {
  const { t, pending, error, onValue } = binding;
  const quiet = binding.quiet === true;
  const shared = binding.sharedReason === true;
  switch (control.kind) {
    case "setpoint":
      return html`<sz-setpoint
        .control=${control}
        .t=${t}
        .pending=${pending}
        .error=${error}
        .sharedReason=${shared}
        .formatNumber=${binding.formatNumber}
        ?quiet=${quiet}
        @sz-value=${onValue}
      ></sz-setpoint>`;
    case "select":
      return html`<sz-select .control=${control} .t=${t} .pending=${pending} .error=${error} .sharedReason=${shared} ?quiet=${quiet} @sz-value=${onValue}></sz-select>`;
    case "toggle":
      return html`<sz-toggle .control=${control} .t=${t} .pending=${pending} .error=${error} .sharedReason=${shared} ?quiet=${quiet} @sz-value=${onValue}></sz-toggle>`;
    case "action":
      return html`<sz-action .control=${control} .t=${t} .pending=${pending} .error=${error} .sharedReason=${shared} ?quiet=${quiet} @sz-value=${onValue}></sz-action>`;
    case "duration":
      return html`<sz-duration .control=${control} .t=${t} .pending=${pending} .error=${error} .sharedReason=${shared} ?quiet=${quiet} @sz-value=${onValue}></sz-duration>`;
    case "fan":
      return html`<sz-fan .control=${control} .t=${t} .pending=${pending} .error=${error} .sharedReason=${shared} ?quiet=${quiet} @sz-value=${onValue}></sz-fan>`;
    case "light":
      return html`<sz-light .control=${control} .t=${t} .pending=${pending} .error=${error} .sharedReason=${shared} ?quiet=${quiet} @sz-value=${onValue}></sz-light>`;
    case "reading":
      return html`<sz-reading .control=${control} .t=${t} ?quiet=${quiet}></sz-reading>`;
    case "countdown":
      return html`<sz-countdown .control=${control} .t=${t} ?quiet=${quiet}></sz-countdown>`;
    case "ice_delay":
      return html`<sz-ice-delay
        .control=${control}
        .t=${t}
        .pending=${pending}
        .error=${error}
        .sharedReason=${shared}
        .timeZone=${binding.timeZone}
        ?quiet=${quiet}
        @sz-value=${onValue}
      ></sz-ice-delay>`;
  }
}
