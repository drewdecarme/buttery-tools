import type { CommandAction, CommandMeta, CommandOptions } from "../../../lib";
import { LOG_TOKENS } from "../tokens/tokens.config.logger";
import { build } from "./tokens.build";

export const meta: CommandMeta = {
  name: "build",
  description: "Run the buttery-tokens CLI in watch mode.",
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

export const action: CommandAction = async ({ options }) => {
  try {
    const prompt = !options?.["no-prompt"];

    await build({
      debug: false,
      interactive: false,
      watch: false,
      prompt,
    });
  } catch (error) {
    throw LOG_TOKENS.fatal(new Error(error as string));
  }
};
