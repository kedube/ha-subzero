import * as esbuild from "esbuild";
import { fileURLToPath } from "node:url";

// The integration serves the bundle from custom_components/subzero/frontend/, and release.yml
// zips that folder, so the committed file ships as is (dist/ is git-ignored, hence not there).
// Nothing version-specific is baked in: the panel reads its version from the ?v= stamp on its
// own URL, so bumping manifest.json for a release never makes the committed bundle stale.
await esbuild.build({
  absWorkingDir: fileURLToPath(new URL(".", import.meta.url)),
  entryPoints: ["src/subzero-panel.ts"],
  bundle: true,
  format: "esm",
  target: "es2021",
  outfile: "../custom_components/subzero/frontend/subzero-panel.js",
  minify: true,
  legalComments: "none",
  logLevel: "info",
});
