import path from "node:path";
import { exhaustiveMatchGuard } from "@buttery/utils/ts";
import { LOG } from "../../_utils/util.logger";
import { runCommand } from "../../_utils/util.run-command";
import type { ButteryDocsConfig } from "../../docs/shared.getButteryDocsConfig";
import { getButteryDocsDirectories } from "../../docs/shared.getButteryDocsDirectories";

export const buildForProduction = async (config: ButteryDocsConfig) => {
  const butteryDirs = await getButteryDocsDirectories(config);
  LOG.debug("Building distribution files...");

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
      break;
    }

    default:
      exhaustiveMatchGuard(config.docs.build.target);
  }

  LOG.success(
    `Successfully built production distribution into "${butteryDirs.build.outDir}"`
  );
};
