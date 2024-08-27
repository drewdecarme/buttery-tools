import path from "node:path";
import { findDirectoryUpwards } from "@buttery/utils/node";
import { hashString } from "../_utils/util.hash-string";
import type { ButteryDocsConfig } from "./docs.getButteryDocsConfig";

export type ButteryDocsDirectories = Awaited<
  ReturnType<typeof getButteryDocsDirectories>
>;

/**
 * Returns some absolute path directories for easily referencing directories
 * that we should be pulling files from or serving content.
 */
export async function getButteryDocsDirectories(config: ButteryDocsConfig) {
  // const localConfig = await getButteryConfig("docs", {
  //   startingDirectory: import.meta.dirname,
  // });
  // const docsSrcFilesDir = path.resolve(
  //   localConfig.paths.rootDir,
  //   "./.buttery-docs"
  // );
  const userCreatedDocsDir = path.resolve(config.paths.butteryDir, "./docs");

  const artifacts = findDirectoryUpwards("artifacts", undefined, {
    startingDirectory: import.meta.dirname,
  });

  if (!artifacts) {
    throw "Cannot locate artifacts directory to build documentation site. This should not have happened. Please log a Github issue.";
  }
  const artifactsDocsDir = path.resolve(artifacts, "./docs");
  const artifactsDocsAppsDir = path.resolve(artifactsDocsDir, "./apps");

  // dev
  // TODO: Change this when we can run this with Remix
  const docTargetDevTemplate = path.resolve(
    artifactsDocsAppsDir,
    `./_template-${config.docs.build.target}`
  );
  const docTargetDevDynamicApp = path.resolve(
    artifactsDocsAppsDir,
    "app.".concat(hashString(config.paths.rootDir))
  );
  const docTargetDevDynamicAppDocs = path.resolve(
    docTargetDevDynamicApp,
    "./docs"
  );

  // build
  const docTargetBuildTemplate = path.resolve(
    artifactsDocsAppsDir,
    `./_template-${config.docs.build.target}`
  );
  const docTargetBuildDynamicAppRoot = path.resolve(
    artifactsDocsAppsDir,
    "build.".concat(hashString(config.paths.rootDir))
  );

  // output dirs
  const outputRootDir = path.resolve(userCreatedDocsDir, "./dist");
  const outputBundleDir = path.resolve(outputRootDir, "./build");

  return {
    /**
     * The docs that are created and stored by the user. This is where
     * they create their markdown|mdx files to then be created into
     * the app
     */
    userDocs: {
      root: userCreatedDocsDir,
      public: path.resolve(userCreatedDocsDir, "./public"),
    },
    artifacts: {
      root: artifacts,
      // since this is scoped to docs in here, we don't need this next level
      // TODO: Remove the docs key
      docs: {
        root: artifactsDocsDir,
        apps: {
          root: artifactsDocsAppsDir,
          // TODO: Deprecate the dev directory and default NODE_ENV to development
          // which will resolve to the template-spa
          dev: {
            root: artifactsDocsAppsDir,
            template: docTargetDevTemplate,
            dynamicApp: {
              root: docTargetDevDynamicApp,
              docs: docTargetDevDynamicAppDocs,
            },
          },
          build: {
            root: artifactsDocsAppsDir,
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
