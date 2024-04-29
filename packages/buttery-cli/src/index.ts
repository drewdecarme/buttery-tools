#! /usr/bin/env node
import { program } from "commander";
import { cosmiconfig } from "cosmiconfig";
import { glob } from "glob";
import { CLIConfig } from "./types.js";
import { registerCommandsFromFiles } from "./util.process-command-dir.js";
import { fileURLToPath, resolve } from "node:url";
export * from "./types.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const explorer = cosmiconfig("buttery");

explorer
  .search()
  .then(async (result) => {
    // protect against a bad parse
    if (!result)
      throw new Error(
        "Cannot locate your buttery config. Please ensure you have a `buttery.config.ts` file."
      );

    const config = result.config as CLIConfig;

    // Add the name and the description of the CLI
    program.name(config.name).description(config.description);
    const commandsDir = resolve(__dirname, "./commands");

    const commandFilePaths = glob.sync(commandsDir.concat("/*.js"), {
      follow: false,
    });

    await registerCommandsFromFiles(program, commandFilePaths);
    console.log(program.opts());
    await program.parseAsync();
  })
  .catch((error) => {
    console.error(error);
    throw new Error(error);
  });
