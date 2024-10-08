import { buildCommands } from "../src/build-commands";
import { LOG } from "../src/utils";

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
