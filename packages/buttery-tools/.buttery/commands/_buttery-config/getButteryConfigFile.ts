import { existsSync, lstatSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { LOG } from "../_logger/util.ts.logger.js";
import type { GetButteryConfigOptions } from "./buttery-config.types.js";
import {
  createDefaultButteryConfigAndDirs,
  promptUserForButteryConfigDefaults,
  promptUserForButteryDirLocation
} from "./buttery-config.utils.js";

/**
 * Starts from a provided starting and searches up the directory structure to
 * find a .buttery/ directory, a .config file inside of it and then resolves the config if
 * is populated with content. At any point in time the necessary directories, files or file requirements
 * aren't met, it will throw.
 *
 * However, if a `option.prompt` is passed into the function, the function will then prompt the
 * user for any missing information to ensure the necessary files are created and then subsequently used.
 */
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
    LOG.warning(
      "Cannot locate the `.buttery/config` file in your file structure. Let's create one."
    );
    const userButteryDir =
      await promptUserForButteryDirLocation(startingDirectory);
    const userButteryConfigDefaults = await promptUserForButteryConfigDefaults({
      message: "Select 1 or many configurations you wish to default",
      defaultChecked: defaultConfig
    });
    // set the butteryDir to the path that the user defined
    butteryDir = userButteryDir;

    // create the default config
    await createDefaultButteryConfigAndDirs(
      butteryDir,
      userButteryConfigDefaults
    );
  }

  if (!butteryDir) {
    throw "Cannot locate the `.buttery/config` file in your file structure. Please ensure you have created one.";
  }

  // Check for the config file in the .buttery directory
  const configFilePath = path.resolve(butteryDir, "./config.ts");
  let doesConfigFileExist = existsSync(configFilePath);

  // Create a config file based upon the answers that the user is prompted for
  if (!doesConfigFileExist && prompt) {
    LOG.warning(
      `Found the .buttery directory at '${butteryDir}'. However, no \`config.ts\` file is present. Let's create one.`
    );
    const userDefinedConfigDefaults = await promptUserForButteryConfigDefaults({
      message: "Which configurations would you like to default?",
      defaultChecked: defaultConfig
    });
    await createDefaultButteryConfigAndDirs(
      butteryDir,
      userDefinedConfigDefaults
    );
    doesConfigFileExist = true;
  }

  if (!doesConfigFileExist) {
    throw `Found the .buttery directory at '${butteryDir}'. However, no \`config.ts\` file is present. Please add one.`;
  }

  let file = await readFile(configFilePath);
  let isFileEmpty = file.length === 0;

  // Create a config file if the config file is empty
  if (isFileEmpty && prompt) {
    LOG.warning(
      `Found "config.ts" file at: '${configFilePath}'. However, this file is empty. Let's populate it.`
    );
    const userDefinedConfigDefaults = await promptUserForButteryConfigDefaults({
      message: "Which configurations would you like to default?",
      defaultChecked: defaultConfig
    });
    await createDefaultButteryConfigAndDirs(
      butteryDir,
      userDefinedConfigDefaults
    );
    file = await readFile(configFilePath);
    isFileEmpty = false;
  }

  if (isFileEmpty) {
    throw `Found "config.ts" file at: '${configFilePath}'. However, this file is empty. Please add your config.`;
  }

  return {
    path: configFilePath,
    content: file,
    directory: butteryDir
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
