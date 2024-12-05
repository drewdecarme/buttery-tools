import picomatch from "picomatch";

import type { ButteryCommandsDirectories } from "../utils/getButteryCommandsDirectories";
import { LOG, getEntryPointsGlob } from "../utils/utils";

/**
 * This function will evaluate a loaded file against the entry points glob
 * to ensure that the file that is loaded by esbuild is actually a command.
 * We still want esbuild to build all of the files, but we only want to process
 * a specific subset of those as commands to create the commands manifest.
 *
 * This is necessary due to the fact that esbuild will build any files that are imported
 * into the command. We want esbuild to build them but we don't want to process those
 * imports as commands.
 */
export function loadCommand(
  filePath: string,
  dirs: ButteryCommandsDirectories
): string | undefined {
  // ignore anything that isn't in the commands dir
  LOG.debug("Loading command...");
  const entryPointGlob = getEntryPointsGlob(dirs);
  const isMatch = picomatch(entryPointGlob);
  const isCommandFile = isMatch(filePath);
  if (!isCommandFile) {
    LOG.debug(`Loading command... INVALID_COMMAND. Ignoring: "${filePath}"`);
    return undefined;
  }
  LOG.debug(
    `Loading command... VALID_COMMAND. Parsing command at path: ${filePath}...`
  );
  return filePath;
}
