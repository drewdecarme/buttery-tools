import chokidar from "chokidar";
import { getButteryTokensConfig } from "../tokens/tokens.getButteryTokensConfig";
import { getButteryTokensDirectories } from "../tokens/tokens.getButteryTokensDirectories";
import { LOG_TOKENS } from "../tokens/tokens.logger";
import { buildTemplates } from "./tokens.build.buildFunctionsAndTokens";
import { prepareWorkingDirectory } from "./tokens.build.prepare-working-directory";

export type TokensBuildOptions = {
  debug: boolean;
  watch: boolean;
  interactive: boolean;
};
export async function buildTokens(
  options: TokensBuildOptions & {
    /**
     * Not a publicly accessible option. This is used specifically
     * for generating token sets in this CLI for the docs and tokens apps
     * respectively.
     */
    local?: boolean;
  }
) {
  LOG_TOKENS.debug("Building buttery tokens...");

  const isLocal = !!options.local;

  // get the config and the directories needed to build
  const config = await getButteryTokensConfig();
  const dirs = await getButteryTokensDirectories(config, {
    isLocal,
  });

  // create the necessary directories and build the templates 1 time
  await prepareWorkingDirectory(config, dirs, { isLocal });
  await buildTemplates(config, dirs);

  LOG_TOKENS.success("Build complete!");

  if (!options.watch) return;

  if (options.interactive) {
    // launchPlayground(configs.tokens);
  }

  // Watch the config anytime it changes
  const watcher = chokidar.watch(config.paths.config);
  LOG_TOKENS.watch(config.paths.config.concat(" for changes..."));

  // When the config changes...
  // re-fetch the config and build the templates
  watcher.on("change", async (file) => {
    LOG_TOKENS.watch(`"${file}" changed. Rebuilding tokens...`);
    const updatedConfig = await getButteryTokensConfig();
    await buildTemplates(updatedConfig, dirs);
  });
}
