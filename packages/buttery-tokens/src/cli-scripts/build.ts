import { buildCSSUtils } from "../buildCSSUtils";
import { getButteryTokensConfig } from "../getButteryTokensConfig";
import { getButteryTokensDirectories } from "../getButteryTokensDirectories";
import { LOG } from "../logger";

// TODO: Add some public options
export async function build() {
  try {
    // Fetch the tokens config and resolve the paths
    const config = await getButteryTokensConfig();
    const dirs = await getButteryTokensDirectories(config);
    await buildCSSUtils(config, dirs);
  } catch (error) {
    throw LOG.fatal(
      new Error(`Error when trying to build @buttery/tools: ${error}`)
    );
  }
}
