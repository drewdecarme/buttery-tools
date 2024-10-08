import { buildCommands } from "../.buttery/commands/commands.build/build-commands";
import { LOG_CLI } from "../lib/logger/loggers";

try {
  await buildCommands({
    watch: true,
    local: true,
  });
} catch (error) {
  throw LOG_CLI.fatal(new Error(error as string));
}
