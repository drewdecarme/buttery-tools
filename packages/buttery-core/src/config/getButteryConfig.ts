import path from "node:path";
import { LOG } from "../private/index.js";
import type {
  ButteryConfigPaths,
  GetButteryConfigOptions,
} from "./buttery-config.types.js";
import { ensureButteryConfig } from "./ensureButteryConfig.js";
import { ensureButteryStore } from "./ensureButteryStore.js";
import { parseButteryConfig } from "./parseButteryConfig.js";

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
  // Resolve the options
  const optionPrompt = options?.prompt ?? false;
  const optionDefaults = options.defaults;

  // set the level
  LOG.level = options?.logLevel ?? "info";

  // Find the configuration file and if it doesn't exist
  // create the necessary structures to ensure it
  const butteryConfigFile = await ensureButteryConfig<T>(configNamespace, {
    prompt: optionPrompt,
    defaults: optionDefaults,
  });

  // ensure the .buttery/.store directory
  const butteryStoreDir = await ensureButteryStore({
    butteryDir: butteryConfigFile.directory,
  });

  // transpile the build and optionally watch
  const butteryConfigModule = await parseButteryConfig<T>({
    configFilePath: butteryConfigFile.path,
    configNamespace,
    configFileName: butteryConfigFile.name,
    storePath: butteryStoreDir,
  });

  return {
    config: butteryConfigModule,
    paths: {
      config: butteryConfigFile.path,
      storeDir: butteryStoreDir,
      butteryDir: butteryConfigFile.directory,
      rootDir: path.dirname(butteryConfigFile.directory),
    },
  };
}
