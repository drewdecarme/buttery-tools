import type { CommandAction, CommandOptions } from "../../../dist";
import type { CommandMeta } from "../../../lib/types";
import { type BuildTokensOptions, build } from "../tokens/tokens.build";
import { LOG_TOKENS } from "../tokens/tokens.logger";

export const meta: CommandMeta = {
  name: "dev",
  description:
    "Iteratively develop @buttery/tokens `make` functions based upon the `buttery/config.tokens`",
};

type TokensDevOptions = Pick<BuildTokensOptions, "interactive">;

export const options: CommandOptions<"no-prompt" | keyof TokensDevOptions> = {
  "no-prompt": {
    type: "boolean",
    alias: "np",
    description:
      "A boolean option to disable command line prompts if the proper configurations aren't detected.",
    required: false,
  },
  interactive: {
    alias: "i",
    description:
      "Runs the build in watch mode and opens up a local server to configure your tokens through a UI",
    type: "boolean",
    required: false,
  },
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  try {
    LOG_TOKENS.debug("Running `tokens.dev` command");
    // enable configuration prompting by default
    const prompt = !options?.["no-prompt"];
    const interactive = !options.interactive;

    await build({
      debug: false,
      interactive,
      prompt,
      watch: true,
    });
  } catch (error) {
    throw LOG_TOKENS.fatal(new Error(error));
  }
};
