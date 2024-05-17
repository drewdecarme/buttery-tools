import { cp, readFile, stat } from "node:fs/promises";
import path from "node:path";
import type { ButteryConfig } from "@buttery/cli";
import type { Plugin } from "esbuild";
import type { TokensConfig } from "../lib/types";
import { tokenLogger } from "../utils";

export type ESBuildPluginBuildTokensOptions = {
  butteryConfig: ButteryConfig;
  tokensConfig: TokensConfig;
};

export class ESBuildPluginBuildTokens {
  private butteryConfig: ButteryConfig;
  private tokensConfig: TokensConfig;
  private replacements: {
    BUTTERY_CONST__PREFIX: string;
    BUTTERY_TYPE__FONT_FAMILY: string;
  };
  private replacementEntries: [string, string][];

  constructor(options: ESBuildPluginBuildTokensOptions) {
    this.butteryConfig = options.butteryConfig;
    this.tokensConfig = options.tokensConfig;
    this.replacements = {
      // global
      BUTTERY_CONST__PREFIX: this.tokensConfig.prefix,

      // font
      BUTTERY_TYPE__FONT_FAMILY: this.createUnionType(
        Object.keys(this.tokensConfig.font.family)
      )
    };
    this.replacementEntries = Object.entries(this.replacements);
  }

  /**
   * Creates a union type from an array of strings
   */
  private createUnionType(arr: string[]): string {
    return arr.join(" | ");
  }

  getPlugin(): Plugin {
    return {
      name: "build-tokens",
      setup: (build) => {
        build.onLoad({ filter: /javascript\.utils\.ts$/ }, async (args) => {
          tokenLogger.debug("Pre-compiling templated variables and types...");
          // get the config file contents
          let javascriptConfig = await readFile(args.path, {
            encoding: "utf-8"
          });

          // go through all of the replacement entires and
          // update their template values
          for (const [key, value] of this.replacementEntries) {
            const regex = new RegExp(`\\{\\{\\{${key}\\}\\}\\}`, "g");
            javascriptConfig = javascriptConfig.replace(regex, value);
          }

          tokenLogger.debug(
            "Pre-compiling templated variables and types... done"
          );

          return {
            contents: javascriptConfig,
            loader: "ts"
          };
        });
      }
    };
  }
}
