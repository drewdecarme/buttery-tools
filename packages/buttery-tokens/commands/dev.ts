import { CommandAction, CommandMeta } from "@buttery/cli";

export const meta: CommandMeta = {
  name: "dev",
  description: "dev description... Please update me",
};

export const action: CommandAction = async () => {
  console.log("running buttery tokens in dev mode.");
};
