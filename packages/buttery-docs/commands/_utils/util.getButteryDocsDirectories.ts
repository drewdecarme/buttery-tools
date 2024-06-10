import path from "node:path";
import type { ButteryDocsConfig } from "./util.getButteryDocsConfig";

/**
 * Returns some absolute path directories for easily referencing directories
 * that we should be pulling files from or serving content.
 */
export function getButteryDocsDirectories(config: ButteryDocsConfig) {
  return {
    docs: path.resolve(config.configBase.root, "./docs"),
    public: path.resolve(config.configBase.root, "./docs/public"),
  };
}
