import { readFileSync, readdirSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { select } from "@inquirer/prompts";
import graphlib from "graphlib";
import type { CommandAction } from "../../../dist/commands/butter-commands.types";
import type { CommandMeta } from "../../../lib/commands/butter-commands.types";
import { getButteryConfig } from "../../../lib/config/getButteryConfig";
import { LOG_CLI } from "../../../lib/logger/loggers";
import { getAllDependenciesOfFile } from "./components.export.getAllDependenciesOfFile";

export const meta: CommandMeta = {
  name: "export",
  description: "Export any buttery-components via wizard or by args"
};

// Recursively traverse through a directory
/**
 * Recursively traverse through a directory and execute a callback for each file.
 * @param dir The directory to traverse.
 * @param callback A function to execute for each file.
 */
// const traverseDirectory = (
//   dir: string,
//   callback: (filePath: string) => void
// ) => {
//   const files = readdirSync(dir, { withFileTypes: true });
//   for (const fileOrDirectory of files) {
//     if (fileOrDirectory.isFile()) {
//       const mainFilePath =
//     }

//     if (fileOrDirectory.isDirectory() && !file.includes("example")) {
//       traverseDirectory(fullPath, callback);
//     } else if (
//       fullPath.endsWith(".ts") ||
//       fullPath.endsWith(".tsx") ||
//       fullPath.endsWith(".js") ||
//       fullPath.endsWith(".jsx")
//     ) {
//       callback(fullPath);
//     }
//   }
// };

export const action: CommandAction = async () => {
  LOG_CLI.debug("Running `buttery.components.export` command");

  const config = await getButteryConfig("docs");

  LOG_CLI.debug("Getting components directory...");
  const componentsDir = path.resolve(config.paths.rootDir, "./lib/components");
  LOG_CLI.debug("Getting components directory... done", { componentsDir });

  LOG_CLI.debug("Fetching components to pick from...");
  const componentDirs = await readdir(componentsDir, {
    withFileTypes: true
  });
  const componentsToPickFrom = componentDirs.filter(
    (dirent) =>
      dirent.isDirectory() &&
      !dirent.name.includes("__archive") &&
      !dirent.name.includes("utils-private") &&
      !dirent.name.includes("utils")
  );
  LOG_CLI.debug("Fetching components to pick from... done.");

  LOG_CLI.debug("Waiting for user to select a component to export...");
  const componentForExport = await select({
    message: "Please select a component to export",
    choices: componentsToPickFrom.map((dirent) => ({
      name: dirent.name,
      value: {
        name: dirent.name,
        path: path.join(dirent.parentPath, dirent.name),
        mainFilePath: path.join(
          dirent.parentPath,
          dirent.name,
          dirent.name.concat(".tsx")
        )
      }
    }))
  });
  LOG_CLI.debug("Waiting for user to select a component to export... done.", {
    componentForExport
  });

  // Initialize a graph
  LOG_CLI.debug("Creating component dependency graph...");
  LOG_CLI.debug(componentForExport.path);
  const dependencyGraph = new graphlib.Graph({ directed: true });

  getAllDependenciesOfFile(componentForExport.path, componentForExport.name);

  // traverseDirectory(componentForExport.path, (filePath: string) => {

  //   const depndencies: string[] = [];
  //   console.log(filePath);

  //   console.log({ dependencies });
  // });
};
