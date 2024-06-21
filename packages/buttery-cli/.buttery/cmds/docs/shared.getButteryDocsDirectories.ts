import { createHash } from "node:crypto";
import path from "node:path";
import { getButteryConfig } from "@buttery/core";
import type { ButteryDocsConfig } from "./shared.getButteryDocsConfig";

/**
 * Takes a string and returns a hashed representation
 * of that string. This is done to provide a significantly
 * unique temp directory for serving the local docs configuration
 */
export const hashString = (input: string) => {
  return createHash("sha256").update(input).digest("hex");
};

export type ButteryDocsDirectories = Awaited<
  ReturnType<typeof getButteryDocsDirectories>
>;

/**
 * Returns some absolute path directories for easily referencing directories
 * that we should be pulling files from or serving content.
 */
export async function getButteryDocsDirectories(config: ButteryDocsConfig) {
  const localConfig = await getButteryConfig("docs", {
    startingDirectory: import.meta.dirname,
  });
  const docsSrcFilesDir = path.resolve(
    localConfig.paths.rootDir,
    "./.buttery-docs"
  );

  const devDir = path.resolve(docsSrcFilesDir, "./.dev");
  const devAppTemplateDir = path.resolve(devDir, "./_template");
  const divAppServerDir = path.resolve(
    devDir,
    hashString(config.paths.rootDir)
  );

  return {
    docs: path.resolve(config.paths.butteryDir, "./docs"),
    public: path.resolve(config.paths.butteryDir, "./docs/public"),
    dev: {
      templateDir: devAppTemplateDir,
      rootDir: divAppServerDir,
      docsDir: path.resolve(divAppServerDir, "./docs"),
    },
  };
}
