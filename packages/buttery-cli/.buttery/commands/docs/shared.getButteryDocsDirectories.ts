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

  // dev
  const docTargetDevDir = path.resolve(docTargetApps, "./_dev");
  const docTargetDevTemplate = path.resolve(docTargetDevDir, "./_template");
  const docTargetDevDynamicAppRoot = path.resolve(
    docTargetDevDir,
    "dev.".concat(hashString(config.paths.rootDir))
  );

  // build
  const docTargetBuildDir = path.resolve(docTargetApps, "./_build");
  const docTargetBuildTemplate = path.resolve(
    docTargetBuildDir,
    `./_template-${config.docs.build.target}`
  );
  const docTargetBuildDynamicAppRoot = path.resolve(
    docTargetBuildDir,
    "build.".concat(hashString(config.paths.rootDir))
  );

  // output dirs
  const outputRootDir = path.resolve(userDocsDir, "./dist");
  const outputBundleDir = path.resolve(outputRootDir, "./build");

  return {
    root: {
      userDocs: userDefinedDocs,
      userDocsPublic: path.resolve(userDefinedDocs, "./public"),
    },
    artifacts: {
      root: artifacts,
      docs: {
        root: docsArtifacts,
        targetApps: {
          root: docTargetApps,
          dev: {
            root: docTargetDevDir,
            template: docTargetDevTemplate,
            dynamicAppRoot: docTargetDevDynamicAppRoot,
          },
          build: {
            root: docTargetBuildDir,
            template: docTargetBuildTemplate,
            dynamicAppRoot: docTargetBuildDynamicAppRoot,
          },
        },
      },
    },
    output: {
      root: outputRootDir,
      bundleDir: outputBundleDir,
    },
  };
}
