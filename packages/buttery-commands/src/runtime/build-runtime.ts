import path from "node:path";
import { build } from "esbuild";
import type { ButteryCommandsDirectories } from "../getButteryCommandsDirectories";
import { LOG, defaultEsbuildOptions } from "../utils";

export async function buildRuntime(dirs: ButteryCommandsDirectories) {
  LOG.debug("Building buttery commands runtime...");
  try {
    await build({
      ...defaultEsbuildOptions,
      entryPoints: [path.resolve(import.meta.dirname, "./runtime.ts")],
      outfile: path.resolve(dirs.binDir, "./index.js"),
    });
    LOG.debug("Building buttery commands runtime... done.");
  } catch (error) {
    throw new Error(String(error));
  }
}
