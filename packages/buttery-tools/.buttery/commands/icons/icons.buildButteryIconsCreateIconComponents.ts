import { exec } from "node:child_process";
import { LOG } from "../_logger";
import type { ButteryIconsDirectories } from "./icons.getButteryIconsDirectories";

/**
 * Runs an opinionated SVGR command to create the component files
 */
export async function createIconComponents(dirs: ButteryIconsDirectories) {
  const createComponents = () =>
    new Promise<void>((resolve, reject) => {
      exec(
        `svgr --out-dir ${dirs.output.generated} --filename-case kebab --jsx-runtime automatic --no-index --title-prop -- ${dirs.entry.svgDir}`,
        (error, stdout) => {
          if (error) {
            reject(stdout);
          } else {
            resolve();
          }
        }
      );
    });

  try {
    LOG.debug("Creating icon components...");
    await createComponents();
    LOG.debug("Creating icon components... done.");
  } catch (error) {
    LOG.error(`Error when creating icon components: ${error}`);
    throw LOG.fatal(new Error(error as string));
  }
}
