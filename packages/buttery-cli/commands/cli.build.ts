import type { CommandAction, CommandMeta, CommandOptions } from "../lib/types";
import { build } from "../src/script.build.js";
import { LOG } from "../src/util.logger";

export const meta: CommandMeta = {
  name: "build",
  description: "Build your file-based CLI"
};

export const options: CommandOptions<"autofix"> = {
  autofix: {
    alias: "af",
    description:
      "Prompts the user to add a description to any missing command files during the build process",
    type: "boolean",
    required: false
  }
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  try {
    LOG.debug("Building for production...");
    await build({ watch: false, local: false });
    LOG.success("Building for production... complete.");
  } catch (error) {
    throw new Error(error as string);
  }
};
