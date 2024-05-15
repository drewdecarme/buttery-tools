import path from "node:path";
import * as esbuild from "esbuild";
import { createEsbuildOptions } from "./config.esbuild";
import type { BuildScriptArgs } from "./script.build";
import { LOG } from "./util.logger";

export const buildConfig = async ({
  argv,
  config,
  configFilePath
}: BuildScriptArgs & { configFilePath: string }) => {
  try {
    const configFileOutDir = path.resolve(config.root, "./bin");

    // Create the esbuild options
    const esbuildOptions = createEsbuildOptions({
      entryPoints: [configFilePath],
      outdir: configFileOutDir
    });

    // Just build when dev isn't present
    if (!argv.watch) {
      return await esbuild.build(esbuildOptions);
    }

    LOG.watch(`Listening for changes in "${configFilePath}"...`);

    // Build the esbuild context and watch it to re-build
    // files on change
    const context = await esbuild.context({
      ...esbuildOptions,
      minify: false
    });
    return await context.watch();
  } catch (error) {
    throw new Error(
      `Error when building '${config.name}.config': `.concat(error as string)
    );
  }
};
