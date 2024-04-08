import { type Command } from "commander";
import path from "path";
import {
  CommandAction,
  CommandArgs,
  CommandMeta,
  CommandOptions,
} from "../lib/types";

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
  files.forEach((file) => {
    const segments = file.name.split(".");

    // We keep an instance of a file command in here to create
    // the deeply nested relationships when going through the
    // segments
    let fileCommand = command;

    // go through all of the segments of the file and
    // create nested command relationships if they don't already
    // exist.
    segments.forEach((segment, iSegment, origArr) => {
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

      if (!segmentCommand) {
        segmentCommand = fileCommand.command(segment);
        const segmentFileName = origArr
          .slice(0, iSegment + 2)
          .join(".")
          .concat(".js");
        const segmentFilePath = file.basePath.concat(segmentFileName);
        const cmd = segmentCommand; // alias here for typechecking

        import(segmentFilePath)
          .then((segmentProperties) => {
            console.log("adding properties");
            const importedCommand = segmentProperties as Partial<{
              meta: CommandMeta;
              args: CommandArgs;
              options: CommandOptions;
              action: CommandAction;
            }>;
            console.log(importedCommand.action);
            // Validate command.meta and set the description
            if (!importedCommand.meta) {
              throw `Error in '${segmentFileName}'. 'meta' export not detected. Please ensure that you have exported a 'meta' configuration object from the '${segmentFileName}'.`;
            }
            cmd.description(importedCommand.meta.description);

            // Validate the action and set the action
            if (!importedCommand.action) {
              throw new Error(
                `Error in '${segmentFileName}'. 'action' export not detected. Please ensure that you have exported a 'action' configuration object from the '${segmentFileName}'.`
              );
            }
            const action = importedCommand.action;
            cmd.action(action);

            // Process the arguments
            if (importedCommand.args && importedCommand.args.length > 0) {
              importedCommand.args.forEach((arg) => {
                const name = arg.required ? `[${arg}]` : `<${arg}>`;
                cmd.argument(name, arg.description, arg.defaultValue);
              });
            }

            // Process options
            if (importedCommand.options && importedCommand.options.length > 0) {
              importedCommand.options.forEach((option) => {
                cmd.option(
                  `-${option.alias} --${option.flag}`,
                  option.description,
                  option.defaultValue
                );
              });
            }
          })
          .catch(() => {
            console.log(segmentFilePath, segmentFileName);
            console.warn(
              `Command file doesn't exist. Using '${segmentFilePath}' as parent command.`
            );
          });
      }

      fileCommand = segmentCommand;
    });

    // once the file segments are processed, we can
    // reset our file command to the base program
    // that was passed in... in this case it's the commander
    // program
    fileCommand = command;
  });

  command.parse(process.argv);
}
