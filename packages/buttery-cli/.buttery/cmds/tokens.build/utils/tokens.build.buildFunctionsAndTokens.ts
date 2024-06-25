import { cp, watch as watchDir } from "node:fs/promises";
import path from "node:path";

import {
  EsbuildPluginTypescriptCompiler,
  createEsbuildOptions,
} from "@buttery/utils/esbuild";
import { build } from "esbuild";

import type { ResolvedButteryConfig } from "@buttery/core";

import type { ButteryTokensDirectories } from "../../tokens/tokens.util.getButteryTokensDirectories";
import { MakeTemplates } from "../templates/MakeTemplates";
import { MakeTemplateColor } from "../templates/template.makeColor";
import { MakeTemplateColorStatic } from "../templates/template.makeColorStatic";
import { MakeTemplateCustom } from "../templates/template.makeCustom";
import { MakeTemplateFontFamily } from "../templates/template.makeFontFamily";
import { MakeTemplateFontWeight } from "../templates/template.makeFontWeight";
import { MakeTemplateRem } from "../templates/template.makeRem";
import { MakeTemplateReset } from "../templates/template.makeReset";
import { MakeTemplateResponsive } from "../templates/template.makeResponsive";
import { launchPlayground } from "./util.launch-playground";
import { tokenLogger } from "./util.logger";

// The function that does stuff. It's in here so it can either be used
// when a specific file changes or just straight up.
async function generateAndTranspile(
  config: ResolvedButteryConfig<"tokens">,
  dirs: ButteryTokensDirectories
) {
  // const {
  //   transpiledFilesOutDir,
  //   transpiledFilesOutFile,
  //   generatedTSFilesOutDir,
  //   generatedTSFilesTSConfig,
  // } = await getResolvedVariables(config);

  const Templates = new MakeTemplates({
    config: config,
    outDir: dirs.working.path,
  });

  // Register the templates that should be generated
  Templates.register(MakeTemplateFontFamily);
  Templates.register(MakeTemplateFontWeight);
  Templates.register(MakeTemplateRem);
  Templates.register(MakeTemplateResponsive);
  Templates.register(MakeTemplateColor);
  Templates.register(MakeTemplateColorStatic);
  Templates.register(MakeTemplateReset);
  if (config.tokens.custom) {
    Templates.register(MakeTemplateCustom);
  }

  // Create a plugin to eventually transpile the .tokens directory
  // and assemble the ESBuild options for that entry / barrel file.
  const tsPlugin = new EsbuildPluginTypescriptCompiler({
    tsConfigPath: dirs.templateTSConfig,
  });
  const buildOptions = createEsbuildOptions({
    entryPoints: [Templates.entryFile],
    outfile: path.resolve(dirs.working.path, "./index.js"),
    plugins: [
      // transpile and create files
      tsPlugin.getPlugin({
        filePathToTranspile: Templates.entryFile,
        extraArgs: [`--outDir ${dirs.working.path}`],
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
  } catch (error) {
    const err = new Error(error as string);
    tokenLogger.fatal(err);
    throw err;
  }
}

/**
 * TODO: Fix this description
 */
export const buildFunctionsAndTokens = async (
  config: ResolvedButteryConfig<"tokens">,
  dirs: ButteryTokensDirectories,
  {
    watch,
    interactive,
  }: {
    watch: boolean;
    interactive: boolean;
  }
) => {
  // build it once
  await generateAndTranspile(config, dirs);

  // if (!watch) return;

  // if (interactive) {
  //   launchPlayground(configs.tokens);
  // }

  // // Watch the tokens.config for any changes
  // tokenLogger.watch(configs.configBase.root.concat(" for changes..."));

  // const watcher = watchDir(configs.configBase.root);

  // for await (const _event of watcher) {
  //   // KNOWN ISSUE - watchDir files twice
  //   tokenLogger.watch("Changes detected. Rebuilding functions and tokens...");
  //   const updatedConfig = await getButteryConfig("tokens");
  //   await generateAndTranspile(updatedConfig.tokens);
  //   tokenLogger.watch(
  //     "Changes detected. Rebuilding functions and tokens... done."
  //   );
  // }
};
