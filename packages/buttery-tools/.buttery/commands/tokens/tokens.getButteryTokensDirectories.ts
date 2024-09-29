import path from "node:path";
import { getButteryArtifactsDir } from "../../../lib/commands/utils/util.getButteryArtifactsDir";
import { getNodeModulesButteryOutputDir } from "../../../lib/commands/utils/util.getNodeModulesButteryDir";
import type { ResolvedButteryConfig } from "../../../lib/config/getButteryConfig";

export type ButteryTokensDirectories = Awaited<
  ReturnType<typeof getButteryTokensDirectories>
>;

export async function getButteryTokensDirectories(
  config: ResolvedButteryConfig<"tokens">
) {
  const outputDirs = await getNodeModulesButteryOutputDir(
    config.paths,
    "tokens"
  );
  const artifactsDir = await getButteryArtifactsDir(
    import.meta.dirname,
    "buttery-tokens"
  );

  return {
    /**
     * The UI for the configuration UI playground. We provide the location
     * of the template and then the location of the dynamically created app root
     * and public path to feed to the createServer vite function.
     */
    artifacts: {
      root: artifactsDir,
      playground: {
        root: path.resolve(artifactsDir, "./playground")
      }
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
      root: outputDirs.target,
      packageJson: path.resolve(outputDirs.target, "./package.json")
    }
  };
}
