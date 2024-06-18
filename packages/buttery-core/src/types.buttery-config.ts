import type { ButteryConfigCli } from "./types.buttery-config-cli";
import type { ButteryConfigDocs } from "./types.buttery-config-docs";
import type { ButteryConfigTokens } from "./types.buttery-config-tokens";

export type ButteryConfig = {
  cli?: ButteryConfigCli;
  tokens?: ButteryConfigTokens;
  docs?: ButteryConfigDocs;
};
