import path from "node:path";
import esbuild from "esbuild";

import { LOG_CLI } from "../logger";
import { dynamicImport, hashString } from "../utils/node";
import type { ButteryConfig } from "./buttery-config.types";

async function importButteryConfigModule(
  butteryConfigPath: string
): Promise<ButteryConfig> {
  try {
    LOG_CLI.debug("Importing transpiled '.buttery/config' file...");
    const module = await dynamicImport(butteryConfigPath);
    LOG_CLI.debug("Importing transpiled '.buttery/config' file... done.");
    return module.default;
  } catch (error) {
    throw LOG_CLI.fatal(
      new Error(
        `Fatal error when trying to import the transpiled '.buttery/config': ${error}`
      )
    );
  }
}

/**
 * Provided some resolved paths, this function will build the '.buttery/config' file
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
    `./config/${hashString(options.butteryConfigFilePath)}.js`
  );

  try {
    // use the rebuild API since a file watcher will be implemented
    // to re-call this function when things change in the app
    const context = await esbuild.context({
      entryPoints: [options.butteryConfigFilePath],
      bundle: true,
      platform: "node",
      target: ["esnext"],
      format: "esm",
      outfile: builtConfigOutFile,
      packages: "external",
      minify: true,
      tsconfigRaw: JSON.stringify({
        extends: "@buttery/tsconfig/library"
      })
    });
    LOG_CLI.debug("Transpiling the '.buttery/config' file...");
    await context.rebuild();
    LOG_CLI.debug("Transpiling the '.buttery/config' file... done.");
    const config = await importButteryConfigModule(builtConfigOutFile);
    return config;
  } catch (error) {
    throw LOG_CLI.fatal(
      new Error(
        `Fatal error when trying to transpile and build the '.buttery/config' file: ${error}`
      )
    );
  }
}
