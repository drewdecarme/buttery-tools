import { exit } from "node:process";
import { buildCommands } from "../.buttery/commands/commands.build/build-commands";
import { LOG_CLI } from "../lib/logger/loggers";

try {
  await buildCommands({
    watch: false,
    local: true
  });
  exit();
} catch (error) {
  throw LOG_CLI.fatal(new Error(error as string));
}
