import { getButteryTokensConfig } from "../tokens/tokens.getButteryTokensConfig";
import { getButteryTokensDirectories } from "../tokens/tokens.getButteryTokensDirectories";
import { LOG_TOKENS } from "../tokens/tokens.logger";
import { buildMakeTemplates } from "./tokens.build.build-make-templates";
import { prepareWorkingDirectory } from "./tokens.build.prepare-working-directory";

export async function createAndRunBuilds(isLocal: boolean) {
  // get the config and the directories needed to build
  const { tokens, ...restConfig } = await getButteryTokensConfig();

  // convert the tokens to an array
  const tokensConfig = Array.isArray(tokens) ? tokens : [tokens];

  await Promise.all(
    tokensConfig.map(async (t) => {
      const iConfig = { ...restConfig, tokens: t };
      const dirs = await getButteryTokensDirectories(iConfig, {
        isLocal,
      });

      LOG_TOKENS.debug(`Building "${iConfig.tokens.importName ?? "index"}"`);

      // create the necessary directories and build the templates 1 time
      await prepareWorkingDirectory(dirs, { isLocal });
      await buildMakeTemplates(iConfig, dirs);
    })
  );
}
