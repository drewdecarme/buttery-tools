import type { ButteryConfigPaths, ButteryConfigTokens } from "@buttery/core";
import { getButteryConfig } from "@buttery/core";

export type ButteryTokensConfig = {
  paths: ButteryConfigPaths;
  tokens: ButteryConfigTokens;
};

export const getButteryTokensConfig = () => getButteryConfig("tokens");
