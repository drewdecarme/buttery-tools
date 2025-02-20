import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { confirm } from "@inquirer/prompts";
import { findDirectoryUpwards, writeFileRecursive } from "@buttery/utils/node";
import { exhaustiveMatchGuard } from "@buttery/utils/isomorphic";

import type {
  GetButteryConfigOptionExtensions,
  GetButteryConfigOptions,
} from "./buttery-config.types.js";

import { LOG } from "../utils/util.logger.js";

/**
 * Capitalizes the first letter
 */
function cap(str: string) {
  if (!str) return str; // Handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Waits for the user to confirm if they want to move forward with
 * the current process
 */
async function waitForUserToConfirm(filename: string) {
  const shouldContinue = await confirm({
    message: "Would you like to continue?",
  });
  if (!shouldContinue) {
    throw `User cancelled auto "${filename}" creation.`;
  }
}

function getConfigFileName<
  T extends Required<
    Pick<GetButteryConfigOptions<T>, "extension" | "configPrefix">
  >
>(namespace: string, options: T) {
  const configFileName = `${
    options.configPrefix ?? ""
  }buttery-${namespace}.config`;

  switch (options.extension) {
    case "ts":
      return configFileName.concat(".ts");

    case "json":
      return configFileName.concat(".json");

    default:
      return exhaustiveMatchGuard(options.extension);
  }
}

/**
 * An object that easily formats errors
 */
const ENSURE_ERRORS = {
  NO_BUTTERY_DIR(configFileName: string, postfix?: string) {
    return `Cannot locate the "${configFileName}" file in your file structure. ${
      postfix ?? ""
    }`;
  },
  NO_CONFIG(butteryDirPath: string, configFileName: string, postfix?: string) {
    return `Found the ".buttery" directory at "${butteryDirPath}". However, no "${configFileName}" file is present. ${
      postfix ?? ""
    }`;
  },
  EMPTY_CONFIG(
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
 * Provided a directory and an array of buttery configuration keys,
 * this function creates a default buttery config in the directory
 * with the defaults that map directly to the provided config keys
 */
async function createButteryConfigFile<T extends Record<string, unknown>>(
  butteryDir: string,
  configNamespace: string,
  extension: GetButteryConfigOptionExtensions,
  butteryConfigFileName: string,
  onEmpty: GetButteryConfigOptions<T>["onEmpty"]
) {
  try {
    // Run the onEmpty handle to get a well formed config
    const awaitedConfig = await onEmpty();

    // crete the buttery/config content
    const butteryConfigPath = path.resolve(
      butteryDir,
      configNamespace,
      butteryConfigFileName
    );
    LOG.debug(`Creating ${butteryConfigFileName} at "${butteryConfigPath}"...`);
    const butteryImport = `define${cap(configNamespace)}Config`;
    const butteryModule = `@buttery/${configNamespace}`;
    let butteryConfigContent = "";

    // Depending upon the extension the file content will change
    switch (extension) {
      case "ts":
        butteryConfigContent = `import { ${butteryImport} } from "${butteryModule}"
export default ${butteryImport}(${JSON.stringify(awaitedConfig, null, 2)})\n`;
        break;

      case "json":
        butteryConfigContent = JSON.stringify(awaitedConfig, null, 2);
        break;

      default:
        exhaustiveMatchGuard(extension);
    }

    await writeFileRecursive(butteryConfigPath, butteryConfigContent);
    LOG.debug(
      `Creating ${butteryConfigFileName} at "${butteryConfigPath}"... done.`
    );
  } catch (error) {
    throw `Error when trying to create a "${butteryConfigFileName}" file: ${error}`;
  }
}

/**
 * Starts from a provided starting and searches up the directory structure to
 * find a .buttery/ directory, a .config file inside of it and then resolves the config if
 * is populated with content. At any point in time the necessary directories, files or file requirements
 * aren't met, it will throw.
 *
 * However, if a `option.prompt` is passed into the function, the function will then prompt the
 * user for any missing information to ensure the necessary files are created and then subsequently used.
 */
export async function ensureButteryConfig<T extends Record<string, unknown>>(
  configNamespace: string,
  options: Pick<
    GetButteryConfigOptions<T>,
    "prompt" | "onEmpty" | "extension"
  > & {
    searchFromPath?: string;
    configPrefix?: string;
  }
) {
  // Resolve the options to their defaults
  const optionPrompt = options?.prompt ?? false;
  const optionSearchFromPath = options?.searchFromPath ?? process.cwd();
  const optionExtension = options.extension ?? "ts";

  // Create the configuration file name out of the namespace
  const configFileName = getConfigFileName(configNamespace, {
    extension: optionExtension,
    configPrefix: options.configPrefix ?? "",
  });

  // Check for the config file in the .buttery directory
  let butteryDir = findDirectoryUpwards(".buttery", undefined, {
    startingDirectory: optionSearchFromPath,
  });
  // let butteryDir = getButteryDir(optionSearchFromPath);

  // Create a config directory and file based upon the answers that the user is prompted for
  if (!butteryDir && optionPrompt) {
    LOG.debug('".buttery" dir not found. User will be prompted');
    const postfix = `A "${configFileName}" file will be created for you.`;
    LOG.warning(ENSURE_ERRORS.NO_BUTTERY_DIR(configFileName, postfix));
    await waitForUserToConfirm(configFileName);

    butteryDir = path.resolve(optionSearchFromPath, "./.buttery");

    // create the default config
    await createButteryConfigFile(
      butteryDir,
      configNamespace,
      optionExtension,
      configFileName,
      options.onEmpty
    );
  }

  if (!butteryDir) {
    LOG.debug('".buttery" dir not found. User will NOT be prompted');
    const postfix = "Please ensure you have created one.";
    throw ENSURE_ERRORS.NO_BUTTERY_DIR(configFileName, postfix);
  }

  // Check for the config file in the .buttery directory
  const configFilePath = path.resolve(
    butteryDir,
    configNamespace,
    configFileName
  );
  let doesConfigFileExist = existsSync(configFilePath);

  // Create a config file based upon the answers that the user is prompted for
  if (!doesConfigFileExist && optionPrompt) {
    LOG.debug(`"${configFileName}" not found. User will be prompted`);
    const postfix = "Let's create one.";
    LOG.warning(ENSURE_ERRORS.NO_CONFIG(butteryDir, configFileName, postfix));
    await waitForUserToConfirm(configFileName);

    await createButteryConfigFile(
      butteryDir,
      configNamespace,
      optionExtension,
      configFileName,
      options.onEmpty
    );
    doesConfigFileExist = true;
  }

  if (!doesConfigFileExist) {
    LOG.debug(`"${configFileName}" not found. User will NOT be prompted`);
    const postfix = "Please add one.";
    throw ENSURE_ERRORS.NO_CONFIG(butteryDir, configFileName, postfix);
  }

  let file = await readFile(configFilePath);
  let isFileEmpty = file.length === 0;

  // Create a config file if the config file is empty
  if (isFileEmpty && optionPrompt) {
    LOG.debug(`"${configFileName}" is empty found. User will be prompted`);
    const postfix = `Let's populate it.`;
    LOG.warning(
      ENSURE_ERRORS.EMPTY_CONFIG(configFileName, configFilePath, postfix)
    );
    await waitForUserToConfirm(configFileName);

    await createButteryConfigFile(
      butteryDir,
      configNamespace,
      optionExtension,
      configFileName,
      options.onEmpty
    );
    file = await readFile(configFilePath);
    isFileEmpty = false;
  }

  if (isFileEmpty) {
    LOG.debug(`"${configFileName}" is empty found. User will NOT be prompted`);
    const postfix = "Please add your config.";
    throw ENSURE_ERRORS.EMPTY_CONFIG(configFileName, configFilePath, postfix);
  }

  return {
    path: configFilePath,
    name: configFileName,
    content: file,
    directory: butteryDir,
  };
}
