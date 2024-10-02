import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(import.meta.dirname, "./lib/index.public.ts"),
      fileName(format, entryName) {
        return `${entryName}.${format}.js`;
      },
      formats: ["cjs", "es"]
    },
    rollupOptions: {
      output: {
        preserveModules: true
      },
      external: [/node_modules/, "@buttery/logger"]
    }
  },
  resolve: {
    alias: {
      "@BUTTERY_COMPONENT": path.resolve(import.meta.dirname, "./lib")
    }
  },
  plugins: [
    react()
    // TODO: Remove this when all styles are removed
    // wyw({
    //   include: "/**/*.(ts|tsx)",
    //   babelOptions: {
    //     compact: false,
    //     presets: ["@babel/preset-typescript", "@babel/preset-react"]
    //   }
    // })
  ]
});
