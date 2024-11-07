import { inlineTryCatch } from "@buttery/core/utils/isomorphic";
import {
  type ButteryCommandManifestEntry,
  type ButteryCommandsManifest,
  LOG,
} from "../utils/utils.js";
import { parseOptionsFromArgv } from "./parse-options-from-argv.js";

async function getCommandsManifest() {
  try {
    // @ts-expect-error this is the output of the commands manifest. This will be
    // here at runtime
    const module = await import("./command-manifest.js");
    return module.default as ButteryCommandsManifest;
  } catch (error) {
    throw new Error(String(error));
  }
}

/**
 * Provided a manifest entry point, loop through all of the
 * manifest entries to find the one that matches the args
 */
async function parseCommandFromArgs(
  argv: string[],
  initManifestEntry: ButteryCommandManifestEntry
) {
  let currentCommand: ButteryCommandManifestEntry = initManifestEntry;

  let index = 0;
  while (index < argv.length) {
    const arg = argv[index];

    // Check if the current argument is a subcommand of the current command
    if (currentCommand.subCommands?.[arg]) {
      // Move into the subcommand context
      currentCommand = currentCommand.subCommands[arg];
      index++;
    } else {
      break;
    }
  }

  // Parse the remaining args
  const remainingArgs = argv.slice(index);
  const cmdOptionsResult = await inlineTryCatch(parseOptionsFromArgv)(
    remainingArgs,
    currentCommand.options ?? []
  );
  if (cmdOptionsResult.hasError) {
    throw cmdOptionsResult.error;
  }

  // TODO: Do some validation on these
  console.log({ currentCommand, options: cmdOptionsResult.data });

  //  if (!commandExists) {
  //    throw `"${argv}" is not a valid command.\nPossible options: ${printAsBullets(
  //      Object.keys(currentCommand.subCommands)
  //    )}`;
  //  }
}

try {
  // get the commands manifest
  const cmdsManifestResult = await inlineTryCatch(getCommandsManifest)();
  if (cmdsManifestResult.hasError) {
    LOG.error("Error when trying to fetch the commands manifest");
    throw cmdsManifestResult.error;
  }

  // find and parse the command
  const cmdResult = await inlineTryCatch(parseCommandFromArgs)(
    process.argv.slice(2),
    {
      subCommands: cmdsManifestResult.data,
    } as ButteryCommandManifestEntry
  );
  if (cmdResult.hasError) {
    throw cmdResult.error;
  }
} catch (error) {
  LOG.fatal(new Error(String(error)));
}
