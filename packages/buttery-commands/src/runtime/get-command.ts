import { inlineTryCatch } from "@buttery/core/utils/isomorphic";

import { getArgs } from "./get-args";
import { getOptions } from "./get-options";

import type { WellFormedCommand } from "../utils/runtime.types";
import type { ButteryCommandsGraph } from "../utils/utils";

/**
 * Provided a manifest entry point, loop through all of the
 * manifest entries to find the one that matches the args
 */
export async function getCommand(
  argv: string[],
  manifestGraph: ButteryCommandsGraph
): Promise<WellFormedCommand> {
  // Get the root command entry
  let cmd = Object.values(manifestGraph)[0];
  let cmdArgs = argv;

  let index = 0;
  while (index < argv.length) {
    const arg = argv[index];

    // Check if the current argument is a subcommand of the current command
    if (cmd.subCommands?.[arg]) {
      // Move into the subcommand context
      cmd = cmd.subCommands[arg];
      cmdArgs = cmdArgs.filter((cmdArg) => cmdArg !== arg); // filter out the sub-command from the args
      index++;
    } else {
      break;
    }
  }

  // If there aren't any args at all or there's a help option included
  // in the arguments, then we're going to run the command which will
  // the in turn run the help menu. We're only going to do this as long
  // as there are no positional arguments that are required. Otherwise that
  // would be a falsy command.
  const cmdCalledWithHelp = argv.includes("--help") || argv.includes("-h");
  const showAutoHelp =
    cmdArgs.length === 0 && !cmd.meta.hasRequiredArgs && !cmd.meta.hasAction;
  if (cmdCalledWithHelp || showAutoHelp) {
    return {
      command: cmd,
      options: {},
      args: {},
    };
  }

  // Parse the args
  const positionalArgs = cmdArgs.filter(
    (arg) => !arg.includes("--") || !arg.includes("-")
  );
  const cmdArgsResult = await inlineTryCatch(getArgs)(
    positionalArgs,
    cmd.args ?? {}
  );
  if (cmdArgsResult.hasError) {
    throw cmdArgsResult.error;
  }

  // Parse the options
  const optionArgs = cmdArgs.filter((arg) => arg !== "--help" && arg !== "-h");
  const cmdOptionsResult = await inlineTryCatch(getOptions)(
    optionArgs,
    cmd.options ?? {}
  );
  if (cmdOptionsResult.hasError) {
    throw cmdOptionsResult.error;
  }

  // remove help from the options so it doesn't show up
  // in the action
  const { help, ...options } = cmdOptionsResult.data;

  return {
    command: cmd,
    options,
    args: cmdArgsResult.data,
  };
}
