import type { CommandAction, CommandMeta } from "../../../lib/types";
import { buildCommands } from "../commands.build/build-commands";

export const meta: CommandMeta = {
  name: "dev",
  description: "Develop your file-based CLI",
};

export const action: CommandAction = async ({ options }) => {
  try {
    await buildCommands({ watch: true, local: false });
  } catch (error) {
    throw new Error(error as string);
  }
};
