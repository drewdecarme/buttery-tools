import {
  type CommandAction,
  type CommandMeta,
  defineArgs,
  defineOptions,
} from "../../../src/lib/library";
import { testCommandGlob } from "./test-glob.something";

export const meta: CommandMeta = {
  name: "nested",
  description:
    "🚗 A command that tests out the nested flat-file sub-command convention",
};

export const args = defineArgs({
  directory: {
    type: "string",
    description: "A directory to target",
    required: true,
    name: "directory",
    length: {
      max: 10,
    },
    default: "cwd",
  },
  "should-test": {
    type: "boolean",
    description: "A test positional arg",
    name: "should-test",
    default: false,
  },
  priority: {
    type: "number",
    description: "Testing choices",
    name: "priority",
    range: {
      min: 9,
      max: 10,
    },
    default: 1,
  },
});

export const options = defineOptions({
  test: {
    type: "boolean",
    name: "test",
    alias: "t",
    description: "A test description",
    required: true,
  },
  "favorite-color": {
    type: "string",
    alias: "fc",
    name: "favorite-color",
    description: "Describe your favorite color",
    default: "blue",
  },
});

export const action: CommandAction<typeof args, typeof options> = async ({
  options,
  args,
}) => {
  console.log(options.test);
  console.log(args);
  testCommandGlob();
};
