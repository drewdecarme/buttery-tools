import type { GetButteryConfigOptions } from "@buttery/core";
import type { CommandAction, CommandOptions } from "../../../dist";
import type { CommandMeta } from "../../../lib/types";
import { getButteryTokensConfig } from "../tokens/tokens.getButteryTokensConfig";
import { LOG_TOKENS } from "../tokens/tokens.logger";

export const meta: CommandMeta = {
  name: "dev",
  // TODO: Fix this description
  description: "develop buttery tokens",
};

export const options: CommandOptions<"no-prompt"> = {
  "no-prompt": {
    type: "boolean",
    alias: "np",
    description:
      "A boolean option to disable command line prompts if the proper configurations aren't detected.",
    required: false,
  },
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  try {
    LOG_TOKENS.debug("Running `tokens.dev` command");
    // enable configuration prompting by default
    const prompt = !options?.["no-prompt"];

    const config = await getButteryTokensConfig({
      prompt,
      defaultConfig: "tokens",
    });
  } catch (error) {
    throw LOG_TOKENS.fatal(new Error(error));
  }
};
