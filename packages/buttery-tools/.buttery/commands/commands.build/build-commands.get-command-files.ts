import { readdir } from "node:fs/promises";
import path from "node:path";

import type { ResolvedButteryConfig } from "../../../lib/config/getButteryConfig";
import {
  type CommandFile,
  getButteryCommandsDirectories
} from "./build-commands.utils";

// This is the name of the file that is a command
// when there is a directory
const nestedDirCommandFileName = "command";

/**
 * Reads the commands directory that has been reconciled
 * in the buttery command and creates an array of command files
 * that contain the command name and the full path of the command.
 *
 * If one of the entires in the command directory is a directory, then
 * this function searches one level deep for a file that has a specific name
 * that is configured at runtime. This function will throw if it cannot find
 * the specifically named file in that directory.
 */
export const getCommandFiles = async (
  config: ResolvedButteryConfig<"commands">
): Promise<CommandFile[]> => {
  const dirs = getButteryCommandsDirectories(config);
  const commandFiles: CommandFile[] = [];

  const commandDirEntries = await readdir(dirs.commandsDir, {
    withFileTypes: true
  });

  for (const entry of commandDirEntries) {
    const commandDirEntryName = entry.name.replace(/\.(ts|js|mjs)$/, "");
    let commandDirEntryPath = path.join(entry.parentPath, entry.name);
    let commandPath = commandDirEntryName;
    const isDirectory = entry.isDirectory();
    const isUnderscore = entry.name.startsWith("_");

    // ignore anything if it begins with an underscore
    if (isUnderscore) continue;

    // check the directory 1 level deep to find the `command` file.
    if (isDirectory) {
      const nestedDirEntries = await readdir(commandDirEntryPath, {
        withFileTypes: true
      });

      // search for a file that matches the criteria
      const nestedDirCommandFile = nestedDirEntries.find((nestedDirEntry) => {
        const nestedEntryName = path.basename(nestedDirEntry.name, ".ts");
        const isNestedDirEntryFile = nestedDirEntry.isFile();
        return (
          isNestedDirEntryFile && nestedEntryName === nestedDirCommandFileName
        );
      });
      if (!nestedDirCommandFile) {
        throw `The directory "${commandDirEntryName}" does not contain a command file. Please ensure that a '${nestedDirCommandFileName}.ts' file exists.`;
      }

      // set the entry to the found nested command
      commandDirEntryPath = path.join(
        nestedDirCommandFile.parentPath,
        nestedDirCommandFile.name
      );
      commandPath = commandPath.concat("/command");
    }

    // console.log({ binDir: dirs.binDir, });

    // push the files to the command files
    commandFiles.push({
      name: commandDirEntryName,
      commandPath,
      commandSegments: commandPath.split("/")[0].split("."),
      inPath: commandDirEntryPath,
      outPath: path.resolve(dirs.binDir, commandPath)
    });
  }

  if (commandFiles.length === 0) {
    throw `No command files could be located in: ${dirs.commandsDir}`;
  }

  return commandFiles;
};
