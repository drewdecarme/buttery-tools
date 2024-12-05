import { readdir } from "node:fs/promises";
import path from "node:path";
import { ensureDir } from "fs-extra";
import { ButteryIconsDirectories } from "./getButteryIconsDirectories";
import { LOG } from "../utils/LOG";

/**
 * Ensures that all of the necessary folders exist and also
 * ensures that there are SVGs
 */
export async function getSVGFilePaths(dirs: ButteryIconsDirectories) {
  // ensure the dirs are there
  LOG.debug("Ensuring root icon & svg directories exist...");
  await ensureDir(dirs.io.svg);
  LOG.debug("Ensuring root icon & svg directories exist... done.");

  // check for svgs
  LOG.debug(`Checking ${dirs.io.svg} for raw svgs...`);
  const dirents = await readdir(dirs.io.svg, {
    withFileTypes: true,
    recursive: true,
  });
  const rawSvgFiles = dirents.filter(
    (dirent) => dirent.isFile() && path.extname(dirent.name) === ".svg"
  );
  LOG.debug(
    `Checking ${dirs.io.svg} for raw svgs... Found ${rawSvgFiles.length}.`
  );
  return rawSvgFiles;
}
