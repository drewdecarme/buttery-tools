import path from "node:path";
import { findDirectoryUpwards } from "../../../utils/node";
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
  const artifactsRootDir = path.resolve(lib, "./buttery-docs");
  const libAppsDir = path.resolve(artifactsRootDir, "./apps");
  const libComponentsDir = path.resolve(artifactsRootDir, "./components");
  const libLibDir = path.resolve(artifactsRootDir, "./lib");

  // apps directories
  const templateName = `./${config.docs.buildTarget}`;

  const appTemplateRootDir = path.resolve(libAppsDir, templateName);

  // output dirs
  const outputRootDir = path.resolve(userCreatedDocsDir, "./dist");
  const outputBundleDir = path.resolve(outputRootDir, "./build");

  return {
    /**
     * The docs that are created and stored by the user. This is where
     * they create their markdown|mdx files to then be created into
     * the app
     */
    srcDocs: {
      root: userCreatedDocsDir,
      public: path.resolve(userCreatedDocsDir, "./public")
    },
    artifacts: {
      root: artifactsRootDir,
      apps: {
        root: libAppsDir,
        template: {
          root: appTemplateRootDir,
          viteConfig: path.resolve(appTemplateRootDir, "./vite.config.ts"),
          dataFile: path.resolve(config.paths.storeDir, "./docs/data.js")
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
