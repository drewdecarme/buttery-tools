import path from "node:path";

import { getNodeModulesButteryOutputDir } from "@buttery/core/utils";
import type { ButteryLogLevel } from "@buttery/logs";
import type { ButteryConfigPaths } from "@buttery/core/config";
import type { ButteryTokensConfig } from "@buttery/tokens-utils/schemas";

import { LOG } from "../utils/util.logger.js";

export type ButteryTokensDirectories = Awaited<
  ReturnType<typeof getButteryTokensDirectories>
>;

export async function getButteryTokensDirectories(
  config: ButteryTokensConfig,
  paths: ButteryConfigPaths,
  { logLevel }: { logLevel: ButteryLogLevel }
) {
  try {
    const nodeModulesTokenDir = await getNodeModulesButteryOutputDir(
      paths.butteryDir,
      "tokens",
      { logLevel: logLevel }
    );
    const nodeModulesTokensPlaygroundDir = await getNodeModulesButteryOutputDir(
      paths.butteryDir,
      "tokens-studio",
      { logLevel: logLevel }
    );

    const studioDir = path.resolve(nodeModulesTokensPlaygroundDir.target);
    const outputDistDir = path.resolve(
      nodeModulesTokenDir.target,
      "./dist/out"
    );
    const outputDistNamespace = path.resolve(
      outputDistDir,
      config.runtime.namespace
    );
    const outputDistNamespaceTsconfig = path.resolve(
      outputDistNamespace,
      "./tsconfig.json"
    );

    const dirs = {
      /**
       * The UI for the configuration UI tokens studio. We provide the location
       * of the template and then the location of the dynamically created app root
       * and public path to feed to the createServer vite function.
       */
      studio: {
        root: studioDir,
        server: path.resolve(studioDir, "./build/server/index.js"),
        static: path.resolve(studioDir, "./build/client"),
        versions: path.resolve(paths.butteryDir, "./tokens/versions"),
      },
      /**
       * The directory where the buttery token utilities
       * are built to. This would include the barrel file
       * that exports all of the `make` utilities as well as
       * the tokens CSS :root declaration that can be imported
       * in to make sure the app has the CSS variables that we're
       * created
       */
      output: {
        root: nodeModulesTokenDir.target,
        out: outputDistDir,
        namespace: outputDistNamespace,
        namespaceTsconfig: outputDistNamespaceTsconfig,
      },
    };

    LOG.debug("Directories");
    LOG.debug(JSON.stringify(dirs, null, 2));

    return dirs;
  } catch (error) {
    throw LOG.fatal(
      new Error(
        `Error when attempting to reconcile the @buttery/tokens directories: ${error}`
      )
    );
  }
}
