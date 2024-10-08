import type { CommandAction, CommandMeta } from "@buttery/commands";
import { build } from "@buttery/icons/build";

export const meta: CommandMeta = {
  name: "build",
  description: "Create buttery icons",
};

/**
 * Reads a directory that contains the svg files, loops through all
 * of the files in that directory and creates a TS union that is written
 * to a file that is then subsequently imported into the icon component.
 * This provides intellisense and TS auto completion when importing an icon
 */
export const action: CommandAction = async () => {
  build();
};
