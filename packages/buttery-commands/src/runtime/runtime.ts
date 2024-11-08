import { inlineTryCatch } from "@buttery/core/utils/isomorphic";
import { getCommandProperties } from "../utils/getCommandProperties.js";
import type { WellFormedCommand } from "../utils/runtime.types.js";
import {
  type ButteryCommandManifestEntry,
  type ButteryCommandsManifest,
  LOG,
} from "../utils/utils.js";
import { parseArgsFromArgv } from "./parse-args-from-argv.js";
import { parseOptionsFromArgv } from "./parse-options-from-argv.js";
import { runCommand } from "./run-command.js";

/**
 * Provided a manifest entry point, loop through all of the
 * manifest entries to find the one that matches the args
 */
async function parseCommandFromArgs(
  argv: string[],
  initManifestEntry: ButteryCommandManifestEntry
): Promise<WellFormedCommand> {
  // Get the command
  let cmd: ButteryCommandManifestEntry = initManifestEntry;
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
  const remainingArgs = argv.slice(index);

  // Parse the options
  const cmdOptionsResult = await inlineTryCatch(parseOptionsFromArgv)(
    remainingArgs,
    cmd.options ?? {}
  );
  if (cmdOptionsResult.hasError) {
    throw cmdOptionsResult.error;
  }

  // Parse the args
  const cmdArgsResult = await inlineTryCatch(parseArgsFromArgv)(
    remainingArgs,
    cmd.args ?? {}
  );
  if (cmdArgsResult.hasError) {
    throw cmdArgsResult.error;
  }

  return {
    command: cmd,
    options: cmdOptionsResult.data,
    args: cmdArgsResult.data,
    properties: getCommandProperties(cmd),
  };
}

export default async (manifest: ButteryCommandsManifest) => {
  // Find, parse, and validate the options and args on the command
  const cmdResult = await inlineTryCatch(parseCommandFromArgs)(
    process.argv.slice(2),
    {
      level: 0,
      subCommands: manifest,
    } as ButteryCommandManifestEntry
  );
  if (cmdResult.hasError) {
    return LOG.fatal(cmdResult.error);
  }

  // Run the command
  const runResult = await inlineTryCatch(runCommand)(cmdResult.data);
  if (runResult.hasError) {
    return LOG.fatal(runResult.error);
  }
};
