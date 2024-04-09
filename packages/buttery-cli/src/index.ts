#! /usr/bin/env node
import { program } from "commander";
import { cosmiconfig } from "cosmiconfig";
import { glob } from "glob";
import { CLIConfig } from "./types.js";
import { registerCommandsFromFiles } from "./process-command-dir.js";
export * from "./types.js";

const explorer = cosmiconfig("butter");

explorer
  .search()
  .then(async (result) => {
    // protect against a bad parse
    if (!result) throw new Error("Cannot parse configuration result.");

    const config = result.config as CLIConfig;

    // Add the name and the description of the CLI
    program.name(config.name).description(config.description);

    const commandFilePaths = glob.sync(`${config.root}/bin/commands/*.js`, {
      follow: false,
    });

    await registerCommandsFromFiles(program, commandFilePaths);
    await program.parseAsync(process.argv);
  })
  .catch((error) => {
    console.error(error);
    throw new Error(error);
  });
