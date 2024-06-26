import { existsSync, lstatSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

// TODO: Add JSDoc
export async function getButteryConfigFile(
  startingDirectory: string,
  options?: { prompt?: boolean }
) {
  const prompt = options?.prompt ?? false;

  // Check for the config file in the .buttery directory
  const butteryDir = getButteryDir(startingDirectory);

  if (!butteryDir && prompt) {
    // TODO: prompt the user to create a buttery config;
  }

  if (!butteryDir) {
    throw "Cannot locate the `.buttery/config` file in your file structure. Please ensure you have created one.";
  }

  // Check for the config file in the .buttery directory
  const configFilePath = path.join(butteryDir, "config.ts");
  const doesConfigFileExist = existsSync(configFilePath);

  if (!doesConfigFileExist && prompt) {
    // TODO: Tell the user a message and prompt to create a buttery config
    throw `Found the .buttery directory at '${butteryDir}'. However, no \`config.ts\` file is present. Please add one.`;
  }

  if (!doesConfigFileExist) {
    throw `Found the .buttery directory at '${butteryDir}'. However, no \`config.ts\` file is present. Please add one.`;
  }

  const file = await readFile(configFilePath, "utf-8");
  const isFileEmpty = file.length === 0;

  if (isFileEmpty && prompt) {
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
