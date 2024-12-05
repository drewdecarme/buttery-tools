import { printAsBullets } from "@buttery/core/logger";
import { inlineTryCatch } from "@buttery/core/utils/isomorphic";

import path from "node:path";

import type { Command } from "../lib";
import type { ButteryCommandsDirectories } from "../config/getButteryCommandsDirectories";
import { type ButteryCommand, LOG, defaultCommandOptions } from "../utils/LOG";

async function getCommandSegments(cmdId: string, cmdPath: string) {
  try {
    const cmdSegments = cmdId.split(".");
    return cmdSegments;
  } catch {
    throw `"${cmdPath}" is malformed. Command files should either be follow the below conventions:
    ${printAsBullets([
      ".buttery/commands/<sub-command>.<sub-command>.<...sub-command>/command.ts",
      ".buttery/<sub-command>.ts",
    ])}`;
  }
}

async function getCommandModule(cmdPath: string): Promise<Command> {
  try {
    const cmdModule = (await import(cmdPath)) as Command;
    return cmdModule;
  } catch (error) {
    LOG.error(`Error when trying to import the command module at ${cmdPath}`);
    throw new Error(String(error));
  }
}

function replaceExt(path: string, replace: string) {
  return path.replace(/\.(ts|js|mjs)$/, replace);
}

async function getCommandMeta(cmdModule: Command, cmdPath: string) {
  // validate that meta
  if (!cmdModule.meta) {
    throw `"${cmdPath}" does not have a "meta" export. This is a required value. Please export constant "meta" with "name" and "description" as key/values.`;
  }
  if (!cmdModule.meta?.name) {
    throw `"${cmdPath}" does not have a "meta.name" export. This is a required value.`;
  }
  if (!cmdModule.meta?.description) {
    throw `"${cmdPath}" does not have a "meta.description" export. This is a required value.`;
  }
  return cmdModule.meta;
}

function getCommandParents(cmdSegments: string[]) {
  const result = [];
  let prefix = "";

  for (let i = 0; i < cmdSegments.length - 1; i++) {
    // Stop before the last element
    prefix = prefix ? `${prefix}.${cmdSegments[i]}` : cmdSegments[i];
    result.push(prefix);
  }

  return result;
}

export async function parseCommand(
  cmdPath: string,
  { dirs }: { dirs: ButteryCommandsDirectories }
): Promise<ButteryCommand> {
  // normalize the command id
  const cmdPathRelToCommandsDir = path.relative(dirs.commandsDir, cmdPath);
  let cmdId = cmdPathRelToCommandsDir.replace(/\/command.ts/, "");
  cmdId = replaceExt(cmdId, "");

  // parse the id into segments
  const cmdSegments = await inlineTryCatch(getCommandSegments)(cmdId, cmdPath);
  if (cmdSegments.hasError) {
    throw cmdSegments.error;
  }

  // import the command module
  const cmdModule = await inlineTryCatch(getCommandModule)(cmdPath);
  if (cmdModule.hasError) {
    throw cmdModule.error;
  }

  // get command meta
  const cmdMeta = await inlineTryCatch(getCommandMeta)(cmdModule.data, cmdPath);
  if (cmdMeta.hasError) {
    throw cmdMeta.error;
  }

  // get the paths
  // const cmdPathSrc = path.join(dirs.outDir, cmdPathRelToCommandsDir);
  // const cmdPathOut = replaceExt(cmdPathSrc, ".js");
  const cmdPathModule = replaceExt(
    path.join("./commands", cmdPathRelToCommandsDir),
    ".js"
  );

  // get command parents ids
  const cmdParents = getCommandParents(cmdSegments.data);

  return {
    id: cmdId,
    name: cmdMeta.data.name,
    description: cmdMeta.data.description,
    options: {
      ...defaultCommandOptions,
      ...cmdModule.data.options,
    },
    args: cmdModule.data.args ?? undefined,
    segments: cmdSegments.data,
    pathCmdModule: cmdPathModule,
    help: "",
    subCommands: {},
    meta: {
      parentCommands: cmdParents,
      hasAction: typeof cmdModule.data.action !== "undefined",
      level: cmdSegments.data.length,
      hasRequiredArgs: Object.values(cmdModule.data.args ?? {}).reduce(
        (accum, arg) => {
          if (arg.required) return true;
          return accum;
        },
        false
      ),
    },
  };
}
