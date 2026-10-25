// Shared by the drawings-*.test.ts files: render a drawing the way a card does and check its
// markup. Each module has its own test file so vitest runs them in separate workers, since a
// DOM of every drawing at once outgrows a worker's memory.
import { nothing, render } from "lit";
import { expect, it } from "vitest";
import type { GalleryVariant } from "../gallery/types";
import { renderDrawing } from "../src/drawings/index";
import type { DrawingInput, DrawingState } from "../src/drawings/types";
import { makeTranslate, type Translate } from "../src/i18n";

/**
 * Words printed on the appliance itself, which stay as Wolf prints them whatever the panel's
 * language: the wall ovens' M Series knob legends and E Series touch-key labels.
 */
const PRINTED = new Set([
  ...["MORE", "ROAST", "BROIL", "BAKE", "OFF", "CONV", "C ROAST", "WARM", "GOURMET", "LO", "TEMP", "HI"],
  ...["UPPER OVEN", "LOWER OVEN", "CLEAN", "PROOF", "UPPER", "LOWER", "ON", "CLEAR", "START", "ENTER"],
]);

/** Gives every word as ⟦key⟧, so a check can tell what the translator said from a drawing's own words. */
export const marked: Translate = (key) => `⟦${key}⟧`;

/** The state with its words (a cooking mode, say) marked too: the family models translate them. */
function markState(state: DrawingState): DrawingState {
  const mark = (value: unknown): unknown => {
    if (typeof value === "string") return /\p{L}/u.test(value) ? "⟦state⟧" : value;
    if (Array.isArray(value)) return value.map(mark);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, mark(item)]));
    return value;
  };
  return mark(state) as DrawingState;
}

/**
 * Renders a drawing into a fresh element, checks it, and clears it again. With `words`, the
 * drawing must have been given `marked`, and every word it draws or says must come from it.
 */
export function checkDrawing(input: DrawingInput, options: { words?: boolean } = {}): void {
  const host = document.createElement("div");
  render(renderDrawing(input), host);
  try {
    // Nested svgs are allowed (clipped parts); the drawing itself is the outermost.
    const root = [...host.querySelectorAll("svg")].find((svg) => !svg.parentElement?.closest("svg"));
    expect(root, "a drawing renders an svg").toBeTruthy();
    checkSvg(root as SVGSVGElement, input.uid);
    if (options.words) checkWords(root as SVGSVGElement);
    else checkKeys(root as SVGSVGElement);
  } finally {
    render(nothing, host);
  }
}

export function checkSvg(svg: SVGSVGElement, uid: string): void {
  const viewBox = (svg.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number);
  expect(viewBox, "a viewBox of four numbers").toHaveLength(4);
  expect(viewBox.every(Number.isFinite), `finite viewBox ${viewBox}`).toBe(true);
  expect(viewBox[2]).toBeGreaterThan(0);
  expect(viewBox[3]).toBeGreaterThan(0);
  expect(svg.getAttribute("role")).toBe("img");
  expect(svg.getAttribute("aria-label")?.trim()).toBeTruthy();

  // Lit leaves comment markers; the attributes and text are what reach the page.
  const markup = svg.outerHTML.replace(/<!--[\s\S]*?-->/g, "");
  for (const bad of ["NaN", "undefined", "Infinity", "[object Object]"]) {
    expect(markup.includes(bad), `no ${bad} in the markup`).toBe(false);
  }

  // Several drawings share a shadow root, so every id carries the uid and none repeats.
  const ids = [...svg.querySelectorAll("[id]")].map((element) => element.id);
  expect(new Set(ids).size, "ids are unique").toBe(ids.length);
  for (const id of ids) expect(id.startsWith(uid), `id ${id} starts with ${uid}`).toBe(true);
  const known = new Set(ids);
  const references = [
    ...markup.matchAll(/url\(\s*['"]?#([^'")\s]+)['"]?\s*\)/g),
    ...markup.matchAll(/href="#([^"]+)"/g),
  ].map((match) => match[1]);
  for (const reference of references) {
    expect(known.has(reference), `#${reference} is defined in the drawing`).toBe(true);
  }
}

function spokenAndDrawn(svg: SVGSVGElement): string[] {
  return [svg.getAttribute("aria-label") ?? "", ...[...svg.querySelectorAll("text")].map((text) => text.textContent ?? "")];
}

/** Nothing English of the drawing's own: past what `marked` gave (cut short with "…" or not), no letters. */
function checkWords(svg: SVGSVGElement): void {
  for (const text of spokenAndDrawn(svg)) {
    const rest = text.replace(/⟦[^⟧]*(⟧|…)/g, "").trim();
    if (PRINTED.has(rest)) continue;
    expect(rest, `an untranslated word in "${text}"`).not.toMatch(/\p{L}/u);
  }
}

/** Every key the drawing asked for has a translation (a missing one comes out as the key). */
function checkKeys(svg: SVGSVGElement): void {
  for (const text of spokenAndDrawn(svg)) expect(text, "a key without a translation").not.toMatch(/drawing\.\w/);
}

/**
 * Every variant in both themes, and at a card's and a full view's shown height. The light one
 * checks that the drawing's words all come from the translator; the others speak English,
 * German and Chinese.
 */
export function checkVariants(prefix: string, variants: GalleryVariant[]): void {
  it("has variants with unique ids", () => {
    expect(variants.length).toBeGreaterThan(0);
    const ids = variants.map((variant) => variant.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  for (const [index, variant] of variants.entries()) {
    it(`${variant.id} draws cleanly, saying only translated words (light)`, () => {
      const input = { ...variant.input, state: markState(variant.input.state) };
      checkDrawing({ ...input, uid: `${prefix}${index}l`, theme: "light", reducedMotion: true, t: marked }, { words: true });
    });
    it(`${variant.id} draws cleanly (dark)`, () => {
      checkDrawing({ ...variant.input, uid: `${prefix}${index}d`, theme: "dark", reducedMotion: true, t: makeTranslate("en") });
    });
    // The panel passes the shown height, which sizes the readout labels.
    for (const [pixelHeight, language] of [
      [180, "de"],
      [720, "zh-Hans"],
    ] as const) {
      it(`${variant.id} draws cleanly at ${pixelHeight} px (${language})`, () => {
        checkDrawing({
          ...variant.input,
          uid: `${prefix}${index}h${pixelHeight}`,
          theme: "light",
          pixelHeight,
          t: makeTranslate(language),
        });
      });
    }
  }
}
