import type { ButteryCommandsDirectories } from "../config/getButteryCommandsDirectories";
import type { CommandOptions } from "../lib";

/**
 * We dynamically create our entry points up to 20 glob paths
 * If someone is creating more than 20 nested glob paths for their
 * command files then I feel like there are more serious problems
 * than being able to load them... :/
 *
 * The reason we try to evaluate on globs is that if we find that
 * a file is invalid or we want to add another file after the load
 * process starts, we can do that, esbuild will handle it, and then
 * we can create the manifest after we know all of the commands
 * are well formed
 */
export function getEntryPointsGlob(dirs: ButteryCommandsDirectories) {
  const entryPointGlob = [...new Array(20)]
    .map((_, i) => {
      const numOfStars = i + 1;
      const levels = [...new Array(numOfStars)].map(() => "*").join(".");
      return `${dirs.commandsDir}/${levels}.ts`;
    })
    .concat(dirs.commandsDir.concat("/**/command.ts"));
  return entryPointGlob;
}

export const defaultCommandOptions: CommandOptions = {
  help: {
    type: "boolean",
    required: false,
    alias: "h",
    description: "Display the help menu",
  },
};
