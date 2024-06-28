import { createHash } from "node:crypto";
import path from "node:path";
import { getButteryConfig } from "@buttery/core";
import { findDirectoryUpwards } from "@buttery/utils/node";
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

  const userDefinedDocs = path.resolve(config.paths.butteryDir, "./docs");

  const artifacts = findDirectoryUpwards("artifacts", undefined, {
    startingDirectory: import.meta.dirname,
  });

  if (!artifacts) {
    throw "Cannot locate artifacts directory to build documentation site. This should not have happened. Please log a Github issue.";
  }
  const docsArtifacts = path.resolve(artifacts, "./docs");
  const docTargetApps = path.resolve(docsArtifacts, "./apps");
  const docTargetDev = path.resolve(docTargetApps, "./.dev");
  const docTargetDevTemplate = path.resolve(docTargetDev, "./_template");
  const docTargetBuild = path.resolve(docTargetApps, "./.build");

  const devDir = path.resolve(docsSrcFilesDir, "./.dev");
  const devAppTemplateDir = path.resolve(devDir, "./_template");
  const divAppServerDir = path.resolve(
    devDir,
    "dev.".concat(hashString(config.paths.rootDir))
  );

  // get some of the build paths
  const buildDir = path.resolve(docsSrcFilesDir, "./.build");
  const buildAppTemplateDir = path.resolve(
    buildDir,
    `./_template-${config.docs.build.target}`
  );
  const buildAppDir = path.resolve(buildDir, hashString(config.paths.rootDir));

  return {
    artifacts: {
      root: artifacts,
      docs: {
        root: docsArtifacts,
        targetApps: {
          root: docTargetApps
        }
      }
    }


    // OLD
    docs: userDocsDir,
    public: path.resolve(config.paths.butteryDir, "./docs/public"),
    dev: {
      templateDir: devAppTemplateDir,
      rootDir: divAppServerDir,
      docsDir: path.resolve(divAppServerDir, "./docs"),
    },
    // TODO: Change this for next js
    // dev: {
    //   templateDir: path.resolve(devDir, "./_template-next"),
    //   rootDir: divAppServerDir,
    //   docsDir: path.resolve(divAppServerDir, "./docs"),
    // },
    build: {
      templateDir: buildAppTemplateDir,
      appDir: buildAppDir,
      bundleDir: path.resolve(buildAppDir, "./build"),
      outDir: path.resolve(userDocsDir, "./dist"),
    },
  };
}
