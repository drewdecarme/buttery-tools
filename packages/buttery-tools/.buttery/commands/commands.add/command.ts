import type { CommandAction, CommandMeta } from "../../../lib/types";
import { getButteryConfigCommands } from "../commands/commands.getButteryConfigCommands";

export const meta: CommandMeta = {
  name: "add",
  description:
    "Bootstraps a new buttery command by asking the user a few questions."
};

export const action: CommandAction = async (params) => {
  try {
    const butteryConfig = await getButteryConfigCommands();
    console.log(butteryConfig);
  } catch (error) {}
};
