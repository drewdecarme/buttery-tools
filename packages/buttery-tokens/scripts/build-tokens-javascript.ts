import path from "node:path";
import type { ButteryConfig } from "@buttery/cli";
import {
  EsbuildPluginTypescriptCompiler,
  createEsbuildOptions
} from "@buttery/utils/esbuild";
import { build } from "esbuild";
import type { TokensConfig } from "../lib/types";
import { tokenLogger } from "../utils";
import { MakeTemplates } from "./MakeTemplates";
import { MakeTemplateFontFamily } from "./template.makeFontFamily";

/**
 * The build script that takes the files in the /src/ts directory
 * pre-compiles them and then builds them into dist/js directory
 */
export const buildTokensJavascript = async ({
  butteryConfig,
  tokensConfig
}: {
  butteryConfig: ButteryConfig;
  tokensConfig: TokensConfig;
}) => {
  // Register a new MakeTemplates instance
  const Templates = new MakeTemplates({
    config: tokensConfig,
    outDir: path.resolve(butteryConfig.root, "./.tokens/javascript/")
  });

  // Register the templates that should be generated
  Templates.register(MakeTemplateFontFamily);

  // Generate all of the registered templates
  await Templates.generate();

  // TODO: Watch for the tokensConfig file change...
  // TODO: When developing locally listen to the /src/javascript folder and run createTemp and transform

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
    tokenLogger.debug("Transpiling & bundling...");
    await build(buildOptions);
    tokenLogger.debug("Transpiling & bundling... done.");
  } catch (error) {
    const err = new Error(error);
    tokenLogger.fatal(err);
    throw err;
  }
};
