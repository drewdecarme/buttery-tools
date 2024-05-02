import { CommandMeta } from "../types";

// TODO: FUTURE --- run an init command to prompt the user for these values rather than
// setting this up manually.

export const meta: CommandMeta = {
  name: "init",
  description:
    "Automatically create all of the configurations necessary needed to start building your template based CLI.",
};
