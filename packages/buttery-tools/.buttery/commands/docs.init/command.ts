import type {
  CommandAction,
  CommandMeta,
} from "../../../lib/commands/butter-commands.types";

export const meta: CommandMeta = {
  name: "init",
  description:
    "Initialize a project with the necessary configurations and files needed to create the Buttery Docs UI",
};

export const action: CommandAction = async () => {
  console.log("TODO!");
};
