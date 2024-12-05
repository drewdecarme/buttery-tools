import { readdir } from "node:fs/promises";
import path from "node:path";

import { ButteryIconsDirectories } from "../config/getButteryIconsDirectories";
import { LOG } from "../utils/util.logger";

/**
 * Fetches the file paths of the SVGs
 */
export async function getSvgFilePaths(dirs: ButteryIconsDirectories) {
  try {
    // get the icon files
    LOG.debug(`Fetching SVG files from: "${dirs.svg}"...`);
    const svgDirents = await readdir(dirs.svg, {
      recursive: true,
      withFileTypes: true,
    });
    const iconFiles = svgDirents.reduce<{ path: string; name: string }[]>(
      (accum, dirent) => {
        if (dirent.isFile() && path.extname(dirent.name) === ".svg") {
          return accum.concat({
            path: path.join(dirent.parentPath, dirent.name),
            name: dirent.name,
          });
        }
        return accum;
      },
      []
    );
    LOG.debug(`Fetching SVG files from: "${dirs.svg}"... done.`);
    return iconFiles;
  } catch (error) {
    throw LOG.fatal(
      new Error(`Error when trying to fetch the svg file paths: ${error}`)
    );
  }
}
