import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { LOG } from "../../../lib/logger/LOG_CLI";
import type { ButteryIconsDirectories } from "./icons.getButteryIconsDirectories";

/**
 * Reads the SVG file names from the svg directory reconciled in the config
 * creates a type union and then creates the file in the output directory
 */
export async function createTypes(dirs: ButteryIconsDirectories) {
  try {
    // get the icon files
    LOG.debug(`Fetching SVG files from: "${dirs.entry.svgDir}"...`);
    const iconFileNames = await readdir(dirs.entry.svgDir);
    LOG.debug(`Fetching SVG files from: "${dirs.entry.svgDir}"... done.`);

    // Create a types union
    LOG.debug("Creating types from icon file names...");
    const fileContent = iconFileNames.reduce(
      (accum, iconFileName, i, origArr) => {
        const fileName = iconFileName.split(".svg")[0];
        return accum.concat(
          `${i > 0 ? " | " : " "}"${fileName}"${
            i === origArr.length - 1 ? ";\n" : ""
          }`
        );
      },
      "export type IconNames ="
    );
    LOG.debug("Creating types from icon file names... done.");

    // create the types file
    const typesFilePath = path.resolve(
      dirs.output.root,
      "./buttery-icons.types.ts"
    );
    LOG.debug(`Writing types to: "${typesFilePath}"...`);
    LOG.debug(`Types fileContent: ${fileContent}`);
    await writeFile(typesFilePath, fileContent);
    LOG.debug(`Writing types to: "${typesFilePath}"... done.`);
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
