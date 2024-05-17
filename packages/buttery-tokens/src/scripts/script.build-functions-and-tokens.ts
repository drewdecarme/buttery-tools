import { cp, watch as watchDir } from "node:fs/promises";
import path from "node:path";

import {
  EsbuildPluginTypescriptCompiler,
  createEsbuildOptions
} from "@buttery/utils/esbuild";
import { build } from "esbuild";

import type { ButteryConfig } from "@buttery/cli";
import type { TokensConfig } from "../lib/types";
import { MakeTemplates } from "../templates/MakeTemplates";
import { MakeTemplateFontFamily } from "../templates/template.makeFontFamily";
import { MakeTemplateFontWeight } from "../templates/template.makeFontWeight";
import { getButteryConfig, tokenLogger } from "../utils";
import { getTokensConfig } from "../utils/util.get-tokens-config";

// The function that does stuff. It's in here so it can either be used
// when a specific file changes or just straight up.
async function generateAndTranspile({
  tokensConfig,
  butteryConfig
}: {
  tokensConfig: TokensConfig;
  butteryConfig: ButteryConfig;
}) {
  // Register a new MakeTemplates instance
  // to register the pre-defined Template classes
  const Templates = new MakeTemplates({
    config: tokensConfig,
    outDir: path.resolve(butteryConfig.root, "./.tokens/javascript/")
  });

  // Register the templates that should be generated
  Templates.register(MakeTemplateFontFamily);
  Templates.register(MakeTemplateFontWeight);

  // Create a plugin to eventually transpile the .tokens directory
  // and assemble the ESBuild options for that entry / barrel file.
  const tsPlugin = new EsbuildPluginTypescriptCompiler({
    tsConfigPath: path.resolve(butteryConfig.root, "./tsconfig.lib-js.json")
  });
  const plugins = [tsPlugin.getPlugin()];
  const buildOptions = createEsbuildOptions({
    entryPoints: [Templates.entryFile],
    outfile: path.resolve(butteryConfig.root, "./dist/javascript/index.js"),
    plugins
  });

  try {
    // Generate all of the registered templates
    tokenLogger.debug("Generating make functions...");
    await Templates.generate();
    tokenLogger.debug("Generating make functions.. done.");

    // Transpile the templates
    tokenLogger.debug("Transpiling generated files...");
    await build(buildOptions);
    tokenLogger.debug("Transpiling generated files... done.");

    // move the index files
    tokenLogger.debug("Distributing CSS files...");
    await cp(
      Templates.tokensCSSFile,
      path.resolve(butteryConfig.root, "./dist/index.css"),
      {
        recursive: true,
        force: true
      }
    );
    tokenLogger.debug("Distributing CSS files... done");
  } catch (error) {
    const err = new Error(error);
    tokenLogger.fatal(err);
    throw err;
  }
}

/**
 * TODO: Fix this description
 */
export const buildFunctionsAndTokens = async ({
  watch,
  butteryConfig,
  tokensConfig,
  tokensConfigPath
}: {
  butteryConfig: ButteryConfig;
  tokensConfig: TokensConfig;
  watch: boolean;
  tokensConfigPath: string;
}) => {
  // build it once
  await generateAndTranspile({ tokensConfig, butteryConfig });

  if (!watch) return;

  // Watch the tokens.config for any changes
  tokenLogger.watch(tokensConfigPath.concat(" for changes..."));

  const watcher = watchDir(tokensConfigPath);

  for await (const event of watcher) {
    // KNOWN ISSUE - watchDir files twice
    tokenLogger.watch("Changes detected. Rebuilding functions and tokens...");
    const updatedTokensConfig = await getTokensConfig();
    await generateAndTranspile({
      tokensConfig: updatedTokensConfig.config,
      butteryConfig
    });
    tokenLogger.watch(
      "Changes detected. Rebuilding functions and tokens... done."
    );
  }
};
