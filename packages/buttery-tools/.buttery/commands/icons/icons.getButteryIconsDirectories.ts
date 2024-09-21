import path from "node:path";
import type { ResolvedButteryConfig } from "../_buttery-config";
import {
  getButteryArtifactsDir,
  getNodeModulesButteryOutputDir
} from "../_utils";

export type ButteryIconsDirectories = Awaited<
  ReturnType<typeof getButteryIconsDirectories>
>;

export async function getButteryIconsDirectories(
  config: ResolvedButteryConfig<"icons">
) {
  const outputDirs = await getNodeModulesButteryOutputDir(
    config.paths,
    "icons"
  );
  const artifactsDir = await getButteryArtifactsDir(
    import.meta.dirname,
    "buttery-icons"
  );

  return {
    entry: {
      svgDir:
        config.icons.svgDir ?? path.resolve(config.paths.butteryDir, "./icons")
    },
    artifacts: {
      root: artifactsDir
    },
    output: {
      root: outputDirs.target,
      packageJson: path.resolve(outputDirs.target, "./package.json"),
      tsConfig: path.resolve(outputDirs.target, "./tsconfig.json"),
      /**
       * The path where all of the generated React components will be stored
       */
      generated: path.resolve(outputDirs.target, "./generated")
    }
  };
}
