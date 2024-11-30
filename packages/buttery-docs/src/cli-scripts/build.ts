import { cp, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseAndValidateOptions } from "@buttery/core/utils/node";
import { ensureFile } from "fs-extra";
import { build as viteBuild } from "vite";
import { getButteryDocsConfig } from "../getButteryDocsConfig";
import { getButteryDocsDirectories } from "../getButteryDocsDirectories";
import { getButteryDocsRouteManifest } from "../getButteryDocsRouteManifest";
import { getButteryDocsViteConfig } from "../getButteryDocsViteConfig";
import {
  type ButteryDocsBuildOptions,
  butteryDocsBuildOptionsSchema,
} from "../options";
import { LOG } from "../utils";

export async function build(options?: ButteryDocsBuildOptions) {
  const parsedOptions = parseAndValidateOptions(
    butteryDocsBuildOptionsSchema,
    options,
    LOG
  );
  LOG.level = parsedOptions.logLevel;

  // Process and store configurations
  LOG.loadingStart("Building @buttery/docs");
  const config = await getButteryDocsConfig({
    prompt: parsedOptions.prompt,
  });
  const dirs = await getButteryDocsDirectories(config, {
    logLevel: parsedOptions.logLevel,
  });
  const viteConfig = getButteryDocsViteConfig(config, dirs);
  const butteryManifest = getButteryDocsRouteManifest(config, dirs);

  try {
    LOG.debug("Building client bundle for production...");
    await viteBuild({
      logLevel: "silent",
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
      logLevel: "silent",
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
    LOG.loadingEnd("complete!");

    // Report the success
    const filesAndDirs = await readdir(dirs.output.root, {
      recursive: true,
      withFileTypes: true,
    });

    const files = filesAndDirs.filter((dirent) => dirent.isFile());
    LOG.success(`Successfully built documentation app!

      Location: ${dirs.output.root}
      Total Files: ${files.length}

    ${files.reduce(
      (accum, file) =>
        accum.concat(
          `    - ${path.relative(
            dirs.output.root,
            `${file.parentPath}/${file.name}`
          )}\n`
        ),
      ""
    )}
    `);
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
