// TODO: Work on removing some easily replicated packages
// to reduce dependency size
import path from "node:path";
import { glob } from "glob";
import * as esbuild from "esbuild";
import { rm } from "node:fs/promises";
import { BuildScriptArgs } from "./script.build";
import { EsbuildPluginWatchLogger } from "./util.esbuild-plugin-watch-logger";
import { compileEntryTemplate } from "./util.compile-entry-template";
import { ESBuildPluginEntryTemplateTransformer } from "./util.esbuild-plugin-entry-template-transformer";

const __dirname = import.meta.dirname;

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
    let srcFilesGlob = path.resolve(srcFilesDir, "./index.ts");
    let srcFiles = glob.sync(srcFilesGlob, { follow: false });
    const srcFilesOutDir = path.join(config.root, "./bin");

    // Create the build options
    const esbuildArgs: esbuild.BuildOptions = {
      entryPoints: srcFiles,
      bundle: true,
      minify: true,
      format: "esm",
      platform: "node",
      target: ["node20.11.1"],
      packages: "external",
      outdir: srcFilesOutDir,
    };

    // Just build when dev or local aren't present
    if (!argv.watch || !argv.local) {
      return await esbuild.build(esbuildArgs);
    }

    // Run in development mode if our watch command exists.
    console.log("Running build in `watch` && `local` mode...");
    console.log(`Watching '${srcFilesDir}' for changes...`);

    // change some values for development
    srcFilesGlob = path.resolve(srcFilesDir, "*");
    srcFiles = glob.sync(srcFilesGlob, { follow: false });

    const ESBuildWatchLogger = new EsbuildPluginWatchLogger({
      cliName: config.name,
      dirname: "src",
    });
    const ESBuildEntryTemplateTransformer =
      new ESBuildPluginEntryTemplateTransformer({ cli_name: config.name });

    const context = await esbuild.context({
      ...esbuildArgs,
      entryPoints: srcFiles,
      bundle: false,
      minify: false,
      plugins: [
        ESBuildWatchLogger.getPlugin(),
        ESBuildEntryTemplateTransformer.getPlugin(),
      ],
    });
    return await context.watch();
  } catch (error) {
    throw new Error(error as string);
  }
}
