import { exec } from "node:child_process";
import { LOG } from "../utils/LOG";
import { ButteryIconsDirectories } from "./getButteryIconsDirectories";

/**
 * Runs an opinionated SVGR command to create the component files
 */
export async function generateComponents(dirs: ButteryIconsDirectories) {
  const createComponents = () =>
    new Promise<void>((resolve, reject) => {
      exec(
        `npx @svgr/cli --out-dir ${dirs.io.generated} --filename-case kebab --typescript --jsx-runtime automatic --no-index --title-prop -- ${dirs.io.svg}`,
        (error, stdout) => {
          if (error) {
            LOG.error(error as unknown as string);
            LOG.error(stdout);
            reject(error);
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
