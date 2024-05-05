import { CommandAction, CommandMeta, CommandOptions } from "../lib/types";

export const meta: CommandMeta = {
  name: "saved",
  description: "Cras mattis consectetur purus sit amet fermentum.",
};

export const options: CommandOptions = {
  first: {
    type: "value",
    alias: "f",
    description: "display just the first substring",
    required: false,
  },
};

export const action: CommandAction = async (params) => {
  console.log("Hello from the `random.saved` command.", params);
};
