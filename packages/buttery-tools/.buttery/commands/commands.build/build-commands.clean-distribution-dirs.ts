import { rm } from "node:fs/promises";
import path from "node:path";
import { LOG_COMMANDS } from "../commands/commands.log";
import type { CommandsBuildFunction } from "./build-commands.utils";

/**
 * Deletes the entire `bin` & `dist` folders
 */
export const buildCommandsCleanDistributionDirs: CommandsBuildFunction =
  async ({ config }) => {
    try {
      LOG_COMMANDS.debug("Cleaning distribution directories...");
      const foldersToDelete = ["./bin"].map((folder) =>
        rm(path.resolve(config.paths.rootDir, folder), {
          recursive: true,
          force: true,
        })
      );
      await Promise.all(foldersToDelete);
      LOG_COMMANDS.debug("Cleaning distribution directories... done.");
    } catch (error) {
      throw LOG_COMMANDS.fatal(new Error(error as string));
    }
  };
