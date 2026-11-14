import { html, nothing, type ReactiveControllerHost, type TemplateResult } from "lit";
import { renderConfirmBar, type ConfirmBar } from "./parts";

type Host = ReactiveControllerHost & { readonly renderRoot: HTMLElement | DocumentFragment };

/**
 * The inline confirmation bar (see renderConfirmBar) for an element that asks before it acts:
 * whether it's open, where focus goes, and Escape. The host renders `bar(...)` where the bar
 * belongs, with `partStyles` among its styles, and calls `ask()` from the button that asks.
 */
export class Confirmation {
  /** True while the bar is open. */
  asking = false;

  constructor(
    private readonly host: Host,
    /** Finds the button that asked in the host's shadow root; focus returns to it. */
    private readonly asker: string,
  ) {}

  /** Opens the bar, with focus on the safe choice, so Enter or Space doesn't act by accident. */
  async ask(): Promise<void> {
    this.asking = true;
    this.host.requestUpdate();
    await this.host.updateComplete;
    this.host.renderRoot.querySelector<HTMLElement>(".confirm .sz-button")?.focus();
  }

  /** Closes the bar and puts focus back on the button that asked. */
  close(): void {
    this.asking = false;
    this.host.requestUpdate();
    void this.host.updateComplete.then(() => this.host.renderRoot.querySelector<HTMLElement>(this.asker)?.focus());
  }

  /** Closes the bar where it is, when what it asked about is no longer there to ask. */
  drop(): void {
    this.asking = false;
  }

  /**
   * The bar while it's open, else nothing. Either answer closes it, and `onConfirm` runs for the
   * action's; Escape is the other answer.
   */
  bar(bar: Omit<ConfirmBar, "onConfirm" | "onCancel">, onConfirm: () => void): TemplateResult | typeof nothing {
    if (!this.asking) return nothing;
    const confirm = () => {
      this.close();
      onConfirm();
    };
    return html`<div class="ask" @keydown=${this.onKey}>${renderConfirmBar({ ...bar, onConfirm: confirm, onCancel: () => this.close() })}</div>`;
  }

  private readonly onKey = (event: KeyboardEvent): void => {
    if (event.key !== "Escape") return;
    event.stopPropagation();
    this.close();
  };
}
