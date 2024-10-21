import { constants, access, readdir } from "node:fs/promises";
import path from "node:path";
import { ensureDir } from "fs-extra";
import { copyStatic } from "./icons.copy-static";
import { generateComponents } from "./icons.generate-components";
import { generateTypes } from "./icons.generate-types";
import { getButteryIconsConfig } from "./icons.getButteryIconsConfig";
import { getButteryIconsDirectories } from "./icons.getButteryIconsDirectories";
import { LOG } from "./utils";

export async function build() {
  const config = await getButteryIconsConfig();
  const dirs = await getButteryIconsDirectories(config);

  // ensure the dirs are there
  LOG.debug("Ensuring root icons directory exists");
  await ensureDir(dirs.io.root);

  // check for the svg folder
  try {
    LOG.debug("Checking to see if SVG folder exists...");
    await access(dirs.io.svg, constants.F_OK);
  } catch (error) {
    throw LOG.fatal(
      new Error(
        `Please create a "./svg" directory in the icons directory: ${dirs.io.root}`
      )
    );
  }
  LOG.debug("Checking to see if SVG folder exists... done.");

  // check for svgs
  LOG.debug("Reading svg dir for raw svgs");
  const dirents = await readdir(dirs.io.svg, {
    withFileTypes: true,
    recursive: true,
  });
  const locatedSvgFiles = dirents.filter(
    (dirent) => dirent.isFile() && path.extname(dirent.name)
  );
  if (locatedSvgFiles.length === 0) {
    throw LOG.fatal(
      new Error(`Unable to find any SVGs in "${dirs.io.svg}". Ending command.`)
    );
  }

  // copy the library files to the output directory
  await copyStatic(dirs);
  //  create the components
  await generateComponents(dirs);
  // create types
  await generateTypes(dirs);
}
