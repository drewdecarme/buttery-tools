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

  const lib = findDirectoryUpwards("lib", undefined, {
    startingDirectory: import.meta.dirname
  });

  if (!lib) {
    throw "Cannot locate lib directory to build documentation site. This should not have happened. Please log a Github issue.";
  }

  // lib directories
  const libRootDir = path.resolve(lib, "./buttery-docs");
  const libAppsDir = path.resolve(libRootDir, "./apps");
  const libComponentsDir = path.resolve(libRootDir, "./components");
  const libLibDir = path.resolve(libRootDir, "./lib");

  // apps directories
  const templateName = `./_template-${config.docs.buildTarget}`;
  const appName = "app.".concat(hashString(config.paths.rootDir));

  const appTemplateRootDir = path.resolve(libAppsDir, templateName);

  const appGenRootDir = path.resolve(libAppsDir, appName);
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
    lib: {
      root: libRootDir,
      apps: {
        root: libAppsDir,
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
      components: libComponentsDir,
      lib: libLibDir
    },
    output: {
      root: outputRootDir,
      bundleDir: outputBundleDir
    }
  };
}
