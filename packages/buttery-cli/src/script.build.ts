import { rm } from "node:fs/promises";
import path from "node:path";
import { cosmiconfig } from "cosmiconfig";
import type { CLIConfig } from "../lib/types";
import type { BuildArgs } from "../scripts/build";
import { buildConfig } from "./script.build-config";
import { buildPackageJson } from "./script.build-package-json";
import { buildProgram } from "./script.build-program";
import { LOG } from "./util.logger";

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
    LOG.debug("Cleaning distribution directories...");
    const foldersToDelete = [
      "./bin/index.js",
      "./bin/buttery-config.js",
      "./bin/commands"
    ].map((folder) =>
      rm(path.resolve(config.root, folder), {
        recursive: true,
        force: true
      })
    );
    await Promise.all(foldersToDelete);
    LOG.debug("Cleaning distribution directories... done.");

    await Promise.all([
      buildConfig({ ...params, configFilePath }),
      buildProgram(params),
      buildPackageJson(params)
    ]);
  } catch (error) {
    const err = new Error(error as string);
    LOG.fatal(err);
    throw err;
  }
}
