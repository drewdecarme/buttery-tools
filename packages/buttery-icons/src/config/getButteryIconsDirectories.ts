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

  const svgDirRel = config.svgDir ?? ".buttery/icons/svg";
  const outDirRel = config.outDir ?? "icons";

  const svgDir = path.resolve(paths.rootDir, svgDirRel);
  const outDir = path.resolve(paths.rootDir, outDirRel);

  const dirs = {
    static: staticDir,
    svg: svgDir,
    out: {
      root: outDir,
      generated: path.resolve(outDir, "./generated"),
    },
  };

  LOG.debug("Directories:");
  LOG.debug(JSON.stringify(dirs, null, 2));

  return dirs;
}
