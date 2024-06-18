import path from "node:path";
import { buildTSLibrary } from "@buttery/utils/esbuild";
import { LOG } from "../.buttery/commands/_utils/util.logger";

export const buildDistributionLibrary = () => {
  return buildTSLibrary({
    srcDir: path.resolve(import.meta.dirname, "../lib"),
    outDir: path.resolve(import.meta.dirname, "../dist"),
    tsconfigPath: path.resolve(import.meta.dirname, "../tsconfig.lib.json"),
    logger: LOG,
  });
};
