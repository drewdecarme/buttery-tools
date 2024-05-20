import { cp, watch as watchDir } from "node:fs/promises";
import path from "node:path";

import {
  EsbuildPluginTypescriptCompiler,
  createEsbuildOptions
} from "@buttery/utils/esbuild";
import { build } from "esbuild";

import { type ButteryConfigTokens, getButteryConfig } from "@buttery/core";
import { MakeTemplates } from "../templates/MakeTemplates";
import { MakeTemplateFontFamily } from "../templates/template.makeFontFamily";
import { MakeTemplateFontWeight } from "../templates/template.makeFontWeight";
import { getLocalRootPath, tokenLogger } from "../utils";

// The function that does stuff. It's in here so it can either be used
// when a specific file changes or just straight up.
async function generateAndTranspile(configTokens: ButteryConfigTokens) {
  const tokensRootPath = await getLocalRootPath();

  console.log({ tokensRootPath });

  const outDirForGeneratedTSFiles = path.resolve(
    tokensRootPath,
    configTokens?.importName
      ? `./.tokens/${configTokens.importName}/`
      : "./.tokens/"
  );

  const outDirForTranspiledFiles = path.resolve(
    tokensRootPath,
    configTokens?.importName ? `./${configTokens.importName}/` : "./dist/"
  );

  const outFileForTranspiledFiles = path.resolve(
    outDirForTranspiledFiles,
    "./index.js"
  );

  const Templates = new MakeTemplates({
    config: configTokens,
    outDir: outDirForGeneratedTSFiles
  });

  // Register the templates that should be generated
  Templates.register(MakeTemplateFontFamily);
  Templates.register(MakeTemplateFontWeight);

  // Create a plugin to eventually transpile the .tokens directory
  // and assemble the ESBuild options for that entry / barrel file.
  const tsPlugin = new EsbuildPluginTypescriptCompiler({
    tsConfigPath: path.resolve(tokensRootPath, "./tsconfig.build.json")
  });
  const buildOptions = createEsbuildOptions({
    entryPoints: [Templates.entryFile],
    outfile: outFileForTranspiledFiles,
    plugins: [
      // transpile and create files
      tsPlugin.getPlugin({
        filePathToTranspile: Templates.entryFile,
        extraArgs: [`--outDir ${outDirForTranspiledFiles}`]
      })
    ]
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
      path.resolve(outDirForTranspiledFiles, "./index.css"),
      {
        recursive: true,
        force: true
      }
    );
    tokenLogger.debug("Distributing CSS files... done");
  } catch (error) {
    const err = new Error(error as string);
    tokenLogger.fatal(err);
    throw err;
  }
}

/**
 * TODO: Fix this description
 */
export const buildFunctionsAndTokens = async ({
  watch
}: {
  watch: boolean;
}) => {
  // Get the `buttery.config` to baseline some variables
  // The `buttery.config` is included in the distribution via package.json files
  // and it's set as a JS file so it can be consumed without a lot of configuration
  tokenLogger.debug("Fetching necessary configuration files...");
  const configs = await getButteryConfig("tokens");
  tokenLogger.debug("Fetching necessary configuration files... done.");

  // build it once
  await generateAndTranspile(configs.tokens);

  if (!watch) return;

  // Watch the tokens.config for any changes
  tokenLogger.watch(configs.configBase.root.concat(" for changes..."));

  const watcher = watchDir(configs.configBase.root);

  for await (const event of watcher) {
    // KNOWN ISSUE - watchDir files twice
    tokenLogger.watch("Changes detected. Rebuilding functions and tokens...");
    const updatedConfig = await getButteryConfig("tokens");
    await generateAndTranspile(updatedConfig.tokens);
    tokenLogger.watch(
      "Changes detected. Rebuilding functions and tokens... done."
    );
  }
};