import path from "node:path";

import { watch } from "chokidar";
import { printAsBullets } from "@buttery/logs";

import { buildRuntime } from "./runtime.build.js";

import { dev } from "../src/cli-scripts/dev.js";
import { LOG } from "../src/utils/LOG.js";

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
