import path from "node:path";

import { tryHandle } from "@buttery/utils/isomorphic";
import { buildWithEsbuild } from "@buttery/core/build";

import { LOG } from "../src/utils/LOG.js";

/**
 * Bundle buttery commands at runtime into the bin directory so that the manifest
 * can be dynamically imported, parsed and run, well... during runtime.
 *
 * The runtime itself does all of the parsing and handling of the buttery
 * commands manifest which is built from the buttery commands hierarchy
 * at build time.
 */
export async function buildRuntime() {
  LOG.debug("Building buttery commands runtime...");
  try {
    await buildWithEsbuild({
      entryPoints: [
        path.resolve(import.meta.dirname, "../src/runtime/runtime.ts"),
      ],
      outfile: path.resolve(import.meta.dirname, "../dist/runtime.js"),
      packages: "bundle",
    });
    LOG.debug("Building buttery commands runtime... done.");
  } catch (error) {
    throw new Error(String(error));
  }
}

const runtimeResult = await tryHandle(buildRuntime)();
if (runtimeResult.hasError) {
  LOG.fatal(runtimeResult.error);
}
