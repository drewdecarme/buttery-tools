import { rm } from "node:fs/promises";
import path from "node:path";
import type { ResolvedButteryConfig } from "@buttery/core/config";
import { printAsBullets } from "@buttery/core/logger";
import { LOG } from "../utils.js";

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
