import { inlineTryCatch } from "@buttery/core/utils/isomorphic";
import { getCommandProperties } from "../utils/getCommandProperties";
import type { WellFormedCommand } from "../utils/runtime.types";
import type { ButteryCommandsManifest } from "../utils/utils";
import { getArgs } from "./get-args";
import { getOptions } from "./get-options";

/**
 * Provided a manifest entry point, loop through all of the
 * manifest entries to find the one that matches the args
 */
export async function getCommand(
  argv: string[],
  manifest: ButteryCommandsManifest
): Promise<WellFormedCommand> {
  // Get the root command entry
  let cmd = Object.values(manifest)[0];

  let index = 0;
  while (index < argv.length) {
    const arg = argv[index];

    // Check if the current argument is a subcommand of the current command
    if (cmd.subCommands?.[arg]) {
      // Move into the subcommand context
      cmd = cmd.subCommands[arg];
      index++;
    } else {
      break;
    }
  }

  // don't parse the help args so filter them out of the remaining args
  const remainingArgs = argv
    .slice(index)
    .filter((arg) => arg !== "--help" && arg !== "-h");

  // Parse the options
  const cmdOptionsResult = await inlineTryCatch(getOptions)(
    remainingArgs,
    cmd.options ?? {}
  );
  if (cmdOptionsResult.hasError) {
    throw cmdOptionsResult.error;
  }

  // Parse the args
  const cmdArgsResult = await inlineTryCatch(getArgs)(
    remainingArgs,
    cmd.args ?? {}
  );
  if (cmdArgsResult.hasError) {
    throw cmdArgsResult.error;
  }

  // remove help from the options so it doesn't show up
  // in the action
  const { help, ...options } = cmdOptionsResult.data;

  return {
    command: cmd,
    options,
    args: cmdArgsResult.data,
    properties: getCommandProperties(cmd),
  };
}
