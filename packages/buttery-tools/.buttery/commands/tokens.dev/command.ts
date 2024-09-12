import type { CommandAction, CommandOptions } from "../../../dist";
import type { CommandMeta } from "../../../lib/types";
import { buildButteryTokens } from "../tokens/tokens.buildButteryTokens";
import { LOG_TOKENS } from "../tokens/tokens.logger";

export const meta: CommandMeta = {
  name: "dev",
  description:
    "Iteratively develop @buttery/tokens `make` functions based upon the `buttery/config.tokens`"
};

export const options: CommandOptions<{
  prompt: boolean;
  interactive: boolean;
  debug: boolean;
}> = {
  interactive: {
    alias: "i",
    defaultValue: false,
    description:
      "Runs the build in watch mode and opens up a local server to configure your tokens through a UI",
    type: "boolean",
    required: false
  },
  prompt: {
    type: "boolean",
    defaultValue: false,
    alias: "p",
    description:
      "A boolean option to enabled command line prompts if the proper configurations aren't detected.",
    required: false
  },
  debug: {
    type: "boolean",
    defaultValue: false,
    alias: "d",
    description:
      "Prints all of the logs to stdout to easily see all of the activity to create the tokens.",
    required: false
  }
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  try {
    LOG_TOKENS.debug("Running `tokens.dev` command");

    // TODO: Create a central function to reconcile options from defaultOptions

    await buildButteryTokens({
      debug: options.debug,
      interactive: options.interactive,
      prompt: options.prompt,
      watch: true,
      isLocal: false
    });
  } catch (error) {
    throw LOG_TOKENS.fatal(new Error(error));
  }
};