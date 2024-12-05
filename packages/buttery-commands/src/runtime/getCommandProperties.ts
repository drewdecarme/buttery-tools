import type {
  WellFormedCommandArgs,
  WellFormedCommandOptions,
} from "./runtime.types";

import type { ButteryCommand } from "../utils/LOG";

export type CommandProperties = ReturnType<typeof getCommandProperties>;

export function getCommandProperties(
  cmd: ButteryCommand,
  parsedArgs: WellFormedCommandArgs,
  parsedOptions: WellFormedCommandOptions
) {
  const numOfArgs = Object.keys(cmd.args ?? {}).length;
  const numOfOptions = Object.keys(cmd.args ?? {}).length;
  const numOfParsedArgs = Object.values(parsedArgs).length;
  const numOfParsedOptions = Object.values(parsedOptions).length;

  return {
    hasSubCommands: Object.keys(cmd.subCommands).length > 0,
    isRootCommand: cmd.meta.level === 0,
    hasAction: cmd.meta.hasAction,
    hasNoArgsOrOptions: numOfArgs === 0 && numOfOptions === 0,
    numOfOptions,
    numOfArgs,
    numOfParsedArgs,
    numOfParsedOptions,
    hasNoParsedArgsOrOptions: numOfParsedArgs === 0 && numOfParsedOptions === 0,
  };
}
