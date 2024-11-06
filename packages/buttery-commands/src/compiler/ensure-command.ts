import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { ResolvedButteryConfig } from "@buttery/core/config";
import { printAsBullets } from "@buttery/core/logger";
import {
  exhaustiveMatchGuard,
  inlineTryCatch,
} from "@buttery/core/utils/isomorphic";
import { input, select } from "@inquirer/prompts";
import { ensureFile } from "fs-extra";
import type { ButteryCommandsBaseOptions } from "../options";
import { type CommandFile, LOG } from "../utils";

/**
 * This function will ensure that a command exists in order to make
 * the entire command manifest well formed. Depending upon the options
 * that we're set in the CLI or from instantiating the commands build time
 * this function will prompt the user if it finds that it's missing a command
 * in the command hierarchy. Once prompted, this function will create it and
 * move on.
 */
export async function ensureCommand<T extends ButteryCommandsBaseOptions>(
  cmdFiles: CommandFile[],
  cmdFileIndex: number,
  config: ResolvedButteryConfig<"commands">,
  options: T
): Promise<string> {
  const cmdFile = cmdFiles[cmdFileIndex];

  let cmdFilePath = cmdFile.inPath;

  const currentSegments = cmdFile.commandSegments;
  const nextSegments = cmdFiles[cmdFileIndex + 1]?.commandSegments ?? [];
  const segmentsHaveSameBase = currentSegments[0] === nextSegments[0];
  const segmentMismatch = nextSegments.length - currentSegments.length > 1;

  if (nextSegments && segmentsHaveSameBase && segmentMismatch) {
    const missingSegments = nextSegments.slice(0, -segmentMismatch);
    LOG.warning(
      `It appears that you're missing part of the file hierarchy in the nested commands:

            Parent Cmd Filepath:  ${currentSegments.join(".")}
        Next Child Cmd Filepath:  ${currentSegments.join(".")}
    ------------------------------------------------------
Expected (Missing) Cmd Filepath:  ${missingSegments.join(".")}
          `
    );

    const newCommandFileOptions = [
      `/commands/${missingSegments.join(".")}.ts`,
      `/commands/${missingSegments.join(".")}/command.ts`,
    ];

    if (options.autoFix) {
      throw `Please add a the missing command file or directory:

    Options: ${printAsBullets(newCommandFileOptions)}`;
    }

    // Ask the user how they want to bootstrap the missing command
    cmdFilePath = await select({
      message:
        "Please select either the file or directory command option to bootstrap the missing command",
      choices: newCommandFileOptions.map((fPath) => ({
        name: fPath,
        value: path.join(config.paths.butteryDir, fPath),
      })),
    });
    const bootstrapType = await select<"basic" | "custom">({
      message: "How would you like to bootstrap the file?",
      choices: [
        {
          name: "Basic parent command with name and description",
          value: "basic",
        },
        {
          name: "Custom parent command with options, args, and/or action",
          value: "custom",
        },
      ],
    });
    const newCmdName = await input({
      message: "Please provide a name for the command",
      default: missingSegments[missingSegments.length - 1],
    });
    const newCmdDescription = await input({
      message: `Please add a description for this the "${newCmdName}" command`,
    });

    const meta = `import type { CommandMeta } from "@buttery/commands";

export const meta: CommandMeta = {
  name: "${newCmdName}",
  description: "${newCmdDescription}",
};
`;

    // ensure that the file exists
    const ensureFileResult = await inlineTryCatch(ensureFile)(cmdFilePath);
    if (ensureFileResult.hasError) {
      throw ensureFileResult.error;
    }

    let fileContent = "";

    switch (bootstrapType) {
      case "basic": {
        fileContent = meta;
        break;
      }

      case "custom": {
        // TODO: Ensure that all of the properties are queried for
        break;
      }

      default:
        exhaustiveMatchGuard(bootstrapType);
    }

    const writeFileResult = await inlineTryCatch(writeFile)(
      cmdFilePath,
      fileContent,
      { encoding: "utf8" }
    );
    if (writeFileResult.hasError) {
      throw writeFileResult.error;
    }
  }
  return cmdFilePath;
}
