import type { ResolvedButteryConfig } from "@buttery/core";
import type { BuildOptions } from "esbuild";
import type {
  CommandAction,
  CommandArgs,
  CommandMeta,
  CommandOptions,
} from "./types";

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

export const defaultEsbuildOptions: BuildOptions = {
  bundle: true,
  minify: true,
  format: "esm",
  platform: "node",
  target: ["node22.9.0"],
  packages: "external",
};
