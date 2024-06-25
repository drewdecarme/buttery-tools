import chokidar from "chokidar";
import { getButteryTokensConfig } from "../tokens/tokens.getButteryTokensConfig";
import { LOG_TOKENS } from "../tokens/tokens.logger";
import { createAndRunBuilds } from "./tokens.build.create-builds";

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
  const isLocal = !!options.local;
  const butteryConfig = await getButteryTokensConfig();

  LOG_TOKENS.debug("Building buttery tokens...");
  await createAndRunBuilds(isLocal);
  LOG_TOKENS.success("Build complete!");

  if (!options.watch) return;

  if (options.interactive) {
    // launchPlayground(configs.tokens);
  }

  // Watch the config anytime it changes
  const watcher = chokidar.watch(butteryConfig.paths.config);
  LOG_TOKENS.watch(butteryConfig.paths.config.concat(" for changes..."));

  // When the config changes...
  // re-fetch the config and build the templates
  watcher.on("change", async (file) => {
    LOG_TOKENS.watch(`"${file}" changed.`);
    LOG_TOKENS.watch("Rebuilding tokens...");
    await createAndRunBuilds(isLocal);
    LOG_TOKENS.watch("Rebuilding tokens... done.");
  });
}
