import path from "node:path";
import type { ResolvedButteryConfig } from "@buttery/core";
import { findDirectoryUpwards } from "@buttery/utils/node";
import type { ButteryTokensConfig } from "./tokens.getButteryTokensConfig";

export type ButteryTokensDirectories = Awaited<
  ReturnType<typeof getButteryTokensDirectories>
>;

/**
 * Does some recursive upwards directory searching for the correct buttery tokens
 * directory to start publishing files to. In this case, it first tries to look for the
 * mono repo directory name. If it can't find that we can assume that this package
 * is being used outside the scope of this mono-repo and that the buttery tokens directory
 * is in the node_modules.
 *
 * This is done to easily reconcile development as well as production use. Ideally all
 * we want is to find the "right" buttery/tokens directory to start putting files into
 */
async function getButteryTokensDir(
  config: ResolvedButteryConfig<"tokens">,
  isLocal: boolean
) {
  if (isLocal) {
    const butteryTokensCliDir = path.resolve(
      config.paths.rootDir,
      "./.buttery-tokens"
    );
    console.log(config.paths);
    return butteryTokensCliDir;
  }

  const butteryTokensPackageDir = findDirectoryUpwards("buttery-tokens");
  const butteryNodeModulesDir = findDirectoryUpwards(
    "node_modules",
    "@buttery"
  );
  if (butteryTokensPackageDir) {
    return butteryTokensPackageDir;
  }
  if (!butteryTokensPackageDir) {
    return butteryNodeModulesDir;
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
  const butteryTokensDir = await getButteryTokensDir(config, isLocal);

  if (!butteryTokensDir) {
    throw "Cannot locate a `@buttery/tokens` directory. This should not have happened.";
  }

  const workingName = config.tokens.importName ?? "index";
  const workingPath = path.resolve(
    butteryTokensDir,
    "./.buttery-tokens",
    workingName
  );
  // const workingPathSrc = path.resolve(workingPath, "./src");
  // const workingPathDist = path.resolve(workingPath, "./dist");

  const outputPath = path.resolve(butteryTokensDir, workingName);

  return {
    // TODO: Need a better name for package
    root: butteryTokensDir,
    templateTSConfig: path.resolve(butteryTokensDir, "./tsconfig.json"),
    working: {
      path: workingPath,
      name: workingName,
      css: path.resolve(workingPath, "./index.css"),
    },
    /**
     * Where the generated token files will be placed
     */
    output: {
      path: outputPath,
      css: path.resolve(outputPath, "./index.css"),
    },
  };
}
