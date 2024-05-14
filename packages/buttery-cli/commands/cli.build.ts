import { CommandAction, CommandMeta, CommandOptions } from "../lib/types";
import { build } from "../src/script.build.js";

export const meta: CommandMeta = {
  name: "build",
  description: "Build your file-based CLI",
};

export const options: CommandOptions<"autofix"> = {
  autofix: {
    alias: "af",
    description:
      "Prompts the user to add a description to any missing command files during the build process",
    type: "boolean",
    required: false,
  },
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  try {
    await build({ watch: false, local: false });
  } catch (error) {
    throw error;
  }
};
