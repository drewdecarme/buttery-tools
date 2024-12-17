import express from "express";
import { createRequestHandler } from "@remix-run/express";

import type { ResolvedButteryTokensConfig } from "../config/getButteryTokensConfig.js";
import { LOG } from "../utils/util.logger.js";

export async function launchPlayground(rConfig: ResolvedButteryTokensConfig) {
  const app = express();

  // Serve static files from the public directory
  app.use(express.static(rConfig.dirs.playground.static));

  // Middleware to handle Remix requests
  app.all(
    "*",
    createRequestHandler({
      build: await import(rConfig.dirs.playground.server),
      mode: process.env.NODE_ENV,
    })
  );

  const port = process.env.PORT || 5700;

  // Set some local environment variables
  process.env.BUTTERY_TOKENS_PG_LOCAL_CONFIG = JSON.stringify(rConfig.config);

  app.listen(port, () => {
    LOG.watch(
      `✅ Buttery Tokens Playground is running at http://localhost:${port}`
    );
  });
}
