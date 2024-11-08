import { inlineTryCatch } from "@buttery/core/utils/isomorphic";
import { parseAndValidateOptions } from "@buttery/core/utils/node";
import chokidar from "chokidar";
import { type BuildContext, type BuildOptions, context } from "esbuild";
import { getBuildConfig } from "../compiler/get-build-config.js";
import { getCommands } from "../compiler/get-commands.js";
import { runPreBuild } from "../compiler/run-prebuild.js";
import {
  type ButteryCommandsDevOptions,
  butteryCommandsDevOptionsSchema,
} from "../options";
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

  const config = await getButteryCommandsConfig();
  const dirs = getButteryCommandsDirectories(config);

  // run the prebuild
  const preBuildResults = await inlineTryCatch(runPreBuild)(
    config,
    dirs,
    parsedOptions
  );
  if (preBuildResults.hasError) {
    return LOG.fatal(preBuildResults.error);
  }

  let esbuildContext: BuildContext<BuildOptions> | undefined = undefined;

  /**
   * An inline function that will dispose of the current build context
   * and then update the build config with new entry points when
   * actions in the watcher require the entry points to be updated
   */
  async function rebuild() {
    if (esbuildContext) {
      await esbuildContext.dispose();
    }
    const newConfig = await getButteryCommandsConfig();
    const newDirs = getButteryCommandsDirectories(config);
    const newCommands = await getCommands(newConfig);
    const esbuildConfig = await getBuildConfig(
      newConfig,
      newDirs,
      newCommands,
      {
        ...parsedOptions,
        isProd: false,
      }
    );
    esbuildContext = await context(esbuildConfig);
    await esbuildContext.watch();
    LOG.watch(`Watching ${dirs.commandsDir} for changes...`);
  }

  // build one time and watch
  await rebuild();

  // we don't want to include any watchers in here
  // since when we develop against this we're running
  // a watcher higher in the call stack
  if (process.env.LOCAL_DEV === "true") {
    return LOG.debug("Running as LOCAL_DEV.");
  }

  // Watch the commands directory by staring a chokidar instance
  let changeNum = 1;
  chokidar
    .watch([dirs.commandsDir, config.paths.config], { ignoreInitial: true })
    .on("all", async (event, path) => {
      try {
        switch (event) {
          case "add":
            LOG.watch(`${path} added. Rebuilding x${changeNum}...`);
            rebuild();
            break;

          case "unlink":
            LOG.watch(`${path} removed. Rebuilding x${changeNum}...`);
            rebuild();
            break;

          default:
            LOG.watch(`${path} changed. Rebuilding x${changeNum}...`);
            if (!esbuildContext) {
              throw "Build context is undefined. This should not have happened.";
            }
            await esbuildContext.rebuild();
            break;
        }
        LOG.watch(`${path} changed. Rebuilding x${changeNum}... done.`);
        changeNum++;
      } catch (error) {
        LOG.fatal(new Error(String(error)));
      }
    });
}
