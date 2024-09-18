import path from "node:path";
import { findDirectoryUpwards } from "../../../utils/node";
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
async function getTokensBuildRootDir(
  config: ButteryTokensConfig,
  isLocal: boolean
) {
  // CONTEXT - Run in context to THIS package - tokens for the docs and tokens playground UI
  //
  // If we're building this stuff locally we can just the .buttery-tokens build files
  // this folder. Same goes
  if (isLocal) {
    return path.resolve(config.paths.rootDir, "./artifacts/tokens");
  }

  // CONTEXT - Run in context of THIS monorepo
  //
  // if we're building the buttery tokens in this mono-repo for other buttery packages
  // it means that we're going to run the CLI from the buttery-tokens package so
  // we're going to stick the build output in there
  const butteryTokensPackageDir = findDirectoryUpwards("buttery-tokens");
  if (butteryTokensPackageDir) return butteryTokensPackageDir;

  // CONTEXT - Run in context of a project that has downloaded this from the npm registry
  //
  // if we're running the buttery tokens dev|build command _outside_ of the context
  // of the mono-repo then we're going to search up the directory structure until
  // we find the node_modules and then search down that until we find the @buttery directory
  // we'll stick the build output in there.
  const butteryNodeModulesDir = findDirectoryUpwards(
    "node_modules",
    "@buttery"
  );
  if (butteryNodeModulesDir) {
    return path.resolve(butteryNodeModulesDir, "./tokens");
  }
  return undefined;
}

export async function getButteryTokensDirectories(
  config: ButteryTokensConfig,
  options: {
    isLocal: boolean;
  }
) {
  const isLocal = options?.isLocal ?? false;
  const butteryTokensBuildRootDir = await getTokensBuildRootDir(
    config,
    isLocal
  );

  if (!butteryTokensBuildRootDir) {
    throw "Cannot locate a tokens directory to build the utilities to. This should not have happened.";
  }

  const outputDirName = config.tokens.importName;

  const getOutputPath = (importName: string | undefined) =>
    path.resolve(butteryTokensBuildRootDir, importName ?? "index");
  const outputDirPath = getOutputPath(outputDirName);

  // the playground sits in the root of this repo
  const tokenArtifactsDir = findDirectoryUpwards("artifacts", undefined, {
    startingDirectory: import.meta.dirname
  });
  if (!tokenArtifactsDir) {
    throw "Cannot locate `artifacts` directory to launch the interactive playground. This should not have happened. Please log a Github issue.";
  }

  const artifactsRootDir = path.resolve(tokenArtifactsDir, "./tokens");

  const artifactsPlaygroundRoot = path.resolve(
    artifactsRootDir,
    "./playground"
  );
  const artifactsMakeTemplatesRoot = path.resolve(
    artifactsRootDir,
    "./make-templates"
  );
  const artifactsLibraryRoot = path.resolve(artifactsRootDir, "./library");

  return {
    /**
     * The root dir where a .buttery-tokens directory will be created.
     * This directory will contain the output of the `make` utilities
     */
    root: {
      path: butteryTokensBuildRootDir,
      tsConfigPath: path.resolve(butteryTokensBuildRootDir, "./tsconfig.json")
    },
    /**
     * The UI for the configuration UI playground. We provide the location
     * of the template and then the location of the dynamically created app root
     * and public path to feed to the createServer vite function.
     */
    artifacts: {
      root: artifactsRootDir,
      playground: {
        root: artifactsPlaygroundRoot
      },
      library: {
        root: artifactsLibraryRoot
      },
      "make-templates": {
        root: artifactsMakeTemplatesRoot
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
      path: outputDirPath,
      name: outputDirName,
      getOutputPath,
      cssFilePath: path.resolve(outputDirPath, "./index.css")
    }
  };
}
