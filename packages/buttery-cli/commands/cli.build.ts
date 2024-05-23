import type { CommandAction, CommandMeta, CommandOptions } from "../lib/types";
import { build } from "./_cli.build/script.build.js";
import { LOG } from "./_utils";

export const meta: CommandMeta = {
  name: "build",
  description: "Build your file-based CLI"
};

export const options: CommandOptions<"autofix" | "debug"> = {
  debug: {
    alias: "d",
    description: "Run the build command with more verbose logging",
    type: "boolean",
    required: false
  },
  autofix: {
    alias: "af",
    description:
      "Prompts the user to add a description to any missing command files during the build process",
    type: "boolean",
    required: false
  }
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  if (options.debug) {
    LOG.level = "info";
  } else {
    LOG.level = "error";
  }

  try {
    LOG.debug("Building for production...");
    await build({ watch: false, local: false });
    LOG.success("Building for production... complete.");
  } catch (error) {
    throw new Error(error as string);
  }
};
