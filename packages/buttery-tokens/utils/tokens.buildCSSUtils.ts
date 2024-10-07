import path from "node:path";
import {
  type ResolvedButteryConfig,
  writeDynamicDirectoryPackageJSON,
} from "@buttery/config";
import { LOG } from "./logger";
import { buildCSSUtilsTypeScript } from "./tokens.buildCSSUtilsTypeScript";
import type { ButteryTokensDirectories } from "./tokens.getButteryTokensDirectories";

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
        // reconcile the namespace
        const namespace = tokenConfig.namespace ?? "index";
        const namespacedOutDir = path.resolve(
          dirs.output.root,
          "./".concat(namespace)
        );

        // enrich the package.json
        await writeDynamicDirectoryPackageJSON(
          dirs.output.packageJson,
          namespace
        );

        // build the utilities
        await buildCSSUtilsTypeScript(tokenConfig, namespacedOutDir);
      }
  );

  // Create all of the utilities at once.
  for (const createUtilPromise of createCSSUtils) {
    await createUtilPromise();
  }

  LOG.debug("Building CSS utils... done.");
}
