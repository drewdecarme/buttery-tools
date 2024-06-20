import path from "node:path";
import type { ResolvedButteryConfig } from "@buttery/core";
import type {
  CommandAction,
  CommandArgs,
  CommandMeta,
  CommandOptions,
} from "../../../lib";

export type BuildCommandsOptions = {
  watch: boolean;
  local: boolean;
  autofix?: boolean;
};

export type BuildCommandsFunctionArgs = {
  config: ResolvedButteryConfig<"cli">;
  options: BuildCommandsOptions;
};

export type BuildCommandFunction = (
  args: BuildCommandsFunctionArgs
) => Promise<void>;

export type ButteryCLIDirectories = {
  commandsDir: string;
  binDir: string;
};

export const getButteryCliDirectories = (
  config: ResolvedButteryConfig<"cli">
): ButteryCLIDirectories => {
  return {
    commandsDir: path.resolve(config.paths.butteryDir, "./commands"),
    binDir: path.resolve(config.paths.rootDir, "./bin"),
  };
};

export type CommandGraphProperties = {
  segment_name: string;
  meta: CommandMeta;
  options?: CommandOptions<"">;
  args?: CommandArgs;
  action?: CommandAction;
};

export type CommandGraph = {
  [key: string]: {
    properties: CommandGraphProperties;
    commands: CommandGraph;
  };
};

export type CommandFile = {
  /**
   * the name of the command
   */
  name: string;
  /**
   * The relative path of the command file to the
   * commands input and also the commands output dir
   */
  commandPath: string;
  /**
   * The segments of the command path
   */
  commandSegments: string[];
  /**
   * The absolute path to the commands source file
   */
  inPath: string;
  /**
   * The absolute path of the built command file
   */
  outPath: string;
};
