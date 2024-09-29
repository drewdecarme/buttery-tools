import path from "node:path";
import { getButteryArtifactsDir } from "../commands/utils/util.getButteryArtifactsDir";
import type { ResolvedButteryConfig } from "../config/getButteryConfig";

export type ButteryIconsDirectories = Awaited<
  ReturnType<typeof getButteryIconsDirectories>
>;

export async function getButteryIconsDirectories(
  config: ResolvedButteryConfig<"icons">
) {
  const artifactsDir = await getButteryArtifactsDir(
    import.meta.dirname,
    "buttery-icons"
  );

  const outputRootDir = path.resolve(config.paths.storeDir, "./icons");

  return {
    entry: {
      svgDir:
        config.icons.svgDir ?? path.resolve(config.paths.butteryDir, "./icons")
    },
    artifacts: {
      root: artifactsDir
    },
    output: {
      root: outputRootDir,
      barrelFile: path.resolve(outputRootDir, "./index.ts"),
      /**
       * The path where all of the generated React components will be stored
       */
      generated: path.resolve(outputRootDir, "./generated")
    }
  };
}
