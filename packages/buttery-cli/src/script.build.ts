import { cosmiconfig } from "cosmiconfig";
import { CLIConfig } from "../types";

import type { BuildArgs } from "../scripts/util.parse-build-args";
import { buildCommands } from "./script.build-commands";
import { buildEntry } from "./script.build-entry";
import { buildPackageJson } from "./script.build-package-json";

const __dirname = import.meta.dirname;

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
    const config = configResult.config as CLIConfig;
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
  const config = await getAndParseButteryConfig();

  try {
    const params = { config, argv: parsedArgs };

    await Promise.all([
      buildEntry(params),
      buildCommands(params),
      buildPackageJson(params),
    ]);
  } catch (error) {
    throw new Error(error as string);
  }
}
