import type {
  ButteryConfigPaths,
  GetButteryConfigOptions
} from "../../../lib/config/buttery-config.types";
import type { ButteryConfigTokens } from "../../../lib/config/buttery-config.types.tokens";
import { getButteryConfig } from "../../../lib/config/getButteryConfig";

export type ButteryTokensConfig = {
  paths: ButteryConfigPaths;
  tokens: ButteryConfigTokens;
};

export const getButteryTokensConfig = (options?: GetButteryConfigOptions) =>
  getButteryConfig("tokens", {
    ...options,
    defaultConfig: "tokens"
  });
