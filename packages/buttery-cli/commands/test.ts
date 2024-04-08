import { CommandAction, CommandMeta, CommandOptions } from "../lib/types";

export const meta: CommandMeta = {
  name: "test",
  description: "Cras mattis consectetur purus sit amet fermentum.",
};

export const options: CommandOptions = [
  {
    flag: "option-1",
    alias: "opt1",
    description: "option 1 description",
  },
];

export const action: CommandAction<undefined, typeof options> = async (
  params
) => {
  console.log("Hello from the `test` command.", params);
};
