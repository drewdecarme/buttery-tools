import { parseAndValidateOptions } from "@buttery/core/utils/node";
import chokidar from "chokidar";
import { context } from "esbuild";
import { compileCommands } from "../compiler/compile-commands.js";
import { getBuildConfig } from "../compiler/get-build-config.js";
import {
  type ButteryCommandsDevOptions,
  butteryCommandsDevOptionsSchema,
} from "../options";
import { buildButteryCommands } from "../utils/buildButteryCommands.js";
import { getButteryCommandsConfig } from "../utils/getButteryCommandsConfig.js";
import { getButteryCommandsDirectories } from "../utils/getButteryCommandsDirectories.js";
import { LOG } from "../utils/utils.js";

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

  // Reconcile the buttery config & dirs
  const config = await getButteryCommandsConfig();
  const dirs = getButteryCommandsDirectories(config);

  // build the commands
  await buildButteryCommands(config, dirs, parsedOptions);

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
        LOG.fatal(new Error(String(error)));
      }
    });
}
