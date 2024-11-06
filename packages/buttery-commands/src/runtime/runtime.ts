import { inlineTryCatch } from "@buttery/core/utils/isomorphic";
import type { ButteryCommandsManifest } from "../types.private.js";
import { LOG } from "../utils.js";

async function getCommandsManifest() {
  try {
    // @ts-expect-error this is the output of the commands manifest. This will be
    // here at runtime
    const module = await import("./command-manifest.js");
    return module as ButteryCommandsManifest;
  } catch (error) {
    throw new Error(String(error));
  }
}

async function runCommands() {
  const commandsResult = await inlineTryCatch(getCommandsManifest)();
  if (commandsResult.hasError) {
    LOG.error("Error when trying to fetch the commands manifest");
    return LOG.fatal(commandsResult.error);
  }

  const commandsManifest = commandsResult.data;

  console.log(commandsManifest);
}

runCommands();
