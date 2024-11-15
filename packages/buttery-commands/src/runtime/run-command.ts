import path from "node:path";
import type { WellFormedCommand } from "../utils/runtime.types";
import { LOG } from "../utils/utils";

export type RunCommandOptions = { cwd: string };

export async function runCommand(
  cmd: WellFormedCommand,
  opts: RunCommandOptions
) {
  LOG.debug(JSON.stringify(cmd, null, 2));
  const { command, args, options, properties } = cmd;

  LOG.debug(`Running command: ${command.name}`);

  // Command doesn't have any sub-commands and also doesn't have
  // an action. This is an invalid command and a warning should appear.
  // TODO: Move this to build time
  if (!properties.hasSubCommands && !properties.hasAction) {
    LOG.warning(
      `The command "${command.name}" is a standalone command and doesn't have an action exported from it's command file. Calling this command will do nothing. Please export an action in "${command.id}".`
    );
    return;
  }

  // Command doesn't have an action and there aren't any args or properties
  // associated with it, we're just going to display the help menu.
  if (properties.hasNoArgsOrOptions && !properties.hasAction) {
    return console.log(command.help);
  }

  if (properties.hasAction) {
    const importPath = path.resolve(opts.cwd, command.path);
    LOG.debug(`Importing module from: ${importPath}`);
    const module = await import(importPath);
    const action = module.action;
    await action({ options, args });
  }
}
