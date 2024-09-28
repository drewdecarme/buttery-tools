import { LOG_CLI } from "../../logger";
import { findDirectoryUpwards } from "../../utils/node";

export async function getButteryArtifactsDir(
  startingDirectory: string,
  findDirectoryName: string
) {
  try {
    LOG_CLI.debug(
      `Searching for "${findDirectoryName}" artifacts in order to build the program...`
    );
    const tokensLib = findDirectoryUpwards("artifacts", findDirectoryName, {
      startingDirectory
    });
    if (!tokensLib) {
      throw `Cannot locate the "${findDirectoryName}" library artifacts. This should not have happened. Please log a Github issue.`;
    }
    LOG_CLI.debug(
      `Searching for "${findDirectoryName}" artifacts in order to build the program.... done.`
    );
    return tokensLib;
  } catch (error) {
    throw LOG_CLI.fatal(new Error(error as string));
  }
}
