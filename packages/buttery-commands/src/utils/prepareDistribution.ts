import { rm } from "node:fs/promises";
import path from "node:path";
import type { ResolvedButteryConfig } from "@buttery/core/config";
import { printAsBullets } from "@buttery/core/logger";
import { inlineTryCatch } from "@buttery/core/utils/isomorphic";
import type { ButteryCommandsBaseOptions } from "../options";
import { LOG } from "./utils";

/**
 * Cleans out some of the production directories that distribute
 * the build and runtime versions of the commands so we're working
 * with the most recent set.
 */
export async function cleanOutputDirs(
  config: ResolvedButteryConfig<"commands">
) {
  try {
    const dirsToClean = ["./bin"].map((dir) =>
      path.resolve(config.paths.rootDir, dir)
    );
    LOG.debug(
      `Cleaning the following directories for a clean build: ${printAsBullets(
        dirsToClean
      )}`
    );
    const cleanFoldersFn = dirsToClean.map((folder) =>
      rm(path.resolve(config.paths.rootDir, folder), {
        recursive: true,
        force: true,
      })
    );
    await Promise.all(cleanFoldersFn);
    LOG.debug("Cleaning the following directories for a clean build. done.");
  } catch (error) {
    LOG.error("Error when trying to clean out the directories.");
    throw new Error(String(error));
  }
}

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
