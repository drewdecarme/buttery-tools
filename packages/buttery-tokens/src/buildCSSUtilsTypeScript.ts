
import { exec } from "node:child_process";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import type { ButteryConfigTokens } from "@buttery/core/config";

import type { ButteryTokensDirectories } from "./getButteryTokensDirectories";
import { LOG } from "./logger";
import { MakeTemplates } from "./make-templates/MakeTemplates";
import { MakeTemplateColorBrand } from "./make-templates/template.makeColorBrand";
import { MakeTemplateColorShade } from "./make-templates/template.makeColorShade";
import { MakeTemplateColorStatic } from "./make-templates/template.makeColorStatic";
import { MakeTemplateCustom } from "./make-templates/template.makeCustom";
import { MakeTemplateFontFamily } from "./make-templates/template.makeFontFamily";
import { MakeTemplateFontWeight } from "./make-templates/template.makeFontWeight";
import { MakeTemplateRem } from "./make-templates/template.makeRem";
import { MakeTemplateReset } from "./make-templates/template.makeReset";
import { MakeTemplateResponsive } from "./make-templates/template.makeResponsive";

const execAsync = promisify(exec);

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
export async function buildCSSUtilsTypeScript(
  tokensConfig: ButteryConfigTokens,
  namespacedOutDir: string,
  dirs: ButteryTokensDirectories
) {
  const Templates = new MakeTemplates({
    config: tokensConfig,
    outDir: namespacedOutDir,
    css: {
      outDir: dirs.output.root,
      fileName: tokensConfig.namespace,
    },
  });

  // Register the templates that should be generated
  Templates.register(MakeTemplateFontFamily);
  Templates.register(MakeTemplateFontWeight);
  Templates.register(MakeTemplateRem);
  Templates.register(MakeTemplateResponsive);
  Templates.register(MakeTemplateColorBrand);
  Templates.register(MakeTemplateColorShade);
  if (tokensConfig.color.static) {
    Templates.register(MakeTemplateColorStatic);
  }
  Templates.register(MakeTemplateReset);
  if (tokensConfig.custom) {
    Templates.register(MakeTemplateCustom);
  }

  // Generate all of the registered templates
  LOG.debug("Generating make functions...");
  await Templates.generate();
  LOG.debug("Generating make functions.. done.");

  // create a tsconfig.json in the output directory
  const tsconfigJsonPath = path.resolve(namespacedOutDir, "./tsconfig.json");
  const tsconfigJsonContent = JSON.stringify({
    extends: "@buttery/core/tsconfig",
    compilerOptions: {
      noEmit: false,
      declaration: true,
    },
  });

  try {
    LOG.debug("Creating tsconfig...");
    await writeFile(tsconfigJsonPath, tsconfigJsonContent);
    LOG.debug("Creating tsconfig... done.");
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }

  // transpile the typescript files
  LOG.debug("Building & transpiling...");
  try {
    const { stderr } = await execAsync(`tsc --project ${tsconfigJsonPath}`);
    if (stderr) {
      throw stderr;
    }
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }

  // move the styles over to the root directory

  LOG.debug("Building & transpiling... done.");
}
