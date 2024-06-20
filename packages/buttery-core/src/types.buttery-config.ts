import type { ButteryConfigCommands } from "./types.buttery-config-commands";
import type { ButteryConfigDocs } from "./types.buttery-config-docs";
import type { ButteryConfigTokens } from "./types.buttery-config-tokens";

export type ButteryConfig = {
  commands?: ButteryConfigCommands;
  tokens?: ButteryConfigTokens;
  docs?: ButteryConfigDocs;
};
