import { createHash } from "node:crypto";
import path from "node:path";
import { getButteryConfig } from "@buttery/core";
import { hashString } from "../_utils/util.hash-string";
import type { ButteryDocsConfig } from "./shared.getButteryDocsConfig";

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
  const userDocsDir = path.resolve(config.paths.butteryDir, "./docs");

  const devDir = path.resolve(docsSrcFilesDir, "./.dev");
  const devAppTemplateDir = path.resolve(devDir, "./_template");
  const divAppServerDir = path.resolve(
    devDir,
    hashString(config.paths.rootDir)
  );

  // get some of the build paths
  const buildDir = path.resolve(docsSrcFilesDir, "./.build");
  const buildAppTemplateDir = path.resolve(
    buildDir,
    `./_template-${config.docs.build.target}`
  );
  const buildAppDir = path.resolve(buildDir, hashString(config.paths.rootDir));

  return {
    docs: userDocsDir,
    public: path.resolve(config.paths.butteryDir, "./docs/public"),
    dev: {
      templateDir: devAppTemplateDir,
      rootDir: divAppServerDir,
      docsDir: path.resolve(divAppServerDir, "./docs"),
    },
    build: {
      templateDir: buildAppTemplateDir,
      appDir: buildAppDir,
      outDir: path.resolve(userDocsDir, "./dist"),
    },
  };
}