import type { CommandAction, CommandMeta, CommandOptions } from "@buttery/cli";
import { buildFunctionsAndTokens } from "../src/scripts/script.build-functions-and-tokens";
import { getButteryConfig, tokenLogger } from "../src/utils";
import { getTokensConfig } from "../src/utils/util.get-tokens-config";

export const meta: CommandMeta = {
  name: "build",
  description: "Run the buttery-tokens CLI in watch mode."
};

export const options: CommandOptions<"debug" | "watch"> = {
  debug: {
    alias: "d",
    description:
      "Runs the build with a specific logging level set to debug the build process.",
    type: "boolean",
    required: false
  },
  watch: {
    alias: "w",
    description:
      "Runs the build in development mode. Any changes to commands will rebuild the CLI",
    type: "boolean",
    required: false
  }
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  tokenLogger.debug("Building buttery tokens...", options);

  // Get the `buttery.config` to baseline some variables
  // The `buttery.config` is included in the distribution via package.json files
  // and it's set as a JS file so it can be consumed without a lot of configuration
  tokenLogger.debug("Fetching necessary configuration files...");
  const butteryConfig = await getButteryConfig();
  const tokensConfig = await getTokensConfig();
  tokenLogger.debug("Fetching necessary configuration files... done.");

  await buildFunctionsAndTokens({
    watch: Boolean(options.watch),
    butteryConfig,
    tokensConfig: tokensConfig.config,
    tokensConfigPath: tokensConfig.filepath
  });

  tokenLogger.success("Build complete!");
};
