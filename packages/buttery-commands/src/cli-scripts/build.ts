import { buildCommands } from "../build-commands";
import { LOG } from "../utils";

/**
 * Build's the @buttery/commands binary
 */
export async function build() {
  try {
    buildCommands({
      watch: false,
      local: true,
    });
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
