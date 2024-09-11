import chokidar from "chokidar";
import { buildMakeFunctions } from "./tokens.buildMakeFunctions";
import { getButteryTokensConfig } from "./tokens.getButteryTokensConfig";
import { launchPlayground } from "./tokens.launchPlayground";
import { LOG_TOKENS } from "./tokens.logger";

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
  await buildMakeFunctions(config, { isLocal: options.isLocal });

  // listen to any changes to the `.buttery/config`
  if (!options.watch) return;
  const watcher = chokidar.watch(config.paths.config);
  LOG_TOKENS.watch(config.paths.config.concat(" for changes..."));

  watcher.on("change", async (file) => {
    LOG_TOKENS.watch(`"${file}" changed.`);
    LOG_TOKENS.watch("Rebuilding tokens...");
    await buildMakeFunctions(config, { isLocal: options.isLocal });
    LOG_TOKENS.watch("Rebuilding tokens... done.");
  });

  // watch and launch the interactive UI
  if (!options.interactive) return;
  await launchPlayground(config, options);
}
