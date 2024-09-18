import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Reads a directory that contains the svg files, loops through all
 * of the files in that directory and creates a TS union that is written
 * to a file that is then subsequently imported into the icon component.
 * This provides intellisense and TS auto completion when importing an icon
 */
async function createIconTypes() {
  try {
    const iconDir = path.resolve(import.meta.dirname, "../svg");
    const iconFileNames = await readdir(iconDir);

    // create a union string from the file names
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

    const outFile = path.resolve(import.meta.dirname, "../src/icon.types.ts");
    await writeFile(outFile, fileContent);
  } catch (error) {
    const err = new Error(error as string);
  }
}

createIconTypes();
