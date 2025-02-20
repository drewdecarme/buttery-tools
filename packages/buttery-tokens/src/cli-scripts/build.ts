import { parseAndValidateOptions } from "@buttery/core/utils";
import { tryHandle } from "@buttery/utils/isomorphic";

import type { ButteryTokensBuildOptions } from "./_cli-scripts.utils.js";
import { butteryTokensBuildOptionsSchema } from "./_cli-scripts.utils.js";

import { buildButteryTokens } from "../build/buttery-tokens.build.js";
import { LOG } from "../utils/util.logger.js";

/**
 * Build the @buttery/tokens library to the `node_modules/@buttery/tokens`
 * under your provided namespace so the `make` utilities and the
 * :root CSS can be imported and used in your applications.
 */
export async function build(options?: Partial<ButteryTokensBuildOptions>) {
  // parse and validate & set the options
  const parsedOptions = parseAndValidateOptions(
    butteryTokensBuildOptionsSchema,
    options,
    LOG
  );
  LOG.level = parsedOptions.logLevel;

  const res = await tryHandle(buildButteryTokens)(parsedOptions);
  if (res.hasError) {
    throw LOG.fatal(res.error);
  }
}
