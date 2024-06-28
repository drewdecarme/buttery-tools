import { rename } from "node:fs/promises";
import type { ResolvedButteryConfig } from "@buttery/core";
import { LOG_TOKENS } from "../tokens/tokens.config.logger";
import { buildMakeTemplates } from "./tokens.build.build-make-templates";
import { buildWorkingDirectory } from "./tokens.build.build-working-directory";
import { getButteryTokensDirectories } from "./tokens.config.getButteryTokensDirectories";

export async function runBuild(
  { tokens, ...restConfig }: ResolvedButteryConfig<"tokens">,
  options: { isLocal: boolean }
) {
  // convert the tokens to an array
  const tokensConfig = Array.isArray(tokens) ? tokens : [tokens];

  await Promise.all(
    tokensConfig.map(async (t) => {
      const iConfig = { ...restConfig, tokens: t };
      const dirs = await getButteryTokensDirectories(iConfig, {
        isLocal: options.isLocal,
      });

      LOG_TOKENS.debug(`Building "${iConfig.tokens.importName ?? "index"}"`);

      // create the necessary directories and build the templates 1 time
      await buildWorkingDirectory(dirs, { isLocal: options.isLocal });
      await buildMakeTemplates(iConfig, dirs);

      if (options.isLocal) return;

      // move the index.css file to the output dir
      LOG_TOKENS.debug("Moving generated CSS file...");
      await rename(dirs.working.css, dirs.output.css);
      LOG_TOKENS.debug("Moving generated CSS file... done.");
    })
  );
}
