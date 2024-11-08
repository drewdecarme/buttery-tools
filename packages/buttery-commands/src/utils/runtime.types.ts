import type { CommandProperties } from "./getCommandProperties";
import type { ButteryCommandManifestEntry } from "./utils";

export type WellFormedCommandArgs = Record<string, string | number | boolean>;

export type WellFormedCommandOptions = Record<
  string,
  string | number | boolean
>;

export type WellFormedCommand = {
  command: ButteryCommandManifestEntry;
  options: WellFormedCommandOptions;
  args: WellFormedCommandArgs;
  properties: CommandProperties;
};
