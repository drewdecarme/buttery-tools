import type { ButteryConfig } from "@buttery/cli";
import type { TokensConfig } from "../lib/types";

/**
 * The build script that takes the files in the /src/scss directory
 * pre-compiles them and then builds them into dist/scss directory
 */
export const buildTokensScss = async ({
  butteryConfig,
  tokensConfig
}: {
  butteryConfig: ButteryConfig;
  tokensConfig: TokensConfig;
}) => {};
