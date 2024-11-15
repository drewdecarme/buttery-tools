import type { ResolvedButteryConfig } from "@buttery/core/config";
import type { ButteryCommandsBaseOptions } from "../options";
import type { ButteryCommandsDirectories } from "../utils/getButteryCommandsDirectories";
import {
  type ButteryCommand,
  type ButteryCommandsGraph,
  type ButteryCommandsManifest,
  LOG,
  defaultCommandOptions,
} from "../utils/utils";

/**
 * This function will assemble the manifest graph by getting the command files
 * and then loop through them to recursively build the graph. This function
 * does nothing more than fetch information about the manifest and then build
 * the graph. The reason for this is so that any other transformations, validations
 * can recurse over a standard structure and validate, add, etc... to it.
 */
export async function buildManifestGraph<T extends ButteryCommandsBaseOptions>(
  manifest: ButteryCommandsManifest,
  options: {
    config: ResolvedButteryConfig<"commands">;
    dirs: ButteryCommandsDirectories;
    options: T;
  }
) {
  // Get a sorted array of all of the manifest values
  const manifestValues = [...manifest.values()].sort((cmdFileA, cmdFileB) => {
    if (cmdFileB.name.startsWith(cmdFileA.id)) {
      return -1;
    }
    return 1;
  });

  const cmdGraph: ButteryCommandsGraph = {};

  function addNode(cmd: ButteryCommand) {
    let currentCmdManifest = cmdGraph;

    for (const cmdSegmentIndex in cmd.segments) {
      const i = Number(cmdSegmentIndex);
      const cmdSegment = cmd.segments[i];
      if (!cmdGraph[cmdSegment]) {
        currentCmdManifest[cmdSegment] = {
          ...cmd,
          meta: {
            ...cmd.meta,
            level: i + 1,
          },
        };
      }

      // If we're not at the last segment, then we need to
      // set the currentCommand to the this commands subCommands
      // this allows us to recursively build the sub commands
      if (i !== cmd.segments.length - 1) {
        currentCmdManifest = currentCmdManifest[cmdSegment].subCommands;
      }
    }
  }

  // Build the manifest by looping through all of the values of
  // the manifest

  for (const manifestValue of manifestValues) {
    try {
      LOG.debug(`Adding "${manifestValue.name}" to the manifest...`);
      addNode(manifestValue);
      LOG.debug(`Adding "${manifestValue.name}" to the manifest... done.`);
    } catch (error) {
      throw new Error(String(error));
    }
  }

  // Add the root level of the graph with the values
  // that define the program at the config level
  const graphWithRoot: ButteryCommandsGraph = {
    [options.config.commands.name]: {
      name: options.config.commands.name,
      id: options.config.commands.name,
      path: "",
      segments: [],
      description: options.config.commands.description,
      subCommands: cmdGraph,
      args: undefined,
      options: defaultCommandOptions,
      help: "",
      meta: {
        parentCommands: [],
        level: 0,
        hasAction: false,
      },
    },
  };

  return graphWithRoot;
}