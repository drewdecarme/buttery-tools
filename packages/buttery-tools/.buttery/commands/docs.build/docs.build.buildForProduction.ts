import path from "node:path";
import { exhaustiveMatchGuard } from "../../../utils/ts";

import { cp, readdir } from "node:fs/promises";
import { exit } from "node:process";
import { runCommand } from "../../../utils/node/util.node.run-command";
import { LOG } from "../_logger/util.ts.logger";
import type { ButteryDocsConfig } from "../docs/docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../docs/docs.getButteryDocsDirectories";

export const buildForProduction = async (config: ButteryDocsConfig) => {
  const dirs = await getButteryDocsDirectories(config);
  LOG.debug("Building distribution files...");

  try {
    switch (config.docs.buildTarget) {
      case "cloudflare-pages": {
        process.env.REMIX_ROOT = dirs.artifacts.apps.template.root;

        await runCommand(
          `npx remix vite:build --config ${dirs.output.root} --emptyOutDir --logLevel=error`
        );

        // Move the build to the local dist
        await cp(
          path.resolve(dirs.artifacts.apps.template.root, "./build"),
          path.resolve(dirs.output.root, "./build"),
          {
            recursive: true
          }
        );

        // move functions to local dist
        const functionsDir = path.resolve(
          dirs.artifacts.apps.template.root,
          "./functions"
        );
        await cp(functionsDir, path.resolve(dirs.output.root, "./functions"), {
          recursive: true
        });

        break;
      }

      default:
        exhaustiveMatchGuard(config.docs.buildTarget);
    }

    const filesAndDirs = await readdir(dirs.output.root, {
      recursive: true,
      withFileTypes: true
    });

    const files = filesAndDirs.filter((dirent) => dirent.isFile());
    LOG.success(`Successfully built documentation app!

  Location: ${dirs.output.root}
  Total Files: ${files.length}

${files.reduce((accum, file) => accum.concat(`    - ${path.relative(dirs.output.root, `${file.parentPath}/${file.name}`)}\n`), "")}      
`);
    exit();
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
};
