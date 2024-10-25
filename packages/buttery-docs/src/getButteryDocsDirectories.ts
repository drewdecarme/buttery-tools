import path from "node:path";
import { getNodeModulesButteryOutputDir } from "@buttery/core/config";
import { findDirectoryUpwards } from "@buttery/core/utils/node";
import type { ButteryDocsConfig } from "./getButteryDocsConfig";
import { LOG } from "./utils";

export type ButteryDocsDirectories = Awaited<
  ReturnType<typeof getButteryDocsDirectories>
>;

/**
 * Returns some absolute path directories for easily referencing directories
 * that we should be pulling files from or serving content.
 */
export async function getButteryDocsDirectories(config: ButteryDocsConfig) {
  LOG.checkpointStart("resolve docs dir");

  const nodeModulesDocsDir = await getNodeModulesButteryOutputDir(
    config.paths,
    "docs"
  );

  const userCreatedDocsDir = path.resolve(config.paths.butteryDir, "./docs");

  const appRootDir = path.resolve(nodeModulesDocsDir.target, "./app");
  const serverEntryFileName =
    process.env.NODE_ENV === "production"
      ? `entry.server.${config.docs.buildTarget}.tsx`
      : "entry.server.tsx";
  const appEntryServer = path.join(appRootDir, serverEntryFileName);

  // output dirs
  const outputRootDir = path.resolve(userCreatedDocsDir, "./dist");
  const outputBundleDir = path.resolve(outputRootDir, "./build");

  // initial css
  const tokensCss = path.resolve(
    findDirectoryUpwards("node_modules", "@buttery", {
      startingDirectory: import.meta.dirname,
    }) as string,
    "./tokens/docs.css"
  );
  const docsUiCSS = path.resolve(
    findDirectoryUpwards("node_modules", "@buttery", {
      startingDirectory: import.meta.dirname,
    }) as string,
    "./docs/dist/style.css"
  );

  LOG.checkpointEnd("resolve docs dir");

  return {
    /**
     * The docs that are created and stored by the user. This is where
     * they create their markdown|mdx files to then be created into
     * the app
     */
    srcDocs: {
      root: userCreatedDocsDir,
      public: path.resolve(userCreatedDocsDir, "./_public"),
    },
    app: {
      root: appRootDir,
      viteCacheDir: path.resolve(config.paths.storeDir, "./docs/.vite-cache"),
      appEntryServer,
      appEntryClient: path.resolve(appRootDir, "./entry.client.tsx"),
      css: {
        tokens: tokensCss,
        docsUI: docsUiCSS,
      },
    },
    output: {
      root: outputRootDir,
      bundleDir: outputBundleDir,
    },
  };
}
