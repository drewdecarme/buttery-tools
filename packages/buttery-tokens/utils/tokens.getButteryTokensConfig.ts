import {
  type ButteryConfigPaths,
  type ButteryConfigTokens,
  type GetButteryConfigOptions,
  getButteryConfig,
} from "@buttery/config";

export type ButteryTokensConfig = {
  paths: ButteryConfigPaths;
  tokens: ButteryConfigTokens;
};

export const getButteryTokensConfig = (options?: GetButteryConfigOptions) =>
  getButteryConfig("tokens", {
    ...options,
    defaultConfig: "tokens",
  });
