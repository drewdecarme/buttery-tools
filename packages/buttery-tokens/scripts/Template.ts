import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { TokensConfig } from "../lib/types";
import { tokenLogger } from "../utils";

// export type MakeTemplateLiteralFunction = (
//   strings: TemplateStringsArray,
//   config: TokensConfig,
//   methods: MakeTemplate["methods"]
// ) => string;

export type TemplateFunction = (
  config: TokensConfig,
  methods: MakeTemplate["methods"],
  functionName: string
) => string;

export type MakeTemplateOptions = {
  functionName: string;
  template: TemplateFunction;
};

export class MakeTemplate {
  functionName: string;
  template: TemplateFunction;
  private methods: { createTypeUnion: (arr: string[]) => string };

  constructor(options: MakeTemplateOptions) {
    this.functionName = options.functionName;
    this.template = options.template;
    this.methods = {
      createTypeUnion: this.createUnionType
    };
  }

  private createUnionType(arr: string[]): string {
    return arr.reduce<string>((accum, val, i, origArr) => {
      accum.concat(`"${val}"`);
      if (i < origArr.length - 1) {
        return accum.concat(`"${val}" | `);
      }
      return accum.concat(`"${val}"`);
    }, "");
  }

  compile(config: TokensConfig) {
    return this.template(config, this.methods, this.functionName);
  }
}

export class MakeTemplates {
  private templates: MakeTemplate[];
  private config: TokensConfig;
  outDir: string;

  constructor(options: { config: TokensConfig; outDir: string }) {
    this.config = options.config;
    this.outDir = options.outDir;
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
        tokenLogger.debug("Generating function from template...", {
          fileName,
          filePath
        });
        await writeFile(filePath, fileContent, { encoding: "utf8" });
        tokenLogger.debug("Generating function from template... done.");
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
        const indexFilePath = path.resolve(this.outDir, "./index.ts");
        await writeFile(indexFilePath, indexFileContent, { encoding: "utf8" });
        tokenLogger.success("Creating entry point... done.");
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
