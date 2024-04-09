import { Command } from "commander";
import path from "path";
import { parseCommandFileProperties } from "./parse-command-file-properties.js";

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
): Promise<Command> {
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

      // the segment command doesn't exist for this segment
      // so we need to create it by importing the properties
      // from the segment path and then adding them to the command.
      if (!segmentCommand) {
        segmentCommand = fileCommand.command(segment).action((args) => {
          console.log("Launching segment action", segment, args);
        });
        const segmentFileName = origArr
          .slice(0, iSegment + 2)
          .join(".")
          .concat(".js");
        const segmentFilePath = file.basePath.concat(segmentFileName);

        // import(segmentFilePath)
        //   .then((content) => {
        //     const props = parseCommandFileProperties({
        //       content,
        //       fileName: segmentFileName,
        //     });

        //     // add the items to the newCommand and chain them correctly
        //     segmentCommand = fileCommand
        //       .command(segment)
        //       .description(props.meta.description)
        //       // @ts-ignore
        //       .action((...args) => props.action(args));
        //   })
        //   .catch(() => {
        //     // console.error(error);
        //     console.log("ERROR", segmentFilePath, segmentFileName);
        //   });
      }
      // @ts-ignore
      fileCommand = segmentCommand;
    });

    // once the file segments are processed, we can
    // reset our file command to the base program
    // that was passed in... in this case it's the commander
    // program
    fileCommand = command;
  });
  return command;
}
