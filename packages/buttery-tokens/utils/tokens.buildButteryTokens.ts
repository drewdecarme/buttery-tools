import chokidar from "chokidar";
import { LOG } from "./logger";
import { buildCSSUtils } from "./tokens.buildCSSUtils";
import { getButteryTokensConfig } from "./tokens.getButteryTokensConfig";
import { getButteryTokensDirectories } from "./tokens.getButteryTokensDirectories";
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
  const dirs = await getButteryTokensDirectories(config);

  // build the make functions
  await buildCSSUtils(config, dirs);

  // listen to any changes to the `.buttery/config`
  if (!options.watch) {
    return;
  }

  const watcher = chokidar.watch(config.paths.config);
  LOG.watch(config.paths.config.concat(" for changes..."));

  watcher.on("change", async (file) => {
    LOG.watch(`"${file}" changed.`);
    LOG.watch("Rebuilding tokens...");
    const config = await getButteryTokensConfig(options);
    const dirs = await getButteryTokensDirectories(config);

    await buildCSSUtils(config, dirs);

    LOG.watch("Rebuilding tokens... done.");
  });

  // watch and launch the interactive UI
  if (!options.interactive) return;
  await launchPlayground(config);
}
