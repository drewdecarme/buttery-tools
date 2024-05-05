import { CommandAction, CommandMeta, CommandOptions } from "../lib/types";

export const meta: CommandMeta = {
  name: "create-command",
  description: "Bootstrap a new file based CLI command via a few prompts",
};

export const args: CommandOptions = {
  watch: {
    alias: "w",
    type: "boolean",
    description:
      "Run the build command in watch mode. Any changes to command files will automatically be re-built.",
    required: false,
  },
};

export const action: CommandAction = async (args) => {
  // This is where you make the index.js file where the commands
  // will have an entry point...

  console.log("Hello from the CLI 'create-command' command.", args);
};
