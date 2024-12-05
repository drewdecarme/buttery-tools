import { inlineTryCatch } from "@buttery/core/utils/isomorphic";

import { getCommand } from "./get-command.js";
import { type RunCommandOptions, runCommand } from "./run-command.js";

import { type ButteryCommandsGraph, LOG } from "../utils/LOG.js";

/**
 * The runtime exists as nothing more than a few functions
 * that read values from the manifest, parse it and then
 * fetch a module if it is needed fro the commands output
 * directory.
 *
 * For the most part, a lot of the work is done at build time but
 * there are things that have to be done at runtime such as command
 * and arg validation as well as the evaluation of the action if it
 * is provided in the file.
 *
 * This runtime file is called from the runtime build output. This runtime
 * operates much like the model that vite provides where at build time
 * the assets are built to the directories, but it's up to the framework
 * that's implementing it to create their own runtime.
 *
 * So in essence, this runtime is the default runtime that is provided
 * from the buttery commands build but it is entirely possible that a
 * user could provide their own runtime. TODO: Document and include a way
 * to add an runtime
 */
export default async (
  manifestGraph: ButteryCommandsGraph,
  options: RunCommandOptions
) => {
  // Find, parse, and validate the options and args on the command
  const cmdResult = await inlineTryCatch(getCommand)(
    process.argv.slice(2),
    manifestGraph
  );
  if (cmdResult.hasError) {
    return LOG.fatal(cmdResult.error);
  }

  // Run the command - error handling is up to the action
  await runCommand(cmdResult.data, options);
};
