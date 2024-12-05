import { parseAndValidateOptions } from "@buttery/core/utils/node";
import { watch } from "chokidar";
import type { z } from "zod";

import { butteryTokensDevOptionsSchema } from "./_options.schema";

import { buildCSSUtils } from "../buildCSSUtils";
import { getButteryTokensConfig } from "../getButteryTokensConfig";
import { getButteryTokensDirectories } from "../getButteryTokensDirectories";
import { launchPlayground } from "../launchPlayground";
import { LOG } from "../logger";

export type ButterTokensDevOptions = z.infer<
  typeof butteryTokensDevOptionsSchema
>;

/**
 * Run the @buttery/tokens build process in development mode
 * where you can make changes to the .buttery/config.tokens
 * and have the utilities re-build on demand.
 *
 * Depending upon the options that are passed you can also
 * view the interactive wizard to make changes live in a GUI.
 */
export async function dev(options?: ButterTokensDevOptions) {
  const parsedOptions = parseAndValidateOptions(
    butteryTokensDevOptionsSchema,
    options,
    LOG
  );
  LOG.level = parsedOptions.logLevel;

  try {
    LOG.info("Building @buttery/tokens..");
    // Fetch the tokens config and resolve the paths
    const config = await getButteryTokensConfig({
      prompt: parsedOptions.prompt,
    });
    const dirs = await getButteryTokensDirectories(config, {
      logLevel: parsedOptions.logLevel,
    });

    // build the make functions
    await buildCSSUtils(config, dirs);
    LOG.info("Building @buttery/tokens... done.");

    // Watch the .buttery/config file to check if any changes
    // are
    const watcher = watch(config.paths.config);
    LOG.watch(config.paths.config.concat(" for changes..."));

    watcher.on("change", async (file) => {
      LOG.watch(`"${file}" changed.`);
      LOG.watch("Rebuilding tokens...");
      const config = await getButteryTokensConfig({
        prompt: parsedOptions.prompt,
      });
      const dirs = await getButteryTokensDirectories(config, {
        logLevel: parsedOptions.logLevel,
      });

      await buildCSSUtils(config, dirs);

      LOG.watch("Rebuilding tokens... done.");
    });

    // watch and launch the interactive UI
    if (!parsedOptions.interactive) return;

    LOG.info("Launching interactive playground...");
    await launchPlayground(config, {
      logLevel: parsedOptions.logLevel,
    });
  } catch (error) {
    throw LOG.fatal(
      new Error(`Error when trying to run @buttery/tools in DEV mode: ${error}`)
    );
  }
}
