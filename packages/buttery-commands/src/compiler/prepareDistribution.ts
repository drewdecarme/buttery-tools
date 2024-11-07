import { rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ResolvedButteryConfig } from "@buttery/core/config";
import { printAsBullets } from "@buttery/core/logger";
import { inlineTryCatch } from "@buttery/core/utils/isomorphic";
import { ensureDir } from "fs-extra";
import type { ButteryCommandsBaseOptions } from "../options";
import type { ButteryCommandsDirectories } from "../utils/getButteryCommandsDirectories";
import { LOG } from "../utils/utils";

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
  dirs: ButteryCommandsDirectories,
  _options: Required<T>
) {
  // clean the directories
  const cleanResult = await inlineTryCatch(cleanOutputDirs)(config);
  if (cleanResult.hasError) {
    throw cleanResult.error;
  }

  // Create the entry file
  // The reason that we want to do this here is that when we build
  // the program outside of the context of this repo, we want to make sure
  // the entry file is placed inside of the bin directory of the repo that
  // is going to run the CLI.
  //
  // If we did this during the runtime build, the runtime entry file wouldn't
  // be available since it would be in the @buttery/commands/bin directory instead
  // of the directory that the @buttery/commands framework is targeting.
  LOG.debug("Re-initializing the binary directory...");
  await ensureDir(dirs.binDir);
  LOG.debug("Re-initializing the binary directory... done.");
  const runtimeEntryPath = path.join(dirs.binDir, "./index.js");
  const runtimeEntryContent = `import run from "@buttery/commands/runtime";
const manifestModule = await import("./command-manifest.js");
run(manifestModule.default);
`;
  LOG.debug("Creating the entry path to the commands runtime...");
  const createRuntimeEntry = await inlineTryCatch(writeFile)(
    runtimeEntryPath,
    runtimeEntryContent
  );
  if (createRuntimeEntry.hasError) {
    LOG.error("Error when trying to create the runtime entry file");
    throw createRuntimeEntry.error;
  }
  LOG.debug("Creating the entry path to the commands runtime...");
}
