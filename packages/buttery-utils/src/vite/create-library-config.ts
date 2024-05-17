import { resolve } from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { externalizeDependencies } from "./externalize-dependencies.js";

type BaseLibraryOptions = {
  /**
   * The root directory where the `package.json` is located
   */
  rootDir: string;
  /**
   * Path of the library entry; this file is relative to the `rootDir` param
   * @example `./src/index.ts`
   * @default `./src/index.ts`
   */
  entryFile?: string;
  /**
   * Directory relative from `rootDir` where build output will be placed.
   * @example `./dist`
   * @default `./dist`
   */
  outDir?: string;
};
type LibraryConfigParams =
  | (BaseLibraryOptions & {
      type: "react";
    })
  | (BaseLibraryOptions & {
      type: "node";
    });

export const createLibraryConfig = (params: LibraryConfigParams) => {
  return defineConfig({
    plugins: params.type === "react" ? [react()] : undefined,
    esbuild: {
      target: params.type === "node" ? ["esnext", "node18.14.0"] : "esnext"
    },
    build: {
      lib: {
        entry: resolve(params.rootDir, params.entryFile ?? "./src/index.ts"),
        formats: ["es", "cjs"],
        fileName: (format) => `index.${format}.js`
      },
      outDir: resolve(params.rootDir, params.outDir ?? "./dist"),
      rollupOptions: {
        output: {
          preserveModules: true
        },
        external: externalizeDependencies(params.rootDir)
      }
    }
  });
};
