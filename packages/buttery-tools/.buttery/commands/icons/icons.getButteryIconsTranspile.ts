import { exec } from "node:child_process";
import { LOG } from "../_logger";
import type { ButteryIconsDirectories } from "./icons.getButteryIconsDirectories";

/**
 * Transpile all of the components and type files.
 */
export async function transpile(dirs: ButteryIconsDirectories) {
  const transpileFiles = () =>
    new Promise<void>((resolve, reject) => {
      exec(
        `tsc --project ${dirs.output.tsConfig} --outDir ${dirs.output.root}`,
        (error, stdout) => {
          if (error) {
            LOG.error("Error when transpiling icon files...");
            reject(stdout);
          } else {
            resolve();
          }
        }
      );
    });

  try {
    LOG.debug("Transpiling icon files...");
    await transpileFiles();
    LOG.debug("Transpiling icon files... done.");
  } catch (error) {
    LOG.error("Error when transpiling icon files...");
    throw LOG.fatal(new Error(error as string));
  }
}
