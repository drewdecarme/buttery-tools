import * as esbuild from "esbuild";
import { getCommandFiles } from "./build-commands.get-command-files";
import { ESBuildPluginCommands } from "./build-commands.util.esbuild-plugin-commands";
import {
  type CommandsBuildFunction,
  defaultEsbuildOptions,
} from "./build-commands.utils";
import { getButteryCommandsDirectories } from "./getButteryCommandsDirectories";
import { LOG } from "./utils";

// to the src directory so it can be transpiled and built again.
export const buildCommandsCreateBinary: CommandsBuildFunction = async ({
  config,
  options,
}) => {
  try {
    const commandFiles = await getCommandFiles(config);
    const cliDirs = getButteryCommandsDirectories(config);

    // Create the commands plugin
    const ESBuildCommandsPlugin = new ESBuildPluginCommands(config);

    // // Create the build options
    const esbuildOptions: esbuild.BuildOptions = {
      ...defaultEsbuildOptions,
      entryPoints: commandFiles.map((commandFile) => commandFile.inPath),
      outdir: cliDirs.binDir,
      plugins: [ESBuildCommandsPlugin.getPlugin()],
    };

    // // Run the build in 'watch' mode
    if (options.watch) {
      LOG.watch(`Listening for changes in "${cliDirs.commandsDir}"...`);
      const context = await esbuild.context({
        ...esbuildOptions,
        minify: false,
      });
      return await context.watch();
    }

    // Run the build
    esbuild.build(esbuildOptions);
  } catch (error) {
    throw new Error("Error when building 'entry': ".concat(error as string));
  }
};
