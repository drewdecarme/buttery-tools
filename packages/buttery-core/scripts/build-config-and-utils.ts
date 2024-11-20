import path from "node:path";
import { build } from "../src/builder/index.js";

/**
 * The @buttery/core/config path needs to be bundled using esbuild to
 * ensure that all of the code that is needed to reconcile the configuration
 * during CLI runtime is in one file. This ensures that we don't have
 * to worry about line endings that are easily reconciled by TS but not
 * by node (that is without an experimental feature behind a flag)
 */

build({
  mode: "loose",
  entryPoints: [
    "config",
    "utils/browser",
    "utils/isomorphic",
    "utils/node",
  ].map((lib) => path.resolve(import.meta.dirname, `../src/${lib}/index.ts`)),
});
