import { existsSync, lstatSync } from "node:fs";
import path from "node:path";
import input from "@inquirer/input";
import { writeFileRecursive } from "../utils/node/util.node.writeFileRecursive.js";

export const ERRORS = {
  NO_BUTTERY_DIR(configFileName: string, postfix?: string) {
    return `Cannot locate the "${configFileName}" file in your file structure. ${
      postfix ?? ""
    }`;
  },
  FOUND_BUTTERY_DIR_NO_CONFIG(
    butteryDirPath: string,
    configFileName: string,
    postfix?: string
  ) {
    return `Found the .buttery directory at "${butteryDirPath}". However, no "${configFileName}" file is present. ${
      postfix ?? ""
    }`;
  },
  FOUND_EMPTY_CONFIG(
    configFileName: string,
    configFilePath: string,
    postfix?: string
  ) {
    return `Found "${configFileName}" file at "${configFilePath}". However, this file is empty. ${
      postfix ?? ""
    }`;
  },
};

/**
 * Asks the user to write a location for the path of where the buttery directory
 * should be placed. Returns the resolved .buttery/ directory.
 */
export async function promptUserForButteryDirLocation(
  startingDirectory: string
) {
  const baseDir = await input({
    message: "In what directory would you like to create one?",
    default: startingDirectory,
  });
  const butteryDir = path.resolve(baseDir, "./.buttery");
  return butteryDir;
}

/**
 * Capitalizes the first letter
 */
function cap(str: string) {
  if (!str) return str; // Handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Provided a directory and an array of buttery configuration keys,
 * this function creates a default buttery config in the directory
 * with the defaults that map directly to the provided config keys
 */
export async function createButteryConfigFile<
  T extends Record<string, unknown>
>(
  butteryDir: string,
  configNamespace: string,
  butteryConfigFileName: string,
  defaults: T
) {
  try {
    // crete the buttery/config content
    const butteryConfigPath = path.resolve(butteryDir, butteryConfigFileName);
    const butteryImport = `define${cap(configNamespace)}Config`;
    const butteryModule = `@buttery/${configNamespace}`;
    const butteryConfigContent = `import { ${butteryImport} } from "${butteryModule}"
export default ${butteryImport}(${JSON.stringify(defaults, null, 2)})\n`;

    await writeFileRecursive(butteryConfigPath, butteryConfigContent);
  } catch (error) {
    throw `Error when trying to create a default ".buttery/config" file: ${error}`;
  }
}

export /**
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
