import type { CommandAction, CommandMeta, CommandOptions } from "../../../lib";
import { LOG_TOKENS } from "../tokens/tokens.logger";
import { buildTokens } from "./tokens.build";

export const meta: CommandMeta = {
  name: "build",
  description: "Run the buttery-tokens CLI in watch mode.",
};

export const action: CommandAction = async () => {
  try {
    await buildTokens({
      debug: false,
      interactive: false,
      watch: false,
      // TODO: Might need to change this
      prompt: false,
    });
  } catch (error) {
    throw LOG_TOKENS.fatal(new Error(error as string));
  }
};
