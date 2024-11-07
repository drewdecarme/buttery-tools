import { parseAndValidateOptions } from "@buttery/core/utils/node";
import { buildButteryCommands } from "../compiler/buildButteryCommands";
import {
  type ButteryCommandsBuildOptions,
  butteryCommandsBuildOptionsSchema,
} from "../options";
import { getButteryCommandsConfig } from "../utils/getButteryCommandsConfig";
import { getButteryCommandsDirectories } from "../utils/getButteryCommandsDirectories";
import { LOG } from "../utils/utils";

/**
 * Compiles and builds the buttery commands binary
 */
export async function build(options?: Partial<ButteryCommandsBuildOptions>) {
  LOG.loadingStart("Building commands");

  const parsedOptions = parseAndValidateOptions(
    butteryCommandsBuildOptionsSchema,
    options,
    LOG
  );
  LOG.level = parsedOptions.logLevel;

  // Reconcile the buttery config & dirs
  const config = await getButteryCommandsConfig();
  const dirs = getButteryCommandsDirectories(config);

  // build the commands
  await buildButteryCommands(config, dirs, parsedOptions);

  LOG.loadingEnd("complete.");
  LOG.success("Successfully built @buttery/commands!");
}
