import { select } from "@inquirer/prompts";
import chokidar from "chokidar";
import { getButteryTokensConfig } from "../tokens/tokens.getButteryTokensConfig";
import { LOG_TOKENS } from "../tokens/tokens.logger";
import { runBuild } from "./tokens.build.run";
import { launchPlayground } from "./utils/util.launch-playground";

export type BuildTokensOptions = {
  watch: boolean;
  debug: boolean;
  interactive: boolean;
  prompt: boolean;
};

export async function buildTokens(
  options: BuildTokensOptions & {
    /**
     * Not a publicly accessible option. This is used specifically
     * for generating token sets in this CLI for the docs and tokens apps
     * respectively.
     */
    local?: boolean;
  }
) {
  const isLocal = !!options.local;
  const watch = options.watch;
  const interactive = options.interactive;
  const prompt = options.prompt;

  // Get the config
  const config = await getButteryTokensConfig({
    startingDirectory: isLocal ? import.meta.dirname : process.cwd(),
    prompt,
    defaultConfig: "tokens",
  });

  LOG_TOKENS.debug("Building buttery tokens...");
  await runBuild(config, { isLocal });
  LOG_TOKENS.success("Build complete!");

  if (!watch) return;

  if (interactive) {
    const { tokens, ...restConfig } = config;
    if (Array.isArray(tokens)) {
      LOG_TOKENS.info("Detected more than one tokens configuration.");
      const choice = await select({
        message:
          "Please select which configuration you would like to load into the interactive token config UI",
        choices: tokens.map((tokenConfig, i) => ({
          name: tokenConfig.importName,
          value: i,
        })),
      });
      launchPlayground(
        {
          ...restConfig,
          tokens: tokens[choice],
        },
        { isLocal }
      );
    } else {
      launchPlayground(
        {
          ...restConfig,
          tokens,
        },
        { isLocal }
      );
    }
    // Check to see which tokens config should be run
  }

  // Watch the config anytime it changes
  const watcher = chokidar.watch(config.paths.config);
  LOG_TOKENS.watch(config.paths.config.concat(" for changes..."));

  // When the config changes...
  // re-fetch the config and build the templates
  watcher.on("change", async (file) => {
    LOG_TOKENS.watch(`"${file}" changed.`);
    LOG_TOKENS.watch("Rebuilding tokens...");
    await runBuild(config, { isLocal });
    LOG_TOKENS.watch("Rebuilding tokens... done.");
  });
}
