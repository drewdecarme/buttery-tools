import type { ButteryLogLevel } from "@buttery/logs";
import { findDirectoryUpwards } from "@buttery/utils/node";
import { tryHandle } from "@buttery/utils/isomorphic";

import { constants, access, mkdir } from "node:fs/promises";
import path from "node:path";

import { LOG } from "./util.logger.js";

import type { ButteryConfigPaths } from "../config/buttery-config.types.js";

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
  outputDirName: string,
  options: { logLevel: ButteryLogLevel }
) {
  if (options?.logLevel) {
    LOG.level = options.logLevel;
  }

  try {
    LOG.debug(
      `Starting to search for "node_modules" at directory "${paths.butteryDir}"`
    );

    const butteryNodeModulesPath = findDirectoryUpwards(
      "node_modules",
      "@buttery",
      {
        startingDirectory: paths.butteryDir,
      }
    );
    if (!butteryNodeModulesPath) {
      throw "Unable to locate `node_modules` in your directory structure. This should not have happened. Please raise a Github issue.";
    }

    LOG.debug(
      `Resolved "node_modules/@buttery" directory: "${butteryNodeModulesPath}"`
    );
    const butteryPackagePath = path.resolve(
      butteryNodeModulesPath,
      `./${outputDirName}`
    );

    const res = await tryHandle(access)(butteryPackagePath, constants.F_OK);
    if (res.hasError) {
      throw `It appears that you might be missing a buttery dependency: Please download "@buttery/${outputDirName}" and try this command again.`;
    }

    LOG.debug(`Ensuring that "@buttery/${outputDirName}" target exists...`, {
      butteryPackagePath,
    });
    await mkdir(butteryPackagePath, { recursive: true });
    LOG.debug(
      `Ensuring that "@buttery/${outputDirName}" target exists... done.`
    );

    return {
      node_modules: path.relative(butteryPackagePath, "../"),
      buttery: butteryPackagePath,
      target: butteryPackagePath,
    };
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
