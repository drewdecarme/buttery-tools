import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ButteryConfigTokens } from "@buttery/core/config";
import { LOG } from "../logger";
import type { MakeTemplate } from "./MakeTemplate";

export class MakeTemplates {
  private templates: MakeTemplate[];
  private config: ButteryConfigTokens;
  private css: {
    outDir: string;
    fileName: string;
  };
  outDir: string;
  /**
   * The path of the barrel file that will include
   * all of the functional exports
   */
  entryFile: string;
  /**
   * the path of the config json file that
   * contains a json representation of the
   * config.
   */
  private configOutFilePath: string;
  tokensCSSFile: string;

  constructor(options: {
    config: ButteryConfigTokens;
    outDir: string;
    css: {
      outDir: string;
      fileName: string;
    };
  }) {
    this.config = options.config;
    this.outDir = options.outDir;
    this.css = options.css;
    this.entryFile = path.resolve(this.outDir, "./index.ts");
    this.configOutFilePath = path.resolve(this.outDir, "./config.ts");
    this.tokensCSSFile = path.resolve(
      this.css.outDir,
      `./${this.css.fileName}.css`
    );
    this.templates = [];
  }

  register(template: MakeTemplate) {
    this.templates.push(template);
  }

  private async ensureOutDir() {
    await mkdir(this.outDir, { recursive: true });
  }

  async generate() {
    await this.ensureOutDir();
    let indexFileContent = "";
    let tokensCSSFileContent = "";

    //
    for (const template of this.templates) {
      const { compiledFunctionContent, compiledCSSVars } = template.compile(
        this.config
      );
      const fileName = template.functionName;
      const filePath = path.resolve(this.outDir, `./${fileName}.ts`);

      try {
        LOG.debug(`Generating function "${fileName}" from template...`);
        await writeFile(filePath, compiledFunctionContent, {
          encoding: "utf8",
        });
        LOG.debug(`Generating function "${fileName}" from template... done.`);

        // add the function to a barrel file
        indexFileContent = indexFileContent.concat(
          `export * from "./${fileName}.js";\n`
        );
        // add the css to the root css
        tokensCSSFileContent = tokensCSSFileContent.concat(compiledCSSVars);
      } catch (error) {
        const err = new Error(
          `Error when generating "${fileName}" at "${filePath}": ${error}`
        );
        LOG.fatal(err);
        throw err;
      }
    }

    // create the entry point barrel file
    try {
      LOG.debug("Creating config file...");
      await writeFile(
        this.configOutFilePath,
        `export const config = ${JSON.stringify(this.config)}`,
        { encoding: "utf8" }
      );
      indexFileContent = indexFileContent.concat(
        `export * from "./config.js";\n`
      );
      LOG.debug("Creating config file... done");
      LOG.debug("Creating entry point...");
      await writeFile(this.entryFile, indexFileContent, { encoding: "utf8" });
      LOG.debug("Creating entry point... done.");
    } catch (error) {
      const err = new Error(
        `Error when generating the barrel file for consumption: ${error}`
      );
      LOG.fatal(err);
      throw err;
    }

    // create the root css file
    try {
      LOG.debug("Creating root css...");
      // wrap the tokens in the root
      tokensCSSFileContent = `:root {
${tokensCSSFileContent}}`;
      await writeFile(this.tokensCSSFile, tokensCSSFileContent, {
        encoding: "utf8",
      });
    } catch (error) {
      const err = new Error(`Error when generating tokens CSS file: ${error}`);
      LOG.fatal(err);
      throw err;
    }
  }
}
