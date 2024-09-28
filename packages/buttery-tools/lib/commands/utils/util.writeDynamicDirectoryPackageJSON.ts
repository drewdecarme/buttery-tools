import { readFile, writeFile } from "node:fs/promises";
import { LOG_CLI } from "../../logger";

/**
 * Adds the necessary exports to the package.json in order
 * for the dynamically created directory to be imported using
 * node module resolution.
 */
export async function writeDynamicDirectoryPackageJSON(
  packageJsonPath: string,
  namespace?: string
) {
  // update package.json
  LOG_CLI.debug(
    "Enriching package.json with necessary properties for import...",
    {
      namespace
    }
  );
  try {
    const packageJsonContents = await readFile(packageJsonPath, {
      encoding: "utf8"
    });
    const packageJsonJSON = JSON.parse(packageJsonContents);
    let updatedPackageJsonContents = {};
    if (!namespace) {
      updatedPackageJsonContents = {
        ...packageJsonJSON,
        exports: {
          ...packageJsonJSON.exports,
          ".": "./index.js",
          "./css": "./index.css"
        }
      };
    } else {
      const importPath = namespace === "index" ? "." : `./${namespace}`;
      updatedPackageJsonContents = {
        ...packageJsonJSON,
        exports: {
          ...packageJsonJSON.exports,
          [`${importPath}`]: `./${namespace}/index.js`,
          [`${importPath}/css`]: `./${namespace}/index.css`
        }
      };
    }

    await writeFile(
      packageJsonPath,
      JSON.stringify(updatedPackageJsonContents, null, 2)
    );
    LOG_CLI.debug(
      "Enriching package.json with necessary properties for import... done.",
      { namespace }
    );
  } catch (error) {
    throw LOG_CLI.fatal(new Error(error as string));
  }
}
