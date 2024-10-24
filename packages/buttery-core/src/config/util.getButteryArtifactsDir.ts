import { findDirectoryUpwards } from "../utils/node";
import { LOG } from "./buttery-config.utils";

export async function getButteryArtifactsDir(
  startingDirectory: string,
  findDirectoryName: string
) {
  try {
    LOG.debug(
      `Searching for "${findDirectoryName}" artifacts in order to build the program...`
    );
    const tokensLib = findDirectoryUpwards("artifacts", findDirectoryName, {
      startingDirectory,
    });
    if (!tokensLib) {
      throw `Cannot locate the "${findDirectoryName}" library artifacts. This should not have happened. Please log a Github issue.`;
    }
    LOG.debug(
      `Searching for "${findDirectoryName}" artifacts in order to build the program.... done.`
    );
    LOG.debug(`Artifacts library: ${tokensLib}`);
    return tokensLib;
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
