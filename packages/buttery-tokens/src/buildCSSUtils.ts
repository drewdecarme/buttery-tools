import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { ResolvedButteryConfig } from "@buttery/core/config";
import { buildCSSUtilsTypeScript } from "./buildCSSUtilsTypeScript";
import type { ButteryTokensDirectories } from "./getButteryTokensDirectories";
import { LOG } from "./logger";

export async function buildCSSUtils(
  config: ResolvedButteryConfig<"tokens">,
  dirs: ButteryTokensDirectories
) {
  LOG.debug("Building CSS utils...");

  // convert the tokens to an array
  const allButteryTokensConfigs = Array.isArray(config.tokens)
    ? config.tokens
    : [config.tokens];

  const createCSSUtils = allButteryTokensConfigs.map(
    (tokenConfig) =>
      async function createUtils() {
        // Write the import paths. These are files that will be created in the root
        // of the node modules directory in order for someone to easily  their
        // utilities based upon the namespace they provided
        const exportPathRoot = path.resolve(
          dirs.output.root,
          `./${tokenConfig.namespace}`
        );
        const exportPathContent = `export * from "./dist/${tokenConfig.namespace}/index.js";`;
        const exportPromises = [".js", ".d.ts"].map((fileExt) =>
          writeFile(exportPathRoot.concat(fileExt), exportPathContent)
        );
        await Promise.all(exportPromises);

        // build the utilities to the dist directory
        // inside of the output root directory
        const namespacedOutDir = path.resolve(
          dirs.output.dist,
          "./".concat(tokenConfig.namespace)
        );
        await buildCSSUtilsTypeScript(tokenConfig, namespacedOutDir, dirs);
      }
  );

  // Create all of the utilities at once.
  for (const createUtilPromise of createCSSUtils) {
    await createUtilPromise();
  }

  LOG.debug("Building CSS utils... done.");
}
