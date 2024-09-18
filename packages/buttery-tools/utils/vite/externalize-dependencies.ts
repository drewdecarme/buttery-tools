import path from "node:path";
import fs from "fs-extra";

/**
 * Collects the dependencies inside of the package.json
 * file provided at the root url and creates an array
 * of strings to provide to the rollup options of a vite
 * build.
 *
 * As an added bonus, this function will always externalize
 * the `react/jsx-runtime`
 */
export const externalizeDependencies = (
  packageRootUrl: string,
  options?: {
    exclude?: string[];
  }
) => {
  const exclude = options?.exclude ?? [];
  try {
    const packageJson = fs.readJsonSync(
      path.resolve(packageRootUrl, "./package.json")
    );
    if (!packageJson.dependencies) return [];

    const dependencies = Object.entries(packageJson.dependencies).reduce<
      string[]
    >((accum, [packageName]) => {
      if (!exclude.includes(packageName)) {
        return accum.concat(packageName);
      }
      return accum;
    }, []);
    return [...dependencies, "react/jsx-runtime"];
  } catch (error) {
    throw new Error(error as string);
  }
};
