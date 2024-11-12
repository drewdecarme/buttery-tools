import type { CommandAction, CommandMeta } from "@buttery/commands";
import { dev } from "@buttery/commands/cli/dev";

export const meta: CommandMeta = {
  name: "dev",
  description: "Iteratively build the commands in watch mode",
};

export const action: CommandAction = async () => {
  try {
    dev();
  } catch (error) {}
};
