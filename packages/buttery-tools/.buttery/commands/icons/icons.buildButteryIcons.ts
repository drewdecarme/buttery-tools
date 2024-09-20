import { writeFile } from "node:fs/promises";
import { writeDynamicDirectoryPackageJSON } from "../_utils";
import { copyArtifacts } from "./icons.buildButteryIconsCopyArtifacts";
import { createIconComponents } from "./icons.buildButteryIconsCreateIconComponents";
import { createTypes } from "./icons.buildButteryIconsCreateTypes";
import { getButteryIconsConfig } from "./icons.getButteryIconsConfig";
import { getButteryIconsDirectories } from "./icons.getButteryIconsDirectories";
import { transpile } from "./icons.getButteryIconsTranspile";

export async function buildButteryIcons() {
  const config = await getButteryIconsConfig();
  const dirs = await getButteryIconsDirectories(config);

  // write the package.json file
  const packageJsonContent = {
    name: "@buttery/icons",
    type: "module",
    version: "0.0.0"
  };
  await writeFile(
    dirs.output.packageJson,
    JSON.stringify(packageJsonContent, null, 2)
  );

  // enrich the package.json
  await writeDynamicDirectoryPackageJSON(dirs.output.packageJson);

  // copy the library files to the output directory
  await copyArtifacts(dirs);
  //  create the components
  await createIconComponents(dirs);
  // create types
  await createTypes(dirs);
  // // build and transpile
  await transpile(dirs);
}
