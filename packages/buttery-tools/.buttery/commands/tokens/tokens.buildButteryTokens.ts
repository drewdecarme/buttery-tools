import chokidar from "chokidar";
import { LOG } from "../_logger/util.ts.logger";
import { buildMakeUtils } from "./tokens.buildMakeUtils";
import { getButteryTokensConfig } from "./tokens.getButteryTokensConfig";
import { launchPlayground } from "./tokens.launchPlayground";

export type BuildButteryTokensOptions = {
  debug: boolean;
  interactive: boolean;
  prompt: boolean;
  watch: boolean;
};

type BuildButteryTokensParams = BuildButteryTokensOptions & {
  isLocal: boolean;
};

export async function buildButteryTokens(options: BuildButteryTokensParams) {
  // Fetch the tokens config and resolve the paths
  const config = await getButteryTokensConfig(options);

  // build the make functions
  await buildMakeUtils(config);

  // listen to any changes to the `.buttery/config`
  if (!options.watch) return;
  const watcher = chokidar.watch(config.paths.config);
  LOG.watch(config.paths.config.concat(" for changes..."));

  watcher.on("change", async (file) => {
    LOG.watch(`"${file}" changed.`);
    LOG.watch("Rebuilding tokens...");
    await buildMakeUtils(config);
    LOG.watch("Rebuilding tokens... done.");
  });

  // watch and launch the interactive UI
  if (!options.interactive) return;
  await launchPlayground(config, options);
}
