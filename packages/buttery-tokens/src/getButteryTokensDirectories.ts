import path from "node:path";

import {
  type ResolvedButteryConfig,
  getNodeModulesButteryOutputDir,
} from "@buttery/core/config";
import type { ButteryLogLevel } from "@buttery/core/logger";


import { LOG } from "./logger";

export type ButteryTokensDirectories = Awaited<
  ReturnType<typeof getButteryTokensDirectories>
>;

export async function getButteryTokensDirectories(
  config: ResolvedButteryConfig<"tokens">,
  options: { logLevel: ButteryLogLevel }
) {
  try {
    const nodeModulesTokenDir = await getNodeModulesButteryOutputDir(
      config.paths,
      "tokens",
      { logLevel: options.logLevel }
    );

    const appDir = path.resolve(nodeModulesTokenDir.target, "./app");
    const outputDistDir = path.resolve(nodeModulesTokenDir.target, "./dist");

    return {
      /**
       * The UI for the configuration UI playground. We provide the location
       * of the template and then the location of the dynamically created app root
       * and public path to feed to the createServer vite function.
       */
      app: appDir,
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
        dist: outputDistDir,
      },
    };
  } catch (error) {
    throw LOG.fatal(
      new Error(
        `Error when attempting to reconcile the @buttery/tokens directories: ${error}`
      )
    );
  }
}
