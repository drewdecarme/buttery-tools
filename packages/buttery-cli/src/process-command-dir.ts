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
  commandFilePaths.sort().map((commandFilePath) => ({
    name: path.basename(commandFilePath, ".js"),
    path: commandFilePath,
  }));

export type CommandObj = {
  [key: string]: {
    path: string;
    commands: CommandObj;
  };
};

// export type CommandObj = [
//   {
//     name: "test";
//     commands: [
//       {
//         name: "data";
//         commands: [];
//       }
//     ];
//   },
//   {
//     name: "random";
//     commands: [
//       {
//         name: "saved";
//         commands: [{ name: "brutal"; commands: [] }];
//       },
//       {
//         name: "deep";
//         commands: [];
//       }
//     ];
//   }
// ];

export function constructCommandObj(commandFilePaths: string[]): CommandObj {
  const files = constructCommandFiles(commandFilePaths);
  const commandObj: CommandObj = {};
  files.forEach((file) => {
    // @ts-ignore
    file.name.split(".").reduce<CommandObj>((accum, e) => {
      console.log(accum, e);
      return (accum[e] = accum[e] || {
        path: file.path,
      });
    }, commandObj);
  });

  console.log(JSON.stringify(commandObj, null, 2));

  return commandObj;
}

export async function processCommands(
  command: Command,
  files: CommandFile[]
): Promise<void> {
  if (files.length === 0) return;

  if (!command) {
    console.log("reached the end");
    return;
  }

  //   const currentFile = files[0];
  //   const remainingFiles = files.slice(1);

  //   for (const nextFile of remainingFiles) {
  //     console.log(currentFile.name);

  //     console.log(currentFile.name, currentFile.name);

  //     // // Add the command if it doesn't already exist on
  //     // // the parent command
  //     // let existingCommand = command.commands.find(
  //     //   (cmd) => cmd.name() === currentFile.name
  //     // );

  //     // if (!existingCommand) {
  //     //   console.log(`Adding command: ${currentFile.name} to`);
  //     //   existingCommand = command.command(currentFile.name);
  //     // }

  //     // const nestedFiles = files.filter(
  //     //   (file) =>
  //     //     file.name !== currentFile.name && file.name.startsWith(nextFile.name)
  //     // );

  //     // console.log(`Processing ${currentFile.name}`);
  //     // processCommands(existingCommand, nestedFiles);
  //   }
}
