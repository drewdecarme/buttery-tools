import path from "node:path";
import { findDirectoryUpwards } from "@buttery/utils/node";
import { ensureDir } from "fs-extra";
import type { ButteryConfigPaths } from "./buttery-config.types";
import { LOG } from "./buttery-config.utils";

/**
 * Searches up the directory structure starting at the package root
 * which is one directory up from the `.buttery` directory. It will
 * attempt to find the `node_modules` directory that has the scoped
 * `@buttery` directory inside of it. If it doesn't find the scoped
 * directory, it will continue searching up the directory structure
 * until it finds it.
 *
 * This function is crucial in locating the necessary static artifacts
 * required to copy files, run apps, etc... from the CLI.
 */
export async function getNodeModulesButteryOutputDir(
  paths: ButteryConfigPaths,
  outputDirName: string
) {
  try {
    const startingDirectory = path.resolve(paths.rootDir, "../");
    LOG.debug(
      `Starting to search for node_modules at directory: ${startingDirectory}`
    );

    const node_modules_path = findDirectoryUpwards("node_modules", undefined, {
      startingDirectory,
    });
    if (!node_modules_path) {
      throw "Unable to locate `node_modules` in your directory structure. This should not have happened. Please raise a Github issue.";
    }

    LOG.debug(`Resolved "node_modules" directory: "${node_modules_path}"`);
    const root = path.resolve(node_modules_path, "./@buttery");
    const target = path.resolve(root, `./${outputDirName}`);

    LOG.debug("Ensuring that `node_modules` target exists", { target });
    await ensureDir(target);
    LOG.debug("Ensuring that `node_modules` target exists... done.");

    return {
      root,
      target,
    };
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
