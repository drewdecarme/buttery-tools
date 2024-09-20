import { readFile, writeFile } from "node:fs/promises";
import { LOG } from "../_logger";
import type { ButteryTokensDirectories } from "./tokens.getButteryTokensDirectories";

/**
 * Adds the necessary exports to the package.json for buttery tokens
 * so the dynamic directory can be imported
 */
export async function buildCSSUtilsEnrichPackageJSON(
  dirs: ButteryTokensDirectories,
  namespace: string
) {
  // update package.json
  LOG.debug(
    "Enriching package.json with necessary properties for token import...",
    { namespace }
  );
  try {
    const packageJsonContents = await readFile(dirs.output.packageJson, {
      encoding: "utf8"
    });
    const packageJsonJSON = JSON.parse(packageJsonContents);
    const importPath = namespace === "index" ? "./*" : `./${namespace}/*`;
    const updatedPackageJsonContents = {
      ...packageJsonJSON,
      [`${importPath}`]: {
        default: `./${namespace}/*.js`,
        import: `./${namespace}/*.js`,
        node: `./${namespace}/*.js`,
        require: `./${namespace}/*.js`,
        types: `./${namespace}/*.d.ts`
        // css: `./${namespace}/*.css`
      }
    };
    await writeFile(
      dirs.output.packageJson,
      JSON.stringify(updatedPackageJsonContents, null, 2)
    );
    LOG.debug(
      "Enriching package.json with necessary properties for token import... done.",
      { namespace }
    );
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
