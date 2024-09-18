import { LOG } from "../.buttery/commands/_logger/util.ts.logger.js";
import { buildCommands } from "../.buttery/commands/commands.build/build-commands.js";

try {
  await Promise.all([
    buildCommands({
      watch: true,
      local: true
    })
    // buildTSLibrary({
    //   srcDir: path.resolve(import.meta.dirname, "../lib"),
    //   outDir: path.resolve(import.meta.dirname, "../dist"),
    //   tsconfigPath: path.resolve(
    //     import.meta.dirname,
    //     "../tsconfig.library.build.json"
    //   ),
    //   logger: LOG
    // })
  ]);
} catch (error) {
  throw LOG.fatal(new Error(error as string));
}
