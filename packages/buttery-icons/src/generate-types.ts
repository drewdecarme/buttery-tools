import { writeFile } from "node:fs/promises";
import path from "node:path";
import { getSvgFilePaths } from "./get-svg-files";
import type { ButteryIconsDirectories } from "./getButteryIconsDirectories";
import { LOG } from "./utils";

/**
 * Reads the SVG file names from the svg directory reconciled in the config
 * creates a type union and then creates the file in the output directory
 */
export async function generateTypes(dirs: ButteryIconsDirectories) {
  try {
    const iconFiles = await getSvgFilePaths(dirs);

    // Create a types union
    LOG.debug("Creating types from icon file names...");
    const fileContent = iconFiles.reduce((accum, { name }, i, origArr) => {
      const fileName = name.split(".svg")[0];
      return accum.concat(
        `${i > 0 ? " | " : " "}"${fileName}"${
          i === origArr.length - 1 ? ";\n" : ""
        }`
      );
    }, "export type IconNames =");
    LOG.debug("Creating types from icon file names... done.");

    // create the types file
    const typesFilePath = path.resolve(
      dirs.io.root,
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
