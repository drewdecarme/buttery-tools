import * as esbuild from "esbuild";
import { ESBuildPluginCommands } from "./esbuild-plugin-commands";
import { getCommandFiles } from "./get-command-files";
import { getButteryCommandsDirectories } from "./getButteryCommandsDirectories";
import {
  type CommandsBuildFunction,
  LOG,
  defaultEsbuildOptions,
} from "./utils";

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
