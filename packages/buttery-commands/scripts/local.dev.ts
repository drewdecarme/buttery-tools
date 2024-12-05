import { printAsBullets } from "@buttery/core/logger";
import { watch } from "chokidar";

import path from "node:path";

import { buildRuntime } from "./runtime.build";

import { dev } from "../src/cli-scripts/dev";
import { LOG } from "../src/utils/LOG";

// Allows for local development to test out all functionality
// before it is built and published to the rest of the packages
// that consume this.

// This is for LOCAL testing only and should not be used to build
// the package for distribution

process.env.LOCAL_DEV = "true";

dev({
  autoFix: true,
  logLevel: "debug",
});

// Collect some paths to watch
const rootDir = path.resolve(import.meta.dirname, "..");
const srcDir = path.resolve(rootDir, "./src");
const commandsDir = path.resolve(rootDir, "./.buttery/commands");
const butteryConfig = path.resolve(rootDir, "./.buttery/config.ts");

// Watch these directories and rebuild to make life easier when developing
// against the framework
const watchPaths = [srcDir, butteryConfig];
LOG.watch(
  `Watching the following paths for changes: ${printAsBullets(watchPaths)}}`
);
watch([srcDir, commandsDir, butteryConfig], { ignoreInitial: true }).on(
  "all",
  async (event, changePath) => {
    LOG.checkpointStart(
      `${path.relative(rootDir, changePath)}:${event}. Rebuilding...`
    );
    await buildRuntime();
    await dev({
      autoFix: true,
      logLevel: "debug",
    });
    LOG.checkpointEnd(
      `${path.relative(rootDir, changePath)}:${event}. Rebuilding... done.`
    );
  }
);
