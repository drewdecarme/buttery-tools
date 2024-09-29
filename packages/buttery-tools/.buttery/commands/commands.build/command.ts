import type {
  CommandAction,
  CommandMeta,
  CommandOptions
} from "../../../lib/commands/butter-commands.types";
import { LOG_CLI } from "../../../lib/logger/loggers";
import { buildCommands } from "./build-commands";

export const meta: CommandMeta = {
  name: "build",
  description: "Build your file-based CLI"
};

export const options: CommandOptions<{ autofix: boolean; debug: boolean }> = {
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
    LOG_CLI.level = "info";
  } else {
    LOG_CLI.level = "error";
  }

  await buildCommands({ watch: false, local: false });
};
