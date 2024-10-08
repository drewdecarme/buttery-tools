import { getButteryConfig } from "@buttery/config";
import { LOG_COMMANDS } from "../commands/commands.log.js";
import { buildCommandsCleanDistributionDirs } from "./build-commands.clean-distribution-dirs.js";
import { buildCommandsCreateBinary } from "./build-commands.create-binary.js";
import { buildCommandsEnrichPackageJson } from "./build-commands.enrich-package-json.js";
import type {
  CommandsBuildFunctionArgs,
  CommandsBuildOptions,
} from "./build-commands.utils";
/**
 * This function is the main build command that reads the .buttery/config
 * parses the commands directory and then builds the binary. This command
 * is also used locally to build the commands that build the commands.
 */
export async function buildCommands(options: CommandsBuildOptions) {
  const config = await getButteryConfig("commands");
  LOG_COMMANDS.debug(`Using config: ${config.paths.config}`);

  const args: CommandsBuildFunctionArgs = {
    config,
    options,
  };

  // clean the distribution dirs
  await buildCommandsCleanDistributionDirs(args);

  // enrich the local package.json and build the binary directory
  await Promise.all([
    buildCommandsEnrichPackageJson(args),
    buildCommandsCreateBinary(args),
  ]);
}
