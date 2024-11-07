import { ButteryLogger } from "@buttery/core/logger";
import type { BuildOptions } from "esbuild";
import type { CommandArg, CommandMeta } from "../dist";
import type { CommandOption } from "./command-utils";
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

export type ButteryCommand = {
  meta: CommandMeta;
  options: CommandOption[];
  args: CommandArg[];
  action?: () => void;
};

export type ButteryCommandManifestEntry = ButteryCommand & {
  subCommands: ButteryCommandsManifest;
};

export type ButteryCommandsManifest = {
  [key: string]: ButteryCommandManifestEntry;
};

export type EnrichedButteryCommand = CommandFile & { module: ButteryCommand };
