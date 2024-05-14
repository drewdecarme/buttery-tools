import { CommandAction, CommandMeta, CommandOptions } from "../lib/types";

export const meta: CommandMeta = {
  name: "build",
  description: "Build your file-based CLI",
};

export const options: CommandOptions = {
  ["auto-fix"]: {
    alias: "af",
    description:
      "Prompts the user to add a description to any missing command files during the build process",
    type: "boolean",
    required: false,
  },
};

export const action: CommandAction = async (args) => {
  console.log(args);
};
