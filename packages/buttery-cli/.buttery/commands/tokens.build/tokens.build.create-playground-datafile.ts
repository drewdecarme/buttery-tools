import { writeFile } from "node:fs/promises";
import path from "node:path";
import { LOG_TOKENS } from "../tokens/tokens.config.logger";
import type { ButteryTokensConfig } from "./tokens.config.getButteryTokensConfig";
import { getButteryTokensDirectories } from "./tokens.config.getButteryTokensDirectories";

/**
 * Creates a data file to be easily imported when using
 * the playground of the generated config.
 */
export async function createPlaygroundDataFile(
  config: ButteryTokensConfig,
  options: { isLocal: boolean }
): Promise<{ dataFilePath: string }> {
  LOG_TOKENS.debug("Creating the generated tokens data file");
  try {
    const dirs = await getButteryTokensDirectories(config, options);
    const dataFilePath = path.resolve(
      dirs.artifacts.tokens.playground.dynamicAppRoot,
      "./src/token-config.ts"
    );

    await writeFile(
      dataFilePath,
      `export * from "${path.resolve(dirs.output.path, "./index.js")}";\n`
    );
    return { dataFilePath };
  } catch (error) {
    throw "Cannot write the data file to the output directory.";
  }
}
