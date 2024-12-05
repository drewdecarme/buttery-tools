import {
  type ButteryConfigPaths,
  getNodeModulesButteryOutputDir,
} from "@buttery/core/config";
import type { ButteryLogLevel } from "@buttery/logs";

import path from "node:path";

import { ButteryIconsConfig } from "./icons-config.utils";

import { LOG } from "../utils/LOG";

export type ButteryIconsDirectories = Awaited<
  ReturnType<typeof getButteryIconsDirectories>
>;

export async function getButteryIconsDirectories(
  config: ButteryIconsConfig,
  paths: ButteryConfigPaths,
  { logLevel }: { logLevel: ButteryLogLevel }
) {
  const nodeModulesIconsDir = await getNodeModulesButteryOutputDir(
    paths,
    "icons",
    { logLevel }
  );

  const staticDir = path.resolve(nodeModulesIconsDir.target, "./static");

  const svgDir = config.svgDir ?? path.resolve(paths.butteryDir, "/icons/svg");
  const outDir = config.outDir ?? path.resolve(paths.rootDir, "icons");

  const dirs = {
    static: staticDir,
    svg: svgDir,
    out: {
      root: outDir,
      generated: path.resolve(outDir, "./generated"),
    },
  };

  LOG.trace("Directories:");
  LOG.trace(JSON.stringify(dirs, null, 2));

  return dirs;
}
