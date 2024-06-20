import type { CommandAction, CommandMeta } from "../../../lib";
import { LOG_DOCS } from "../docs.dev/_utils/util.logger";

export const meta: CommandMeta = {
  name: "format",
  description:
    "Ensure that every file is formatted correctly with the proper frontmatter",
};

export const action: CommandAction = async () => {
  LOG_DOCS.watch("Formatting...");
};
