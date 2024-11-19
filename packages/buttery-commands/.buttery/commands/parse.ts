import {
  type CommandAction,
  type CommandMeta,
  defineArgs,
  defineOptions,
} from "../../src/lib/library";

export const meta: CommandMeta = {
  name: "parse",
  description: "A script to test single level args and options parsing",
};

export const args = defineArgs({
  path: {
    type: "string",
    name: "path",
    description: "The path of the command to parse",
    required: true,
  },
});

export const options = defineOptions({
  debug: {
    type: "boolean",
    description: "Debug any output by printing out the logs to the terminal",
    alias: "t",
  },
});

export const action: CommandAction<typeof args, typeof options> = (params) => {
  console.log("Hello from the parse command.", params);
};
