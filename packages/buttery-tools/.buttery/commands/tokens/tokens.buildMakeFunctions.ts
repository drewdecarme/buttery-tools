import type { ResolvedButteryConfig } from "../_buttery-config";
import { buildMakeFunctionsFromTemplates } from "./tokens.buildMakeFunctionsFromTemplates";
import { buildMakeFunctionsOutputDirectory } from "./tokens.buildMakeFunctionsOutputDirectory";
import { getButteryTokensDirectories } from "./tokens.getButteryTokensDirectories";
import { LOG_TOKENS } from "./tokens.logger";

export async function buildMakeFunctions(
  { tokens, ...restConfig }: ResolvedButteryConfig<"tokens">,
  options: { isLocal: boolean }
) {
  LOG_TOKENS.debug("Building make functions...");
  // convert the tokens to an array
  const tokensConfig = Array.isArray(tokens) ? tokens : [tokens];

  await Promise.all(
    tokensConfig.map(async (t) => {
      const iConfig = { ...restConfig, tokens: t };
      const dirs = await getButteryTokensDirectories(iConfig, {
        isLocal: options.isLocal
      });

      LOG_TOKENS.debug(`Building "${iConfig.tokens.importName ?? "index"}"`);

      // Create the make functions output directory
      await buildMakeFunctionsOutputDirectory(dirs, {
        isLocal: options.isLocal
      });

      // build the make functions from the registered templates.
      await buildMakeFunctionsFromTemplates(iConfig, dirs);
    })
  );

  LOG_TOKENS.success("Building make functions... complete.");
}
