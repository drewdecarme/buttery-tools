import { CommandAction, CommandMeta } from "../lib/types";

export const meta: CommandMeta = {
  name: "build",
  description: "Build your file-based CLI",
};

export const action: CommandAction = async (args) => {
  console.log(args);
};
