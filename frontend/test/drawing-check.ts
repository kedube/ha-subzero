// Shared by the drawings-*.test.ts files: render a drawing the way a card does and check its
// markup. Each module has its own test file so vitest runs them in separate workers, since a
// DOM of every drawing at once outgrows a worker's memory.
import { nothing, render } from "lit";
import { expect, it } from "vitest";
import type { GalleryVariant } from "../gallery/types";
import { renderDrawing } from "../src/drawings/index";
import type { DrawingInput } from "../src/drawings/types";

/** Renders a drawing into a fresh element, checks it, and clears it again. */
export function checkDrawing(input: DrawingInput): void {
  const host = document.createElement("div");
  render(renderDrawing(input), host);
  try {
    // Nested svgs are allowed (clipped parts); the drawing itself is the outermost.
    const root = [...host.querySelectorAll("svg")].find((svg) => !svg.parentElement?.closest("svg"));
    expect(root, "a drawing renders an svg").toBeTruthy();
    checkSvg(root as SVGSVGElement, input.uid);
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

/** Every variant in both themes, and at a card's and a full view's shown height. */
export function checkVariants(prefix: string, variants: GalleryVariant[]): void {
  it("has variants with unique ids", () => {
    expect(variants.length).toBeGreaterThan(0);
    const ids = variants.map((variant) => variant.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  for (const [index, variant] of variants.entries()) {
    for (const theme of ["light", "dark"] as const) {
      it(`${variant.id} draws cleanly (${theme})`, () => {
        checkDrawing({ ...variant.input, uid: `${prefix}${index}${theme[0]}`, theme, reducedMotion: true });
      });
    }
    // The panel passes the shown height, which sizes the readout labels.
    for (const pixelHeight of [180, 720]) {
      it(`${variant.id} draws cleanly at ${pixelHeight} px`, () => {
        checkDrawing({ ...variant.input, uid: `${prefix}${index}h${pixelHeight}`, theme: "light", pixelHeight });
      });
    }
  }
}
