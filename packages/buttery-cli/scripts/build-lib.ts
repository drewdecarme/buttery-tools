import path from "node:path";
import { glob } from "glob";
import * as esbuild from "esbuild";

import type { BuildScriptArgs } from "../src/script.build";
import { EsbuildPluginWatchLogger } from "../src/util.esbuild-plugin-watch-logger";
import { createEsbuildOptions } from "../src/config.esbuild";
import { EsbuildPluginTypescriptCompiler } from "../src/util.esbuild-plugin-typescript-compiler";

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
export async function buildLib(argv: BuildScriptArgs["argv"]) {
  // We don't want to do anything when building or developing
  // from another package. This build is only for developing
  // the CLI builder.

  try {
    const libFilesDir = path.resolve(import.meta.dirname, "../lib");
    const libFilesGlob = path.resolve(libFilesDir, "./*.ts");
    const libFiles = glob.sync(libFilesGlob, {
      follow: false,
    });
    const libFilesOutDir = path.join(import.meta.dirname, "../dist");

    // Create the TS compiler plugin
    const ESBuildTypescriptCompiler = new EsbuildPluginTypescriptCompiler({
      tsConfigPath: path.resolve(import.meta.dirname, "../tsconfig.lib.json"),
    });
    const plugins = [ESBuildTypescriptCompiler.getPlugin()];

    // Create the build options
    const esbuildOptions = createEsbuildOptions({
      entryPoints: libFiles,
      outdir: libFilesOutDir,
      plugins,
    });

    // Build when not in watch mode
    if (!argv.watch) {
      return await esbuild.build(esbuildOptions);
    }

    console.log(`Watching '${libFilesDir}' for changes...`);

    // Create a watcher plugin
    const ESBuildWatchLogger = new EsbuildPluginWatchLogger({
      cliName: "buttery",
      dirname: "lib",
    });

    // Build the esbuild context and watch it to re-build
    // files on change
    const context = await esbuild.context({
      ...esbuildOptions,
      minify: false,
      plugins: [...plugins, ESBuildWatchLogger.getPlugin()],
    });

    return await context.watch();
  } catch (error) {
    throw new Error("Error when building 'lib': ".concat(error as string));
  }
}
