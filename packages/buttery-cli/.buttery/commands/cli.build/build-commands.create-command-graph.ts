import path from "node:path";
import type {
  CommandAction,
  CommandArgs,
  CommandMeta,
  CommandOptions,
} from "../../../lib";
import { LOG } from "../_utils";
import type { CommandFile } from "./build-commands.utils";

type CommandGraphProperties = {
  segment_name: string;
  meta: CommandMeta;
  options?: CommandOptions<"">;
  args?: CommandArgs;
  action?: CommandAction;
};

export type CommandGraph = {
  [key: string]: {
    properties: CommandGraphProperties;
    commands: CommandGraph;
  };
};

export const createCommandGraph = async (
  commandFiles: CommandFile[]
): CommandGraph => {
  LOG.debug("Creating the command graph...");
  const commandGraph = {};

  for (const { name: commandName, path: commandFilePath } of commandFiles) {
    const commandSegments = commandName.split(".");
    let currentCommandGraph = commandGraph;

    for (const commandSegment of commandSegments) {
      try {
        const commandFilePath = path.resolve(
          this.commandFilesOutDir,
          `./${commandFileName}.js`
        );
        const commandFileContent = await this.importCommand(commandFilePath);
        const properties: CommandProperties = {
          meta: commandFileContent?.meta,
          segment_name: commandFileName,
          action: commandFileContent?.action,
          args: commandFileContent?.args,
          options: commandFileContent?.options,
        };
        if (!currentCommandGraph[commandSegment]) {
          currentCommandGraph[commandSegment] = {
            properties,
            commands: {},
          };
        }
        currentCommandGraph = currentCommandGraph[commandSegment].commands;
      } catch (error) {
        const err = new Error(error as string);
        LOG.fatal(err);
        throw err;
      }
    }
  }
  LOG.debug("Creating the command graph... done.");
};
