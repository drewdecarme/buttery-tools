import path from "node:path";
import { type ResolvedButteryConfig, getButteryConfig } from "@buttery/core";
import { findDirectoryUpwards } from "@buttery/utils/node";

export type ButteryTokensDirectories = Awaited<
  ReturnType<typeof getButteryTokensDirectories>
>;

/**
 * Does some recursive upwards directory searching for the property buttery tokens
 * directory to start publishing files to. In this case, it first tries to look for the
 * mono repo directory name. If it can't find that we can assume that this package
 * is being used outside the scope of this mono-repo and that the buttery tokens directory
 * is in the node_modules.
 *
 * This is done to easily reconcile development as well as production use. Ideally all
 * we want is to find the "right" buttery/tokens directory to start putting files into
 */
async function getButteryTokensDir() {
  // TODO: Resolve this when the basic is working. Work out the internals of th
  // const localConfig = await getButteryConfig("tokens", {
  //   startingDirectory: import.meta.dirname,
  // });
  // const butteryTokensCliDir = localConfig.paths.butteryDir;
  // console.log({ butteryTokensCliDir });
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
  config: ResolvedButteryConfig<"tokens">
) {
  const butteryTokensDir = await getButteryTokensDir();

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

  return {
    package: butteryTokensDir,
    templateTSConfig: path.resolve(butteryTokensDir, "./tsconfig.json"),
    working: {
      path: workingPath,
      name: workingName,
    },
  };
}
