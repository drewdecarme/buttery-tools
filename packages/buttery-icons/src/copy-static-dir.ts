import { cp } from "node:fs/promises";
import type { ButteryIconsDirectories } from "./getButteryIconsDirectories";
import { LOG } from "./utils";

/**
 * Copies the necessary source files into the io directory to then
 * be utilized and transformed.
 */
export async function copyStaticDir(dirs: ButteryIconsDirectories) {
  try {
    LOG.debug(`Copying static files to: ${dirs.io.root}...`);
    cp(dirs.static, dirs.io.root, { recursive: true, force: true });
    LOG.debug("Copying static files... done.");
  } catch (error) {
    LOG.error(`Error when copying static files: ${error}`);
    throw LOG.fatal(new Error(error as string));
  }
}
