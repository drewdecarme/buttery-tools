import { printAsBullets } from "@buttery/logs";

import { defaultCommandOptions } from "./build.utils.js";

import type { ButteryCommandsBaseOptions } from "../cli-scripts/_cli-scripts.utils.js";
import type { ResolvedButteryCommandsConfig } from "../config/getButteryCommandsConfig.js";
import type {
  ButteryCommandsManifest,
  ButteryCommandsGraph,
  ButteryCommand,
} from "../utils/LOG.js";
import { LOG } from "../utils/LOG.js";

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
    rConfig: ResolvedButteryCommandsConfig;
    options: T;
  }
) {
  // Get a sorted array of all of the manifest values
  LOG.debug("Converting manifest to a sorted array");
  const manifestValues = [...manifest.values()].sort(
    ({ segments: segmentsA }, { segments: segmentsB }) => {
      // Compare segment by segment
      for (let i = 0; i < Math.min(segmentsA.length, segmentsB.length); i++) {
        if (segmentsA[i] !== segmentsB[i]) {
          return segmentsA[i].localeCompare(segmentsB[i]);
        }
      }

      // If all compared segments are the same, the shorter one (parent) should come first
      return segmentsA.length - segmentsB.length;
    }
  );
  LOG.debug(`${printAsBullets(manifestValues.map((m) => m.id))}`);

  const cmdGraph: ButteryCommandsGraph = {};

  function addNode(cmd: ButteryCommand) {
    let currentCmdManifest = cmdGraph;

    for (const cmdSegmentIndex in cmd.segments) {
      const i = Number(cmdSegmentIndex);
      const cmdSegment = cmd.segments[i];
      if (!cmdGraph[cmdSegment]) {
        currentCmdManifest[cmdSegment] = {
          ...cmd,
          subCommands: {},
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
      LOG.debug(`Adding "${manifestValue.name}" to the graph...`);
      addNode(manifestValue);
      LOG.debug(`Adding "${manifestValue.name}" to the graph... done.`);
    } catch (error) {
      throw new Error(String(error));
    }
  }

  // Add the root level of the graph with the values
  // that define the program at the config level
  const graphWithRoot: ButteryCommandsGraph = {
    [options.rConfig.config.name]: {
      name: options.rConfig.config.name,
      id: options.rConfig.config.name,
      pathCmdModule: "",
      segments: [],
      description: options.rConfig.config.description,
      subCommands: cmdGraph,
      args: undefined,
      options: defaultCommandOptions,
      help: "",
      meta: {
        parentCommands: [],
        level: 0,
        hasAction: false,
        hasRequiredArgs: false,
      },
    },
  };

  return graphWithRoot;
}
