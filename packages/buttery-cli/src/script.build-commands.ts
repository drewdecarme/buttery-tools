import path from "node:path";
import { glob } from "glob";
import * as esbuild from "esbuild";

import type { BuildScriptArgs } from "./script.build";
import { EsbuildPluginWatchLogger } from "./util.esbuild-plugin-watch-logger";
import { createEsbuildOptions } from "./config.esbuild";

// TODO: Fix jsdoc description
/**
 * Builds the commands in the commands directory defined in
 * the buttery.config cosmic config file.
 *
 * Process:
 * 1. Gather the commands via glob defined in the commands directory
 * relative to the provided root.
 * 2. Build the new files defined via glob into the bin/commands directory
 *
 * Ensures that any commands from a previous development instance
 * are cleared out so the new ones can be replaced and updated dynamically
 * via the esbuild watch context (if necessary).
 */
export async function buildCommands({ config, argv }: BuildScriptArgs) {
  try {
    const commandFilesDir = path.resolve(config.root, "./commands");
    const commandFilesGlob = path.resolve(commandFilesDir, "./*.ts");
    const commandFiles = glob.sync(commandFilesGlob, {
      follow: false,
    });
    const commandFilesOutDir = path.join(config.root, "./bin/commands");

    // Create the build options
    const esbuildOptions = createEsbuildOptions({
      entryPoints: commandFiles,
      outdir: commandFilesOutDir,
    });

    // Build when not in watch mode
    if (!argv.watch) {
      return await esbuild.build(esbuildOptions);
    }

    console.log(`Watching '${commandFilesDir}' for changes...`);

    // Create a watcher plugin
    const ESBuildWatchLogger = new EsbuildPluginWatchLogger({
      cliName: config.name,
      dirname: "commands",
    });

    // Build the esbuild context and watch it to re-build
    // files on change
    const context = await esbuild.context({
      ...esbuildOptions,
      minify: false,
      plugins: [ESBuildWatchLogger.getPlugin()],
    });

    return await context.watch();
  } catch (error) {
    throw new Error("Error when building 'commands': ".concat(error as string));
  }
}
