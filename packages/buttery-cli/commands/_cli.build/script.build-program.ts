import path from "node:path";
import { createEsbuildOptions } from "@buttery/utils/esbuild";
import * as esbuild from "esbuild";
import { glob } from "glob";
import { LOG } from "../_utils/util.logger";
import type { BuildScriptArgs } from "./script.build";
import { ESBuildPluginCommands } from "./util.esbuild-plugin-commands";

// TODO: Fix description
/**
 * Process
 * 1 - Build the /src
 * 1.0 - Delete the src/index.ts file
 * 1.1 - Process the template with the config
 * 1.2 - Build the src into the bin folder
 * 2 - Build the /commands
 */

// force remove the index.ts file

// -- SRC --
// delete the existing index.ts file, compile the index template and write it
// to the src directory so it can be transpiled and built again.
export async function buildProgram({
  configBase,
  configCli,
  configPath,
  programArgs,
}: BuildScriptArgs) {
  try {
    const commandFilesDir = path.resolve(configBase.root, "./commands");
    const commandFilesGlob = [
      `!${path.resolve(commandFilesDir, "./_*")}`, // Ignore all underscore-prefixed files and directories
      `!${path.resolve(commandFilesDir, "./_*/**")}`, // Ignore all files inside underscore prefixed directories
      path.resolve(commandFilesDir, "./[!_]*.ts"), // Include all TypeScript files, excluding those with underscore prefix
    ];
    // TODO: <TEST> - Test to ensure that these patterns are ignored
    const commandFiles = glob.sync(commandFilesGlob, {
      follow: false,
    });

    const outDir = path.join(configBase.root, "./bin");

    // Create a commands plugin
    const ESBuildCommandsPlugin = new ESBuildPluginCommands({
      ...configBase,
      ...configCli,
    });
    const plugins = [ESBuildCommandsPlugin.getPlugin()];

    // Create the build options
    const esbuildOptions = createEsbuildOptions({
      entryPoints: commandFiles,
      outdir: outDir,
      plugins,
    });

    // Build when not in watch
    if (!programArgs.watch) {
      return await esbuild.build(esbuildOptions);
    }

    LOG.watch(`Listening for changes in "${commandFilesDir}"...`);

    // Build the esbuild context and watch it to re-build
    // files on change
    const context = await esbuild.context({
      ...esbuildOptions,
      minify: false,
    });
    return await context.watch();
  } catch (error) {
    throw new Error("Error when building 'entry': ".concat(error as string));
  }
}
