import { rm } from "node:fs/promises";
import path from "node:path";
import {
  type ButteryConfigBase,
  type ButteryConfigCli,
  getButteryConfig,
} from "@buttery/core";
import type { BuildArgs } from "../../scripts/build";
import { LOG } from "../_utils/util.logger";
import { buildPackageJson } from "./script.build-package-json";
import { buildProgram } from "./script.build-program";

export type BuildScriptArgs = {
  configBase: ButteryConfigBase;
  configPath: string;
  configCli: ButteryConfigCli;
  programArgs: BuildArgs;
};

/**
 * This is the main build command that is used to build the
 * the consumer CLI.
 *
 * This has been abstracted out into it's own central function in
 * order to properly dog-food the build process while building
 * the CLI that runs this process. In essence, this command
 * builds the CLI that the consumer is creating AND also
 * builds this CLI that creates the CLI that the consumer
 * is creating. A little CLI inception... if you will ;)
 */
export async function build(programArgs: BuildArgs) {
  LOG.level = "info";
  const butteryConfig = await getButteryConfig("cli");

  try {
    const { configBase, configPath, cli: configCli } = butteryConfig;
    const params = { configBase, configPath, configCli, programArgs };

    LOG.debug(`Using config: ${configPath}`);

    // delete the entire bin & dist folder to make it fresh
    LOG.debug("Cleaning distribution directories...");
    const foldersToDelete = ["./bin"].map((folder) =>
      rm(path.resolve(configBase.root, folder), {
        recursive: true,
        force: true,
      })
    );
    await Promise.all(foldersToDelete);
    LOG.debug("Cleaning distribution directories... done.");

    await Promise.all([buildProgram(params), buildPackageJson(params)]);
  } catch (error) {
    const err = new Error(error as string);
    LOG.fatal(err);
    throw err;
  }
}
