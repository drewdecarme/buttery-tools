import path from "node:path";
import react from "@vitejs/plugin-react";
import wyw from "@wyw-in-js/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@buttery/tokens",
        replacement: path.resolve(
          import.meta.dirname,
          "../../../node_modules/@buttery/tokens"
        )
      }
    ]
  },
  plugins: [
    react(),
    wyw({
      include: "/**/*.(ts|tsx)",
      babelOptions: {
        presets: ["@babel/preset-typescript", "@babel/preset-react"]
      }
    })
  ]
});
