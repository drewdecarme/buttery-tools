// TODO: Work on removing some easily replicated packages
// to reduce dependency size
import path from "node:path";
import { glob } from "glob";
import * as esbuild from "esbuild";
import handlebars from "handlebars";
import { writeFile, readFile, rm } from "node:fs/promises";
import { BuildScriptArgs } from "./script.build";
import { EsbuildPluginWatchLogger } from "./util.esbuild-plugin-watch-logger";

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
    const entryTemplateFile = await readFile(
      path.resolve(__dirname, "./template.index.hbs")
    );
    const template = handlebars.compile<{ cli_name: string }>(
      entryTemplateFile.toString()
    )({
      cli_name: config.name,
    });
    await writeFile(path.resolve(__dirname, "./index.ts"), template, "utf-8");

    // Glob the selected files from src and build
    // this is done first so this CLI can be instantiated from here and when installed elsewhere
    const srcFilesDir = __dirname;
    const srcFilesGlob = path.resolve(srcFilesDir, "./index.ts");
    const srcFiles = glob.sync(srcFilesGlob, { follow: false });
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

    // Just build
    if (!argv.watch) {
      return await esbuild.build(esbuildArgs);
    }

    // Run in development mode if our watch command exists.
    const watchLogger = new EsbuildPluginWatchLogger({
      cliName: config.name,
      dirname: "src",
    });
    const context = await esbuild.context({
      ...esbuildArgs,
      plugins: [watchLogger.getPlugin()],
    });
    return await context.watch();
  } catch (error) {
    throw new Error(error as string);
  }
}
