import { copyArtifacts } from "./icons.buildButteryIconsCopyArtifacts";
import { createIconComponents } from "./icons.buildButteryIconsCreateIconComponents";
import { createTypes } from "./icons.buildButteryIconsCreateTypes";
import { getButteryIconsConfig } from "./icons.getButteryIconsConfig";
import { getButteryIconsDirectories } from "./icons.getButteryIconsDirectories";

export async function buildButteryIcons() {
  const config = await getButteryIconsConfig();
  const dirs = await getButteryIconsDirectories(config);

  // copy the library files to the output directory
  await copyArtifacts(dirs);
  //  create the components
  await createIconComponents(dirs);
  // create types
  await createTypes(dirs);
}
