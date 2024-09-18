import wyw from "@wyw-in-js/vite";
import { defineConfig, mergeConfig } from "vite";
import { createLibraryConfig } from "./utils/vite";

export default mergeConfig(
  createLibraryConfig({
    rootDir: __dirname,
    type: "react"
  }),
  defineConfig({
    plugins: [
      wyw({
        include: ["**/*.{ts,tsx}"],
        babelOptions: {
          presets: ["@babel/preset-typescript", "@babel/preset-react"]
        }
      })
    ]
  })
);
