import path from "node:path";
import {
  type ResolvedButteryConfig,
  getNodeModulesButteryOutputDir,
} from "@buttery/config";

export type ButteryIconsDirectories = Awaited<
  ReturnType<typeof getButteryIconsDirectories>
>;

export async function getButteryIconsDirectories(
  config: ResolvedButteryConfig<"icons">
) {
  const nodeModulesIconsDir = await getNodeModulesButteryOutputDir(
    config.paths,
    "icons"
  );

  const staticDir = path.resolve(nodeModulesIconsDir.target, "./static");

  const iconsDir = config.icons.iconsDirectory
    ? path.resolve(config.paths.butteryDir, config.icons.iconsDirectory)
    : path.resolve(config.paths.rootDir, "./icons");

  console.log({ iconsDir: config.icons.iconsDirectory });

  return {
    static: staticDir,
    io: {
      root: iconsDir,
      svg: path.resolve(iconsDir, "./svg"),
      generated: path.resolve(iconsDir, "./generated"),
    },
  };
}
