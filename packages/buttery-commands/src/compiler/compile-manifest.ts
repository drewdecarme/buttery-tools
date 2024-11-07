import type { ResolvedButteryConfig } from "@buttery/core/config";
import { inlineTryCatch } from "@buttery/core/utils/isomorphic";

import type { ButteryCommandsBaseOptions } from "../options/index.js";
import {
  type ButteryCommand,
  type ButteryCommandsManifest,
  type CommandFile,
  type EnrichedButteryCommand,
  LOG,
} from "../utils.js";
import { ensureCommand } from "./ensure-command.js";
import { getCommandFiles } from "./get-command-files.js";

/**
 * Dynamically import a file by cache busting the import
 * cache by adding a number representation of now. This forces
 * import to go out and fetch a new instance.
 */
export async function dynamicImport<T extends Record<string, unknown>>(
  modulePath: string
) {
  // Construct a new import specifier with a unique URL timestamp query parameter
  const timestamp = new Date().getTime();
  const importSpecifier = `${modulePath}?t=${timestamp}`;

  // Import the module fresh
  return (await import(importSpecifier)) as T;
}

async function importButteryCommandFromPath(commandFilePath: string) {
  try {
    const command = await dynamicImport<ButteryCommand>(commandFilePath);
    return command;
  } catch (error) {
    throw LOG.fatal(
      new Error(`Unable to import command at: ${commandFilePath}`)
    );
  }
}

export async function compileManifest<T extends ButteryCommandsBaseOptions>(
  config: ResolvedButteryConfig<"commands">,
  options: T
) {
  // Get the command files from the directory structure
  const cmdFilesResult = await inlineTryCatch(getCommandFiles)(config);
  if (cmdFilesResult.hasError) {
    LOG.error("Error when trying to get the command files");
    throw LOG.fatal(cmdFilesResult.error);
  }

  // Sort all of the command files based upon their naming
  const commandFiles = cmdFilesResult.data.sort((cmdFileA, cmdFileB) => {
    if (cmdFileB.name.startsWith(cmdFileA.name)) {
      return -1;
    }
    return 1;
  });

  // We run the command files into async generators so we can loop through
  // them and do some async stuff to make sure the commandFiles are well formed
  // and all there
  //
  // As we loop through all of the commands and yield when we're done, this allows
  // us to do a few things.
  //
  // - 1. Validate the structure fo the commands hierarchy in the .buttery/docs folder
  // - 2. Validate the contents of each of the commands
  // - 3. Ensure all of the commands are well formed before we go and create the commands manifest
  // that will be read and statically evaluated during runtime.
  async function* enrichCommandFile(cmdFiles: CommandFile[]): AsyncGenerator<
    | {
        hasError: false;
        data: EnrichedButteryCommand;
        error: undefined;
      }
    | { hasError: true; data: undefined; error: string }
  > {
    for (const cmdFileIndex in cmdFiles) {
      const i = Number(cmdFileIndex);
      const cmdFile = cmdFiles[i];

      // ensure the command file exists
      const cmdFileResult = await inlineTryCatch(ensureCommand)(
        cmdFiles,
        i,
        config,
        options
      );
      if (cmdFileResult.hasError) {
        yield {
          hasError: true,
          data: undefined,
          error: cmdFileResult.error.message,
        };
      }

      // import the cmd module
      const cmdModule = await importButteryCommandFromPath(
        cmdFileResult.data as string
      );

      yield {
        hasError: false,
        data: {
          ...cmdFile,
          module: cmdModule,
        },
        error: undefined,
      };
    }
  }

  const cmdManifest: ButteryCommandsManifest = {};

  function addCommandManifestNode(cmd: EnrichedButteryCommand) {
    let currentCmdManifest = cmdManifest;

    for (const cmdSegmentIndex in cmd.commandSegments) {
      const i = Number(cmdSegmentIndex);
      const cmdSegment = cmd.commandSegments[i];
      if (!cmdManifest[cmdSegment]) {
        currentCmdManifest[cmdSegment] = {
          meta: {
            name: "",
            description: "",
          },
          options: {},
          // args: {},
          action: undefined,
          subCommands: {},
        };
      }

      if (i === cmd.commandSegments.length - 1) {
        // TODO: Validate the command module here.
        currentCmdManifest[cmdSegment] = {
          meta: cmd.module.meta,
          options: cmd.module.options,
          // args: cmd.module.args,
          action: cmd.module.action,
          subCommands: {},
        };
      } else {
        currentCmdManifest = currentCmdManifest[cmdSegment].subCommands;
      }
    }
  }

  // Build the manifest by looping through all of the enriched command
  // files that have their meta data and then the module import from
  // the generator
  for await (const commandFile of enrichCommandFile(commandFiles)) {
    try {
      if (commandFile.hasError) {
        throw commandFile.error;
      }
      LOG.debug(`Adding "${commandFile.data.name}" to the manifest...`);
      addCommandManifestNode(commandFile.data);
      LOG.debug(`Adding "${commandFile.data.name}" to the manifest... done.`);
    } catch (error) {
      throw new Error(String(error));
    }
  }

  return cmdManifest;
}
