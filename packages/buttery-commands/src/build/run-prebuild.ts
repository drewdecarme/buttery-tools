import path from "node:path";
import { rm, writeFile } from "node:fs/promises";

import { ensureDir } from "fs-extra";
import { tryHandle } from "@buttery/utils/isomorphic";
import { printAsBullets } from "@buttery/logs";

import type { ResolvedButteryCommandsConfig } from "../config/getButteryCommandsConfig.js";
import type { ButteryCommandsBaseOptions } from "../cli-scripts/_cli-scripts.utils.js";
import { LOG } from "../utils/LOG.js";

/**
 * Cleans out some of the production directories that distribute
 * the build and runtime versions of the commands so we're working
 * with the most recent set.
 */
export async function cleanOutputDirs(rConfig: ResolvedButteryCommandsConfig) {
  try {
    const dirsToClean = ["./bin"].map((dir) =>
      path.resolve(rConfig.paths.rootDir, dir)
    );
    LOG.debug(
      `Cleaning the following directories for a clean build: ${printAsBullets(
        dirsToClean
      )}`
    );
    const cleanFoldersFn = dirsToClean.map((folder) =>
      rm(path.resolve(rConfig.paths.rootDir, folder), {
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
 * and files in order to build the runtime
 */
export async function runPreBuild<T extends ButteryCommandsBaseOptions>(
  rConfig: ResolvedButteryCommandsConfig,
  _options: Required<T>
) {
  // clean the directories
  const cleanResult = await tryHandle(cleanOutputDirs)(rConfig);
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
  await ensureDir(rConfig.dirs.binDir);
  LOG.debug("Re-initializing the binary directory... done.");
  const runtimeEntryPath = path.join(rConfig.dirs.binDir, "./index.js");
  const runtimeEntryContent = `import run from "@buttery/commands/runtime";
import manifest from "./manifest.js";

// run the CLI against the manifest
run(manifest, { cwd: import.meta.dirname });
`;
  LOG.debug("Creating the entry path to the commands runtime...");
  const createRuntimeEntry = await tryHandle(writeFile)(
    runtimeEntryPath,
    runtimeEntryContent
  );
  if (createRuntimeEntry.hasError) {
    LOG.error("Error when trying to create the runtime entry file");
    throw createRuntimeEntry.error;
  }
  LOG.debug("Creating the entry path to the commands runtime...");
}
