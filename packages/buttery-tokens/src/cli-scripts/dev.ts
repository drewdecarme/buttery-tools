import { parseAndValidateOptions } from "@buttery/core/utils";
import { watchButteryConfigForChanges } from "@buttery/core/config";
import { tryHandle } from "@buttery/utils/isomorphic";

import type { ButteryTokensDevOptions } from "./_cli-scripts.utils.js";
import { butteryTokensDevOptionsSchema } from "./_cli-scripts.utils.js";

import { LOG } from "../utils/util.logger.js";
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

  watchButteryConfigForChanges(rConfig.paths.config, {
    async onChange() {
      // rebuild the tokens
      await buildButteryTokens(parsedOptions);
    },
  });
}
