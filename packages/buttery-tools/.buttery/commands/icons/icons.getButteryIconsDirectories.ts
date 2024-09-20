import path from "node:path";
import { ensureDir } from "fs-extra";
import { findDirectoryUpwards } from "../../../utils/node";
import type { ResolvedButteryConfig } from "../_buttery-config";
import { LOG } from "../_logger";
import {
  getButteryArtifactsDir,
  getNodeModulesButteryOutputDir
} from "../_utils";

export type ButteryIconsDirectories = Awaited<
  ReturnType<typeof getButteryIconsDirectories>
>;

/**
 * This function, depending upon the context where teh `buttery tokens dev|build` commands
 * are run, will find the root directory at which to create the `.buttery-tokens` directory
 * that will contain all of the dynamically generated files needed to import and run
 * any `make` utilities.
 */
async function getIconsOutputDir(config: ResolvedButteryConfig<"icons">) {
  // search up the directory structure until
  // we find the `node_modules` and then search down that until we find the @buttery directory
  // we'll stick the build output in there.
  const startingDirectory = path.resolve(config.paths.rootDir, "../");
  LOG.debug(
    `Starting to search for node_modules at directory: ${startingDirectory}`
  );

  const node_modules_path = findDirectoryUpwards("node_modules", undefined, {
    startingDirectory
  });
  if (!node_modules_path) {
    throw LOG.fatal(
      new Error(
        "Unable to locate `node_modules` in your directory structure. This should not have happened. Please raise a Github issue."
      )
    );
  }

  LOG.debug(`Resolved "node_modules" directory: "${node_modules_path}"`);

  // resolve the @buttery/tokens directory
  const namespace = config.icons.namespace
    ? "/".concat(config.icons.namespace)
    : "";
  const nodeModulesButteryDir = path.resolve(
    node_modules_path,
    "./@buttery/icons".concat(namespace)
  );
  await ensureDir(nodeModulesButteryDir);
  return nodeModulesButteryDir;
}

export async function getButteryIconsDirectories(
  config: ResolvedButteryConfig<"icons">
) {
  const outputDirs = await getNodeModulesButteryOutputDir(
    config.paths,
    "icons"
  );
  const artifactsDir = await getButteryArtifactsDir(
    import.meta.dirname,
    "buttery-icons"
  );

  return {
    entry: {
      svgDir:
        config.icons.svgDir ?? path.resolve(config.paths.butteryDir, "./icons")
    },
    artifacts: {
      root: artifactsDir
    },
    output: {
      root: outputDirs.target,
      packageJson: path.resolve(outputDirs.target, "./package.json"),
      tsConfig: path.resolve(outputDirs.target, "./tsconfig.json"),
      /**
       * The path where all of the generated React components will be stored
       */
      generated: path.resolve(outputDirs.target, "./generated")
    }
  };
}
