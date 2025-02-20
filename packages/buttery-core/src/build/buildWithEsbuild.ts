import type { BuildResult, SameShape, BuildOptions } from "esbuild";
import { build } from "esbuild";

const defaultEsbuildOptions: BuildOptions = {
  bundle: true,
  minify: true,
  sourcemap: true,
  format: "esm",
  platform: "node",
  target: ["node23.3.0"],
  packages: "external",
};

export function buildWithEsbuild<T extends BuildOptions>(
  options: SameShape<BuildOptions, T>
): Promise<BuildResult<T>> {
  return build({
    ...defaultEsbuildOptions,
    ...options,
  });
}
