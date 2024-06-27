import { existsSync, lstatSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  createDefaultButteryConfig,
  promptUserForButteryConfigDefaults,
  promptUserForButteryDirLocation,
} from "./buttery-core.utils.js";
import type { GetButteryConfigOptions } from "./types.buttery-config";

// TODO: Add JSDoc
export async function getButteryConfigFile(
  startingDirectory: string,
  options?: GetButteryConfigOptions
) {
  // Resolve the options to their defaults
  const prompt = options?.prompt ?? false;
  const defaultConfig = options?.defaultConfig;

  // Check for the config file in the .buttery directory
  let butteryDir = getButteryDir(startingDirectory);

  // Create a config directory and file based upon the answers that the user is prompted for
  if (!butteryDir && prompt) {
    const userDefinedConfigDir =
      await promptUserForButteryDirLocation(startingDirectory);
    const userDefinedConfigDefaults = await promptUserForButteryConfigDefaults({
      message: "Select 1 or many configurations you wish to auto create.",
      defaultChecked: defaultConfig,
    });
    // set the butteryDir to the path that the user defined
    butteryDir = path.dirname(userDefinedConfigDir);
    // create the default config
    await createDefaultButteryConfig(butteryDir, userDefinedConfigDefaults);
  }

  if (!butteryDir) {
    throw "Cannot locate the `.buttery/config` file in your file structure. Please ensure you have created one.";
  }

  // Check for the config file in the .buttery directory
  const configFilePath = path.join(butteryDir, "config.ts");
  const doesConfigFileExist = existsSync(configFilePath);

  // Create a config file based upon the answers that the user is prompted for
  if (!doesConfigFileExist && prompt) {
    const userDefinedConfigDefaults = await promptUserForButteryConfigDefaults({
      message: `Found the .buttery directory at '${butteryDir}'. However, no \`config.ts\` file is present. Let's create one. Which configurations would you like to default?`,
      defaultChecked: defaultConfig,
    });
    await createDefaultButteryConfig(butteryDir, userDefinedConfigDefaults);
  }

  if (!doesConfigFileExist) {
    throw `Found the .buttery directory at '${butteryDir}'. However, no \`config.ts\` file is present. Please add one.`;
  }

  let file = await readFile(configFilePath);
  const isFileEmpty = file.length === 0;

  if (isFileEmpty && prompt) {
    const userDefinedConfigDefaults = await promptUserForButteryConfigDefaults({
      message: `Found "config.ts" file at: '${configFilePath}'. However, this file is empty. Let's populate it. Which configurations would you like to default?`,
      defaultChecked: defaultConfig,
    });
    await createDefaultButteryConfig(butteryDir, userDefinedConfigDefaults);
    file = await readFile(configFilePath);
  }

  if (isFileEmpty) {
    throw `Found "config.ts" file at: '${configFilePath}'. However, this file is empty. Please add your config.`;
  }

  return {
    path: configFilePath,
    content: file,
    directory: butteryDir,
  };
}

/**
 * Recursively looks up from the current directory up the tree until the root directory
 * for a directory called .buttery
 * @param currentDir - The current directory to start searching from
 * @returns The path to the .buttery directory if found, otherwise null
 */
function getButteryDir(currentDir: string): string | null {
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
  return butteryDir;
}
