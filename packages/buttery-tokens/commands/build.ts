import type { CommandAction, CommandMeta, CommandOptions } from "@buttery/cli";
import { build } from "../scripts/script.build";

export const meta: CommandMeta = {
  name: "build",
  description: "Run the buttery-tokens CLI in watch mode."
};

export const options: CommandOptions<"debug"> = {
  debug: {
    alias: "d",
    description:
      "Runs the build with a specific logging level set to debug the build process.",
    type: "boolean",
    required: false
  }
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  await build({ watch: false, debug: !!options.debug });
};
