import { exit } from "node:process";
import type {
  CommandAction,
  CommandMeta,
  CommandOptions
} from "../../../artifacts/buttery-commands";
import { LOG } from "../../../lib/logger/LOG_CLI/LOG.CLI";
import { buildButteryTokens } from "../tokens/tokens.buildButteryTokens";

export const meta: CommandMeta = {
  name: "build",
  description: "Run the buttery-tokens CLI in watch mode."
};

export const options: CommandOptions<{ prompt: boolean }> = {
  prompt: {
    type: "boolean",
    alias: "np",
    description:
      "A boolean option to disable command line prompts if the proper configurations aren't detected.",
    required: false
  }
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  try {
    await buildButteryTokens({
      debug: false,
      interactive: false,
      watch: false,
      prompt: options.prompt,
      isLocal: false
    });
    LOG.success("Successfully built buttery tokens!");
    exit();
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
};
