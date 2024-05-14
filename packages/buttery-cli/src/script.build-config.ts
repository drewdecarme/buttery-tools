import path from "path";
import { createEsbuildOptions } from "./config.esbuild";
import { BuildScriptArgs } from "./script.build";
import * as esbuild from "esbuild";
import { EsbuildPluginWatchLogger } from "./util.esbuild-plugin-watch-logger";

export const buildConfig = async ({
  argv,
  config,
  configFilePath,
}: BuildScriptArgs & { configFilePath: string }) => {
  try {
    const configFileOutDir = path.resolve(config.root, "./bin");

    // Create the esbuild options
    const esbuildOptions = createEsbuildOptions({
      entryPoints: [configFilePath],
      outdir: configFileOutDir,
    });

    // Just build when dev isn't present
    if (!argv.watch) {
      return await esbuild.build(esbuildOptions);
    }

    // Create a watcher plugin
    const ESBuildWatchLogger = new EsbuildPluginWatchLogger({
      cliName: config.name,
      dirname: config.name.concat(".config"),
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
    throw new Error(
      `Error when building '${config.name}.config': `.concat(error as string)
    );
  }

  return;
};
