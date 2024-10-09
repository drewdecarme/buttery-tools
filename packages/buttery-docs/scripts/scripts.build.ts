import path from "node:path";
import { buildScripts } from "@buttery/builder";

// Builds the scripts to be able to be used in the @butter/tools CLI
buildScripts({
  scriptsDir: import.meta.dirname,
  outDir: path.resolve(import.meta.dirname, "../dist"),
});
