/**
 * NOTE: Needed to use rollup to transpile and build the distribution
 * since `tsc` didn't transpile with .js endings. This normally wouldn't
 * be an issue, but when running a binary the tsconfig doesn't have any
 * bearing on how things are resolved.
 */

import path from "node:path";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: [
    "./lib/docs/getViteConfig.ts",
    "./lib/config/index.ts",
    "./lib/components/index.ts",
    "./lib/commands/index.ts",
  ].map((relPath) => path.resolve(import.meta.dirname, relPath)),
  output: [
    {
      dir: "dist",
      format: "esm",
      preserveModules: true, // Preserves the module directory structure
      exports: "named",
      sourcemap: true,
    },
  ],
  external: (id) => !id.startsWith(".") && !id.startsWith("/"), // Exclude node_modules
  plugins: [
    resolve({
      preferBuiltins: true, // Prefer native Node.js modules
    }),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.library.json" }), // Adjust based on your tsconfig
  ],
};
