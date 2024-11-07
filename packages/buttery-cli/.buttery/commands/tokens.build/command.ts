import {
  type CommandAction,
  type CommandMeta,
  defineOptions,
} from "@buttery/commands";

export const meta: CommandMeta = {
  name: "build",
  description: "Run the buttery-tokens CLI in watch mode.",
};

export const options = defineOptions({
  prompt: {
    type: "boolean",
    alias: "np",
    description:
      "A boolean option to disable command line prompts if the proper configurations aren't detected.",
    required: false,
  },
});

export const action: CommandAction<typeof options> = async () => {
  console.log("TODO!");
};
