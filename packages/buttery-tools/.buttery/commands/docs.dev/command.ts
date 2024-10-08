import type { CommandAction, CommandMeta } from "@buttery/commands";
import { dev } from "@buttery/docs/dev";

export const meta: CommandMeta = {
  name: "dev",
  description: "Iteratively develop your `@buttery/docs` app",
};

export const action: CommandAction = async () => {
  dev();
};
