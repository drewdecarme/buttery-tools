import { readdir } from "node:fs/promises";
import path from "node:path";
import { exit } from "node:process";
import { printAsBullets } from "@buttery/logger";
import { select } from "@inquirer/prompts";
import type {
  CommandAction,
  CommandMeta,
  CommandOptions
} from "../../../lib/commands/butter-commands.types";
import { getButteryConfig } from "../../../lib/config/getButteryConfig";
import { LOG_CLI } from "../../../lib/logger/loggers";
import { getAllDependenciesOfFile } from "./components.export.getAllDependenciesOfFile";

export const meta: CommandMeta = {
  name: "export",
  description: "Export any buttery-components via wizard or by args"
};

export const options: CommandOptions<{ outDir: string }> = {
  outDir: {
    type: "value",
    alias: "o",
    description:
      "The absolute path of the directory the selected component should be exported to",
    required: false
  }
};

export const action: CommandAction<typeof options> = async ({ options }) => {
  // TODO: Define a configuration in the buttery config to reconcile this.
  if (!options.outDir) {
    LOG_CLI.error("The option --outDir,-o is missing.");
    throw LOG_CLI.fatal(new Error("An '--outDir,-o' option is required."));
  }

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
  const dependencies = new Set<string>();

  getAllDependenciesOfFile(
    dependencies,
    componentForExport.path,
    componentForExport.name
  );

  const dependenciesArr = [...dependencies.values()];
  if (dependenciesArr.length === 0) {
    LOG_CLI.debug("No interdependencies.");
  } else {
    LOG_CLI.debug(
      `Dependencies that will be copied: ${printAsBullets(dependenciesArr, { bulletType: "numbers" })}`
    );
  }

  exit(0);
};
