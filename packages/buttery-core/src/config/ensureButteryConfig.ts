import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { LOG } from "../private/index.js";
import type { GetButteryConfigOptions } from "./buttery-config.types.js";
import {
  ERRORS,
  createButteryConfigFile,
  getButteryDir,
  promptUserForButteryDirLocation,
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
export async function ensureButteryConfig<T extends Record<string, unknown>>(
  configNamespace: string,
  options: GetButteryConfigOptions<T> & {
    searchFromPath?: string;
  }
) {
  // Resolve the options to their defaults
  const optionPrompt = options?.prompt ?? false;
  const optionDefaults = options.defaults;
  const optionSearchFromPath = options?.searchFromPath ?? process.cwd();

  // Create the configuration file name out of the namespace
  const configFileName = `buttery-${configNamespace}.config.ts`;

  // Check for the config file in the .buttery directory
  // TODO: Replace with search upwards
  let butteryDir = getButteryDir(optionSearchFromPath);

  // Create a config directory and file based upon the answers that the user is prompted for
  if (!butteryDir && optionPrompt) {
    LOG.warning(ERRORS.NO_BUTTERY_DIR(configFileName, "Let's create one."));
    const userButteryDir = await promptUserForButteryDirLocation(
      optionSearchFromPath
    );

    // set the butteryDir to the path that the user defined
    butteryDir = userButteryDir;

    // create the default config
    await createButteryConfigFile(
      butteryDir,
      configNamespace,
      configFileName,
      optionDefaults
    );
  }

  if (!butteryDir) {
    throw ERRORS.NO_BUTTERY_DIR(
      configFileName,
      "Please ensure you have created one."
    );
  }

  // Check for the config file in the .buttery directory
  const configFilePath = path.resolve(
    butteryDir,
    configNamespace,
    "./config.ts"
  );
  let doesConfigFileExist = existsSync(configFilePath);

  // Create a config file based upon the answers that the user is prompted for
  if (!doesConfigFileExist && optionPrompt) {
    LOG.warning(
      ERRORS.FOUND_BUTTERY_DIR_NO_CONFIG(
        butteryDir,
        configFileName,
        "Let's create one."
      )
    );

    await createButteryConfigFile(
      butteryDir,
      configNamespace,
      configFileName,
      optionDefaults
    );
    doesConfigFileExist = true;
  }

  if (!doesConfigFileExist) {
    throw ERRORS.FOUND_BUTTERY_DIR_NO_CONFIG(
      butteryDir,
      configFileName,
      "Please add one."
    );
  }

  let file = await readFile(configFilePath);
  let isFileEmpty = file.length === 0;

  // Create a config file if the config file is empty
  if (isFileEmpty && optionPrompt) {
    LOG.warning(
      ERRORS.FOUND_EMPTY_CONFIG(
        configFileName,
        configFilePath,
        `Let's populate it.`
      )
    );

    await createButteryConfigFile(
      butteryDir,
      configNamespace,
      configFileName,
      optionDefaults
    );
    file = await readFile(configFilePath);
    isFileEmpty = false;
  }

  if (isFileEmpty) {
    throw ERRORS.FOUND_EMPTY_CONFIG(
      configFileName,
      configFilePath,
      "Please add your config."
    );
  }

  return {
    path: configFilePath,
    name: configFileName,
    content: file,
    directory: butteryDir,
  };
}
