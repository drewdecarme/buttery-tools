import type { CommandAction, CommandMeta } from "@buttery/commands";
import { dev } from "@buttery/commands/cli/dev";

export const meta: CommandMeta = {
  name: "add",
  description:
    "Bootstraps a new buttery command by asking the user a few questions.",
};

export const action: CommandAction = async () => {
  try {
    dev();
  } catch (error) {}
};
