import { createEsbuildOptions } from "@buttery/utils/esbuild";
import * as esbuild from "esbuild";
import { LOG } from "../_utils/util.logger";
import { getCommandFiles } from "./build-commands.get-command-files";
import {
  type BuildCommandFunction,
  getButteryCliDirectories,
} from "./build-commands.utils";
import { ESBuildPluginCommands } from "./util.esbuild-plugin-commands";

// to the src directory so it can be transpiled and built again.
export const buildCommandsCreateBinary: BuildCommandFunction = async ({
  config,
  options,
}) => {
  // const commandGraph = createCommandGraph();
  // const dirs = getButteryCliDirectories(config);
  // const commandFiles = getCommandFiles(config);

  try {
    const commandFiles = await getCommandFiles(config);
    console.log({ commandFiles });

    // Create a commands plugin
    // const ESBuildCommandsPlugin = new ESBuildPluginCommands({
    //   ...configBase,
    //   ...configCli,
    // });
    // const plugins = [ESBuildCommandsPlugin.getPlugin()];

    // // Create the build options
    // const esbuildOptions = createEsbuildOptions({
    //   entryPoints: commandFiles,
    //   outdir: outDir,
    //   plugins,
    // });

    // // Build when not in watch
    // if (!programArgs.watch) {
    //   await esbuild.build(esbuildOptions);
    //   return;
    // }

    // LOG.watch(`Listening for changes in "${commandFilesDir}"...`);

    // // Build the esbuild context and watch it to re-build
    // // files on change
    // const context = await esbuild.context({
    //   ...esbuildOptions,
    //   minify: false,
    // });
    // await context.watch();
    // return;
  } catch (error) {
    throw new Error("Error when building 'entry': ".concat(error as string));
  }
};
