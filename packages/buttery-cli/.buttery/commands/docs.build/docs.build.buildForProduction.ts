import path from "node:path";
import { exhaustiveMatchGuard } from "@buttery/utils/ts";

import { cp, readdir, rename, writeFile } from "node:fs/promises";
import { runCommand } from "../_utils/util.run-command";
import { LOG_DOCS } from "../docs/docs.logger";
import type { ButteryDocsConfig } from "../docs/shared.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../docs/shared.getButteryDocsDirectories";

export const buildForProduction = async (config: ButteryDocsConfig) => {
  const butteryDirs = await getButteryDocsDirectories(config);
  LOG_DOCS.debug("Building distribution files...");

  try {
    switch (config.docs.build.target) {
      case "cloudflare-pages": {
        const configFile = path.resolve(
          butteryDirs.build.appDir,
          "./vite.config.ts"
        );
        process.env.REMIX_ROOT = butteryDirs.build.appDir;

        await runCommand(
          `npx remix vite:build --config ${configFile} --emptyOutDir --logLevel=error`
        );

        // Move the build to the local dist
        await cp(
          butteryDirs.build.bundleDir,
          path.resolve(butteryDirs.build.outDir, "./build"),
          {
            recursive: true,
          }
        );

        // move functions to local dist
        const functionsDir = path.resolve(
          butteryDirs.build.appDir,
          "./functions"
        );
        await cp(
          functionsDir,
          path.resolve(butteryDirs.build.outDir, "./functions"),
          {
            recursive: true,
          }
        );

        break;
      }

      default:
        exhaustiveMatchGuard(config.docs.build.target);
    }

    const filesAndDirs = await readdir(butteryDirs.build.outDir, {
      recursive: true,
      withFileTypes: true,
    });

    const files = filesAndDirs.filter((dirent) => dirent.isFile());
    LOG_DOCS.success(`Successfully built documentation app!

  Location: ${butteryDirs.build.outDir}
  Total Files: ${files.length}

${files.reduce((accum, file) => accum.concat(`    - ${path.relative(butteryDirs.build.outDir, `${file.parentPath}/${file.name}`)}\n`), "")}      
`);
  } catch (error) {
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};