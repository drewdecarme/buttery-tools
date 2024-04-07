import { CommandAction, CommandMeta, CommandOptions } from "../lib/types";

export const meta: CommandMeta = {
  name: "data",
  description: "Cras mattis consectetur purus sit amet fermentum.",
};

export const options: CommandOptions = {
  "data-option": {
    alias: "do",
    description: "test.data option 1 description",
  },
};

export const action: CommandAction<undefined, typeof options> = async (
  params
) => {
  console.log("Hello from the `test.data` command.", params);
};
