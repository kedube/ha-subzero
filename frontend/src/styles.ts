import { css } from "lit";
import type { HomeAssistant } from "./hass";

/**
 * Shared CSS: colors derived from Home Assistant's theme variables, so the panel follows light
 * and dark themes and any custom theme. An element that uses them reflects `dark` from
 * `hass.themes.darkMode` (see `syncTheme`); each element sets its own tokens rather than
 * inheriting the panel's, so it also looks right on its own (the gallery, tests).
 */
export const tokens = css`
  :host {
    --sz-text: var(--primary-text-color, #1f2328);
    --sz-muted: var(--secondary-text-color, #6b7178);
    --sz-card-bg: var(--ha-card-background, var(--card-background-color, #ffffff));
    --sz-page-bg: var(--primary-background-color, #f4f5f6);
    --sz-radius: var(--ha-card-border-radius, 12px);
    --sz-border-width: var(--ha-card-border-width, 1px);
    --sz-border: var(--ha-card-border-color, var(--divider-color, rgba(0, 0, 0, 0.12)));
    --sz-divider: var(--divider-color, rgba(0, 0, 0, 0.12));
    --sz-accent: var(--primary-color, #03a9f4);
    --sz-on-accent: var(--text-primary-color, #ffffff);
    --sz-error: var(--error-color, #db4437);
    /* Tone text is the tone mixed toward the ink: darker on light themes, lighter on dark ones,
       so a status reads clearly on its tinted pill either way. */
    --sz-ink: #000000;
    --sz-tone-strength: 66%;
    --sz-tone-neutral: var(--primary-text-color, #1f2328);
    --sz-tone-accent: var(--primary-color, #03a9f4);
    --sz-tone-warm: #e8590c;
    --sz-tone-amber: #e69500;
    --sz-tone-green: var(--success-color, #43a047);
    --sz-tone-red: var(--error-color, #db4437);
    --sz-tone-gray: var(--secondary-text-color, #6b7178);
    /* Warning and error text, mixed toward the ink like the tones so it reaches 4.5:1 on the card;
       borders and fills keep the raw colors. */
    --sz-warning-text: color-mix(in srgb, var(--sz-tone-amber) var(--sz-tone-strength), var(--sz-ink));
    --sz-error-text: color-mix(in srgb, var(--sz-error) 80%, var(--sz-ink));
    /* Insets such as the info panel, and the fill of buttons and segmented controls. */
    --sz-inset-bg: rgba(0, 0, 0, 0.04);
    --sz-inset-edge: rgba(0, 0, 0, 0.08);
    --sz-control-bg: rgba(0, 0, 0, 0.06);
    --sz-control-hover: rgba(0, 0, 0, 0.1);
    --sz-lift: 0 8px 24px rgba(0, 0, 0, 0.12);
    /* A switch's off track, at 3:1 against the card so an off switch still reads as one. */
    --sz-switch-off: color-mix(in srgb, var(--sz-text) 50%, transparent);
    /* Fills behind white text (chosen segments, primary and danger buttons), darkened from the
       theme's colors so the text reaches 4.5:1. */
    --sz-accent-fill: color-mix(in srgb, var(--sz-accent) 80%, #000000);
    --sz-danger-fill: color-mix(in srgb, var(--sz-error) 88%, #000000);
  }
  :host([dark]) {
    --sz-ink: #ffffff;
    --sz-tone-strength: 76%;
    --sz-tone-warm: #ff8a4c;
    --sz-tone-amber: #ffb83d;
    --sz-inset-bg: rgba(8, 10, 12, 0.5);
    --sz-inset-edge: rgba(255, 255, 255, 0.08);
    --sz-control-bg: rgba(255, 255, 255, 0.09);
    --sz-control-hover: rgba(255, 255, 255, 0.14);
    --sz-lift: 0 8px 28px rgba(0, 0, 0, 0.45);
    --sz-switch-off: color-mix(in srgb, var(--sz-text) 40%, transparent);
  }
`;

/** `data-tone` sets `--tone`, which pills and other status marks color themselves with. */
export const toneStyles = css`
  [data-tone="neutral"] {
    --tone: var(--sz-tone-neutral);
  }
  [data-tone="accent"] {
    --tone: var(--sz-tone-accent);
  }
  [data-tone="warm"] {
    --tone: var(--sz-tone-warm);
  }
  [data-tone="amber"] {
    --tone: var(--sz-tone-amber);
  }
  /* Amber is so light that its text needs more ink on a light theme to reach 4.5:1. */
  :host(:not([dark])) [data-tone="amber"] {
    --sz-tone-strength: 60%;
  }
  [data-tone="green"] {
    --tone: var(--sz-tone-green);
  }
  [data-tone="red"] {
    --tone: var(--sz-tone-red);
  }
  [data-tone="gray"] {
    --tone: var(--sz-tone-gray);
  }
`;

/** Pill buttons as on the GE card: neutral, primary (the accent) and danger. */
export const buttonStyles = css`
  .sz-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 40px;
    padding: 8px 16px;
    border: none;
    border-radius: 999px;
    background: var(--sz-control-bg);
    color: var(--sz-text);
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    text-decoration: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    transition: background-color 0.15s, opacity 0.15s;
  }
  .sz-button:hover {
    background: var(--sz-control-hover);
  }
  .sz-button.primary {
    background: var(--sz-accent-fill, var(--sz-accent));
    color: var(--sz-on-accent);
  }
  .sz-button.danger {
    background: var(--sz-danger-fill, var(--sz-error));
    color: #ffffff;
  }
  .sz-button:is(.primary, .danger):hover:not(:disabled, [aria-disabled="true"]) {
    opacity: 0.9;
  }
  .sz-button:disabled,
  .sz-button[aria-disabled="true"] {
    opacity: 0.45;
    cursor: default;
  }
  /* A button that can't be pressed doesn't answer the pointer. */
  .sz-button:not(.primary, .danger):is(:disabled, [aria-disabled="true"]):hover {
    background: var(--sz-control-bg);
  }
  .sz-button:focus-visible {
    outline: 2px solid var(--sz-accent);
    outline-offset: 2px;
  }
  /* Touch laptops report a mouse as their main pointer, so any finger gets the bigger target. */
  @media (any-pointer: coarse) {
    .sz-button {
      min-height: 44px;
    }
  }
`;

/** Reflects the Home Assistant theme as the `dark` attribute the tokens switch on. */
export function syncTheme(element: HTMLElement, hass: Pick<HomeAssistant, "themes"> | undefined): void {
  element.toggleAttribute("dark", hass?.themes?.darkMode === true);
}
