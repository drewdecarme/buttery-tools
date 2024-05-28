import type { CommandAction, CommandMeta, CommandOptions } from "@buttery/cli";
import { buildFunctionsAndTokens } from "../src/scripts/script.build-functions-and-tokens";
import { launchPlayground } from "../src/scripts/script.launch-playground";
import { tokenLogger } from "../src/utils";

export const meta: CommandMeta = {
  name: "build",
  description: "Run the buttery-tokens CLI in watch mode."
};

export const options: CommandOptions<"debug" | "watch" | "interactive"> = {
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
  },
  interactive: {
    alias: "i",
    description:
      "Runs the playground to visually view and edit the tokens configuration",
    type: "boolean",
    required: false
  }
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  tokenLogger.debug("Building buttery tokens...", options);

  await buildFunctionsAndTokens({
    watch: Boolean(options.watch),
    interactive: Boolean(options.interactive)
  });

  tokenLogger.success("Build complete!");
};
