import path from "node:path";
import { build as viteBuild } from "vite";

import { cp, writeFile } from "node:fs/promises";
import { ensureFile } from "fs-extra";
import { getButteryDocsConfig } from "./utils/docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./utils/docs.getButteryDocsDirectories";
import { getButteryDocsRouteManifest } from "./utils/docs.getButteryDocsRouteManifest";
import { getButteryDocsViteConfig } from "./utils/docs.getButteryDocsViteConfig";
import { LOG } from "./utils/docs.utils";

export async function build() {
  process.env.NODE_ENV = "production";

  // Process and store configurations
  const config = await getButteryDocsConfig();
  const dirs = await getButteryDocsDirectories(config);
  const viteConfig = getButteryDocsViteConfig(config, dirs);
  const butteryManifest = getButteryDocsRouteManifest(dirs);

  try {
    LOG.debug("Building client bundle for production...");
    await viteBuild({
      root: dirs.app.root,
      ...viteConfig,
      build: {
        emptyOutDir: true,
        manifest: true,
        outDir: path.resolve(dirs.output.bundleDir, "./client"),
        rollupOptions: {
          input: dirs.app.appEntryClient,
        },
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
        rollupOptions: {
          output: {
            entryFileNames: "server.js",
          },
        },
      },
    });
    LOG.debug("Building server bundle for production... done");

    // create the buttery manifest
    try {
      const butteryManifestPath = path.resolve(
        dirs.output.bundleDir,
        "./client/.buttery/buttery.manifest.json"
      );
      LOG.debug("Writing buttery manifest.json...");
      await ensureFile(butteryManifestPath);
      await writeFile(
        butteryManifestPath,
        JSON.stringify(butteryManifest, null, 2),
        { encoding: "utf8" }
      );
      LOG.debug("Writing buttery manifest.json... done.");
    } catch (error) {
      throw LOG.fatal(new Error(error as string));
    }

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
