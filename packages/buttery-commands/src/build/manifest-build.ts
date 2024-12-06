import { writeFile } from "node:fs/promises";
import path from "node:path";

import type { ResolvedButteryConfig } from "@buttery/core/config";
import { inlineTryCatch } from "@buttery/core/utils/isomorphic";


import { buildManifestHelpMenus } from "./manifest-build-graph-help.js";
import { buildManifestGraph } from "./manifest-build-graph.js";

import type { ButteryCommandsBaseOptions } from "../cli-scripts/_cli-scripts.utils.js";
import type { ButteryCommandsDirectories } from "../config/getButteryCommandsDirectories.js";
import { type ButteryCommandsManifest, LOG } from "../utils/LOG.js";

/**
 * This function is the main build command that reads the .buttery/config
 * parses the commands directory and then builds the binary. This command
 * is also used locally to build the commands that build the commands.
 */
export async function buildManifest<T extends ButteryCommandsBaseOptions>(
  manifest: ButteryCommandsManifest,
  options: {
    config: ResolvedButteryConfig<"commands">;
    dirs: ButteryCommandsDirectories;
    options: Required<T>;
  }
) {
  // Build the graph representation of the manifest
  const manifestGraph = await inlineTryCatch(buildManifestGraph)(
    manifest,
    options
  );
  if (manifestGraph.hasError) {
    LOG.error("Error when trying to build the commands manifest");
    throw manifestGraph.error;
  }

  // Add help menus
  const helpMenuResults = await inlineTryCatch(buildManifestHelpMenus)(
    manifestGraph.data
  );
  if (helpMenuResults.hasError) {
    LOG.error("Error when trying to add help menus to the manifest");
    throw helpMenuResults.error;
  }

  // write the manifest to disk
  const manifestFileName = "./manifest.js";
  const manifestFilepath = path.resolve(options.dirs.binDir, manifestFileName);
  const manifestContent = `export default ${JSON.stringify(
    manifestGraph.data,
    null,
    2
  )};
`;
  const writeManifestResult = await inlineTryCatch(writeFile)(
    manifestFilepath,
    manifestContent
  );
  if (writeManifestResult.hasError) {
    LOG.error("Error when trying to write the commands.manifest.json.");
    throw writeManifestResult.error;
  }
}
