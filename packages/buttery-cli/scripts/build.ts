import { cp } from "node:fs/promises";
import path from "node:path";
import { buildTSLibrary } from "@buttery/utils/esbuild";
import { build } from "../commands/_cli.build/script.build.js";
import { LOG } from "../commands/_utils/util.logger.js";

export type BuildArgs = {
  watch: boolean;
  local: boolean;
  autofix?: boolean;
};

const defaultBuildArgs: BuildArgs = {
  watch: false,
  local: false,
  autofix: false
};

/**
 * A simple function that parses the `process.argv` to find
 * some default values that were expecting in order to develop
 * the cli builder properly. We don't really need anything too
 * complex here... all we're looking to do is allow some args
 * to be supplied to the build script internally to this package.
 */
export const parseBuildArgs = (args: typeof process.argv): BuildArgs => {
  return args.reduce<BuildArgs>((accum, arg) => {
    if (arg === "--watch" || arg === "-w") {
      return Object.assign({}, accum, { watch: true });
    }
    if (arg === "--local" || arg === "-l") {
      return Object.assign({}, accum, { local: true });
    }
    return accum;
  }, defaultBuildArgs);
};

try {
  const args = process.argv.slice(2);
  const parsedArgs = parseBuildArgs(args);

  LOG.debug("Building library for distribution...");
  const buildLibrary = buildTSLibrary({
    srcDir: path.resolve(import.meta.dirname, "../lib"),
    outDir: path.resolve(import.meta.dirname, "../dist"),
    tsconfigPath: path.resolve(import.meta.dirname, "../tsconfig.lib.json"),
    logger: LOG
  });
  LOG.debug("Building library for distribution... complete.");

  LOG.debug("Copying templates to bin directory...");
  await cp(
    path.resolve(import.meta.dirname, "../templates/"),
    path.resolve(import.meta.dirname, "../bin/templates/"),
    { recursive: true }
  );
  LOG.debug("Copying templates to bin directory... complete.");
  await Promise.all([build(parsedArgs), buildLibrary]);
} catch (error) {
  console.error(error);
}
