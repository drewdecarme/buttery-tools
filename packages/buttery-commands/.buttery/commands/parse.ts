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
    name: "path",
    description: "required positional argument",
    type: "string",
    required: true,
  },
});

export const options = defineOptions({
  template: {
    type: "boolean",
    description: "An optional option",
    alias: "t",
  },
});

export const action: CommandAction<typeof args, typeof options> = (params) => {
  console.log("Hello from the parse command.", params);
};
