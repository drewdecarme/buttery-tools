import { cp, readFile, stat } from "node:fs/promises";
import path from "node:path";
import type { ButteryConfig } from "@buttery/cli";
import {
  EsbuildPluginTypescriptCompiler,
  createEsbuildOptions
} from "@buttery/utils/esbuild";
import { build } from "esbuild";
import type { TokensConfig } from "../lib/types";
import { tokenLogger } from "../utils";
import { ESBuildPluginBuildTokens } from "./esbuild-plugin-build-javascript";

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
  // TODO: Watch for the tokensConfig file change...
  // TODO: When developing locally listen to the /src/javascript folder
  tokenLogger.debug("Creating working temp dir...");
  const tempDir = path.resolve(butteryConfig.root, "./src/javascript/.temp");
  const tempSrc = path.resolve(butteryConfig.root, "./src/javascript/");
  // copy the js to another temp directory
  await cp(tempSrc, tempDir, { recursive: true, force: true });
  tokenLogger.debug("Creating working temp dir... done.");

  // Create the plugins to manage the build
  const ESBuildPluginBuildTokensPlugin = new ESBuildPluginBuildTokens({
    butteryConfig,
    tokensConfig
  });
  const EsbuildPluginTypescriptCompilerPlugin =
    new EsbuildPluginTypescriptCompiler({
      tsConfigPath: path.resolve(butteryConfig.root, "./tsconfig.lib-js.json")
    });

  const buildOptions = createEsbuildOptions({
    entryPoints: [path.resolve(tempDir, "./index.ts")],
    outfile: path.resolve(butteryConfig.root, "./dist/javascript/index.js"),
    plugins: [
      ESBuildPluginBuildTokensPlugin.getPlugin(),
      EsbuildPluginTypescriptCompilerPlugin.getPlugin()
    ]
  });

  try {
    await build(buildOptions);
  } catch (error) {
    const err = new Error(error);
    tokenLogger.fatal(err);
    throw err;
  }
};
