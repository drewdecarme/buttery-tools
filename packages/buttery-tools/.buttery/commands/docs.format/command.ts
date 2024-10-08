import type {
  CommandAction,
  CommandMeta,
} from "../../../lib/commands/butter-commands.types";

export const meta: CommandMeta = {
  name: "format",
  description:
    "Ensure that every file is formatted correctly with the proper frontmatter",
};

export const action: CommandAction = async () => {
  console.log("TODO!");
};
