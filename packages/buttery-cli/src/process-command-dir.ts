import { type Command } from "commander";

export function compareFileNames(a: string, b: string): number {
  const baseNameA = a.split("/").pop()!.split(".")[0];
  const baseNameB = b.split("/").pop()!.split(".")[0];
  return baseNameA.localeCompare(baseNameB);
}

export async function processCommands(
  commandFilePaths: string[],
  parentCommand: Command
): Promise<void> {
  if (commandFilePaths.length === 0) return;

  if (!parentCommand) {
    console.log("reached the end");
    return;
  }

  //   const thisCommand = parentCommand;
  for (const commandFilePath of commandFilePaths) {
    console.log(commandFilePath);
  }
}
