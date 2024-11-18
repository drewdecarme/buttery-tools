import path from "node:path";
import { getCommandProperties } from "../utils/getCommandProperties";
import type { WellFormedCommand } from "../utils/runtime.types";

export type RunCommandOptions = { cwd: string };

export async function runCommand(
  cmd: WellFormedCommand,
  opts: RunCommandOptions
) {
  const { command, args: parsedArgs, options: parsedOptions } = cmd;
  const properties = getCommandProperties(command, parsedArgs, parsedOptions);

  // Command doesn't have an action and there aren't any args or properties
  // associated with it, we're just going to display the help menu.
  if (
    (properties.hasNoParsedArgsOrOptions || properties.hasNoArgsOrOptions) &&
    !properties.hasAction
  ) {
    return console.log(command.help);
  }

  if (properties.hasAction) {
    const importPath = path.resolve(opts.cwd, command.pathOut);
    const module = await import(importPath);
    const action = module.action;
    await action({ options: parsedOptions, args: parsedArgs });
  }
}
