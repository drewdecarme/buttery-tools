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
import wyw from "@wyw-in-js/rollup";
import css from "rollup-plugin-css-only";

const entryFiles = [
  // "./lib/docs/index.public.ts",
  // "./lib/config/index.public.ts",
  // "./lib/components/index.public.ts",
  "./lib/logger/index.public.ts",
  "./lib/commands/index.public.ts",
].map((relPath) => path.resolve(import.meta.dirname, relPath));

export default {
  input: entryFiles,
  output: [
    {
      dir: "dist",
      format: "esm",
      preserveModules: true, // Preserves the module directory structure
      exports: "named",
      sourcemap: true,
    },
  ],
  external: (id) => {
    const isExternal = !id.startsWith(".") && !id.startsWith("/");
    if (isExternal) {
      console.log("Excluding external module:", id);
    }
    return isExternal;
  },
  plugins: [
    resolve({
      preferBuiltins: true, // Prefer native Node.js modules,
    }),
    typescript({
      // project: "./tsconfig.library.json",
      // project: path.resolve(import.meta.dirname, "./tsconfig.library.json"),
      project: path.resolve(import.meta.dirname, "./tsconfig.library.json"),
    }), // Adjust based on your tsconfig
    commonjs(),
    {
      name: "rollup-debugger",
      buildStart() {
        console.log("Rollup build started");
      },
      transform(code, id) {
        console.log("Transforming file:", id);
        return code;
      },
      buildEnd() {
        console.log("Rollup build ended");
      },
    },

    // wyw({
    //   include: "/**/*.(ts|tsx)",
    //   babelOptions: {
    //     compact: false,
    //     presets: ["@babel/preset-typescript", "@babel/preset-react"],
    //   },
    // }),
    // css({
    //   output: "buttery-docs.css",
    // }),
  ],
};
