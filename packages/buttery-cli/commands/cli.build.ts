import { CommandAction, CommandMeta, CommandOptions } from "../types";

export const meta: CommandMeta = {
  name: "build",
  description: "Build your file-based CLI",
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

  console.log("Hello from the CLI 'build' command.", args);
};
