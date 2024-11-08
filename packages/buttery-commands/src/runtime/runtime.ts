import { inlineTryCatch } from "@buttery/core/utils/isomorphic";
import { getCommandProperties } from "../utils/commandHasSubCommands.js";
import {
  type ButteryCommandManifestEntry,
  type ButteryCommandsManifest,
  LOG,
} from "../utils/utils.js";
import { parseArgsFromArgv } from "./parse-args-from-argv.js";
import { parseOptionsFromArgv } from "./parse-options-from-argv.js";

/**
 * Provided a manifest entry point, loop through all of the
 * manifest entries to find the one that matches the args
 */
async function parseCommandFromArgs(
  argv: string[],
  initManifestEntry: ButteryCommandManifestEntry
) {
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
  const { command, args, options, properties } = cmdResult.data;

  console.log({ command, args, options, properties });

  // If we're at the base level then we need to display the help menu
  // if (properties.isRootCommand && properties.hasSubCommands) {
  //   return console.log("TODO: Display the help menu: root");
  // }

  // if (properties.hasSubCommands) {
  //   // TODO: Display the help menu
  //   return console.log(`TODO: Display the help menu: ${command.name}`);
  // }

  // // We can assume that this is a executable command
  // if (!properties.hasSubCommands) {
  //   LOG.debug(`Located command: ${command.name}`);
  // }

  //  if (!commandExists) {
  //    throw `"${argv}" is not a valid command.\nPossible options: ${printAsBullets(
  //      Object.keys(currentCommand.subCommands)
  //    )}`;
  //  }
};
