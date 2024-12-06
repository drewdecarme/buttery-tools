import { ButteryLogger } from "@buttery/core/logger";

import type { CommandArgs, CommandOptions } from "../lib";

// ---- Start Types ----
export type ButteryCommand = {
  /**
   * The relative path of the command file to the
   * commands input and also the commands output dir
   */
  id: string;
  /**
   * The name of the command that will call
   */
  name: string;
  /**
   * Describes what the command does
   */
  description: string;
  /**
   * The segments of the command path
   */
  segments: string[];
  /**
   * Options that can be passed to the command action
   */
  options: CommandOptions;
  /**
   * Positional args that can be passed to the command action
   */
  args: CommandArgs | undefined;
  /**
   * The path of the source of the command module
   */
  // pathSrc: string;
  /**
   * The path of the transpiled and bundled command module
   */
  // pathOut: string;
  /**
   * The path of the command module relative to the manifest
   */
  pathCmdModule: string;
  /**
   * The sub-commands of the command
   */
  subCommands: ButteryCommandsGraph;
  /**
   * A string literal representation of the help menu
   */
  help: string;
  /**
   * Other information to help parse and validate the command
   */
  meta: {
    /**
     * An array of command ids that are parent to this command
     */
    parentCommands: string[];
    /**
     * The level that the command sits at
     */
    level: number;
    /**
     * Boolean that represents the existence of an action
     * in the command file.
     */
    hasAction: boolean;
    /**
     * A boolean flag that indicates if the command definition
     * has any required args
     */
    hasRequiredArgs: boolean;
  };
};

export type ButteryCommandsGraph = {
  [key: string]: ButteryCommand;
};

export type ButteryCommandsManifest = Map<string, ButteryCommand>;
// ---- End Types ----

export const LOG = new ButteryLogger({
  id: "buttery-commands",
  prefix: "buttery:commands",
  prefixBgColor: "#e3d01c",
  logLevel: "debug",
});
