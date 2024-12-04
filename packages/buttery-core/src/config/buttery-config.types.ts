import type { ButteryLogLevel } from "../logger/index.js";
import type { ButteryConfigCommands } from "./buttery-config.types.commands.js";
import type { ButteryConfigDocs } from "./buttery-config.types.docs.js";
import type { ButteryConfigIcons } from "./buttery-config.types.icons.js";
import type { ButteryConfigTokens } from "./buttery-config.types.tokens.js";

export type ButteryConfigPaths = {
  config: string;
  butteryDir: string;
  storeDir: string;
  rootDir: string;
};

export type ButteryConfig = {
  commands?: ButteryConfigCommands;
  tokens?: ButteryConfigTokens | ButteryConfigTokens[];
  docs?: ButteryConfigDocs;
  icons?: ButteryConfigIcons;
};

export type GetButteryConfigOptions<ConfigShape> = {
  /**
   * Boolean value that determines if the user should be prompted
   * if the misconfiguration for the config file is detected.
   * @default false
   */
  prompt?: boolean;
  /**
   * The key of the default config that should be added if and when
   * a directory / config isn't detected and the user indicated that they
   * would like to be prompted to reconcile the configuration.
   * @default undefined
   */
  defaults: ConfigShape;
  /**
   * The level of logs that should be displayed
   * @default info
   */
  logLevel?: ButteryLogLevel;
};
