import { buildCommands } from "../.buttery/commands/commands.build/build-commands";
import { LOG_CLI } from "../lib/logger/loggers";

try {
  await Promise.all([
    buildCommands({
      watch: false,
      local: true
    })
  ]);
} catch (error) {
  throw LOG_CLI.fatal(new Error(error as string));
}
