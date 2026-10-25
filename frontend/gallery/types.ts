import type { DrawingInput } from "../src/drawings/types";

/** One drawing in the review gallery (scripts/render.mjs shoots each to a PNG). */
export interface GalleryVariant {
  /** Kebab-case and unique across all modules, e.g. "cl4850sid-freezer-open". */
  id: string;
  title: string;
  /** The page adds the uid, the theme and the translator. */
  input: Omit<DrawingInput, "uid" | "theme" | "t">;
  /** Stage width in CSS pixels; render.mjs --width sets the default. */
  width?: number;
  /** A reference photo's file name inside render.mjs --refs, shot beside the drawing. */
  reference?: string;
}
