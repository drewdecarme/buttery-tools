import path from "node:path";
import { ensureDir } from "fs-extra";
import type { ButteryConfigPaths } from "../../config";
import { LOG_CLI } from "../../logger";
import { findDirectoryUpwards } from "../../utils/node";

// search up the directory structure until
// we find the `node_modules` and then search down that until we find the @buttery directory
// we'll stick the build output in there.
export async function getNodeModulesButteryOutputDir(
  paths: ButteryConfigPaths,
  outputDirName: string
) {
  try {
    const startingDirectory = path.resolve(paths.rootDir, "../");
    LOG_CLI.debug(
      `Starting to search for node_modules at directory: ${startingDirectory}`
    );

    const node_modules_path = findDirectoryUpwards("node_modules", undefined, {
      startingDirectory
    });
    if (!node_modules_path) {
      throw "Unable to locate `node_modules` in your directory structure. This should not have happened. Please raise a Github issue.";
    }

    LOG_CLI.debug(`Resolved "node_modules" directory: "${node_modules_path}"`);
    const root = path.resolve(node_modules_path, "./@buttery");
    const target = path.resolve(root, `./${outputDirName}`);

    LOG_CLI.debug("Ensuring that `node_modules` target exists", { target });
    await ensureDir(target);
    LOG_CLI.debug("Ensuring that `node_modules` target exists... done.");

    return {
      root,
      target
    };
  } catch (error) {
    throw LOG_CLI.fatal(new Error(error as string));
  }
}
