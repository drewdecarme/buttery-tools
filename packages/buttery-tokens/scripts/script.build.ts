import path from "node:path";
import { buildTSLibrary } from "@buttery/utils/esbuild";
import { tokenLogger } from "../utils";

export type BuildOptions = {
  watch: boolean;
  debug: boolean;
};

export const build = async (options: BuildOptions) => {
  tokenLogger.debug("Building buttery tokens...", options);

  // create the library build definition
  const buildLibrary = buildTSLibrary({
    srcDir: path.resolve(import.meta.dirname, "../lib"),
    outDir: path.resolve(import.meta.dirname, "../dist"),
    tsconfigPath: path.resolve(import.meta.dirname, "../tsconfig.lib.json"),
    logger: tokenLogger
  });

  await Promise.all([buildLibrary]);

  tokenLogger.success("Build complete!");
};
