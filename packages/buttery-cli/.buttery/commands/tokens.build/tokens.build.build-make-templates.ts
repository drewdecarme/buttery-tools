import path from "node:path";

import {
  EsbuildPluginTypescriptCompiler,
  createEsbuildOptions,
} from "@buttery/utils/esbuild";
import { build } from "esbuild";

import type { ButteryTokensConfig } from "./tokens.config.getButteryTokensConfig";
import type { ButteryTokensDirectories } from "./tokens.config.getButteryTokensDirectories";
import { LOG_TOKENS } from "../tokens/tokens.config.logger";
import { MakeTemplates } from "./templates/MakeTemplates";
import { MakeTemplateColor } from "./templates/template.makeColor";
import { MakeTemplateColorStatic } from "./templates/template.makeColorStatic";
import { MakeTemplateCustom } from "./templates/template.makeCustom";
import { MakeTemplateFontFamily } from "./templates/template.makeFontFamily";
import { MakeTemplateFontWeight } from "./templates/template.makeFontWeight";
import { MakeTemplateRem } from "./templates/template.makeRem";
import { MakeTemplateReset } from "./templates/template.makeReset";
import { MakeTemplateResponsive } from "./templates/template.makeResponsive";

/**
 * Provided a config and a collection of directories, this function gathers
 * all of the templates, registers them and then adds the necessary data
 * to them to make them functional.
 *
 * It will create the make functions and put them into the working directory
 * which was established when the directories we're reconciled. Those functions
 * are then transpiled using esbuild. After the transpilation a plugin is also run
 * to create the TS types for each of the functions using a esbuild plugin.
 */
export async function buildMakeTemplates(
  config: ButteryTokensConfig,
  dirs: ButteryTokensDirectories
) {
  const Templates = new MakeTemplates({
    config: config,
    outDir: dirs.output.path,
  });

  // Register the templates that should be generated
  Templates.register(MakeTemplateFontFamily);
  Templates.register(MakeTemplateFontWeight);
  Templates.register(MakeTemplateRem);
  Templates.register(MakeTemplateResponsive);
  Templates.register(MakeTemplateColor);
  if (config.tokens.color.static) {
    Templates.register(MakeTemplateColorStatic);
  }
  Templates.register(MakeTemplateReset);
  if (config.tokens.custom) {
    Templates.register(MakeTemplateCustom);
  }

  // Create a plugin to eventually transpile the .tokens directory
  // and assemble the ESBuild options for that entry / barrel file.
  const tsPlugin = new EsbuildPluginTypescriptCompiler({
    tsConfigPath: dirs.root.tsConfigPath,
  });
  const buildOptions = createEsbuildOptions({
    entryPoints: [Templates.entryFile],
    outfile: path.resolve(dirs.output.path, "./index.js"),
    plugins: [
      // transpile and create files
      tsPlugin.getPlugin({
        filePathToTranspile: Templates.entryFile,
        extraArgs: [`--outDir ${dirs.output.path}`],
      }),
    ],
  });

  // Generate all of the registered templates
  LOG_TOKENS.debug("Generating make functions...");
  await Templates.generate();
  LOG_TOKENS.debug("Generating make functions.. done.");

  // Transpile the templates
  LOG_TOKENS.debug("Transpiling generated files...");
  await build(buildOptions);
  LOG_TOKENS.debug("Transpiling generated files... done.");
}
