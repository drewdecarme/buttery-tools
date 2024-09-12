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
  const userCreatedDocsDir = path.resolve(config.paths.butteryDir, "./docs");

  const artifacts = findDirectoryUpwards("artifacts", undefined, {
    startingDirectory: import.meta.dirname
  });

  if (!artifacts) {
    throw "Cannot locate artifacts directory to build documentation site. This should not have happened. Please log a Github issue.";
  }

  // artifacts directories
  const artifactsRootDir = path.resolve(artifacts, "./docs");
  const artifactsAppsDir = path.resolve(artifactsRootDir, "./apps");
  const artifactsComponentsDir = path.resolve(artifactsRootDir, "./components");
  const artifactsLibDir = path.resolve(artifactsRootDir, "./lib");

  // apps directories
  const templateName = `./_template-${config.docs.build.target}`;
  const appName = "app.".concat(hashString(config.paths.rootDir));

  const appTemplateRootDir = path.resolve(artifactsAppsDir, templateName);

  const appGenRootDir = path.resolve(artifactsAppsDir, appName);
  const appGenAppRootDir = path.resolve(appGenRootDir, "./app");
  const appGenAppRoutesDir = path.resolve(appGenAppRootDir, "./routes");

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
      public: path.resolve(userCreatedDocsDir, "./public")
    },
    artifacts: {
      root: artifactsRootDir,
      apps: {
        root: artifactsAppsDir,
        template: {
          root: appTemplateRootDir
        },
        generated: {
          root: appGenRootDir,
          app: {
            root: appGenAppRootDir,
            /**
             * The prefix that is added to the docs to ensure that the docs layout
             * is only applied to the docs and not to the root index page
             */
            routePrefix: "_docs.",
            routes: appGenAppRoutesDir
          }
        }
      },
      components: artifactsComponentsDir,
      lib: artifactsLibDir
    },
    output: {
      root: outputRootDir,
      bundleDir: outputBundleDir
    }
  };
}
