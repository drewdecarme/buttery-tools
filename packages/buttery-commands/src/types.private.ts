import type { CommandFile } from "./utils.js";

type CommandMeta = {
  name: string;
  description: string;
};

type CommandOptionShared = {
  name: string;
  description: string;
};
type CommandOptionBoolean = CommandOptionShared & {
  type: "boolean";
  default?: boolean;
};
type CommandOptionString = CommandOptionShared & {
  type: "string";
  default?: string;
};
type CommandOptionNumber = CommandOptionShared & {
  type: "number";
  default?: number;
};
type CommandOption =
  | CommandOptionBoolean
  | CommandOptionString
  | CommandOptionNumber;

type CommandArg = string;

export type ButteryCommand = {
  meta: CommandMeta;
  options: CommandOption[];
  args: CommandArg[];
  action?: () => void;
};

export type ButteryCommandManifestEntry = ButteryCommand & {
  commandPath: string;
  subCommands: ButteryCommandsManifest;
};

export type ButteryCommandsManifest = {
  [key: string]: ButteryCommandManifestEntry;
};

export type EnrichedButteryCommand = CommandFile & { module: ButteryCommand };
