import { exec } from "node:child_process";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import type { ButteryConfigTokens } from "@buttery/config";
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
import tsconfigJson from "./tsconfig.json" with { type: "json" };

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
  namespacedOutDir: string
) {
  const Templates = new MakeTemplates({
    config: tokensConfig,
    outDir: namespacedOutDir
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
  const tsconfigJsonContent = JSON.stringify(
    // { include: [Templates.entryFile], ...tsconfigJson },
    tsconfigJson,
    null,
    2
  );
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
    const { stderr } = await execAsync(
      `tsc --project ${tsconfigJsonPath} --outDir ${namespacedOutDir}`
    );
    if (stderr) {
      throw stderr;
    }
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }

  LOG.debug("Building & transpiling... done.");

  // build the ts files into the output directory
  // try {
  //   LOG.debug("Building library...");
  //   await build({
  //     // esbuild: {
  //     //   target: "esnext"
  //     // },
  //     // clearScreen: false,
  //     // build: {
  //     //   emptyOutDir: true,
  //     //   outDir: dirs.output.path,
  //     //   lib: {
  //     //     entry: Templates.entryFile,
  //     //     formats: ["es"],
  //     //     fileName: (entryName) => `${entryName}.js`
  //     //   },
  //     //   rollupOptions: {
  //     //     output: {
  //     //       preserveModules: true
  //     //     }
  //     //   }
  //     // },
  //     plugins: [
  //       {
  //         name: "vite-plugin-tsc",
  //         buildEnd() {
  //           LOG.debug("Building library... done.");
  //           return new Promise((resolve, reject) => {
  //             // Use the tsconfig path to transpile the files
  //             LOG.debug("Creating distribution types...");
  //           });
  //         }
  //       }
  //     ]
  //   });
  // } catch (error) {
  //   throw LOG.fatal(new Error(error as string));
  // }

  // Create a plugin to eventually transpile the .tokens directory
  // and assemble the ESBuild options for that entry / barrel file.
  // const tsPlugin = new EsbuildPluginTypescriptCompiler({
  //   tsConfigPath: dirs.root.tsConfigPath
  // });
  // const buildOptions = createEsbuildOptions({
  //   entryPoints: [Templates.entryFile],
  //   outfile: path.resolve(dirs.output.path, "./index.js"),
  //   plugins: [
  //     // transpile and create files
  //     tsPlugin.getPlugin({
  //       filePathToTranspile: Templates.entryFile,
  //       extraArgs: [`--outDir ${dirs.output.path}`]
  //     })
  //   ]
  // });

  // // Transpile the templates
  // LOG.debug("Transpiling generated files...");
  // await build(buildOptions);
  // LOG.debug("Transpiling generated files... done.");
}
