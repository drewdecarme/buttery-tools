import { parseAndValidateOptions } from "@buttery/core/utils";
import { watchButteryConfigForChanges } from "@buttery/core/config";
import { tryHandle } from "@buttery/utils/isomorphic";

import type { ButteryTokensDevOptions } from "./_cli-scripts.utils.js";
import { butteryTokensDevOptionsSchema } from "./_cli-scripts.utils.js";

import { LOG } from "../utils/util.logger.js";
import { launchPlayground } from "../playground/playground-launch.js";
import { buildButteryTokens } from "../build/buttery-tokens.build.js";

/**
 * Run the @buttery/tokens build process in development mode
 * where you can make changes to the .buttery/config.tokens
 * and have the utilities re-build on demand.
 *
 * Depending upon the options that are passed you can also
 * view the interactive wizard to make changes live in a GUI.
 */
export async function dev(options?: Partial<ButteryTokensDevOptions>) {
  const parsedOptions = parseAndValidateOptions(
    butteryTokensDevOptionsSchema,
    options,
    LOG
  );
  LOG.level = parsedOptions.logLevel;

  // Build the tokens using the central builder
  const res = await tryHandle(buildButteryTokens)(parsedOptions);
  if (res.hasError) {
    return LOG.fatal(res.error);
  }
  const rConfig = res.data;

  // Watch the config file if the interactive UI is NOT being run
  // and return early to the UI code isn't reached
  if (!parsedOptions.interactive) {
    watchButteryConfigForChanges(rConfig.paths.config, {
      async onChange() {
        // rebuild the tokens
        await buildButteryTokens(parsedOptions);
      },
    });
    return;
  }

  // Launch the interactive playground
  LOG.info("Launching interactive playground...");
  const playgroundRes = await tryHandle(launchPlayground)(rConfig);
  if (playgroundRes.hasError) {
    return LOG.fatal(
      new Error(
        `Fatal error when trying to launch the tokens interactive playground: ${res.error}`
      )
    );
  }
}
