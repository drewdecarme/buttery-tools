import type { CommandAction, CommandMeta } from "../../lib/types";
import { build } from "./cli.build/script.build";

export const meta: CommandMeta = {
  name: "dev",
  description: "Develop your file-based CLI",
};

export const action: CommandAction = async ({ options }) => {
  try {
    await build({ watch: true, local: false });
  } catch (error) {
    throw new Error(error as string);
  }
};
