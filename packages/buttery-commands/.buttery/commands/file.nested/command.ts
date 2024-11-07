import {
  type CommandAction,
  type CommandMeta,
  defineOptions,
} from "../../../src/lib/library";

export const meta: CommandMeta = {
  name: "nested",
  description:
    "A command that tests out the nested flat-file sub-command convention",
};

export const options = defineOptions({
  test: {
    type: "boolean",
    name: "test",
    alias: "t",
    description: "A test description",
  },
  "favorite-color": {
    type: "string",
    alias: "fc",
    name: "favorite-color",
    description: "Describe your favorite color",
  },
});

export const action: CommandAction<typeof options> = async ({ options }) => {
  console.log(options.test);
};
