import { getButteryConfig } from "@buttery/core";
import { buildCommandsCleanDistributionDirs } from "./build-commands.clean-distribution-dirs.js";
import { buildCommandsCreateBinary } from "./build-commands.create-binary.js";
import { buildCommandsEnrichPackageJson } from "./build-commands.enrich-package-json.js";
import type {
  CommandsBuildFunctionArgs,
  CommandsBuildOptions,
} from "./build-commands.utils";
import { LOG } from "./utils.js";
/**
 * This function is the main build command that reads the .buttery/config
 * parses the commands directory and then builds the binary. This command
 * is also used locally to build the commands that build the commands.
 */
export async function buildCommands(options: CommandsBuildOptions) {
  const config = await getButteryConfig("commands");
  LOG.debug(`Using config: ${config.paths.config}`);

  const args: CommandsBuildFunctionArgs = {
    config,
    options,
  };

  // clean the distribution dirs
  await buildCommandsCleanDistributionDirs(args);

  // enrich the local package.json and build the binary directory
  Promise.all([
    buildCommandsEnrichPackageJson(args),
    buildCommandsCreateBinary(args),
  ]);
}
