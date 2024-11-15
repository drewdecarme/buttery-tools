import type { CommandProperties } from "./getCommandProperties";
import type { ButteryCommand } from "./utils";

export type WellFormedCommandArgs = Record<string, string | number | boolean>;

export type WellFormedCommandOptions = Record<
  string,
  string | number | boolean
>;

export type WellFormedCommand = {
  command: ButteryCommand;
  options: WellFormedCommandOptions;
  args: WellFormedCommandArgs;
  properties: CommandProperties;
};
