import { writeFile } from "node:fs/promises";
import chokidar from "chokidar";
import { LOG_CLI } from "../../../lib/logger/loggers";
import { buildCSSUtils } from "./tokens.buildCSSUtils";
import { getButteryTokensConfig } from "./tokens.getButteryTokensConfig";
import { getButteryTokensDirectories } from "./tokens.getButteryTokensDirectories";
import { launchPlayground } from "./tokens.launchPlayground";

export type BuildButteryTokensOptions = {
  debug: boolean;
  interactive: boolean;
  prompt: boolean;
  watch: boolean;
};

type BuildButteryTokensParams = BuildButteryTokensOptions & {
  isLocal: boolean;
};

export async function buildButteryTokens(options: BuildButteryTokensParams) {
  // Fetch the tokens config and resolve the paths
  const config = await getButteryTokensConfig(options);
  const dirs = await getButteryTokensDirectories(config);

  // write the package.json file
  const packageJsonContent = {
    name: "@buttery/tokens",
    type: "module",
    version: "0.0.0"
  };
  await writeFile(
    dirs.output.packageJson,
    JSON.stringify(packageJsonContent, null, 2)
  );

  // build the make functions
  await buildCSSUtils(config, dirs);

  // listen to any changes to the `.buttery/config`
  if (!options.watch) {
    return;
  }

  const watcher = chokidar.watch(config.paths.config);
  LOG_CLI.watch(config.paths.config.concat(" for changes..."));

  watcher.on("change", async (file) => {
    LOG_CLI.watch(`"${file}" changed.`);
    LOG_CLI.watch("Rebuilding tokens...");
    const config = await getButteryTokensConfig(options);
    const dirs = await getButteryTokensDirectories(config);

    await buildCSSUtils(config, dirs);

    LOG_CLI.watch("Rebuilding tokens... done.");
  });

  // watch and launch the interactive UI
  if (!options.interactive) return;
  await launchPlayground(config);
}
