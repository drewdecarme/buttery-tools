import { select } from "@inquirer/prompts";

import type { ResolvedButteryConfig } from "../../../lib/config/getButteryConfig";
import { LOG_CLI } from "../../../lib/logger/loggers";
import type { ButteryTokensConfig } from "./tokens.getButteryTokensConfig";

/**
 * Provided a resolved tokens configuration from the `.buttery/config`, this function
 * will return 1 tokens config that can be used to launch the playground UI.
 */
export async function launchPlaygroundGetConfig(
  config: ResolvedButteryConfig<"tokens">
): Promise<ButteryTokensConfig> {
  const { tokens, ...restConfig } = config;

  try {
    if (Array.isArray(tokens)) {
      // If the tokens configuration is an array, then make the
      // user select which configuration they want to launch in the
      // interactive UI playground
      LOG_CLI.info("Detected more than one tokens configuration.");
      const choice = await select({
        message:
          "Please select which configuration you would like to load into the interactive token config UI",
        choices: tokens.map((tokenConfig, i) => ({
          name: tokenConfig.namespace,
          value: i
        }))
      });
      return {
        ...restConfig,
        tokens: tokens[choice]
      };
    }

    return {
      ...restConfig,
      tokens
    };
  } catch (error) {
    throw LOG_CLI.fatal(
      new Error(
        `Fatal error when trying to resolve a single tokens configuration from the '.buttery/tokens' config: ${(error as Error).message}`
      )
    );
  }
}
