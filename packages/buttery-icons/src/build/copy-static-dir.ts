import { cp } from "node:fs/promises";

import type { ButteryIconsDirectories } from "../config/getButteryIconsDirectories.js";
import { LOG } from "../utils/util.logger.js";

/**
 * Copies the necessary source files into the io directory to then
 * be utilized and transformed.
 */
export async function copyStaticDir(dirs: ButteryIconsDirectories) {
  try {
    LOG.debug(`Copying static files to: ${dirs.out.root}...`);
    cp(dirs.static, dirs.out.root, { recursive: true, force: true });
    LOG.debug("Copying static files... done.");
  } catch (error) {
    LOG.error(`Error when copying static files: ${error}`);
    throw LOG.fatal(new Error(error as string));
  }
}
