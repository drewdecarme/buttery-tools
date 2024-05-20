import type { CommandAction, CommandMeta, CommandOptions } from "@buttery/cli";

export const meta: CommandMeta = {
  name: "build",
  description:
    "Build the necessary assets required to create actions, fetchers, and components to render the Buttery Docs template."
};

export const options: CommandOptions<"watch"> = {
  watch: {
    alias: "w",
    description: "Run the build in watch mode",
    type: "boolean",
    required: false
  }
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  console.log("Hello from buttery docs build");
};