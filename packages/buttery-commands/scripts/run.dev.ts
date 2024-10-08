import { buildCommands } from "../src/build-commands";
import { LOG } from "../src/utils";

/**
 * Build's the @buttery/commands binary and watches
 * for changes to the .buttery/config or the commands
 * directories
 */
export async function dev() {
  try {
    buildCommands({
      watch: false,
      local: true,
    });
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
