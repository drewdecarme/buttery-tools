import { buildCSSUtils } from "./buildCSSUtils.js";

import type { ButteryTokensBaseOptions } from "../cli-scripts/_cli-scripts.utils.js";
import { getButteryTokensConfig } from "../config/getButteryTokensConfig.js";
import { LOG } from "../utils/util.logger.js";

export async function buildButteryTokens<T extends ButteryTokensBaseOptions>(
  options: T
) {
  try {
    LOG.info("Building @buttery/tokens..");
    // Fetch the tokens config and resolve the paths
    const rConfig = await getButteryTokensConfig(options);

    // build the make functions
    await buildCSSUtils(rConfig);
    LOG.info("Building @buttery/tokens... done.");
    return rConfig;
  } catch (error) {
    throw new Error(`Error when trying to build the @buttery/tokens: ${error}`);
  }
}
