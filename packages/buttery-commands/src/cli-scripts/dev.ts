import { buildCommands } from "../build-commands";
import { LOG } from "../utils";

/**
 * Build's the @buttery/commands binary and watches
 * for changes to the .buttery/config or the commands
 * directories
 */
export async function dev() {
  try {
    buildCommands({
      watch: true,
      local: false,
    });
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
