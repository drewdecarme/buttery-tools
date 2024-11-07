import { ButteryLogger } from "@buttery/core/logger";
import type { BuildOptions } from "esbuild";
// import type { CommandAction, CommandOptions } from "./types";

export const LOG = new ButteryLogger({
  id: "buttery-commands",
  prefix: "buttery:commands",
  prefixBgColor: "#e3d01c",
  logLevel: "debug",
});

export type CommandsBuildOptions = {
  watch: boolean;
  local: boolean;
  autofix?: boolean;
};

// export type CommandGraphProperties = {
//   segment_name: string;
//   meta: CommandMeta;
//   options?: CommandOptions;
//   args?: CommandArgs;
//   action?: CommandAction;
// };

// export type CommandGraph = {
//   [key: string]: {
//     properties: CommandGraphProperties;
//     commands: CommandGraph;
//   };
// };

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
