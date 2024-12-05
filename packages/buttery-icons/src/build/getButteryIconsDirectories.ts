import path from "node:path";
import {
  type ResolvedButteryConfig,
  getNodeModulesButteryOutputDir,
} from "@buttery/core/config";
import type { ButteryLogLevel } from "@buttery/logs";
import { LOG } from "../utils/LOG";

export type ButteryIconsDirectories = Awaited<
  ReturnType<typeof getButteryIconsDirectories>
>;

export async function getButteryIconsDirectories(
  config: ResolvedButteryConfig<"icons">,
  options: { logLevel: ButteryLogLevel }
) {
  const nodeModulesIconsDir = await getNodeModulesButteryOutputDir(
    config.paths,
    "icons",
    { logLevel: options.logLevel }
  );

  const staticDir = path.resolve(nodeModulesIconsDir.target, "./static");

  const iconsDir = config.icons.iconsDirectory
    ? path.resolve(config.paths.butteryDir, config.icons.iconsDirectory)
    : path.resolve(config.paths.rootDir, "./icons");

  const dirs = {
    static: staticDir,
    io: {
      root: iconsDir,
      svg: path.resolve(iconsDir, "./svg"),
      generated: path.resolve(iconsDir, "./generated"),
    },
  };

  LOG.trace("Directories:");
  LOG.trace(JSON.stringify(dirs, null, 2));

  return dirs;
}
