import path from "node:path";
import type { ButteryConfig } from "@buttery/cli";

import type { TokensConfig } from "../lib/types";
import { MakeTemplates } from "./Template";
import { MakeTemplateFontFamily } from "./template.makeFontFamily";

// type TransformerOptions = {
//   butteryConfig: ButteryConfig;
//   tokensConfig: TokensConfig;
// };

// class Transformer {
//   private butteryConfig: ButteryConfig;
//   private replacements: {
//     BUTTERY_CONST__PREFIX: string;
//     BUTTERY_CONST__FONT_FAMILY: string;
//     BUTTERY_CONST__FONT_WEIGHT: string;
//   };
//   private replacementEntries: [string, string][];
//   tempDir: string;
//   srcDir: string;
//   tempTemplate: string;
//   srcTemplate: string;

//   constructor(options: TransformerOptions) {
//     this.butteryConfig = options.butteryConfig;
//     this.tokensConfig = options.tokensConfig;
//     this.tempDir = path.resolve(
//       this.butteryConfig.root,
//       "./.tokens/javascript/"
//     );
//     this.this.tempTemplate = path.resolve(
//       this.tempDir,
//       "./javascript.utils.ts"
//     );
//     this.srcDir = path.resolve(this.butteryConfig.root, "./src/javascript/");
//   }

//   /**
//    * Creates a union type from an array of strings
//    */
//   private createUnionType(arr: string[]): string[] {
//     const union = arr.reduce<string[]>((accum, val, i, origArr) => {
//       accum.push(`"val"`);
//       if (i < origArr.length - 1) {
//         accum.push("|");
//       }
//       return accum;
//     }, []);
//     return union;
//   }

//   private createObject(obj: Record<string, unknown>): string {
//     return JSON.stringify(obj);
//   }

//   private createString(str: string): string {
//     return `"${str}"`;
//   }

//   set tokensConfig(config: TokensConfig) {
//     tokenLogger.debug("Setting tokens config to regex values...");
//     this.replacements = {
//       // global
//       BUTTERY_CONST__PREFIX: this.createString(config.prefix),

//       // font
//       BUTTERY_CONST__FONT_FAMILY: this.createObject(config.font.family),
//       BUTTERY_CONST__FONT_WEIGHT: this.createObject(config.font.weight)
//     };
//     this.replacementEntries = Object.entries(this.replacements);
//     tokenLogger.debug("Setting tokens config to regex values... done.");
//   }

//   // TODO: Change this to ensure
//   private async ensureTempDir() {
//     try {
//       tokenLogger.debug("Creating working temp dir...");

//       // copy the js to another temp directory
//       await cp(this.srcDir, this.tempDir, { recursive: true, force: true });
//       tokenLogger.debug("Creating working temp dir... done.");
//     } catch (error) {
//       tokenLogger.fatal(new Error(error));
//     }
//   }

//   // TODO: Add classes for each of the functions
//   // that should be generated

//   private async generateMakeFontFamily() {
//     const template = `import { type MakeFontFamily, prefix } from "./javascript.utils";

// type FontFamily =
// type MakeFontFamily = (fontFamilyName: FontFamily) => string;

// export const makeFontFamily: MakeFontFamily = (value) => {
//   return "var(--${this.tokensConfig.prefix}-font-family-${value})";
// };
// `;
//   }
//   private async generateMakeFontWeight() {}

//   async generateFunctions() {
//     try {
//       await this.ensureTempDir();

//       tokenLogger.debug("Pre-compiling templated variables and types...");
//       // get the config file contents
//       let javascriptConfig = await readFile(this.tempTemplate, {
//         encoding: "utf8"
//       });

//       // go through all of the replacement entires and
//       // update their template values
//       for (const [key, value] of this.replacementEntries) {
//         const regex = new RegExp(`"\\{\\{\\{${key}\\}\\}\\}"`, "g");
//         javascriptConfig = javascriptConfig.replace(regex, value);
//       }
//       tokenLogger.debug("Pre-compiling templated variables and types... done");

//       tokenLogger.debug("Writing compiled template to temp dir...");
//       await writeFile(this.tempTemplate, javascriptConfig);
//       tokenLogger.debug("Writing compiled template to temp dir... done");
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

/**
 * The build script that takes the files in the /src/ts directory
 * pre-compiles them and then builds them into dist/js directory
 */
export const buildTokensJavascript = async ({
  butteryConfig,
  tokensConfig
}: {
  butteryConfig: ButteryConfig;
  tokensConfig: TokensConfig;
}) => {
  const Templates = new MakeTemplates({
    config: tokensConfig,
    outDir: path.resolve(butteryConfig.root, "./.tokens/javascript/")
  });

  Templates.register(MakeTemplateFontFamily);

  await Templates.generate();

  // Create a new transformer
  // const transformer = new Transformer({ butteryConfig, tokensConfig });
  // const tsPlugin = new EsbuildPluginTypescriptCompiler({
  //   tsConfigPath: path.resolve(butteryConfig.root, "./tsconfig.lib-js.json")
  // });
  // const plugins = [tsPlugin.getPlugin()];

  // // TODO: Watch for the tokensConfig file change...
  // // TODO: When developing locally listen to the /src/javascript folder and run createTemp and transform
  // await transformer.generateFunctions();
  // // BELOW STOP

  // const buildOptions = createEsbuildOptions({
  //   entryPoints: [transformer.tempTemplate],
  //   outfile: path.resolve(butteryConfig.root, "./dist/javascript/index.js"),
  //   plugins
  // });

  // try {
  //   tokenLogger.debug("Bundling...");
  //   await build(buildOptions);
  //   tokenLogger.debug("Bundling... done.");
  // } catch (error) {
  //   const err = new Error(error);
  //   tokenLogger.fatal(err);
  //   throw err;
  // }
};
