import { CommandAction, CommandMeta } from "../src/types";

export const meta: CommandMeta = {
  name: "cli",
  description: "Build your file-based CLI",
};

export const action: CommandAction = async () => {
  console.log("Hello from the CLI 'build' command.");
};
