import { existsSync, lstatSync } from "node:fs";
import path from "node:path";
import { confirm } from "@inquirer/prompts";
import { LOG } from "../private/LOG.js";
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
    return `Found the ".buttery" directory at "${butteryDirPath}". However, no "${configFileName}" file is present. ${
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
 * Capitalizes the first letter
 */
function cap(str: string) {
  if (!str) return str; // Handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function waitForUserToConfirm(filename: string) {
  const shouldContinue = await confirm({
    message: "Would you like to continue?",
  });
  if (!shouldContinue) {
    throw `User cancelled auto "${filename}" creation.`;
  }
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
    const butteryConfigPath = path.resolve(
      butteryDir,
      configNamespace,
      butteryConfigFileName
    );
    LOG.debug(`Creating ${butteryConfigFileName} at "${butteryConfigPath}"...`);
    const butteryImport = `define${cap(configNamespace)}Config`;
    const butteryModule = `@buttery/${configNamespace}`;
    const butteryConfigContent = `import { ${butteryImport} } from "${butteryModule}"
export default ${butteryImport}(${JSON.stringify(defaults, null, 2)})\n`;

    await writeFileRecursive(butteryConfigPath, butteryConfigContent);
    LOG.debug(
      `Creating ${butteryConfigFileName} at "${butteryConfigPath}"... done.`
    );
  } catch (error) {
    throw `Error when trying to create a "${butteryConfigFileName}" file: ${error}`;
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
