import { dev } from "../src/cli-scripts/dev";

// Allows for local development to test out all functionality
// before it is built and published to the rest of the packages
// that consume this.

// This is for LOCAL testing only and should not be used to build
// the package for distribution
dev({
  autoFix: true,
  logLevel: "debug",
});
