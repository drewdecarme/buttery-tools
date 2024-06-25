import {
  type ButteryConfigPaths,
  type ButteryConfigTokens,
  getButteryConfig,
} from "@buttery/core";

export type ButteryTokensConfig = {
  paths: ButteryConfigPaths;
  tokens: ButteryConfigTokens;
};

export const getButteryTokensConfig = () => getButteryConfig("tokens");
