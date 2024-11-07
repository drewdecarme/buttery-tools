import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { ResolvedButteryConfig } from "@buttery/core/config";
import { inlineTryCatch } from "@buttery/core/utils/isomorphic";
import type { ButteryCommandsBaseOptions } from "../options/index.js";
import type { ButteryCommandsDirectories } from "../utils/getButteryCommandsDirectories.js";
import {
  type ButteryCommand,
  type ButteryCommandManifestEntry,
  type ButteryCommandsManifest,
  type CommandFile,
  LOG,
} from "../utils/utils.js";
import { ensureCommand } from "./build-manifest-ensure-command.js";
import { getCommands } from "./get-commands.js";

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

export async function createManifest<T extends ButteryCommandsBaseOptions>(
  config: ResolvedButteryConfig<"commands">,
  dirs: ButteryCommandsDirectories,
  options: T
) {
  // Get the command files from the directory structure
  const cmdFilesResult = await inlineTryCatch(getCommands)(config);
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
  async function* buildManifestEntries(cmdFiles: CommandFile[]): AsyncGenerator<
    | {
        hasError: false;
        data: ButteryCommandManifestEntry;
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

      const commandPathRelativeToBin = path.relative(
        dirs.binDir,
        cmdFile.outPath
      );

      yield {
        hasError: false,
        data: {
          ...cmdModule.meta,
          options: cmdModule.options ?? null,
          commandId: cmdFile.commandId,
          commandSegments: cmdFile.commandSegments,
          commandModulePath: commandPathRelativeToBin.concat(".js"),
          subCommands: {},
        },
        error: undefined,
      };
    }
  }

  const cmdManifest: ButteryCommandsManifest = {};

  function addCommandManifestNode(cmd: ButteryCommandManifestEntry) {
    let currentCmdManifest = cmdManifest;

    for (const cmdSegmentIndex in cmd.commandSegments) {
      const i = Number(cmdSegmentIndex);
      const cmdSegment = cmd.commandSegments[i];
      if (!cmdManifest[cmdSegment]) {
        currentCmdManifest[cmdSegment] = {
          ...cmd,
          subCommands: {},
        };
      }

      // If we're not at the last segment, then we need to
      // set the currentCommand to the this commands subCommands
      // this allows us to recursively go deeper in the command
      if (i !== cmd.commandSegments.length - 1) {
        currentCmdManifest = currentCmdManifest[cmdSegment].subCommands;
      }
    }
  }

  // Build the manifest by looping through all of the enriched command
  // files that have their meta data and then the module import from
  // the generator
  for await (const commandFile of buildManifestEntries(commandFiles)) {
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

/**
 * This function is the main build command that reads the .buttery/config
 * parses the commands directory and then builds the binary. This command
 * is also used locally to build the commands that build the commands.
 */
export async function buildManifest<T extends ButteryCommandsBaseOptions>(
  config: ResolvedButteryConfig<"commands">,
  dirs: ButteryCommandsDirectories,
  options: Required<T>
) {
  // Create the commands manifest
  const manifestResults = await inlineTryCatch(createManifest)(
    config,
    dirs,
    options
  );
  if (manifestResults.hasError) {
    LOG.error("Error when trying to build the commands manifest");
    throw manifestResults.error;
  }

  // write the manifest to disk
  const manifestFileName = "./manifest.js";
  const manifestFilepath = path.resolve(dirs.binDir, manifestFileName);
  const manifestContent = `export default ${JSON.stringify(
    manifestResults.data,
    null,
    2
  )};
  `;
  const writeManifestResult = await inlineTryCatch(writeFile)(
    manifestFilepath,
    manifestContent
  );
  if (writeManifestResult.hasError) {
    LOG.error("Error when trying to write the commands.manifest.json.");
    throw writeManifestResult.error;
  }
}
