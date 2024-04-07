import { CommandAction, CommandMeta, CommandOptions } from "../lib/types";

export const meta: CommandMeta = {
  name: "brutal",
  description: "Cras mattis consectetur purus sit amet fermentum.",
};

export const options: CommandOptions = {
  "option-1": {
    alias: "opt1",
    description: "option 1 description",
  },
};

export const action: CommandAction<undefined, typeof options> = async (
  params
) => {
  console.log("Hello from the `random.saved.brutal` command.", params);
};
