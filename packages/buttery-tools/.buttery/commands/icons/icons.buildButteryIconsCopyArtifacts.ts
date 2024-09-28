import { cp } from "node:fs/promises";
import { LOG } from "../../../lib/logger/LOG_CLI";
import type { ButteryIconsDirectories } from "./icons.getButteryIconsDirectories";

/**
 * Copies the necessary source files from the library over to the
 * output directory for transpilation
 */
export async function copyArtifacts(dirs: ButteryIconsDirectories) {
  try {
    LOG.debug("Copying artifacts...");
    cp(dirs.artifacts.root, dirs.output.root, { recursive: true });
    LOG.debug("Copying artifacts... done.");
  } catch (error) {
    LOG.error(`Error when copying artifacts: ${error}`);
    throw LOG.fatal(new Error(error as string));
  }
}
