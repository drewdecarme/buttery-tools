import path from "node:path";

import { select } from "@inquirer/prompts";
import pc from "picocolors";
import { printAsBullets } from "@buttery/logs";
import { tryHandle } from "@buttery/utils/isomorphic";

import { bootstrapCommand } from "./command-bootstrap.js";
import { parseCommand } from "./command-parse.js";

import type { ResolvedButteryCommandsConfig } from "../config/getButteryCommandsConfig.js";
import type { ButteryCommandsBaseOptions } from "../cli-scripts/_cli-scripts.utils.js";
import type { ButteryCommand, ButteryCommandsManifest } from "../utils/LOG.js";
import { LOG } from "../utils/LOG.js";

/**
 */
async function validateCommandHierarchy<T extends ButteryCommandsBaseOptions>(
  cmd: ButteryCommand,
  allCmdIds: string[],
  manifest: ButteryCommandsManifest,
  {
    rConfig: { dirs, paths },
    options,
  }: {
    rConfig: ResolvedButteryCommandsConfig;
    options: T;
  }
) {
  // create a promise out of all of the parent commands
  // that will check the path
  const validateParentCmds = cmd.meta.parentCommands.map(
    (parentCmdId) => async () => {
      const possiblePaths = [
        path.join(dirs.commandsDir, parentCmdId.concat(".ts")),
        path.join(dirs.commandsDir, parentCmdId, "/command.ts"),
      ].map((possiblePath) => ({
        display: path.relative(paths.rootDir, possiblePath),
        relToButteryDir: possiblePath,
      }));

      LOG.trace("Checking to see if the cmd is in the all of the command ids");
      const isMissing = !allCmdIds.includes(parentCmdId);

      // Log a detailed warning
      if (isMissing) {
        LOG.warning(`Could not find parent command to "${cmd.id}".

  The CLI expects that you have a well-formed directory structure where all sub-commands have their respective parent commands.
  Each sub-command must have it's respective file starting at the root of the sub command. Below is a visual representation
  of what you might be missing.

  NOTE: This validator validates parent / child command relationships one at a time so if there are other parents missing you
  will be prompted to fix them in subsequent prompts.

  ${pc.underline("Flat File Convention")}
  .buttery/
    |--commands
      |-- ${parentCmdId}.ts (missing)
      |-- ${cmd.id}.ts

  ${pc.underline("Command File Convention")}
  .buttery/
    |--commands
      |-- ${parentCmdId}
        |-- /command.ts (missing)
      |-- ${cmd.id}
        |-- /command.ts

  For more information on sub-command routing conventions: https://buttery.tools/commands/routing-conventions
  `);
      }

      // the file is missing and the there's an option to auto fix
      // any issues, then we should prompt the user to create the file
      if (isMissing && options.autoFix) {
        LOG.info(
          "You have supplied the command and option of '--auto-fix=true'. You will be prompted for some defaults to create well-formed command hierarchy."
        );
        // Ask the user how they want to bootstrap the missing command
        const cmdPath = await select({
          message:
            "Please select either the 'flat-file' or 'command file' convention to bootstrap the missing command.",
          choices: possiblePaths.map((fPath) => ({
            name: fPath.display,
            value: fPath.relToButteryDir,
          })),
        });

        const cmdSegments = parentCmdId.split(".");
        const defaultName = cmdSegments[cmdSegments.length - 1];

        await bootstrapCommand(cmdPath, {
          defaultName,
        });

        // parse the new command
        const cmdResult = await tryHandle(parseCommand)(cmdPath, {
          dirs,
        });
        if (cmdResult.hasError) {
          throw LOG.fatal(cmdResult.error);
        }
        // Add new command to the manifest
        manifest.set(cmdResult.data.id, cmdResult.data);

        // return false so we can re-validate the command manifest
        return false;
      }

      // if the file is missing we just need to throw an error
      if (isMissing) {
        throw `Invalid command hierarchy. You've added a child command without adding a parent. Please add the missing parent command file:
Options: ${printAsBullets(possiblePaths.map((path) => path.relToButteryDir))}`;
      }

      return true;
    }
  );

  // Run each promise sequentially
  let isParentCommandValid = true;
  for (const validateParentCmd of validateParentCmds) {
    isParentCommandValid = await validateParentCmd();
  }
  return isParentCommandValid;
}

export async function validateManifest<T extends ButteryCommandsBaseOptions>(
  manifest: ButteryCommandsManifest,
  options: {
    rConfig: ResolvedButteryCommandsConfig;
    options: T;
  }
) {
  async function validateCommands() {
    const manifestObj = Object.fromEntries(manifest.entries());
    const commandsIds = Object.keys(manifestObj);

    // Validate each of the commands individually
    const validateCommands = Object.entries(manifestObj).map(
      ([commandId, cmd]) =>
        async () => {
          LOG.debug(`Validating command "${commandId}"...`);
          // Check to see if all of the parent commands are valid
          const isCommandHierarchyValid = await tryHandle(
            validateCommandHierarchy
          )(cmd, commandsIds, manifest, options);
          if (isCommandHierarchyValid.hasError) {
            throw isCommandHierarchyValid.error;
          }

          // Check to see if the command is missing an action
          const hasSubCommands = commandsIds.reduce(
            (accum, cmdId) =>
              cmdId !== cmd.id && cmdId.startsWith(cmd.id) ? true : accum,
            false
          );
          if (!hasSubCommands && !cmd.meta.hasAction) {
            throw `The command "${cmd.id}" is a standalone command and doesn't have an action exported from it's command file. Calling this command will do nothing. Please export an action in "${cmd.pathCmdModule}".`;
          }

          LOG.debug(`Validating command "${commandId}"... done.`);
          return isCommandHierarchyValid.data;
        }
    );

    let isCommandValid = false;

    // Validate the commands
    for (const validateCommand of validateCommands) {
      isCommandValid = await validateCommand();
    }

    return isCommandValid;
  }

  LOG.debug("Validating manifest...");

  // -- Start command validation
  let areCommandsValid = false;
  LOG.debug("Validating commands...");
  while (!areCommandsValid) {
    areCommandsValid = await validateCommands();
  }
  LOG.debug("Validating commands... done");
  // -- End command validation

  LOG.debug("Validating manifest... done.");
}
