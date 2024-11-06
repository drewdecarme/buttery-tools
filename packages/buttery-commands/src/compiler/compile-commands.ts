import type { ResolvedButteryConfig } from "@buttery/core/config";
import { inlineTryCatch } from "@buttery/core/utils/isomorphic";
import type { ButteryCommandsDirectories } from "../getButteryCommandsDirectories.js";
import type { ButteryCommandsBaseOptions } from "../options/index.js";
import { LOG } from "../utils.js";
import { compileManifest } from "./compile-manifest.js";
import { buildCommandsEnrichPackageJson } from "./enrich-package-json.js";
import { generateManifestModule } from "./generate-manifest-module.js";

/**
 * This function is the main build command that reads the .buttery/config
 * parses the commands directory and then builds the binary. This command
 * is also used locally to build the commands that build the commands.
 */
export async function compileCommands<T extends ButteryCommandsBaseOptions>(
  config: ResolvedButteryConfig<"commands">,
  dirs: ButteryCommandsDirectories,
  options: Required<T>
) {
  LOG.debug("Compiling the commands into the manifest...");
  // Enrich the package.json file to execute the binary
  const enrichResult = await inlineTryCatch(buildCommandsEnrichPackageJson)(
    config,
    dirs
  );
  if (enrichResult.hasError) {
    LOG.error("Error when trying to enrich the package.json");
    throw enrichResult.error;
  }

  // Compile the commands into a manifest
  const manifestResult = await inlineTryCatch(compileManifest)(config, options);
  if (manifestResult.hasError) {
    LOG.error("Error when trying to build the commands manifest");
    throw manifestResult.error;
  }

  // Turn the manifest into a module that can be built
  const manifestModuleResult = await inlineTryCatch(generateManifestModule)(
    manifestResult.data
  );
  if (manifestModuleResult.hasError) {
    LOG.error("Error when trying to convert the manifest into an ESModule");
    throw manifestModuleResult.error;
  }

  LOG.debug("Compiling the commands into the manifest... done.");

  return manifestModuleResult.data;
}
