import {
  type CommandAction,
  type CommandMeta,
  defineOptions,
} from "@buttery/commands";

export const meta: CommandMeta = {
  name: "dev",
  description:
    "Iteratively develop @buttery/tokens `make` functions based upon the `buttery/config.tokens`",
};

export const options = defineOptions({
  interactive: {
    alias: "i",
    defaultValue: false,
    description:
      "Runs the build in watch mode and opens up a local server to configure your tokens through a UI",
    type: "boolean",
    required: false,
  },
  prompt: {
    type: "boolean",
    defaultValue: false,
    alias: "p",
    description:
      "A boolean option to enabled command line prompts if the proper configurations aren't detected.",
    required: false,
  },
  debug: {
    type: "boolean",
    defaultValue: false,
    alias: "d",
    description:
      "Prints all of the logs to stdout to easily see all of the activity to create the tokens.",
    required: false,
  },
});

export const action: CommandAction<typeof options> = async () => {
  console.log("TODO!");
};
