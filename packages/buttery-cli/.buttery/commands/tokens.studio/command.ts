import {
  type CommandAction,
  type CommandMeta,
  defineOptions,
} from "@buttery/commands";
import { tokenStudio } from "@buttery/tokens/cli/token-studio";

export const meta: CommandMeta = {
  name: "studio",
  description:
    "Launch the TokenStudio to visually configure the buttery tokens",
};

export const options = defineOptions({
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

export const action: CommandAction<never, typeof options> = async ({
  options,
}) => {
  tokenStudio({
    logLevel: options.debug ? "debug" : "info",
    prompt: options.prompt,
  });
};
