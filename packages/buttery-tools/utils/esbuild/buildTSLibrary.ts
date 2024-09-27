import path from "node:path";
import { build, context } from "esbuild";
import { glob } from "glob";
import type { ButteryLogger } from "../../artifacts/buttery-logger/index.js";
import { EsbuildPluginTypescriptCompiler } from "./EsbuildPluginTypescriptCompiler.js";
import { createEsbuildOptions } from "./createEsbuildOptions.js";

/**
 * ## Description `buildTSLibrary`
 *
 * A function that utilizes esbuild to create a
 * typescript library distribution so it can be imported
 * from any packages that consume this. This is intended
 * to be a utility that should be used for programmatic execution
 * and creation of a TS library throughput invoked commands such
 * as stand alone scripts or CLIs.
 *
 * **NOTE**: This is not a substitution for
 * the TypeScript compiler. Instead it is another way of running
 * the typescript compiler.
 */
export const buildTSLibrary = async (options: {
  srcDir: string;
  outDir: string;
  tsconfigPath: string;
  watch?: boolean;
  logger: ButteryLogger;
}) => {
  try {
    const srcFilesGlob = path.resolve(options.srcDir, "./*.ts");
    const srcFiles = glob.sync(srcFilesGlob, {
      follow: false,
    });
    // Create the TS compiler plugin
    const ESBuildTypescriptCompiler = new EsbuildPluginTypescriptCompiler({
      tsConfigPath: options.tsconfigPath,
    });
    const plugins = [ESBuildTypescriptCompiler.getPlugin()];
    // Create the build options
    const esbuildOptions = createEsbuildOptions({
      entryPoints: srcFiles,
      outdir: options.outDir,
      plugins,
    });

    if (!options.watch) {
      return await build(esbuildOptions);
    }
    options.logger.watch(`Listening for changes in "${options.srcDir}"...`);

    // Build the esbuild context and watch it to re-build
    // files on change
    const esbuildContext = await context({
      ...esbuildOptions,
      minify: false,
    });

    return await esbuildContext.watch();
  } catch (error) {
    throw options.logger.fatal(
      new Error("Error when building ts library: ".concat(error as string)),
    );
  }
};
