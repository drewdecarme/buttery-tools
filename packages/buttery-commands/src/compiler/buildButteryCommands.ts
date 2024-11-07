import type { ResolvedButteryConfig } from "@buttery/core/config";
import { inlineTryCatch } from "@buttery/core/utils/isomorphic";
import { build } from "esbuild";
import type { ButteryCommandsBaseOptions } from "../options";
import type { ButteryCommandsDirectories } from "../utils/getButteryCommandsDirectories";
import { LOG } from "../utils/utils";
import { compileCommands } from "./compile-commands";
import { getBuildConfig } from "./get-build-config";
import { prepareDistribution } from "./prepareDistribution";

/**
 * A central NodeJS API to tap into building buttery commands.
 * This NodeAPI is used in the `dev` and `build` CLI commands that
 * are available on the @buttery/cli
 */
export async function buildButteryCommands<
  T extends ButteryCommandsBaseOptions
>(
  config: ResolvedButteryConfig<"commands">,
  dirs: ButteryCommandsDirectories,
  options: T
) {
  try {
    // prepare the directories
    const prepareResult = await inlineTryCatch(prepareDistribution)(
      config,
      dirs,
      options
    );
    if (prepareResult.hasError) {
      LOG.error("Error when trying to prepare the distribution directories.");
      throw prepareResult.error;
    }

    // Compile the commands manifest
    const manifestModule = await inlineTryCatch(compileCommands)(
      config,
      dirs,
      options
    );
    if (manifestModule.hasError) {
      LOG.error("Error when compiling the commands");
      throw manifestModule.error;
    }

    // get the build config
    const esbuildConfig = getBuildConfig(manifestModule.data, dirs);

    // transpile and bundle the commands manifest
    const buildResult = await inlineTryCatch(build)(esbuildConfig);
    if (buildResult.hasError) {
      LOG.error("Error when transpiling & bundling the commands manifest");
      throw buildResult.error;
    }
  } catch (error) {
    LOG.fatal(new Error(String(error)));
  }
}
