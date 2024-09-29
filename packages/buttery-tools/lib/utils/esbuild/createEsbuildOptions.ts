import type { BuildOptions } from "esbuild";

/**
 * A function that returns an ESBuild options object
 * that has a base set of shared options. This is to ensure
 * consistency on our builds across our build scripts.
 */
export const createEsbuildOptions = (
  options: Pick<
    BuildOptions,
    "entryPoints" | "outdir" | "plugins" | "outfile" | "stdin"
  >
): BuildOptions => ({
  bundle: true,
  minify: true,
  format: "esm",
  platform: "node",
  target: ["node22.1.0"],
  packages: "external",
  ...options
});
