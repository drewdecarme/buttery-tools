import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { TokensConfig } from "../lib/types";
import { tokenLogger } from "../utils";
import type { MakeTemplate } from "./MakeTemplate";

export class MakeTemplates {
  private templates: MakeTemplate[];
  private config: TokensConfig;
  outDir: string;
  /**
   * The path of the barrel file that will include
   * all of the functional exports
   */
  entryFile: string;

  constructor(options: { config: TokensConfig; outDir: string }) {
    this.config = options.config;
    this.outDir = options.outDir;
    this.entryFile = path.resolve(this.outDir, "./index.ts");
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

    for (const template of this.templates) {
      const fileContent = template.compile(this.config);
      const fileName = template.functionName;
      const filePath = path.resolve(this.outDir, `./${fileName}.ts`);

      try {
        tokenLogger.debug(`Generating function "${fileName}" from template...`);
        await writeFile(filePath, fileContent, { encoding: "utf8" });
        tokenLogger.debug(
          `Generating function "${fileName}" from template... done.`
        );
        indexFileContent = indexFileContent.concat(
          `export * from "./${fileName}";\n`
        );
      } catch (error) {
        const err = new Error(
          `Error when generating "${fileName}" at "${filePath}": ${error}`
        );
        tokenLogger.fatal(err);
        throw err;
      }

      try {
        tokenLogger.debug("Creating entry point...");
        await writeFile(this.entryFile, indexFileContent, { encoding: "utf8" });
        tokenLogger.debug("Creating entry point... done.");
      } catch (error) {
        const err = new Error(
          `Error when generating the barrel file for consumption: ${error}`
        );
        tokenLogger.fatal(err);
        throw err;
      }
    }
  }
}
