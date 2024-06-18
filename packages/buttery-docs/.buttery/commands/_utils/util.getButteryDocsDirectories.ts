import { createHash } from "node:crypto";
import path from "node:path";
import type { ButteryDocsConfig } from "./util.getButteryDocsConfig";

/**
 * Takes a string and returns a hashed representation
 * of that string. This is done to provide a significantly
 * unique temp directory for serving the local docs configuration
 */
export const hashString = (input: string) => {
  return createHash("sha256").update(input).digest("hex");
};

export type ButteryDocsDirectories = ReturnType<
  typeof getButteryDocsDirectories
>;

/**
 * Returns some absolute path directories for easily referencing directories
 * that we should be pulling files from or serving content.
 */
export function getButteryDocsDirectories(config: ButteryDocsConfig) {
  const targetsDir = path.resolve(config.paths.rootDir, "../targets");
  const devDir = path.resolve(config.paths.rootDir, "./.dev-environments");
  const devRootDir = path.resolve(devDir, hashString(config.paths.rootDir));

  return {
    docs: path.resolve(config.paths.butteryDir, "./docs"),
    public: path.resolve(config.paths.butteryDir, "./docs/public"),
    dev: {
      templateDir: path.resolve(devDir, "./_template"),
      rootDir: devRootDir,
      docsDir: path.resolve(devRootDir, "./docs"),
    },
    targets: {
      components: path.resolve(targetsDir, "./components"),
      apps: {
        "cloudflare-pages": path.resolve(targetsDir, "./apps/cloudflare-pages"),
      },
    },
  };
}