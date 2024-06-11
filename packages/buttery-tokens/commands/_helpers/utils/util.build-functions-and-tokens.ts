import { cp, watch as watchDir } from "node:fs/promises";
import path from "node:path";

import {
  EsbuildPluginTypescriptCompiler,
  createEsbuildOptions,
} from "@buttery/utils/esbuild";
import { build } from "esbuild";

import { type ButteryConfigTokens, getButteryConfig } from "@buttery/core";

import { MakeTemplates } from "../templates/MakeTemplates";
import { MakeTemplateColor } from "../templates/template.makeColor";
import { MakeTemplateColorStatic } from "../templates/template.makeColorStatic";
import { MakeTemplateCustom } from "../templates/template.makeCustom";
import { MakeTemplateFontFamily } from "../templates/template.makeFontFamily";
import { MakeTemplateFontWeight } from "../templates/template.makeFontWeight";
import { MakeTemplateRem } from "../templates/template.makeRem";
import { MakeTemplateReset } from "../templates/template.makeReset";
import { MakeTemplateResponsive } from "../templates/template.makeResponsive";
import { getResolvedVariables } from "./util.get-resolved-config-constants";
import { launchPlayground } from "./util.launch-playground";
import { tokenLogger } from "./util.logger";

// The function that does stuff. It's in here so it can either be used
// when a specific file changes or just straight up.
async function generateAndTranspile(configTokens: ButteryConfigTokens) {
  const {
    transpiledFilesOutDir,
    transpiledFilesOutFile,
    generatedTSFilesOutDir,
    generatedTSFilesTSConfig,
  } = await getResolvedVariables(configTokens);

  const Templates = new MakeTemplates({
    config: configTokens,
    outDir: generatedTSFilesOutDir,
  });

  // Register the templates that should be generated
  Templates.register(MakeTemplateFontFamily);
  Templates.register(MakeTemplateFontWeight);
  Templates.register(MakeTemplateRem);
  Templates.register(MakeTemplateResponsive);
  Templates.register(MakeTemplateColor);
  Templates.register(MakeTemplateColorStatic);
  Templates.register(MakeTemplateReset);
  if (configTokens.custom) {
    Templates.register(MakeTemplateCustom);
  }

  // Create a plugin to eventually transpile the .tokens directory
  // and assemble the ESBuild options for that entry / barrel file.
  const tsPlugin = new EsbuildPluginTypescriptCompiler({
    tsConfigPath: generatedTSFilesTSConfig,
  });
  const buildOptions = createEsbuildOptions({
    entryPoints: [Templates.entryFile],
    outfile: transpiledFilesOutFile,
    plugins: [
      // transpile and create files
      tsPlugin.getPlugin({
        filePathToTranspile: Templates.entryFile,
        extraArgs: [`--outDir ${transpiledFilesOutDir}`],
      }),
    ],
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
      path.resolve(transpiledFilesOutDir, "./index.css"),
      {
        recursive: true,
        force: true,
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
  watch,
  interactive,
}: {
  watch: boolean;
  interactive: boolean;
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

  if (interactive) {
    launchPlayground(configs.tokens);
  }

  // Watch the tokens.config for any changes
  tokenLogger.watch(configs.configBase.root.concat(" for changes..."));

  const watcher = watchDir(configs.configBase.root);

  for await (const _event of watcher) {
    // KNOWN ISSUE - watchDir files twice
    tokenLogger.watch("Changes detected. Rebuilding functions and tokens...");
    const updatedConfig = await getButteryConfig("tokens");
    await generateAndTranspile(updatedConfig.tokens);
    tokenLogger.watch(
      "Changes detected. Rebuilding functions and tokens... done."
    );
  }
};
