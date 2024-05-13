import { cosmiconfig } from "cosmiconfig";
import type { CLIConfig } from "../lib/types";

import { buildEntry } from "./script.build-entry";
import { buildPackageJson } from "./script.build-package-json";
import { rm } from "fs/promises";
import path from "path";
import type { BuildArgs } from "../scripts/build";
import { buildLib } from "./script.build-lib";
import { buildConfig } from "./script.build-config";

export type BuildScriptArgs = {
  config: CLIConfig;
  argv: BuildArgs;
};

async function getAndParseButteryConfig() {
  try {
    // get the buttery configuration file
    const explorer = cosmiconfig("buttery");
    const configResult = await explorer.search();
    if (!configResult) {
      throw "Cannot parse configuration result.";
    }
    if (configResult.isEmpty) {
      throw "The buttery configuration file is empty.";
    }
    console.log(configResult);
    const config = configResult;
    return config;
  } catch (error) {
    throw new Error(`Error parsing buttery.config file: ${error as string}`);
  }
}

/**
 * This is the main build command that is used to build the
 * the consumer CLI.
 *
 * This has been abstracted out into it's own central function in
 * order to properly dog-food the build process while building
 * the CLI that runs this process. In essence, this command
 * builds the CLI that the consumer is creating AND also
 * builds this CLI that creates the CLI that the consumer
 * is creating. A little CLI inception... if you will ;)
 */
export async function build(parsedArgs: BuildArgs) {
  const configResult = await getAndParseButteryConfig();

  try {
    const { config, filepath: configFilePath } = configResult;
    const params = { config, argv: parsedArgs };

    // delete the entire bin & dist folder to make it fresh
    console.log("Cleaning distribution directories...");
    const foldersToDelete = ["./bin", "./dist"].map((folder) =>
      rm(path.resolve(config.root, folder), {
        recursive: true,
        force: true,
      })
    );
    await Promise.all(foldersToDelete);
    console.log("Cleaning distribution directories... done.");

    await Promise.all([
      buildConfig({ ...params, configFilePath }),
      buildEntry(params),
      // buildCommands(params),
      buildPackageJson(params),
      buildLib(params),
    ]);
  } catch (error) {
    throw new Error(error as string);
  }
}
