import { Command } from "commander";
import path from "path";
import {
  exhaustiveMatchGuard,
  parseCommandFileProperties,
} from "./parse-command-file-properties.js";

type CommandFile = {
  name: string;
  basePath: string;
  path: string;
};

export const constructCommandFiles = (
  commandFilePaths: string[]
): CommandFile[] =>
  commandFilePaths.map((commandFilePath) => {
    const name = path.basename(commandFilePath, ".js");
    return {
      name,
      basePath: commandFilePath.split(name)[0],
      path: commandFilePath,
    };
  });

export async function registerCommandsFromFiles(
  command: Command,
  commandFilePaths: string[]
): Promise<void> {
  if (commandFilePaths.length === 0) {
    throw new Error(
      "You don't have any files in your 'commands' folder. Please add some command files."
    );
  }

  const files = constructCommandFiles(commandFilePaths);

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
          .slice(0, Number(segmentIndex) + 2)
          .join(".")
          .concat(".js");
        const segmentFilePath = file.basePath.concat(segmentFileName);
        try {
          const commandFileContent = await import(segmentFilePath);
          const props = parseCommandFileProperties({
            content: commandFileContent,
            fileName: segmentFileName,
          });

          // Create the segment command off of it's parent command.
          segmentCommand = fileCommand
            .command(segment)
            .description(props.meta.description);
          // .option("-t, --test", "test option", "blue");

          // Add arguments (if they're defined in the file) to the parent command.
          // props.args.forEach((arg) => {
          //   if (!segmentCommand) return;
          //   const argName = arg.required ? `<${arg.name}>` : `[${arg.name}]`;
          //   segmentCommand
          //     .argument(argName, arg.description, arg.defaultValue)
          //     .passThroughOptions();
          // });

          // Add options (if they're defined in the file) to the parent command.
          Object.entries(props.options).forEach(([flag, option]) => {
            if (!segmentCommand) return;
            switch (option.type) {
              case "value": {
                segmentCommand.option(
                  `-${option.alias}, --${flag} <value>`,
                  option.description
                );
                return;
              }

              case "boolean": {
                segmentCommand.option(
                  `-${option.alias}, --${flag}`,
                  option.description
                );
                return;
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
            props.action({
              args: restArgs,
              options,
            });
          });
        } catch (error) {}
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
