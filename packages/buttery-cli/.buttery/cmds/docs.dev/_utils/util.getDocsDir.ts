import path from "node:path";
import type { ButteryConfigBase, ButteryConfigDocs } from "@buttery/core";

/**
 * Returns the absolute path of the user defined docs directory
 */
export const getDocsDir = (
  configBase: ButteryConfigBase,
  configDocs: ButteryConfigDocs
): string => {
  return path.resolve(configBase.root, configDocs.docsDirectory);
};
