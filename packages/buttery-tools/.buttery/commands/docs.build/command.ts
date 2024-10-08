import type {
  CommandAction,
  CommandMeta,
} from "../../../lib/commands/butter-commands.types";

export const meta: CommandMeta = {
  name: "build",
  description:
    "Build the necessary assets required to create actions, fetchers, and components to render the Buttery Docs template.",
};

export const action: CommandAction = async () => {
  console.log("TODO!");
};
