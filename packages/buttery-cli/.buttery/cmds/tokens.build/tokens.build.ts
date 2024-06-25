import type { ButteryConfigPaths, ButteryConfigTokens } from "@buttery/core";
import chokidar from "chokidar";
import { getButteryTokensConfig } from "../tokens/tokens.getButteryTokensConfig";
import { getButteryTokensDirectories } from "../tokens/tokens.getButteryTokensDirectories";
import { LOG_TOKENS } from "../tokens/tokens.logger";
import { buildTemplates } from "./tokens.build.buildFunctionsAndTokens";
import { prepareWorkingDirectory } from "./tokens.build.prepare-working-directory";

async function createDirsAndBuildTemplates(
  config: {
    paths: ButteryConfigPaths;
    tokens: ButteryConfigTokens;
  },
  isLocal: boolean
) {
  const dirs = await getButteryTokensDirectories(config, {
    isLocal,
  });

  // create the necessary directories and build the templates 1 time
  await prepareWorkingDirectory(config, dirs, { isLocal });
  await buildTemplates(config, dirs);
}

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
  const { tokens, ...restConfig } = await getButteryTokensConfig();

  // convert the tokens to an array
  const tokensConfig = Array.isArray(tokens) ? tokens : [tokens];
  await Promise.all(
    tokensConfig.map((t) =>
      createDirsAndBuildTemplates({ tokens: t, ...restConfig }, isLocal)
    )
  );

  LOG_TOKENS.success("Build complete!");

  if (!options.watch) return;

  if (options.interactive) {
    // launchPlayground(configs.tokens);
  }

  // Watch the config anytime it changes
  const watcher = chokidar.watch(restConfig.paths.config);
  LOG_TOKENS.watch(restConfig.paths.config.concat(" for changes..."));

  // When the config changes...
  // re-fetch the config and build the templates
  watcher.on("change", async (file) => {
    LOG_TOKENS.watch(`"${file}" changed. Rebuilding tokens...`);

    // convert the tokens to an array
    const { tokens: updatedTokens, ...restUpdatedConfig } =
      await getButteryTokensConfig();
    const updatedTokensConfig = Array.isArray(tokens) ? tokens : [tokens];
    await Promise.all(
      updatedTokensConfig.map((t) =>
        createDirsAndBuildTemplates(
          { tokens: t, ...restUpdatedConfig },
          isLocal
        )
      )
    );
  });
}
