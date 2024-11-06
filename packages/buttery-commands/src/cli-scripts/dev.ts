import { inlineTryCatch } from "@buttery/core/utils/isomorphic";
import { parseAndValidateOptions } from "@buttery/core/utils/node";
import chokidar from "chokidar";
import { context } from "esbuild";
import { build } from "esbuild";
import { compileCommands } from "../compiler/compile-commands.js";
import { getBuildConfig } from "../compiler/get-build-config.js";
import { getButteryCommandsConfig } from "../getButteryCommandsConfig.js";
import { getButteryCommandsDirectories } from "../getButteryCommandsDirectories.js";
import {
  type ButteryCommandsDevOptions,
  butteryCommandsDevOptionsSchema,
} from "../options";
import { prepareDistribution } from "../prepareDistribution.js";
import { buildRuntime } from "../runtime/build-runtime.js";
import { LOG } from "../utils.js";

/**
 * Compiles and builds the buttery commands binary
 * in watch mode
 */
export async function dev(options?: Partial<ButteryCommandsDevOptions>) {
  LOG.info("Building command directories in watch mode");

  const parsedOptions = parseAndValidateOptions(
    butteryCommandsDevOptionsSchema,
    options,
    LOG
  );
  LOG.level = parsedOptions.logLevel;

  const config = await getButteryCommandsConfig();
  const dirs = getButteryCommandsDirectories(config);

  // prepare the directories
  const prepareResult = await inlineTryCatch(prepareDistribution)(
    config,
    options
  );
  if (prepareResult.hasError) {
    LOG.error("Error when trying to prepare the distribution directories.");
    return LOG.fatal(prepareResult.error);
  }

  // Build the runtime
  const buildResult = await inlineTryCatch(buildRuntime)(dirs);
  if (buildResult.hasError) {
    LOG.error("Error when building the buttery commands runtime");
    return LOG.fatal(buildResult.error);
  }

  // Compile the commands
  const manifestModule = await inlineTryCatch(compileCommands)(
    config,
    dirs,
    parsedOptions
  );
  if (manifestModule.hasError) {
    LOG.error("Error when compiling the commands");
    return LOG.fatal(manifestModule.error);
  }

  // get the build config
  const esbuildConfig = getBuildConfig(manifestModule.data, dirs);
  await build(esbuildConfig);

  // Watch the commands directory by staring a chokidar instance
  LOG.watch(`Watching ${dirs.commandsDir} for changes...`);
  chokidar
    .watch([dirs.commandsDir, config.paths.config], { ignoreInitial: true })
    .on("all", async (path) => {
      LOG.watch(`${path} changed. Rebuilding...`);
      try {
        const manifestModule = await compileCommands(
          config,
          dirs,
          parsedOptions
        );
        const esbuildConfig = getBuildConfig(manifestModule, dirs);
        const esbuildContext = await context(esbuildConfig);
        await esbuildContext.rebuild();
        LOG.watch(`${path} changed. Rebuilding... done.`);
      } catch (error) {
        throw LOG.fatal(new Error(String(error)));
      }
    });
}
