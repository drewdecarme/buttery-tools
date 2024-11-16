import type { ButteryCommand } from "./utils";

export type CommandProperties = ReturnType<typeof getCommandProperties>;

export function getCommandProperties(cmd: ButteryCommand) {
  const numOfArgs = Object.keys(cmd.args ?? {}).length;
  const numOfOptions = Object.keys(cmd.args ?? {}).length;
  return {
    hasSubCommands: Object.keys(cmd.subCommands).length > 0,
    isRootCommand: cmd.meta.level === 0,
    hasAction: cmd.meta.hasAction,
    hasNoArgsOrOptions: numOfArgs === 0 && numOfOptions === 0,
    numOfOptions,
    numOfArgs,
  };
}
