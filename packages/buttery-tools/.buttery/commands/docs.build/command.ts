import { cp, readdir } from "node:fs/promises";
import path from "node:path";
import { exit } from "node:process";
import { viteBuild } from "@remix-run/dev/dist/cli/commands.js";
import type { CommandAction, CommandMeta } from "../../../lib/buttery-commands";
import { LOG } from "../_logger/util.ts.logger";
import { bootstrapButteryDocsApp } from "../docs/docs.bootstrapButteryDocsApp";
import { getButteryDocsConfig } from "../docs/docs.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../docs/docs.getButteryDocsDirectories";

export const meta: CommandMeta = {
  name: "build",
  description:
    "Build the necessary assets required to create actions, fetchers, and components to render the Buttery Docs template."
};

export const action: CommandAction = async () => {
  try {
    const config = await getButteryDocsConfig();
    const dirs = await getButteryDocsDirectories(config);

    await bootstrapButteryDocsApp(config, dirs);

    await viteBuild(dirs.artifacts.apps.working.root, {
      emptyOutDir: true,
      clearScreen: false,
      force: true,
      config: dirs.artifacts.apps.working.viteConfig,
      logLevel: "info"
    });

    switch (config.docs.buildTarget) {
      case "cloudflare-pages": {
        // move functions to local dist
        const functionsDir = path.resolve(
          dirs.artifacts.apps.working.root,
          "./functions"
        );
        await cp(functionsDir, path.resolve(dirs.output.root, "./functions"), {
          recursive: true
        });
        break;
      }

      default:
        break;
    }

    // Report the success
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
