import { buildCommands } from "../.buttery/commands/commands.build/build-commands.js";
import { LOG } from "../lib/logger/LOG_CLI/LOG.CLI.js";

try {
  await Promise.all([
    buildCommands({
      watch: false,
      local: true
    })
  ]);
} catch (error) {
  throw LOG.fatal(new Error(error as string));
}
