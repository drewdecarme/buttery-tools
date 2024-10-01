/**
 * NOTE: Needed to use rollup to transpile and build the distribution
 * since `tsc` didn't transpile with .js endings. This normally wouldn't
 * be an issue, but when running a binary the tsconfig doesn't have any
 * bearing on how things are resolved.
 */

import path from "node:path";
import { ButteryLogger } from "@buttery/logger";
import alias from "@rollup/plugin-alias";
import typescript from "@rollup/plugin-typescript";
import wyw from "@wyw-in-js/rollup";
import css from "rollup-plugin-css-only";

const externalSet = new Set();

const LOG_BUILD = new ButteryLogger({
  id: "build",
  prefix: "buttery-lib",
  prefixBgColor: "#0594bc",
  logLevel: "debug",
});

const entryFiles = [
  "./lib/docs/index.public.ts",
  "./lib/config/index.public.ts",
  "./lib/components/index.public.ts",
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
      exports: "auto",
      sourcemap: true,
    },
  ],
  external: (id) => {
    const isExternal =
      (!id.startsWith(".") && !id.startsWith("/")) ||
      id.includes("fsevents") ||
      id.startsWith("node:");
    if (isExternal && !externalSet.has(id)) {
      externalSet.add(id);
    }
    return isExternal || id.includes("fsevents"); // Ensure `fsevents` is treated as external
  },
  plugins: [
    // resolve({
    //   preferBuiltins: true, // Prefer native Node.js modules,
    //   extensions: [".ts", ".tsx"],
    // }),
    alias({
      entries: [
        {
          find: "@BUTTERY_COMPONENT",
          replacement: path.resolve(import.meta.dirname, "./lib/components/*"),
        },
      ],
    }),
    typescript({
      tsconfig: path.resolve("./tsconfig.library.json"),
    }),
    wyw({
      include: "**/*.(ts|tsx)",
      exclude: path.resolve(import.meta.dirname, "./lib/config/**/*.ts"),
      babelOptions: {
        compact: false,
        presets: ["@babel/preset-typescript", "@babel/preset-react"],
      },
    }),
    css({
      output: "buttery-docs.css",
    }),
    // analyze({ summaryOnly: true }),
    {
      name: "build-debugger",
      buildStart() {
        LOG_BUILD.debug("Building the `@buttery/tools` distribution...");
      },
      transform(code, id) {
        LOG_BUILD.debug(`Transforming file: ${id}`);
        return code;
      },
      buildEnd() {
        LOG_BUILD.debug("Building the `@buttery/tools` distribution... done.");
        LOG_BUILD.success(
          "Successfully built the distribution for @butter/tools"
        );
        LOG_BUILD.debug(`Externalized the following dependencies:
    ${[...externalSet.values()].map((dep) => `- ${dep}`).join("\n")}`);
      },
    },
  ],
};
