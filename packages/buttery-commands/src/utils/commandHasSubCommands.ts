import type { ButteryCommandManifestEntry } from "./utils";

export function getCommandProperties(
  manifestEntry: ButteryCommandManifestEntry
) {
  return {
    hasSubCommands: Object.keys(manifestEntry.subCommands).length > 0,
    isRootCommand: manifestEntry.level === 0,
  };
}
