import type { ButteryLogLevel } from "../logger";
import type { ButteryConfigCommands } from "./buttery-config.types.commands";
import type { ButteryConfigDocs } from "./buttery-config.types.docs";
import type { ButteryConfigIcons } from "./buttery-config.types.icons";
import type { ButteryConfigTokens } from "./buttery-config.types.tokens";

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

export type GetButteryConfigOptions = {
  /**
   * Optional starting directory to look for the config at
   * @default process.cwd()
   */
  startingDirectory?: string;
  /**
   * Boolean value that determines if the user should be prompted
   * if the misconfiguration for the config file is detected.
   * @default false
   */
  prompt?: boolean;
  /**
   * Indicate if the config file should be rebuilt when changed. Useful
   * for when developing anything that subscribes from values in the config.
   * @default false;
   */
  watch?: boolean;
  /**
   * The key of the default config that should be added if and when
   * a directory / config isn't detected and the user indicated that they
   * would like to be prompted to reconcile the configuration.
   * @default undefined
   */
  defaultConfig?: keyof ButteryConfig;
  /**
   * A boolean that tells the application if you need a config
   * key inside of the .buttery/config file.
   * @default true
   */
  requireConfig?: boolean;
  /**
   * The level of logs that should be displayed
   * @default info
   */
  logLevel?: ButteryLogLevel;
};
