import path from "node:path";

import type {
  ButteryConfigPaths,
  GetButteryConfigOptions,
} from "./buttery-config.types.js";
import { ensureButteryConfig } from "./get-buttery-config.ensure.js";
import { ensureButteryStore } from "./buttery-store.ensure.js";
import { parseButteryConfig } from "./get-buttery-config.parse-config-file.js";
import { ensureGitIgnoreEntry } from "./buttery-gitignore.ensure-entry.js";

import { LOG } from "../utils/util.logger.js";

/**
 * Searches for the `.buttery/config` file either from the current working directory
 * or from a provided directory. Attempts to resolve a few directories and
 * configurations based upon that search. Once found, it builds the configuration
 * using Esbuild and then resolves the configuration as an ESModule to be used
 * in any of the commands in the CLI.
 */
export async function getButteryConfig<T extends Record<string, unknown>>(
  configNamespace: string,
  options: GetButteryConfigOptions<T>
): Promise<{
  config: T;
  paths: ButteryConfigPaths;
}> {
  // set the level
  LOG.level = options?.logLevel ?? "info";

  // Find the configuration file and if it doesn't exist
  // create the necessary structures to ensure it does exist
  const butteryConfigFile = await ensureButteryConfig<T>(
    configNamespace,
    options
  );

  // ensure the .buttery/.store directory
  const butteryStoreDir = await ensureButteryStore({
    butteryDir: butteryConfigFile.directory,
  });

  // ensure an that .store is added to the gitignore
  await ensureGitIgnoreEntry(".store", {
    butteryDir: butteryConfigFile.directory,
  });

  // transpile the build and optionally watch
  const rawConfigModule = await parseButteryConfig<T>({
    configFilePath: butteryConfigFile.path,
    configNamespace,
    configFileName: butteryConfigFile.name,
    storePath: butteryStoreDir,
  });

  // validate the raw config
  LOG.debug("Validating config...");
  const config = await options.validate(rawConfigModule);
  LOG.debug("Validating config... done.");

  return {
    config,
    paths: {
      config: butteryConfigFile.path,
      storeDir: butteryStoreDir,
      butteryDir: butteryConfigFile.directory,
      rootDir: path.dirname(butteryConfigFile.directory),
    },
  };
}
