import { writeFile } from "node:fs/promises";

import { buildCSSUtilsTypeScript } from "./buildCSSUtilsTypeScript.js";

import type { ResolvedButteryTokensConfig } from "../config/getButteryTokensConfig.js";
import { LOG } from "../utils/util.logger.js";

export async function buildCSSUtils(rConfig: ResolvedButteryTokensConfig) {
  LOG.debug("Building CSS utils...");

  // Write the import paths. These are files that will be created in the root
  // of the node modules directory in order for someone to easily  their
  // utilities based upon the namespace they provided
  const exportPathContent = `export * from "./dist/${rConfig.config.runtime.namespace}/index.js";`;
  const exportPromises = [".js", ".d.ts"].map((fileExt) =>
    writeFile(rConfig.dirs.output.namespace.concat(fileExt), exportPathContent)
  );
  await Promise.all(exportPromises);

  // build the utilities to the dist directory
  // inside of the output root directory
  await buildCSSUtilsTypeScript(rConfig);

  LOG.debug("Building CSS utils... done.");
}
