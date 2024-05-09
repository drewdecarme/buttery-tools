import { Command } from "commander";
import path from "path";
import {
  exhaustiveMatchGuard,
  parseCommandFileProperties,
} from "./util.parse-command-file-properties.js";
import { readFile, writeFile } from "fs/promises";
import handlebars from "handlebars";

type CommandFile = {
  name: string;
  hasSubCommands: boolean;
  path: string;
  properties: Record<string, unknown>;
};

export const parseAndValidateCommandFiles = async ({
  commandsDir,
  commandFilePaths,
}: {
  commandsDir: string;
  commandFilePaths: string[];
}): Promise<CommandFile[]> => {
  // Check to make sure there are files in the commands directory
  try {
    if (commandFilePaths.length === 0) {
      throw "You don't have any files in your 'commands' directory. Please add some command files.";
    }
  } catch (error) {
    throw new Error(`Error parsing command files: ${error}`);
  }

  // construct some data about each file
  const files = commandFilePaths.reduce<CommandFile[]>(
    (accum, commandFilePath) => {
      const name = path.basename(commandFilePath, ".js");
      const hasSubCommands = !!commandFilePaths.find(
        (cFilePath) => cFilePath !== commandFilePath && cFilePath.includes(name)
      );
      return [
        ...accum,
        {
          name,
          hasSubCommands,
          path: commandFilePath,
          properties: {},
        },
      ];
    },
    []
  );

  // Import the necessary data from each file and their segments
  // TODO: Add --debug to build to log output
  // TODO: Add --log-level to build to log output
  // If the files don't exist create them, TODO: then prompt using --auto-generate
  for (const fileIndex in files) {
    const file = files[fileIndex];
    const segments = file.name.split(".");

    for (const segmentIndex in segments) {
      const segment = segments[segmentIndex];
      const segmentFileName = segments
        .slice(0, Number(segmentIndex) + 1)
        .join(".");
      const segmentFilePath = `${commandsDir}/${segmentFileName}.js`;
      try {
        console.log(`Importing data from: ${segmentFilePath}...`);
        // find the segment command file
        const segmentCommandProperties = await import(segmentFilePath);
        // add the properties to the file
        console.log(`Importing data from: ${segmentFilePath}... done.`);
        file.properties = {
          meta: segmentCommandProperties?.meta,
          options: segmentCommandProperties?.options,
          args: segmentCommandProperties?.args,
          action: segmentCommandProperties?.action,
        };
      } catch (error) {
        // @ts-expect-error code doesn't normally exist
        // but we're ignoring it here
        if (error.code === "ERR_MODULE_NOT_FOUND") {
          console.info(`Cannot locate command file for '${segmentFileName}'`);
          console.log("Auto creating command file with default values...");
          // TODO: Put any prompting behind --autofix
          // TODO: NEXT STEPS!!! Move build to create commands
          const commandParentTemplate = await readFile(
            path.resolve(import.meta.dirname, "./template.command-parent.hbs"),
            { encoding: "utf-8" }
          );
          const template = handlebars.compile<{ command_name: string }>(
            commandParentTemplate.toString()
          )({ command_name: segment });
          await writeFile(
            path.resolve(commandsDir, `./${segmentFileName}.ts`),
            template,
            { encoding: "utf-8" }
          );
          console.log(
            "Auto creating command file with default values... done."
          );
        }
        throw new Error(error as string);
      }
    }
  }
  console.log(files);
  return files;
};

export async function buildProgramFromFiles({
  command,
  commandsDir,
  commandFilePaths,
}: {
  command: Command;
  commandsDir: string;
  commandFilePaths: string[];
}): Promise<void> {
  const files = await parseAndValidateCommandFiles({
    commandsDir,
    commandFilePaths,
  });

  // Go through every file
  for (const fileIndex in files) {
    const file = files[fileIndex];
    const segments = file.name.split(".");

    // We keep an instance of a file command in here to create
    // the deeply nested relationships when going through the
    // segments
    let fileCommand = command;

    // go through all of the segments of the file and
    // create nested command relationships if they don't already
    // exist.
    const rootCommandName = segments[0];
    for (const segmentIndex in segments) {
      const segment = segments[segmentIndex];

      // In order to create the deeply nested command relationships.. we need
      // to either see if the file has a command on it that matches this segment
      // or we need to create a new command for the file segment.
      // To continue those relationships, we set the fileCommand equal to the newly
      // created segment command or the one that already existed. That way if we need
      // to nest another relationship in the segment we can, but if we don't need to
      // we'll just keep building on the file command.
      let segmentCommand = fileCommand.commands.find(
        (cmd) => cmd.name() === segment
      );

      // the segment command doesn't exist for this segment
      // so we need to create it by importing the properties
      // from the segment path and then adding them to the command.
      if (!segmentCommand) {
        const segmentFileName = segments
          .slice(0, Number(segmentIndex) + 1)
          .join(".")
          .concat(".js");
        const segmentFilePath = `${commandsDir}/${segmentFileName}`;

        try {
          // import the content from the segment
          const commandFileContent = await import(segmentFilePath);
          const props = parseCommandFileProperties({
            content: commandFileContent,
            fileName: segmentFileName,
          });

          // Create the segment command off of it's parent command.
          segmentCommand = fileCommand
            .command(segment)
            .description(props.meta.description);

          // Add arguments (if they're defined in the file) to the parent command.
          props.args.forEach((arg) => {
            if (!segmentCommand) return;
            const argName = arg.required ? `<${arg.name}>` : `[${arg.name}]`;
            segmentCommand.argument(argName, arg.description, arg.defaultValue);
          });

          // Add options (if they're defined in the file) to the parent command.
          Object.entries(props.options).forEach(([flag, option]) => {
            if (!segmentCommand) return;
            switch (option.type) {
              case "value": {
                return segmentCommand.option(
                  `-${option.alias}, --${flag} <value>`,
                  option.description
                );
              }

              case "boolean": {
                return segmentCommand.option(
                  `-${option.alias}, --${flag}`,
                  option.description
                );
              }

              default:
                exhaustiveMatchGuard(option);
                return;
            }
          });

          segmentCommand.action(function (...restArgs) {
            restArgs.pop();
            const options = restArgs[restArgs.length - 1];
            restArgs.pop();
            const args = Object.fromEntries(
              props.args.map((arg, i) => {
                return [arg.name, restArgs[i] as string];
              })
            );
            props.action({
              args,
              options,
            });
          });
        } catch (error) {
          // @ts-expect-error code doesn't normally exist
          // but we're ignoring it here
          if (error.code === "ERR_MODULE_NOT_FOUND") {
            console.log(segmentFilePath);
            console.info(
              `Cannot locate file for the parent command '${rootCommandName}'. Auto creating command file with default values.`
            );
          }
        }
      }
      if (!segmentCommand) return;
      fileCommand = segmentCommand;
    }

    // once the file segments are processed, we can
    // reset our file command to the base program
    // that was passed in... in this case it's the commander
    // program
    fileCommand = command;
  }
}
