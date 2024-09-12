import path from "node:path";
import { findDirectoryUpwards } from "@buttery/utils/node";

const butteryPath = findDirectoryUpwards("node_modules", "@buttery", {
  startingDirectory: import.meta.dirname
});

if (!butteryPath) {
  throw new Error(
    "Cannot locate the `@buttery/cli` in your node_modules. Please ensure you have installed it."
  );
}

const butteryCliIndexPath = path.resolve(butteryPath, "./cli/bin/index.js");

import(butteryCliIndexPath);
