import { LOG } from "../.buttery/commands/_logger/util.ts.logger.js";
import { buildCommands } from "../.buttery/commands/commands.build/build-commands.js";

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
