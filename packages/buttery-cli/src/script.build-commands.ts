// TODO: Work on removing some easily replicated packages
// to reduce dependency size
import path from "node:path";
import { glob } from "glob";
import * as esbuild from "esbuild";
import { rimraf } from "rimraf";

import type { BuildScriptArgs } from "./script.build";

/**
 * Builds the commands in the commands directory defined in
 * the buttery.config cosmic config file.
 *
 * Process:
 * 1. Gather the commands via glob defined in the commands directory
 * relative to the provided root.
 * 2. Delete the old commands in the bin directory
 * 3. Build the new files defined via glob into the bin directory
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
    const outDir = path.join(config.root, "./bin/commands");
    const commandOutputFiles = glob.sync(path.resolve(outDir, "./*.js"), {
      follow: false,
    });
    await rimraf(commandOutputFiles);

    // Create the build options
    const esbuildArgs: esbuild.BuildOptions = {
      entryPoints: [...commandFiles],
      bundle: true,
      minify: true,
      format: "esm",
      platform: "node",
      target: ["node20.11.1"],
      packages: "external",
      outdir: outDir,
    };

    // Run in development mode if our watch command exists.
    if (argv.watch) {
      console.log("Running Buttery CLI Builder in DEV mode...");
      // A simple plugin that logs the output of the watch commands
      // TODO: Move this into another file
      let rebuildNumber = 0;
      const watchPlugin: esbuild.Plugin = {
        name: "watch-logger",
        setup(build) {
          build.onEnd(() => {
            rebuildNumber++;
            if (rebuildNumber <= 2) return;
            const dateFormatter = new Intl.DateTimeFormat("en", {
              dateStyle: "short",
            });
            const now = dateFormatter.format(new Date());
            console.log(
              `${now} [${
                config.name
              }] 'commands' changed Transpiling and re-building... x${
                rebuildNumber - 2
              }`
            );
          });
        },
      };

      const context = await esbuild.context({
        ...esbuildArgs,
        plugins: [watchPlugin],
      });
      await context.watch();
    }
    await esbuild.build(esbuildArgs);
  } catch (error) {
    throw new Error(error as string);
  }
}
