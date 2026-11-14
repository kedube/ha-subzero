// Writes a drawing's Lit templates out as markup without a DOM, and checks that markup. A DOM
// (happy-dom) costs about a hundred times more per drawing, so the wide sweep over the specs the
// integration can send (drawings-matrix.test.ts) runs on this, and the gallery variants run on a
// real DOM (drawing-check.ts).
import { nothing } from "lit";

/** What stands in for an attribute bound to undefined or null, which Lit writes as "". */
const UNSET = "‹unset›";

interface Template {
  strings: ArrayLike<string>;
  values: unknown[];
}

const isTemplate = (value: unknown): value is Template =>
  typeof value === "object" && value !== null && "strings" in value && "values" in value;

/**
 * The markup Lit would render for a template, near enough to check: a binding that is `nothing`
 * leaves its attribute out, and one that is undefined or null is marked, since Lit writes it as
 * an empty attribute (`width=""`) that a scan for "undefined" can't see.
 */
export function serialize(value: unknown): string {
  if (value === nothing || value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(serialize).join("");
  if (!isTemplate(value)) return String(value);
  let out = "";
  // Where the template's own text stands: inside a tag, and inside a quoted attribute value.
  let inTag = false;
  let quote: string | null = null;
  for (let index = 0; index < value.strings.length; index++) {
    const text = value.strings[index];
    for (const char of text) {
      if (quote) {
        if (char === quote) quote = null;
      } else if (inTag) {
        if (char === '"' || char === "'") quote = char;
        else if (char === ">") inTag = false;
      } else if (char === "<") inTag = true;
    }
    out += text;
    if (index >= value.values.length) continue;
    const bound = value.values[index];
    const unset = bound === undefined || bound === null;
    if (quote) {
      // One part of a quoted attribute value.
      out += unset ? UNSET : serialize(bound);
    } else if (inTag) {
      // A whole attribute: name=${bound}.
      if (bound === nothing) out = out.replace(/\s+[^\s=<>]+=$/, "");
      else out += `"${unset ? UNSET : serialize(bound).replaceAll('"', "&quot;")}"`;
    } else out += serialize(bound);
  }
  return out;
}

/** Attributes that hold one number: empty is as wrong as NaN. */
const NUMERIC = [
  ...["x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r", "rx", "ry", "width", "height", "offset"],
  ...["opacity", "fill-opacity", "stroke-opacity", "stop-opacity", "stroke-width", "font-size", "stdDeviation"],
];
const EMPTY_NUMBER = new RegExp(`\\s(${NUMERIC.join("|")})=""`, "g");

/**
 * Numbers that went wrong on their way into the markup, rendered by Lit or written out here: a
 * numeric attribute left empty (what Lit makes of undefined) and a size below zero.
 */
export function numberProblems(markup: string): string[] {
  const found: string[] = [];
  for (const match of markup.matchAll(EMPTY_NUMBER)) found.push(`an empty ${match[1]}`);
  for (const match of markup.matchAll(/\s(width|height|r|rx|ry)="(-[0-9.e-]+)"/g)) found.push(`${match[1]} of ${match[2]}`);
  return [...new Set(found)];
}

/**
 * What's wrong with a drawing's markup, as a list of short findings (empty when it's sound):
 * values that never became numbers, sizes below zero, ids that repeat or lack the drawing's uid
 * (several drawings share one shadow root), and references to definitions that aren't there.
 */
export function problems(markup: string, uid: string): string[] {
  const found: string[] = [];
  for (const bad of ["NaN", "undefined", "Infinity", "[object", UNSET]) {
    if (markup.includes(bad)) found.push(`${bad} in the markup`);
  }
  found.push(...numberProblems(markup));

  const box = /^<svg\b[^>]*?\sviewBox="([^"]*)"/.exec(markup.trimStart());
  const numbers = (box?.[1] ?? "").trim().split(/[\s,]+/).map(Number);
  if (numbers.length !== 4 || !numbers.every(Number.isFinite) || numbers[2] <= 0 || numbers[3] <= 0) {
    found.push(`a viewBox of "${box?.[1] ?? ""}"`);
  }

  const ids = [...markup.matchAll(/\sid="([^"]*)"/g)].map((match) => match[1]);
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) found.push(`id ${id} twice`);
    seen.add(id);
    if (!id.startsWith(`${uid}-`)) found.push(`id ${id} without the uid`);
  }
  const references = [
    ...markup.matchAll(/url\(\s*['"]?#([^'")\s]+)['"]?\s*\)/g),
    ...markup.matchAll(/href="#([^"]+)"/g),
  ].map((match) => match[1]);
  for (const reference of new Set(references)) {
    if (!seen.has(reference)) found.push(`#${reference} isn't defined`);
  }
  return [...new Set(found)];
}
