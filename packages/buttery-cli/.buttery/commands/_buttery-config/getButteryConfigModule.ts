import path from "node:path";
import esbuild, { type BuildOptions } from "esbuild";
import { hashString } from "../_utils/util.hash-string";
import { LOG } from "../_utils/util.logger";
import type { ButteryConfig } from "./buttery-config.types";

async function importButteryConfigModule(
  butteryConfigPath: string
): Promise<ButteryConfig> {
  try {
    const module = await import(butteryConfigPath);
    return module.default;
  } catch (error) {
    throw LOG.fatal(
      new Error(
        `Fatal error when trying to import the transpiled .buttery/config: ${error}`
      )
    );
  }
}

/**
 * Provided some resolved paths, this function will build the .buttery/config file
 * and place it in the .buttery/.store for re-use as time goes on. If a watch option
 * is provided, it will use nodemon to listen to the file for changes and then rebuild
 * the file using Esbuild's Rebuild API.
 *
 * Finally, the function will attempt to import and return the resolved config as an ESModule.
 */
export async function getButteryConfigModule(options: {
  butteryConfigFilePath: string;
  butteryStoreDirectoryPath: string;
  watch?: boolean;
}): Promise<ButteryConfig> {
  const builtConfigOutFile = path.resolve(
    options.butteryStoreDirectoryPath,
    `./config.${hashString(options.butteryConfigFilePath)}.js`
  );

  const esbuildOptions: BuildOptions = {
    entryPoints: [options.butteryConfigFilePath],
    bundle: true,
    platform: "node",
    target: ["node22.1.0"],
    format: "esm",
    outfile: builtConfigOutFile,
    packages: "external",
    minify: !options.watch,
    tsconfigRaw: JSON.stringify(
      {
        extends: "@buttery/tsconfig/library"
      },
      null,
      2
    )
  };

  try {
    // build once
    await esbuild.build(esbuildOptions);

    if (!options.watch) {
      const config = await importButteryConfigModule(builtConfigOutFile);
      return config;
    }

    // running in watch mode
    // TODO: Add nodemon watcher.
    LOG.watch(
      `Watching the .buttery/config file for changes: ${options.butteryConfigFilePath}`
    );
    const config = await importButteryConfigModule(builtConfigOutFile);
    return config;
  } catch (error) {
    throw LOG.fatal(
      new Error(
        `Fatal error when trying to transpile and build the .buttery/config file: ${error}`
      )
    );
  }
}
