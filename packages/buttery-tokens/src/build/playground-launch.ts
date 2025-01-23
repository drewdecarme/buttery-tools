import express from "express";
import { createRequestHandler } from "@react-router/express";

import type { ResolvedButteryTokensConfig } from "../config/getButteryTokensConfig.js";
import { LOG } from "../utils/util.logger.js";

export async function launchPlayground(rConfig: ResolvedButteryTokensConfig) {
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
    LOG.watch(
      `✅ Buttery Tokens Playground is running at http://localhost:${port}`
    );
  });
}
