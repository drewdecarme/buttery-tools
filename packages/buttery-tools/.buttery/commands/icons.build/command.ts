import { exit } from "node:process";
import type { CommandAction, CommandMeta } from "../../../lib/commands";
import { buildButteryIcons } from "../../../lib/icons/icons.buildButteryIcons";

export const meta: CommandMeta = {
  name: "build",
  // TODO: Fix this description
  description: "Create buttery icons"
};

/**
 * Reads a directory that contains the svg files, loops through all
 * of the files in that directory and creates a TS union that is written
 * to a file that is then subsequently imported into the icon component.
 * This provides intellisense and TS auto completion when importing an icon
 */
export const action: CommandAction = async () => {
  await buildButteryIcons();
  exit();
};
