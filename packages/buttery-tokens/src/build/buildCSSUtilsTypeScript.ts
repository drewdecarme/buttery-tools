import { exec } from "node:child_process";
import { writeFile } from "node:fs/promises";

import { tryHandle } from "@buttery/utils/isomorphic";

import { MakeTemplates } from "./make-templates/MakeTemplates.js";
import { MakeTemplateFontFamily } from "./make-templates/template.makeFontFamily.js";
import { MakeTemplateFontWeight } from "./make-templates/template.makeFontWeight.js";
import { MakeTemplateColor } from "./make-templates/template.makeColor.js";
import { MakeTemplateRem } from "./make-templates/template.makeRem.js";
import { MakeTemplateCustom } from "./make-templates/template.makeCustom.js";
import { MakeTemplateReset } from "./make-templates/template.makeReset.js";
import { MakeTemplateResponsive } from "./make-templates/template.makeResponsive.js";
import { MakeTemplatePx } from "./make-templates/template.makePx.js";
import { MakeTemplateFontBaseSize } from "./make-templates/template.makeFontBaseSize.js";
// import { MakeTemplateSpace } from "./make-templates/template.makeSpace.js";

import type { ResolvedButteryTokensConfig } from "../config/getButteryTokensConfig.js";
import { LOG } from "../utils/util.logger.js";

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
export async function buildCSSUtilsTypeScript({
  config,
  dirs,
}: ResolvedButteryTokensConfig) {
  const Templates = new MakeTemplates({
    config,
    outDir: dirs.output.namespace,
    css: {
      outDir: dirs.output.out,
      fileName: config.runtime.namespace,
    },
  });

  // Register the templates that should be generated
  Templates.register(MakeTemplateColor);
  Templates.register(MakeTemplateFontFamily);
  Templates.register(MakeTemplateFontWeight);
  Templates.register(MakeTemplateFontBaseSize);
  Templates.register(MakeTemplateRem);
  Templates.register(MakeTemplatePx);
  Templates.register(MakeTemplateResponsive);
  Templates.register(MakeTemplateReset);
  // Templates.register(MakeTemplateSpace);
  if (config.custom) {
    Templates.register(MakeTemplateCustom);
  }

  // Generate all of the registered templates
  LOG.debug("Generating make functions...");
  await Templates.generate();
  LOG.debug("Generating make functions.. done.");

  // create a tsconfig.json in the output directory
  const tsconfigJsonContent = JSON.stringify({
    extends: "@buttery/tsconfig/library",
    compilerOptions: {
      noEmit: false,
      declaration: true,
    },
  });

  try {
    LOG.debug("Creating tsconfig...");
    await writeFile(dirs.output.namespaceTsconfig, tsconfigJsonContent);
    LOG.debug("Creating tsconfig... done.");
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }

  // transpile the typescript files
  LOG.debug("Building & transpiling...");
  const cmd = `tsc --project ${dirs.output.namespaceTsconfig}`;
  const transpile = () =>
    new Promise<void>((resolve, reject) => {
      exec(cmd, (error, stdout) => {
        if (error) {
          const err = String(error);
          reject(stdout ? `${stdout}:${err}` : err);
          throw LOG.fatal(new Error());
        }
        resolve();
      });
    });

  const res = await tryHandle(transpile)();
  if (res.hasError) {
    throw new Error(
      `Error when trying to transpile the "${config.runtime.namespace}" utils. This is most likely an issue with @buttery/tokens. Please log a Github issue.
${res.error}`
    );
  }

  // move the styles over to the root directory

  LOG.debug("Building & transpiling... done.");
}
