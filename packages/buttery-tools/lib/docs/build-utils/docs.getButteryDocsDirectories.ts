import path from "node:path";
import { getButteryArtifactsDir } from "../../commands";
import { LOG_CLI } from "../../logger";
import { hashString } from "../../utils/node";
import type { ButteryDocsConfig } from "./docs.getButteryDocsConfig";

export type ButteryDocsDirectories = Awaited<
  ReturnType<typeof getButteryDocsDirectories>
>;

/**
 * Returns some absolute path directories for easily referencing directories
 * that we should be pulling files from or serving content.
 */
export async function getButteryDocsDirectories(config: ButteryDocsConfig) {
  LOG_CLI.checkpointStart("resolve docs dir");
  const userCreatedDocsDir = path.resolve(config.paths.butteryDir, "./docs");

  const artifactsDir = await getButteryArtifactsDir(
    import.meta.dirname,
    "buttery-docs"
  );

  // lib directories
  const libAppsDir = path.resolve(artifactsDir, "./apps");

  // apps directories
  const templateAppRootDir = path.resolve(
    libAppsDir,
    `./${config.docs.buildTarget}`
  );

  const workingAppDirHash = hashString(config.docs.buildTarget);
  const workingAppRootDir = path.resolve(
    config.paths.storeDir,
    `./docs/${workingAppDirHash}`
  );

  // output dirs
  const outputRootDir = path.resolve(userCreatedDocsDir, "./dist");
  const outputBundleDir = path.resolve(outputRootDir, "./build");

  LOG_CLI.checkpointEnd("resolve docs dir");

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
      root: artifactsDir,
      apps: {
        root: libAppsDir,
        template: {
          root: templateAppRootDir
        },
        working: {
          root: workingAppRootDir,
          routes: path.resolve(workingAppRootDir, "./app/routes"),
          dataFile: path.resolve(workingAppRootDir, "./app/data.ts"),
          viteConfig: path.resolve(workingAppRootDir, "./vite.config.ts")
        }
      }
    },
    output: {
      root: outputRootDir,
      bundleDir: outputBundleDir
    }
  };
}
