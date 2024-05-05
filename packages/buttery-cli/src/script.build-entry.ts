import path from "node:path";
import { glob } from "glob";
import * as esbuild from "esbuild";
import { rm } from "node:fs/promises";
import { BuildScriptArgs } from "./script.build";
import { EsbuildPluginWatchLogger } from "./util.esbuild-plugin-watch-logger";
import { ESBuildPluginEntryTemplateTransformer } from "./util.esbuild-plugin-entry-template-transformer";
import { createEsbuildOptions } from "./config.esbuild";

const __dirname = import.meta.dirname;

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
export async function buildEntry({ config, argv }: BuildScriptArgs) {
  try {
    await rm(path.resolve(__dirname, "./index.ts"), {
      force: true,
    });

    // Glob the selected files from src and build
    // this is done first so this CLI can be instantiated from here and when installed elsewhere
    const srcFilesDir = __dirname;
    const srcFilesGlob = path.resolve(srcFilesDir, "./index.hbs");
    const srcFiles = glob.sync(srcFilesGlob, { follow: false });
    const srcFilesOutDir = path.join(config.root, "./bin");

    // Create a .hbs plugin transformer
    const ESBuildEntryTemplateTransformer =
      new ESBuildPluginEntryTemplateTransformer({ cli_name: config.name });

    const plugins = [ESBuildEntryTemplateTransformer.getPlugin()];

    // Create the build options
    const esbuildOptions = createEsbuildOptions({
      entryPoints: srcFiles,
      plugins,
      outdir: srcFilesOutDir,
    });

    // Just build when dev or local aren't present
    if (!argv.watch || !argv.local) {
      return await esbuild.build(esbuildOptions);
    }

    // Run in development mode if our watch command exists.
    console.log("Running build in `watch` && `local` mode...");
    console.log(`Watching '${srcFilesDir}' for changes...`);

    // Create a watcher plugin
    const ESBuildWatchLogger = new EsbuildPluginWatchLogger({
      cliName: config.name,
      dirname: "src",
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
    throw new Error("Error when building 'entry': ".concat(error as string));
  }
}
