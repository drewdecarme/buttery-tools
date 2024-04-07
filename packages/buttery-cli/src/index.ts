#! /usr/bin/env node
import { program, type Command } from "commander";
import { cosmiconfig } from "cosmiconfig";
import { glob } from "glob";
import path from "path";
import { CLIConfig } from "../lib/types";

const explorer = cosmiconfig("butter");

explorer
  .search()
  .then(async (result) => {
    // protect against a bad parse
    if (!result) throw new Error("Cannot parse configuration result.");

    const config = result.config as CLIConfig;

    program.name(config.name).description(config.description);

    const commandFiles = glob.sync(`${config.root}/bin/commands/*.js`);

    for (const commandFilePath of commandFiles) {
      const fileName: string = path.basename(commandFilePath, ".js");
      const parts: string[] = fileName.split(".");

      const parentCommand = program;
      let currentCommand: Command = parentCommand;

      parts.forEach((part) => {
        const existingCommand = currentCommand.commands.find(
          (cmd) => cmd.name() === part
        );

        if (!existingCommand) {
          const newCommand = currentCommand.command(part);

          if (currentCommand === parentCommand) {
            newCommand.description("Description for " + part); // You can set description here
          }

          currentCommand = newCommand;
        } else {
          currentCommand = existingCommand;
        }
      });
    }

    // console.log(commands);

    program.parseAsync(process.argv);
  })
  .catch((error) => {
    console.error(error);
    throw new Error(error);
  });
