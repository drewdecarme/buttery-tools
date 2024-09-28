import { buildCommands } from "../.buttery/commands/commands.build/build-commands";
import { LOG_CLI } from "../lib/logger";

try {
  await Promise.all([
    buildCommands({
      watch: true,
      local: true
    })
  ]);
} catch (error) {
  throw LOG_CLI.fatal(new Error(error as string));
}
