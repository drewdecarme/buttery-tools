import { inlineTryCatch } from "@buttery/core/utils/isomorphic";
import { parseAndValidateOptions } from "@buttery/core/utils/node";
import { compileCommands } from "../compiler/compile-commands";
import {
  type ButteryCommandsBuildOptions,
  butteryCommandsBuildOptionsSchema,
} from "../options";
import { LOG } from "../utils";

/**
 * Compiles and builds the buttery commands binary
 */
export async function build(options: ButteryCommandsBuildOptions) {
  const parsedOptions = parseAndValidateOptions(
    butteryCommandsBuildOptionsSchema,
    options,
    LOG
  );
  LOG.level = parsedOptions.logLevel;

  // compile the command directories
  LOG.loadingStart("Building command directories");
  const result = await inlineTryCatch(compileCommands)(parsedOptions);
  if (result.hasError) {
    throw LOG.fatal(result.error);
  }
  LOG.loadingEnd("complete.");
  LOG.success("Successfully built @buttery/commands!");
}
