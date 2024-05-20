import type { ButteryConfigCli } from "./types.buttery-config-cli";
import type { ButteryConfigTokens } from "./types.buttery-config-tokens";

export type ButteryConfig = {
  root: string;
  cli?: ButteryConfigCli;
  tokens?: ButteryConfigTokens;
};
