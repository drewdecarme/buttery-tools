import { inlineTryCatch } from "@buttery/core/utils/isomorphic";
import { parseAndValidateOptions } from "@buttery/core/utils/node";
import { build as esbuild } from "esbuild";

import {
  type ButteryCommandsBuildOptions,
  butteryCommandsBuildOptionsSchema,
} from "./_cli-scripts.utils";

import { getBuildConfig } from "../build/get-build-config";
import { runPreBuild } from "../build/run-prebuild";
import { getButteryCommandsConfig } from "../config/getButteryCommandsConfig";
import { getButteryCommandsDirectories } from "../config/getButteryCommandsDirectories";
import { LOG } from "../utils/LOG";

/**
 * Compiles and builds the buttery commands binary
 */
export async function build(options?: Partial<ButteryCommandsBuildOptions>) {
  LOG.loadingStart("Building commands");

  const parsedOptions = parseAndValidateOptions(
    butteryCommandsBuildOptionsSchema,
    options,
    LOG
  );
  LOG.level = parsedOptions.logLevel;

  // Reconcile the buttery config & dirs
  const config = await getButteryCommandsConfig();
  const dirs = getButteryCommandsDirectories(config);
  const esbuildConfig = await getBuildConfig(config, dirs, {
    ...parsedOptions,
    isProd: true,
  });

  // run the prebuild
  const preBuildResults = await inlineTryCatch(runPreBuild)(
    config,
    dirs,
    parsedOptions
  );
  if (preBuildResults.hasError) {
    return LOG.fatal(preBuildResults.error);
  }

  // build the commands
  const buildResults = await inlineTryCatch(esbuild)(esbuildConfig);
  if (buildResults.hasError) {
    return LOG.fatal(buildResults.error);
  }

  LOG.loadingEnd("complete.");
  LOG.success("Successfully built @buttery/commands!");
}
