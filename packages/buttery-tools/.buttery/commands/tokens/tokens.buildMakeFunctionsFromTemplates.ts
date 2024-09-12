import path from "node:path";

import {
  EsbuildPluginTypescriptCompiler,
  createEsbuildOptions
} from "@buttery/utils/esbuild";
import { build } from "esbuild";

import { MakeTemplates } from "../../../artifacts/tokens/make-templates/MakeTemplates";
import { MakeTemplateColor } from "../../../artifacts/tokens/make-templates/template.makeColor";
import { MakeTemplateColorStatic } from "../../../artifacts/tokens/make-templates/template.makeColorStatic";
import { MakeTemplateCustom } from "../../../artifacts/tokens/make-templates/template.makeCustom";
import { MakeTemplateFontFamily } from "../../../artifacts/tokens/make-templates/template.makeFontFamily";
import { MakeTemplateFontWeight } from "../../../artifacts/tokens/make-templates/template.makeFontWeight";
import { MakeTemplateRem } from "../../../artifacts/tokens/make-templates/template.makeRem";
import { MakeTemplateReset } from "../../../artifacts/tokens/make-templates/template.makeReset";
import { MakeTemplateResponsive } from "../../../artifacts/tokens/make-templates/template.makeResponsive";

import type { ButteryTokensConfig } from "./tokens.getButteryTokensConfig";
import type { ButteryTokensDirectories } from "./tokens.getButteryTokensDirectories";

import { LOG_TOKENS } from "./tokens.logger";

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
export async function buildMakeFunctionsFromTemplates(
  config: ButteryTokensConfig,
  dirs: ButteryTokensDirectories
) {
  const Templates = new MakeTemplates({
    config: config,
    outDir: dirs.output.path
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
    tsConfigPath: dirs.root.tsConfigPath
  });
  const buildOptions = createEsbuildOptions({
    entryPoints: [Templates.entryFile],
    outfile: path.resolve(dirs.output.path, "./index.js"),
    plugins: [
      // transpile and create files
      tsPlugin.getPlugin({
        filePathToTranspile: Templates.entryFile,
        extraArgs: [`--outDir ${dirs.output.path}`]
      })
    ]
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
