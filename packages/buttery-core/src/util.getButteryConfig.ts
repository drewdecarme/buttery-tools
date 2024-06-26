import path from "node:path";

import { LOG } from "./logger.js";
import type {
  ButteryConfig,
  ButteryConfigPaths,
} from "./types.buttery-config.js";
import { getButteryConfigModule } from "./util.getButteryConfigModule.js";

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
 * Fetches the `buttery.config` from the current working
 * directory. If a key from the buttery config is provided
 * then it attempts to search for the configuration of that specific key.
 * TODO: Update the jsdoc here
 */
export const getButteryConfig = async <T extends keyof ButteryConfig>(
  nestedConfigKey: T,
  options?: {
    /**
     * Optional starting directory to look for the config at
     * @default process.cwd()
     */
    startingDirectory?: string;
  }
): Promise<ResolvedButteryConfig<T>> => {
  try {
    const butteryConfigModule = await getButteryConfigModule(
      options?.startingDirectory
    );
    const butteryConfig: ButteryConfigWithPaths = {
      config: butteryConfigModule.config,
      paths: {
        config: butteryConfigModule.configPath,
        butteryDir: butteryConfigModule.configDir,
        rootDir: path.dirname(butteryConfigModule.configDir),
      },
    };

    const nestedConfig = butteryConfig.config[nestedConfigKey];

    if (!nestedConfig) {
      throw `Cannot find the "buttery.config.${nestedConfigKey}" configuration object. Please ensure that the "${nestedConfigKey}" exists in your "buttery.config".`;
    }

    if (Object.keys(nestedConfig).length === 0) {
      throw `"buttery.config.${nestedConfigKey}" configuration object is empty. Please ensure that the "${nestedConfigKey}" has values in your "buttery.config".`;
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
