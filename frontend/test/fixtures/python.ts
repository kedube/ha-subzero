/**
 * Reads the integration's own source, for the tests that hold the panel to it: what the panel
 * translates, and its copies of the integration's constants. A change there then fails here
 * until the panel follows.
 */

/** A file of the repository, by its path from the repository's root. */
export async function repoFile(path: string): Promise<string> {
  // Typed loosely: the frontend's tsconfig has no Node types, and only tests read files.
  const fs = (await import(/* @vite-ignore */ "node:fs" as string)) as {
    readFileSync(path: URL, encoding: "utf8"): string;
  };
  // The path goes in as a variable: Vite takes a literal here for an asset to bundle.
  const fromHere = `../../../${path}`;
  return fs.readFileSync(new URL(fromHere, import.meta.url), "utf8");
}

/** The text of a Python `NAME = {...}` or `NAME = (...)` literal, brackets included. */
export function block(source: string, name: string, open: "{" | "(" = "{"): string {
  const close = open === "{" ? "}" : ")";
  const start = source.indexOf(`${name} = ${open}`);
  if (start < 0) throw new Error(`${name} not found`);
  let depth = 0;
  for (let index = source.indexOf(open, start); index < source.length; index++) {
    if (source[index] === open) depth++;
    if (source[index] === close && --depth === 0) return source.slice(start, index + 1);
  }
  throw new Error(`${name} isn't closed`);
}

export const matches = (text: string, pattern: RegExp) => [...text.matchAll(pattern)].map((match) => match[1]);
/** The keys of `"key": 1` entries. */
export const keysWithNumbers = (text: string) => matches(text, /"([^"]+)":\s*-?\d+/g);
/** The names of `1: "name"` entries. */
export const numberedNames = (text: string) => matches(text, /\d+:\s*"([^"]+)"/g);
/** The keys of `"key": "value"` entries. */
export const keysWithStrings = (text: string) => matches(text, /"([^"]+)":\s*"/g);
