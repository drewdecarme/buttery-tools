import path from "node:path";
import { createEsbuildOptions } from "@buttery/utils/esbuild";
import * as esbuild from "esbuild";
import { glob } from "glob";
import type { BuildScriptArgs } from "./script.build";
import { ESBuildPluginCommands } from "./util.esbuild-plugin-commands";
import { LOG } from "./util.logger";

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
export async function buildProgram({ config, argv }: BuildScriptArgs) {
  try {
    const commandFilesDir = path.resolve(config.root, "./commands");
    const commandFilesGlob = path.resolve(commandFilesDir, "./*.ts");
    const commandFiles = glob.sync(commandFilesGlob, {
      follow: false
    });

    const outDir = path.join(config.root, "./bin/commands");

    // Create a commands plugin
    const ESBuildCommandsPlugin = new ESBuildPluginCommands(config);
    const plugins = [ESBuildCommandsPlugin.getPlugin()];

    // Create the build options
    const esbuildOptions = createEsbuildOptions({
      entryPoints: commandFiles,
      outdir: outDir,
      plugins
    });

    // Build when not in watch
    if (!argv.watch) {
      return await esbuild.build(esbuildOptions);
    }

    LOG.watch(`Listening for changes in "${commandFilesDir}"...`);

    // Build the esbuild context and watch it to re-build
    // files on change
    const context = await esbuild.context({
      ...esbuildOptions,
      minify: false
    });
    return await context.watch();
  } catch (error) {
    throw new Error("Error when building 'entry': ".concat(error as string));
  }
}
