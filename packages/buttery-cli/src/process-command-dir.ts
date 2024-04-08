import { type Command } from "commander";
import path from "path";

export function compareFileNames(a: string, b: string): number {
  const baseNameA = a.split("/").pop()!.split(".")[0];
  const baseNameB = b.split("/").pop()!.split(".")[0];
  return baseNameA.localeCompare(baseNameB);
}

type CommandFile = {
  name: string;
  path: string;
};

export const constructCommandFiles = (
  commandFilePaths: string[]
): CommandFile[] =>
  commandFilePaths
    .sort((firstElement, secondElement) => {
      const aBasename = path.basename(secondElement);
      const bBasename = path.basename(firstElement);
      if (aBasename.split(".").length === 1) {
        return -1;
      }
      return aBasename.startsWith(bBasename) ? -1 : 1;
    })
    .map((commandFilePath) => ({
      name: path.basename(commandFilePath, ".js"),
      path: commandFilePath,
    }));

export type CommandObj = {
  [key: string]: {
    path: string;
    sub_command: CommandObj;
  };
};

// export function constructCommandObj(commandFilePaths: string[]): CommandObj {
//   const files = constructCommandFiles(commandFilePaths);

//   const commandObjArr = files.reduce<CommandObj>((accum, file) => {
//     console.log(file.name);
//     const existingCommandVal = get(accum, file.name);
//     console.log(existingCommandVal);
//     const segments = file.name.split(".");
//     return {
//         ...accum,
//     }

//     // if (!existingCommandVal) {
//     //   const segments = file.name.split(".");
//     //   return segments.reduce<CommandObj>((iAccum, segment) => {
//     //     if (typeof iAccum[segment] === "undefined") {
//     //       return {
//     //         ...iAccum,
//     //         // [iAccum[segment]]
//     //       };
//     //     }
//     //     return iAccum;
//     //   }, accum);
//     // }
//     return accum;
//   }, {} as CommandObj);

//   const commandObj: CommandObj[] = files.map((file, i, arr) => {});
//   const commandObj: CommandObj = {};
//   files.forEach((file) => {
//     // @ts-ignore
//     file.name.split(".").reduce<CommandObj>((accum, e) => {
//       console.log(accum, e);
//       return (accum[e] = accum[e] || {
//         path: file.path,
//       });
//     }, commandObj);
//   });

//   console.log(JSON.stringify(commandObjArr, null, 2));

//   return commandObjArr;
// }

export async function processCommands(
  command: Command,
  files: CommandFile[]
): Promise<void> {
  if (files.length === 0) return;

  if (!command) {
    console.log("reached the end");
    return;
  }

  let parentCommand = command;

  files.forEach((file) => {
    const segments = file.name.split(".");
    let fileCommand = parentCommand;

    segments.forEach((segment) => {
      console.log(file.name, fileCommand.name(), segment);
      const segmentCommand =
        fileCommand.commands.find((cmd) => cmd.name() === segment) ??
        fileCommand.command(segment);
      fileCommand = segmentCommand;
    });
    fileCommand = parentCommand;
    // segments.reduce<Command>((accum, segment) => {
    //   return (accum[segment] = accum[segment] || {
    //     path: file.path,
    //   });

    // }, parentCommand);

    // parentCommand = command;
  });

  //   for (const file of files) {
  //     console.log("file.name ===>", file.name);
  //     const segments = file.name.split(".");

  //     for (const segment of segments) {
  //       console.log("prntCmd ===>", commandName);
  //       console.log(`segment =====>`, segment);

  //       if (commandName !== segment) {
  //         const newCommand = command.command(segment);
  //         console.log(
  //           "Creating new command",
  //           newCommand.name(),
  //           "on",
  //           commandName
  //         );
  //         const newFiles = files.filter((f) => f.name.startsWith(segment));
  //         console.log("newFiles", newFiles);
  //         processCommands(newCommand, newFiles);
  //       }

  //     }

  console.log(`
    
    `);

  // segments.reduce<Command>((accum, segment) => {
  //   console.log("accumName", accum.name(), segment);
  //   if (accum.name() !== segment) {
  //     const newCommand = accum.command(segment);
  //     // const fileName = origArr.slice(segmentIndex).join(".");
  //     console.log("oldCommand", accum.name());
  //     console.log("newCommand", newCommand.name());
  //     console.log(`

  //     `);
  //     return newCommand;
  //   }
  //   return accum;
  // }, parentCommand);

  // get the paths of the files
  //   for (const file of files) {
  //     console.log("Processing", file.name);
  //     const segments = file.name.split(".");
  //     console.log(segments);
  //     segments.forEach((segment, i, origArr) => {
  //       const commandForSegment = command.commands.find(
  //         (cmd) => cmd.name() === segment
  //       );
  //       if (!commandForSegment) {
  //         const startsWithRoot = origArr.slice(0, i + 1).join(".");
  //         console.log("startsWithRoot", startsWithRoot);
  //         const newCommand = command.command(segment);
  //         const newFiles = files.filter((f) => f.name.startsWith(startsWithRoot));
  //         console.log(newFiles);

  //         // console.log(segments);

  //         processCommands(newCommand, newFiles);
  //       }
  //     });
  //   }

  //   const commandName = command.name();

  //   const currentFile = files[0];
  //   const remainingFiles = files.slice(1);

  //   console.log(`Processing files on ${commandName}`, files);

  //   for (const file of files) {
  //     console.log(
  //       `

  //     Processing`,
  //       file.name
  //     );
  //     const segments = file.name.split(".");
  //     segments.forEach((segment) => {
  //       const segmentCommand = command.commands.find(
  //         (cmd) => cmd.name() === segment
  //       );
  //       if (segmentCommand) {
  //         console.log(
  //           `${segment} command has already been added to ${command.name()}`
  //         );
  //         command = segmentCommand;
  //         return;
  //       }

  //       console.log(`Adding "${segment}" command to "${command.name()}"`);
  //       command = command.command(segment);

  //       //   if (commandName !== segment && !segmentCommand) {
  //       //     console.log(`Adding "${segment}" command on "${commandName}"`);
  //       //     const segmentCommand = command.command(segment);

  //       //     const segmentCommandFiles = files.filter(
  //       //       (f) => f.name !== file.name && f.name.startsWith(file.name)
  //       //     );
  //       //     console.log(segmentCommand.name(), segmentCommandFiles);

  //       //     processCommands(segmentCommand, segmentCommandFiles);
  //       //   }
  //     });
  //   }
}
