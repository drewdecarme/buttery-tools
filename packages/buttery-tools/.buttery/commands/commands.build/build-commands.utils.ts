import path from "node:path";
import type {
  CommandAction,
  CommandArgs,
  CommandMeta,
  CommandOptions
} from "../../../lib";
import type { ResolvedButteryConfig } from "../_buttery-config";

export type CommandsBuildOptions = {
  watch: boolean;
  local: boolean;
  autofix?: boolean;
};

export type CommandsBuildFunctionArgs = {
  config: ResolvedButteryConfig<"commands">;
  options: CommandsBuildOptions;
};

export type CommandsBuildFunction = (
  args: CommandsBuildFunctionArgs
) => Promise<void>;

export type ButteryCLIDirectories = {
  commandsDir: string;
  binDir: string;
};

export const getButteryCommandsDirectories = (
  config: ResolvedButteryConfig<"commands">
): ButteryCLIDirectories => {
  const commandsDirName = config.commands.commandsDir ?? "commands";

  return {
    commandsDir: path.resolve(config.paths.butteryDir, `./${commandsDirName}`),
    binDir: path.resolve(config.paths.rootDir, "./bin")
  };
};

export type CommandGraphProperties = {
  segment_name: string;
  meta: CommandMeta;
  options?: CommandOptions;
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
