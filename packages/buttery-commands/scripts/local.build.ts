import { buildRuntime } from "./runtime.build";

import { build } from "../src/cli-scripts/build";

// Allows for local development to test out all functionality
// before it is built and published to the rest of the packages
// that consume this.

// This is for LOCAL testing only and should not be used to build
// the package for distribution
await buildRuntime();
build({
  autoFix: true,
  logLevel: "debug",
});
