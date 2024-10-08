import { select } from "@inquirer/prompts";
import type { CommandAction, CommandMeta } from "../../../lib/buttery-commands";
import { exhaustiveMatchGuard } from "../../../utils/ts";
import { LOG } from "../_logger/util.ts.logger";
import { formatRouteOrder } from "./docs.format.formatRouteOrder";

export const meta: CommandMeta = {
  name: "format",
  description:
    "Ensure that every file is formatted correctly with the proper frontmatter"
};

export const action: CommandAction = async () => {
  LOG.watch("Formatting...");

  const decision = await select<"navigation">({
    message: "What would you like to format?",
    choices: [
      {
        value: "navigation",
        name: "Navigation",
        description:
          'Prints out a "best guest" order of the navigation / routing tree that you can then add to the "config.docs.order" key in the ".buttery/config.ts" file'
      }
    ]
  });

  switch (decision) {
    case "navigation":
      return await formatRouteOrder();

    default:
      return exhaustiveMatchGuard(decision);
  }
};
