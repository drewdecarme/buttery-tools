import type { CommandAction, CommandMeta } from "@buttery/commands";
import { create } from "@buttery/commands/create";

export const meta: CommandMeta = {
  name: "add",
  description: "Easily bootstrap a new buttery command",
};

export const action: CommandAction = async () => {
  try {
    create();
  } catch (error) {}
};
