import path from "node:path";
import { ensureDir } from "fs-extra";
import { findDirectoryUpwards } from "../../../utils/node";
import { LOG } from "../_logger/util.ts.logger";
import type { ButteryTokensConfig } from "./tokens.getButteryTokensConfig";

export type ButteryTokensDirectories = Awaited<
  ReturnType<typeof getButteryTokensDirectories>
>;

/**
 * This function, depending upon the context where teh `buttery tokens dev|build` commands
 * are run, will find the root directory at which to create the `.buttery-tokens` directory
 * that will contain all of the dynamically generated files needed to import and run
 * any `make` utilities.
 */
async function getTokensOutputDir(config: ButteryTokensConfig) {
  // search up the directory structure until
  // we find the `node_modules` and then search down that until we find the @buttery directory
  // we'll stick the build output in there.
  const nodeModules = findDirectoryUpwards("node_modules");
  if (!nodeModules) {
    throw LOG.fatal(
      new Error(
        "Unable to locate `node_modules` in your directory structure. This should not have happened. Please raise a Github issue."
      )
    );
  }

  // resolve the @buttery/tokens directory
  const namespace = config.tokens.namespace
    ? "/".concat(config.tokens.namespace)
    : "";
  const nodeModulesButteryDir = path.resolve(
    nodeModules,
    "./@buttery/tokens".concat(namespace)
  );
  await ensureDir(nodeModulesButteryDir);
  return nodeModulesButteryDir;
}

export async function getButteryTokensDirectories(config: ButteryTokensConfig) {
  const tokensOutDir = await getTokensOutputDir(config);

  console.log(tokensOutDir);

  if (!tokensOutDir) {
    throw "Cannot locate a tokens directory to build the utilities to. This should not have happened.";
  }

  // the playground sits in the root of this repo
  const tokensLib = findDirectoryUpwards("lib", "buttery-tokens", {
    startingDirectory: import.meta.dirname
  });
  if (!tokensLib) {
    throw "Cannot locate the tokens library assets to launch the interactive playground. This should not have happened. Please log a Github issue.";
  }

  const tokensLibPlaygroundRoot = path.resolve(tokensLib, "./playground");

  return {
    root: {
      path: tokensOutDir,
      tsConfigPath: path.resolve(tokensOutDir, "./tsconfig.json")
    },
    /**
     * The UI for the configuration UI playground. We provide the location
     * of the template and then the location of the dynamically created app root
     * and public path to feed to the createServer vite function.
     */
    artifacts: {
      root: tokensLib,
      playground: {
        root: tokensLibPlaygroundRoot
      }
    },
    /**
     * The directory where the buttery token utilities
     * are built to. This would include the barrel file
     * that exports all of the `make` utilities as well as
     * the tokens CSS :root declaration that can be imported
     * in to make sure the app has the CSS variables that we're
     * created
     */
    output: {
      path: tokensOutDir,
      cssFilePath: path.resolve(tokensOutDir, "./index.css")
    }
  };
}
