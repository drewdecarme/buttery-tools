import { cp } from "node:fs/promises";
import { LOG_CLI } from "../logger";
import type { ButteryIconsDirectories } from "./icons.getButteryIconsDirectories";

/**
 * Copies the necessary source files from the library over to the
 * output directory for transpilation
 */
export async function copyArtifacts(dirs: ButteryIconsDirectories) {
  try {
    LOG_CLI.debug("Copying artifacts...");
    cp(dirs.artifacts.root, dirs.output.root, { recursive: true });
    LOG_CLI.debug("Copying artifacts... done.");
  } catch (error) {
    LOG_CLI.error(`Error when copying artifacts: ${error}`);
    throw LOG_CLI.fatal(new Error(error as string));
  }
}
