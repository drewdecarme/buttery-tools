import type { CommandAction, CommandMeta } from "@buttery/commands";
import { build } from "@buttery/docs/build";

export const meta: CommandMeta = {
  name: "build",
  description:
    "Build's necessary production assets for the `@buttery/docs` application deployment",
};

export const action: CommandAction = async () => {
  build();
};
