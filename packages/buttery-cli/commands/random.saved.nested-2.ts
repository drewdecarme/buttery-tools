import { CommandAction, CommandMeta, CommandOptions } from "../src/types";

export const meta: CommandMeta = {
  name: "brutal",
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

export const action: CommandAction<typeof options> = async (params) => {
  console.log("Hello from the `random.saved.brutal` command.", params);
};
