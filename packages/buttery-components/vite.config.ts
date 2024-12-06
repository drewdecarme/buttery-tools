import path from "node:path";

import react from "@vitejs/plugin-react-swc";
import wyw from "@wyw-in-js/vite";
import { defineConfig } from "vite";


import packageJson from "./package.json" with { type: "json"};

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(import.meta.dirname, "./lib/index.ts"),
      fileName(_format, entryName) {
        return `${entryName}.js`;
      },
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        preserveModules: true,
      },
      external: Object.keys(packageJson.dependencies).concat(
        "react/jsx-runtime"
      ),
    },
  },
  resolve: {
    alias: {
      "@BUTTERY_COMPONENT": path.resolve(import.meta.dirname, "./lib"),
    },
  },
  plugins: [
    react(),
    // @ts-expect-error this actually has call signatures
    wyw({
      include: "/**/*.(ts|tsx)",
      babelOptions: {
        compact: false,
        presets: ["@babel/preset-typescript", "@babel/preset-react"],
      },
    }),
  ],
});
