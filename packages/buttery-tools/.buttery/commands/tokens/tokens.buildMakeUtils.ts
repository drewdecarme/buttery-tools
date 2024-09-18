import type { ResolvedButteryConfig } from "../_buttery-config";
import { LOG } from "../_logger/util.ts.logger";
import { buildMakeUtilsFromTemplates } from "./tokens.buildMakeUtilsFromTemplates";
import { getButteryTokensDirectories } from "./tokens.getButteryTokensDirectories";

export async function buildMakeUtils({
  tokens,
  ...restConfig
}: ResolvedButteryConfig<"tokens">) {
  LOG.debug("Building make functions...");
  // convert the tokens to an array
  const tokensConfig = Array.isArray(tokens) ? tokens : [tokens];

  await Promise.all(
    tokensConfig.map(async (t) => {
      const iConfig = { ...restConfig, tokens: t };
      const dirs = await getButteryTokensDirectories(iConfig);

      LOG.debug(`Building "${iConfig.tokens.namespace ?? "index"}"`);

      // build the make functions from the registered te      // // Create the make functions output directory
      // await buildMakeUtilsEnrichDir(dirs, {
      //   isLocal: options.isLocal
      // });mplates.
      await buildMakeUtilsFromTemplates(iConfig, dirs);
    })
  );

  LOG.success("Building make functions... complete.");
}
