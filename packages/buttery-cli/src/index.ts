#! /usr/bin/env node
import { program } from "commander";
import { cosmiconfig } from "cosmiconfig";
import { glob } from "glob";
// import path from "path";
import {
  CLIConfig,
  // CommandAction,
  // CommandArgs,
  // CommandMeta,
  // CommandOptions,
} from "../lib/types";
import { processCommands } from "./process-command-dir.js";

const explorer = cosmiconfig("butter");

explorer
  .search()
  .then(async (result) => {
    // protect against a bad parse
    if (!result) throw new Error("Cannot parse configuration result.");

    const config = result.config as CLIConfig;

    // Add the name and the description of the CLI
    program.name(config.name).description(config.description);

    const commandFiles = glob.sync(`${config.root}/bin/commands/*.js`);

    processCommands(commandFiles, program);

    // Loop through all of the files
    // for (const commandFilePath of commandFiles) {
    //   // Get the filename
    //   const fileName: string = path.basename(commandFilePath, ".js");
    //   const segments: string[] = fileName.split(".");

    //   // set the parent command to the program
    //   const parentCommand = program;
    //   let currentCommand = parentCommand;

    //   // loop through all of the segments and create commands for
    //   // them if they don't exist
    //   for (const segment of segments) {
    //     const existingCommand = currentCommand.commands.find(
    //       (cmd) => cmd.name() === segment
    //     );

    //     if (!existingCommand) {
    //       const newCommand = currentCommand.command(segment);

    //       if (currentCommand === parentCommand) {
    //         // TODO: Add all of the properties of the files here.
    //         // Validate them here
    //         const importedCommand = (await import(commandFilePath)) as Partial<{
    //           meta: CommandMeta;
    //           args: CommandArgs;
    //           options: CommandOptions;
    //           action: CommandAction;
    //         }>;
    //         if (!importedCommand.meta) {
    //           throw new Error(
    //             `Error in '${fileName}'. 'meta' export not detected. Please ensure that you have exported a 'meta' configuration object from the '${fileName}'.`
    //           );
    //         }
    //         newCommand
    //           .name(importedCommand.meta.name)
    //           .description(importedCommand.meta.description);

    //         if (!importedCommand.action) {
    //           throw new Error(
    //             `Error in '${fileName}'. 'action' export not detected. Please ensure that you have exported a 'action' configuration object from the '${fileName}'.`
    //           );
    //         }
    //         const action = importedCommand.action;
    //         newCommand.action((args) => {
    //           console.log(fileName.concat(" action parameters"), ...args);
    //           action(args);
    //         });

    //         // Process arguments
    //         if (importedCommand.args && importedCommand.args.length > 0) {
    //           importedCommand.args.forEach((arg) => {
    //             const name = arg.required ? `[${arg}]` : `<${arg}>`;
    //             newCommand.argument(name, arg.description, arg.defaultValue);
    //           });
    //         }

    //         // Process options
    //         if (importedCommand.options && importedCommand.options.length > 0) {
    //           importedCommand.options.forEach((option) => {
    //             newCommand.option(
    //               `-${option.alias} --${option.flag}`,
    //               option.description,
    //               option.defaultValue
    //             );
    //           });
    //         }
    //       }

    //       currentCommand = newCommand;
    //     } else {
    //       currentCommand = existingCommand;
    //     }
    //   }
    // }

    // console.log(commands);

    program.parseAsync(process.argv);
  })
  .catch((error) => {
    console.error(error);
    throw new Error(error);
  });
