import { cosmiconfig } from "cosmiconfig";
import { LOG } from "./logger";
import type { ButteryConfig } from "./types.buttery-config";

type FoundButteryConfig = {
  configBase: ButteryConfig;
  configPath: string;
};

/**
 * Fetches the buttery.config from the current working directory
 * or travels up the structure to find it.
 */
const getFullConfig = async (): Promise<FoundButteryConfig> => {
  const explorer = cosmiconfig("buttery", { searchStrategy: "global" });
  LOG.debug("Searching for `buttery.config`...");
  const config = await explorer.search(process.cwd());
  if (!config) {
    throw "Cannot find the `buttery.config` file to build the tokens. This should not have happened. Please raise a support ticket.";
  }
  if (config.isEmpty) {
    throw "`buttery.config` is empty. Please ensure you have properly populated the configuration file.";
  }
  LOG.debug("Searching for `buttery.config` config... successful.");
  return {
    configBase: config.config as ButteryConfig,
    configPath: config.filepath
  };
};

export type ButteryConfigBase = Omit<ButteryConfig, "tokens" | "docs" | "cli">;

type GetButteryConfigResult<N extends keyof ButteryConfig | undefined> =
  N extends keyof ButteryConfig
    ? FoundButteryConfig & {
        [K in N]: Required<ButteryConfig>[K];
      }
    : FoundButteryConfig;

/**
 * Fetches the `buttery.config` from the current working
 * directory. If a key from the buttery config is provided
 * then it attempts to search for the configuration of that specific key.
 */
export const getButteryConfig = async <
  T extends keyof ButteryConfig | undefined
>(
  nestedConfigKey?: T
): Promise<GetButteryConfigResult<T>> => {
  try {
    const butteryConfig = await getFullConfig();

    if (!nestedConfigKey) return butteryConfig as GetButteryConfigResult<T>;

    const nestedConfig = butteryConfig.configBase[nestedConfigKey];

    if (!nestedConfig) {
      throw `Cannot find the "buttery.config.${nestedConfigKey}" configuration object. Please ensure that the "${nestedConfigKey}" exists in your "buttery.config".`;
    }

    if (Object.keys(nestedConfig).length === 0) {
      throw `"buttery.config.${nestedConfigKey}" configuration object is empty. Please ensure that the "${nestedConfigKey}" has values in your "buttery.config".`;
    }

    const {
      configBase: { cli, tokens, ...baseConfig },
      configPath
    } = butteryConfig;

    return {
      configPath,
      configBase: baseConfig,
      [nestedConfigKey]: nestedConfig
    } as GetButteryConfigResult<T>;
  } catch (error) {
    const err = new Error(error as string);
    LOG.fatal(err);
    throw err;
  }
};
