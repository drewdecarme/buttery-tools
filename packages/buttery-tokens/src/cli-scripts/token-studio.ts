import { parseAndValidateOptions } from "@buttery/core/utils";
import { tryHandle } from "@buttery/utils/isomorphic";
import express from "express";
import { createRequestHandler } from "@react-router/express";

import type { ButteryTokensTokenStudioOptions } from "./_cli-scripts.utils.js";
import { butteryTokensTokenStudioOptionsSchema } from "./_cli-scripts.utils.js";

import { LOG } from "../utils/util.logger.js";
import { getButteryTokensConfig } from "../config/getButteryTokensConfig.js";

/**
 * Run the @buttery/tokens build process in development mode
 * where you can make changes to the .buttery/config.tokens
 * and have the utilities re-build on demand.
 *
 * Depending upon the options that are passed you can also
 * view the interactive wizard to make changes live in a GUI.
 */
export async function tokenStudio(
  options?: Partial<ButteryTokensTokenStudioOptions>
) {
  const parsedOptions = parseAndValidateOptions(
    butteryTokensTokenStudioOptionsSchema,
    options,
    LOG
  );
  LOG.level = parsedOptions.logLevel;

  // Get the tokens configuration
  const res = await tryHandle(getButteryTokensConfig)(parsedOptions);
  if (res.hasError) {
    return LOG.fatal(res.error);
  }
  const rConfig = res.data;

  // Instantiate an express application
  const app = express();
  const port = process.env.PORT || 5700;

  // Serve static files from the public directory
  app.use(express.static(rConfig.dirs.playground.static));

  // Middleware to handle React Router requests
  app.all(
    "*",
    createRequestHandler({
      build: () => import(rConfig.dirs.playground.server),
      mode: process.env.NODE_ENV,
    })
  );

  // Set some local environment variables
  process.env.BUTTERY_TOKENS_PG_IS_LOCAL = "true";
  process.env.BUTTERY_TOKENS_PG_CONFIG_PATH = rConfig.paths.config;
  process.env.BUTTERY_TOKENS_PG_VERSION_DIR = rConfig.dirs.playground.versions;

  app.listen(port, () => {
    LOG.watch(`🎨 The TokenStudio is running at http://localhost:${port}`);
  });
}
