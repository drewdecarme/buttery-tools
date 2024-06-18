import { existsSync, lstatSync } from "node:fs";
import path from "node:path";
import { LOG } from "./logger.js";
import type { ButteryConfig } from "./types.buttery-config";
import { butteryConfigEvaluateFile } from "./uilt.buttery-config.evaluateFile.js";
import { butteryConfigCheckFile } from "./util.buttery-config.checkFile.js";
import { butteryConfigParseFile } from "./util.buttery-config.parseFile.js";

type FoundButteryConfig = {
  config: ButteryConfig;
  paths: {
    config: string;
    butteryDir: string;
    rootDir: string;
  };
};

/**
 * Recursively looks up from the current directory up the tree until the root directory
 * for a directory called .buttery
 * @param currentDir - The current directory to start searching from
 * @returns The path to the .buttery directory if found, otherwise null
 */
function findButteryDir(currentDir: string): string {
  LOG.debug(`Searching for \`.buttery\` directory from: ${currentDir}`);
  const targetDir = ".buttery";
  const rootDir = path.parse(currentDir).root;

  /**
   * Recursive function to traverse up the directory tree
   * @param directory - The directory to start searching from
   * @returns The path to the .buttery directory if found, otherwise null
   */
  function traverseUp(directory: string): string | null {
    const potentialPath = path.join(directory, targetDir);
    if (existsSync(potentialPath) && lstatSync(potentialPath).isDirectory()) {
      return potentialPath;
    }
    const parentDir = path.dirname(directory);

    if (directory === rootDir) {
      return null;
    }
    return traverseUp(parentDir);
  }

  const butteryDir = traverseUp(currentDir);
  if (!butteryDir) {
    throw "Cannot locate the .buttery directory in your file structure. Please ensure you have created one.";
  }
  return butteryDir;
}

/**
 * Finds the buttery config file recursively in the directory
 * structure while traversing up the
 */
const getFullConfig = async (): Promise<FoundButteryConfig> => {
  LOG.debug("Locating buttery configuration file...");
  const startingDir = process.cwd();
  const butteryDir = findButteryDir(startingDir);
  const butteryConfigPath = butteryConfigCheckFile(butteryDir);
  const butteryConfigModule = await butteryConfigParseFile(butteryConfigPath);
  const butteryConfig = await butteryConfigEvaluateFile(butteryConfigModule);

  LOG.debug("Locating buttery configuration file... done.");

  return {
    config: butteryConfig,
    paths: {
      config: butteryConfigPath,
      butteryDir,
      rootDir: path.dirname(butteryDir),
    },
  };
};

export type ButteryConfigBase = Omit<ButteryConfig, "tokens" | "docs" | "cli">;

export type GetButteryConfig<N extends keyof ButteryConfig | undefined> =
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
  T extends keyof ButteryConfig | undefined,
>(
  nestedConfigKey?: T
): Promise<Omit<GetButteryConfig<T>, "config">> => {
  try {
    const butteryConfig = await getFullConfig();

    if (!nestedConfigKey) return butteryConfig as GetButteryConfig<T>;

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
