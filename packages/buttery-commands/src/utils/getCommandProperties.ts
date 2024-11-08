import type { ButteryCommandManifestEntry } from "./utils";

export type CommandProperties = ReturnType<typeof getCommandProperties>;

export function getCommandProperties(
  manifestEntry: ButteryCommandManifestEntry
) {
  const numOfArgs = Object.keys(manifestEntry.args ?? {}).length;
  const numOfOptions = Object.keys(manifestEntry.args ?? {}).length;
  return {
    hasSubCommands: Object.keys(manifestEntry.subCommands).length > 0,
    isRootCommand: manifestEntry.level === 0,
    hasAction: manifestEntry.hasAction,
    hasNoArgsOrOptions: numOfArgs === 0 && numOfOptions === 0,
    numOfOptions,
    numOfArgs,
  };
}
