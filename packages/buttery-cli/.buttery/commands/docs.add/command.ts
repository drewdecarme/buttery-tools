import {
  type CommandAction,
  type CommandMeta,
  defineArgs,
  defineOptions,
} from "@buttery/commands";
import { add } from "@buttery/docs/cli/add";

export const meta: CommandMeta = {
  name: "add",
  description: "Iteratively develop your `@buttery/docs` app",
};

export const args = defineArgs({
  path: {
    type: "string",
    description:
      "The path relative to the .buttery/docs directory that the new file should be output",
    name: "path",
    required: true,
  },
});

export const options = defineOptions({
  template: {
    type: "boolean",
    description:
      "Prompts the user to bootstrap their new document with a template from the Good Docs Project (https://www.thegooddocsproject.dev/template)",
    alias: "t",
    default: false,
    required: false,
  },
  "log-level": {
    description: "The level at which the logs should display",
    default: "info",
    type: "string",
    alias: "l",
    required: false,
  },
});

export const action: CommandAction<typeof args, typeof options> = async ({
  args,
  options,
}) => {
  add(args.path, options);
};
