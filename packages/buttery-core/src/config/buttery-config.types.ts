import type { ButteryLogLevel } from "@buttery/logs";

export type ButteryConfigPaths = {
  config: string;
  butteryDir: string;
  storeDir: string;
  rootDir: string;
};

export type GetButteryConfigOptions<ConfigShape> = {
  /**
   * Boolean value that determines if the user should be prompted
   * if the misconfiguration for the config file is detected.
   * @default false
   */
  prompt?: boolean;
  /**
   * A function that will returned a well formed Config based upon the generic
   * that is provided. This function will run anytime a config file is missing
   * and needs to be created. This callback is defined externally to this function
   * to allow whatever is instantiating it to control what is put into the file
   */
  onEmpty: () => Promise<ConfigShape>;
  /**
   * A promise that is run after the configuration file content is read and evaluated.
   * This is to ensure that the variables that are return are well formed
   * TODO: Validate the schema instead of a fn
   */
  validate: (rawConfig: ConfigShape) => Promise<ConfigShape>;
  /**
   * The level of logs that should be displayed
   * @default info
   */
  logLevel?: ButteryLogLevel;
};
