import { parseAndValidateOptions } from "@buttery/core/utils";
import { build as esbuild } from "esbuild";
import { tryHandle } from "@buttery/utils/isomorphic";

import type { ButteryCommandsBuildOptions } from "./_cli-scripts.utils.js";
import { butteryCommandsBuildOptionsSchema } from "./_cli-scripts.utils.js";

import { getBuildConfig } from "../build/get-build-config.js";
import { runPreBuild } from "../build/run-prebuild.js";
import { getButteryCommandsConfig } from "../config/getButteryCommandsConfig.js";
import { LOG } from "../utils/LOG.js";

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
  const rConfig = await getButteryCommandsConfig(parsedOptions);
  const esbuildConfig = await getBuildConfig(rConfig, {
    ...parsedOptions,
    isProd: true,
  });

  // run the prebuild
  const preBuildResults = await tryHandle(runPreBuild)(rConfig, parsedOptions);
  if (preBuildResults.hasError) {
    return LOG.fatal(preBuildResults.error);
  }

  // build the commands
  const buildResults = await tryHandle(esbuild)(esbuildConfig);
  if (buildResults.hasError) {
    return LOG.fatal(buildResults.error);
  }

  LOG.loadingEnd("complete.");
  LOG.success("Successfully built @buttery/commands!");
}
