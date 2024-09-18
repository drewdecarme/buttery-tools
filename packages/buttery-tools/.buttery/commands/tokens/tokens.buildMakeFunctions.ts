import type { ResolvedButteryConfig } from "../_buttery-config";
import { LOG } from "../_logger/util.ts.logger";
import { buildMakeFunctionsFromTemplates } from "./tokens.buildMakeFunctionsFromTemplates";
import { buildMakeFunctionsOutputDirectory } from "./tokens.buildMakeFunctionsOutputDirectory";
import { getButteryTokensDirectories } from "./tokens.getButteryTokensDirectories";

export async function buildMakeFunctions(
  { tokens, ...restConfig }: ResolvedButteryConfig<"tokens">,
  options: { isLocal: boolean }
) {
  LOG.debug("Building make functions...");
  // convert the tokens to an array
  const tokensConfig = Array.isArray(tokens) ? tokens : [tokens];

  await Promise.all(
    tokensConfig.map(async (t) => {
      const iConfig = { ...restConfig, tokens: t };
      const dirs = await getButteryTokensDirectories(iConfig, {
        isLocal: options.isLocal
      });

      LOG.debug(`Building "${iConfig.tokens.importName ?? "index"}"`);

      // Create the make functions output directory
      await buildMakeFunctionsOutputDirectory(dirs, {
        isLocal: options.isLocal
      });

      // build the make functions from the registered templates.
      await buildMakeFunctionsFromTemplates(iConfig, dirs);
    })
  );

  LOG.success("Building make functions... complete.");
}
