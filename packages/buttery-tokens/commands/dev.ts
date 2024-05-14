import { CommandAction, CommandMeta } from "@buttery/cli";

export const meta: CommandMeta = {
  name: "dev",
  description: "Run the buttery-tokens CLI in watch mode.",
};

export const action: CommandAction = async () => {
  console.log("running buttery tokens in DEV mode.");
};
