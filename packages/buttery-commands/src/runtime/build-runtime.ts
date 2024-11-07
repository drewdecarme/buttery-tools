import path from "node:path";
import { build } from "esbuild";
import type { ButteryCommandsDirectories } from "../utils/getButteryCommandsDirectories";
import { LOG, defaultEsbuildOptions } from "../utils/utils";

/**
 * Provided the reconciled directories, this function will bundle the
 * buttery commands runtime into the bin directory so that the manifest
 * can be dynamically imported, parsed and run, well... during runtime.
 *
 * The runtime itself does all of the parsing and handling of the buttery
 * commands manifest which is built from the buttery commands hierarchy
 * at build time.
 */
export async function buildRuntime(dirs: ButteryCommandsDirectories) {
  LOG.debug("Building buttery commands runtime...");
  try {
    await build({
      ...defaultEsbuildOptions,
      entryPoints: [path.resolve(import.meta.dirname, "./runtime.ts")],
      outfile: path.resolve(dirs.binDir, "./index.js"),
      bundle: true,
      packages: "bundle",
    });
    LOG.debug("Building buttery commands runtime... done.");
  } catch (error) {
    throw new Error(String(error));
  }
}
