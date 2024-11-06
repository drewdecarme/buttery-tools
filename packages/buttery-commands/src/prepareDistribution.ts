import type { ResolvedButteryConfig } from "@buttery/core/config";
import { inlineTryCatch } from "@buttery/core/utils/isomorphic";
import { cleanOutputDirs } from "./compiler/clean-output-dirs";
import type { ButteryCommandsBaseOptions } from "./options";
import { LOG } from "./utils";

/**
 * A script that should be run once to prepare some directories
 * and files. Note that this should only be run once and not run
 * over and over again
 */
export async function prepareDistribution<T extends ButteryCommandsBaseOptions>(
  config: ResolvedButteryConfig<"commands">,
  _options: Required<T>
) {
  LOG.debug("Preparing directories for distribution...");

  // clean the directories
  const cleanResult = await inlineTryCatch(cleanOutputDirs)(config);
  if (cleanResult.hasError) {
    throw cleanResult.error;
  }

  LOG.debug("Preparing directories for distribution... done.");
}
