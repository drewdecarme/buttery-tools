import type { ButteryConfigCli } from "./types.buttery-config-cli";
import type { ButteryConfigTokens } from "./types.buttery-config-tokens";

export type ButteryConfig = {
  /**
   * The root of the project or wherever the `package.json` is for that
   * particular directory.
   */
  root: string;
  cli?: ButteryConfigCli;
  tokens?: ButteryConfigTokens;
};
