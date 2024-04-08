import { CommandAction, CommandMeta, CommandOptions } from "../src/types";

export const meta: CommandMeta = {
  name: "ramdon",
  description: "Cras mattis consectetur purus sit amet fermentum.",
};

export const options: CommandOptions = [
  {
    flag: "first",
    alias: "f",
    description: "display just the first substring",
  },
];

export const action: CommandAction<undefined, typeof options> = async (
  params
) => {
  console.log("Hello from the `random` command.", params);
};
