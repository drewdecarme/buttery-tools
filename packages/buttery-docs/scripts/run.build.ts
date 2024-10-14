import path from "node:path";
import { build as viteBuild } from "vite";

import { cp } from "node:fs/promises";
import { getButteryDocsConfig } from "../utils/docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../utils/docs.getButteryDocsDirectories";
import { getButteryDocsViteConfig } from "../utils/docs.getButteryDocsViteConfig";
import { LOG } from "../utils/docs.utils";

export async function build() {
  // Process and store configurations
  const config = await getButteryDocsConfig();
  const dirs = await getButteryDocsDirectories(config);
  const viteConfig = getButteryDocsViteConfig(config, dirs);

  try {
    LOG.debug("Building client bundle for production...");
    await viteBuild({
      root: dirs.app.root,
      ...viteConfig,
      build: {
        emptyOutDir: true,
        manifest: true,
        outDir: path.resolve(dirs.output.bundleDir, "./client"),
      },
    });
    LOG.debug("Building client bundle for production... done");

    LOG.debug("Building server bundle for production...");
    await viteBuild({
      root: dirs.app.root,
      ...viteConfig,
      build: {
        emptyOutDir: true,
        ssrManifest: true,
        ssr: dirs.app.appEntryServer,
        outDir: path.resolve(dirs.output.bundleDir, "./server"),
      },
    });
    LOG.debug("Building server bundle for production... done");

    switch (config.docs.buildTarget) {
      case "cloudflare-pages": {
        // move functions to local dist
        const functionsDir = path.resolve(dirs.app.root, "./functions");

        await cp(functionsDir, path.resolve(dirs.output.root, "./functions"), {
          recursive: true,
        });
        break;
      }

      default:
        break;
    }

    // Report the success
    //     const filesAndDirs = await readdir(dirs.output.root, {
    //       recursive: true,
    //       withFileTypes: true,
    //     });

    //     const files = filesAndDirs.filter((dirent) => dirent.isFile());
    //     LOG.success(`Successfully built documentation app!

    //   Location: ${dirs.output.root}
    //   Total Files: ${files.length}

    // ${files.reduce(
    //   (accum, file) =>
    //     accum.concat(
    //       `    - ${path.relative(
    //         dirs.output.root,
    //         `${file.parentPath}/${file.name}`
    //       )}\n`
    //     ),
    //   ""
    // )}
    // `);
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
