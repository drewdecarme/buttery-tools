import { createHash } from "node:crypto";
import type { ButteryDocsConfig } from "./util.getButteryDocsConfig";

/**
 * Takes a string and returns a hashed representation
 * of that string. This is done to provide a significantly
 * unique temp directory for serving the local docs configuration
 */
export const getTempDirname = (configs: ButteryDocsConfig) => {
  return createHash("sha256").update(configPath).digest("hex");
};
