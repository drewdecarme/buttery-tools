import type { CommandAction, CommandMeta } from "../../../lib/buttery-commands";

export const meta: CommandMeta = {
  name: "create-command",
  description: "Bootstrap a new file based CLI command via a few prompts"
};

export const action: CommandAction = async (args) => {
  // This is where you make the index.js file where the commands
  // will have an entry point...

  console.log("Hello from the 'cli.create-command' command.", args);
};
