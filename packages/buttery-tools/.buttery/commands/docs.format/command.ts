import type { CommandAction, CommandMeta } from "@buttery/commands";
import { format } from "@buttery/docs/format";

export const meta: CommandMeta = {
  name: "format",
  description:
    "Ensure that every file is formatted correctly with the proper frontmatter",
};

export const action: CommandAction = async () => {
  format();
};
