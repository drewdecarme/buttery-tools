import { defineConfig, mergeConfig } from "vite";
import { createLibraryConfig } from "@buttery/utils/vite";
import wyw from "@wyw-in-js/vite";

export default mergeConfig(
  createLibraryConfig({
    rootDir: __dirname,
    type: "react",
  }),
  defineConfig({
    plugins: [
      wyw({
        include: ["**/*.{ts,tsx}"],
        babelOptions: {
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      }),
    ],
  })
);
