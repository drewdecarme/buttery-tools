import type {
  CommandAction,
  CommandMeta
} from "../../../lib/commands/butter-commands.types";
import { getButteryConfigCommands } from "../commands/commands.getButteryConfigCommands";

export const meta: CommandMeta = {
  name: "add",
  description:
    "Bootstraps a new buttery command by asking the user a few questions."
};

export const action: CommandAction = async () => {
  try {
    const butteryConfig = await getButteryConfigCommands();
    console.log(butteryConfig);
  } catch (error) {}
};
