import { findDirectoryUpwards } from "../../../utils/node";
import { LOG } from "../_logger";

export async function getButteryArtifactsDir(
  startingDirectory: string,
  findDirectoryName: string
) {
  try {
    LOG.debug(
      `Searching for "${findDirectoryName}" artifacts in order to build the program...`
    );
    const tokensLib = findDirectoryUpwards("lib", findDirectoryName, {
      startingDirectory
    });
    if (!tokensLib) {
      throw `Cannot locate the "${findDirectoryName}" library assets. This should not have happened. Please log a Github issue.`;
    }
    LOG.debug(
      `Searching for "${findDirectoryName}" artifacts in order to build the program.... done.`
    );
    return tokensLib;
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
