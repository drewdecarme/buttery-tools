import { parseAndValidateOptions } from "@buttery/core/utils/node";
import type { z } from "zod";
import { buildCSSUtils } from "../buildCSSUtils";
import { getButteryTokensConfig } from "../getButteryTokensConfig";
import { getButteryTokensDirectories } from "../getButteryTokensDirectories";
import { LOG } from "../logger";
import { butteryTokensBuildOptionsSchema } from "./_options.schema";

export type ButteryTokensBuildOptions = z.infer<
  typeof butteryTokensBuildOptionsSchema
>;

/**
 * Build the @buttery/tokens library to the `node_modules/@buttery/tokens`
 * under your provided namespace so the `make` utilities and the
 * :root CSS can be imported and used in your applications.
 */
export async function build(options?: ButteryTokensBuildOptions) {
  // parse and validate & set the options
  const parsedOptions = parseAndValidateOptions(
    butteryTokensBuildOptionsSchema,
    options,
    LOG
  );
  LOG.level = parsedOptions.logLevel;

  try {
    LOG.loadingStart("Building @buttery/tokens...");
    // Fetch the tokens config and resolve the paths
    const config = await getButteryTokensConfig({
      prompt: parsedOptions.prompt,
    });
    const dirs = await getButteryTokensDirectories(config);
    await buildCSSUtils(config, dirs);
    LOG.loadingEnd("complete.");
  } catch (error) {
    throw LOG.fatal(
      new Error(`Error when trying to build @buttery/tools: ${error}`)
    );
  }
}
