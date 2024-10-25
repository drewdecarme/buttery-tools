import path from "node:path";
import { LOG } from "../private";
import { butteryConfigDefaults } from "./buttery-config.defaults";
import type {
  ButteryConfig,
  ButteryConfigPaths,
  GetButteryConfigOptions,
} from "./buttery-config.types";
import { ensureButteryStore } from "./ensureButteryStore";
import { getButteryConfigFile } from "./getButteryConfigFile";
import { getButteryConfigModule } from "./getButteryConfigModule";

type ButteryConfigWithPaths = {
  config: ButteryConfig;
  paths: ButteryConfigPaths;
};

export type GetButteryConfig<N extends keyof ButteryConfig | undefined> =
  N extends keyof ButteryConfig
    ? ButteryConfigWithPaths & {
        [K in N]: Required<ButteryConfig>[K];
      }
    : ButteryConfigWithPaths;

export type ResolvedButteryConfig<T extends keyof ButteryConfig> = Omit<
  GetButteryConfig<T>,
  "config"
>;

/**
 * Searches for the `.buttery/config` file either from the current working directory
 * or from a provided directory. Attempts to resolve a few directories and
 * configurations based upon that search. Once found, it builds the configuration
 * using Esbuild and then resolves the configuration as an ESModule to be used
 * in any of the commands in the CLI.
 */
export const getButteryConfig = async <T extends keyof ButteryConfig>(
  nestedConfigKey: T,
  options?: GetButteryConfigOptions
): Promise<ResolvedButteryConfig<T>> => {
  // Resolve the options
  const optionPrompt = options?.prompt ?? false;
  const optionWatch = options?.watch ?? false;
  const optionDefaultConfig = options?.defaultConfig;
  const optionStartingDirectory = options?.startingDirectory;
  const optionRequireConfig = options?.requireConfig ?? true;

  // set the level
  LOG.level = options?.logLevel ?? "info";

  // search for the config file starting with a directory or the current working directory
  const searchDirectory = optionStartingDirectory ?? process.cwd();
  const butteryConfigFile = await getButteryConfigFile(searchDirectory, {
    prompt: optionPrompt,
    defaultConfig: optionDefaultConfig,
  });

  // ensure the .buttery/.store directory
  const butteryStoreDir = await ensureButteryStore({
    butteryDir: butteryConfigFile.directory,
  });

  // transpile the build and optionally watch
  const butteryConfigModule = await getButteryConfigModule({
    butteryConfigFilePath: butteryConfigFile.path,
    butteryStoreDirectoryPath: butteryStoreDir,
    watch: optionWatch,
  });

  const butteryConfig: ButteryConfigWithPaths = {
    config: butteryConfigModule,
    paths: {
      config: butteryConfigFile.path,
      storeDir: butteryStoreDir,
      butteryDir: butteryConfigFile.directory,
      rootDir: path.dirname(butteryConfigFile.directory),
    },
  };

  try {
    let nestedConfig = butteryConfig.config[nestedConfigKey];

    if (optionRequireConfig) {
      if (!nestedConfig) {
        throw `Cannot find the "buttery.config.${nestedConfigKey}" configuration object. Please ensure that the "${nestedConfigKey}" exists in your "buttery.config".`;
      }

      if (Object.keys(nestedConfig).length === 0) {
        throw `"buttery.config.${nestedConfigKey}" configuration object is empty. Please ensure that the "${nestedConfigKey}" has values in your "buttery.config".`;
      }
    } else {
      nestedConfig = butteryConfigDefaults[nestedConfigKey];
    }

    const { config, ...restConfig } = butteryConfig;

    return {
      ...restConfig,
      [nestedConfigKey]: nestedConfig,
    } as Omit<GetButteryConfig<T>, "config">;
  } catch (error) {
    const err = new Error(error as string);
    LOG.fatal(err);
    throw err;
  }
};
