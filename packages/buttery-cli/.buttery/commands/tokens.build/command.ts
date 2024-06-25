import type { CommandAction, CommandMeta, CommandOptions } from "../../../lib";
import { LOG_TOKENS } from "../tokens/tokens.logger";
import { type TokensBuildOptions, buildTokens } from "./tokens.build";

export const meta: CommandMeta = {
  name: "build",
  description: "Run the buttery-tokens CLI in watch mode.",
};

export const options: CommandOptions<keyof TokensBuildOptions> = {
  debug: {
    alias: "d",
    description:
      "Runs the build with a specific logging level set to debug the build process.",
    type: "boolean",
    required: false,
  },
  watch: {
    alias: "w",
    description:
      "Runs the build in development mode. Any changes to commands will rebuild the CLI",
    type: "boolean",
    required: false,
  },
  interactive: {
    alias: "i",
    description:
      "Runs the playground to visually view and edit the tokens configuration",
    type: "boolean",
    required: false,
  },
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  try {
    await buildTokens({
      debug: Boolean(options.debug),
      interactive: Boolean(options.interactive),
      watch: Boolean(options.watch),
    });
  } catch (error) {
    throw LOG_TOKENS.fatal(new Error(error as string));
  }
};
