import path from "node:path";
import { buildTSLibrary } from "@buttery/utils/esbuild";

import { tokenLogger } from "../utils";

type BuildArgs = {
  watch: boolean;
};

/**
 * A simple function that parses the `process.argv` to find
 * some default values that were expecting in order to develop
 * the cli builder properly. We don't really need anything too
 * complex here... all we're looking to do is allow some args
 * to be supplied to the build script internally to this package.
 */
export const getArgs = (): BuildArgs => {
  const args = process.argv.slice(2);

  return args.reduce<BuildArgs>(
    (accum, arg) => {
      if (arg === "--watch" || arg === "-w") {
        return Object.assign({}, accum, { watch: true });
      }
      return accum;
    },
    { watch: false }
  );
};

try {
  const { watch } = getArgs();
  // create the library build definition
  tokenLogger.debug("Building buttery tokens distribution directory...");
  await buildTSLibrary({
    srcDir: path.resolve(import.meta.dirname, "../lib"),
    outDir: path.resolve(import.meta.dirname, "../dist"),
    tsconfigPath: path.resolve(import.meta.dirname, "../tsconfig.lib.json"),
    logger: tokenLogger,
    watch
  });
  tokenLogger.success(
    "Building buttery tokens distribution directory... success"
  );
} catch (error) {
  throw tokenLogger.fatal(new Error(error));
}
