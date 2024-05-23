import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import wyw from "@wyw-in-js/vite";
import fse from "fs-extra";
import { defineConfig } from "vite";

const createEntries = (paths: string[]) =>
  paths.reduce(
    (accum, p) =>
      Object.assign({}, accum, {
        [p.concat("/index")]: path.join(
          import.meta.dirname,
          "./lib",
          p,
          "index.ts"
        )
      }),
    {}
  );

const packageJson = fse.readJsonSync(
  path.resolve(import.meta.dirname, "./package.json")
);
const dependencies = Object.entries(packageJson.dependencies).map(
  ([packageName]) => packageName
);
const externalDependencies = [...dependencies, "react/jsx-runtime"];

export default defineConfig({
  esbuild: {
    target: "esnext"
  },
  plugins: [
    react(),
    wyw({
      include: ["**/*.{ts,tsx}"],
      babelOptions: {
        presets: ["@babel/preset-typescript", "@babel/preset-react"]
      }
    })
  ],
  build: {
    lib: {
      entry: createEntries(["remix/cloudflare", "components", "types"]),
      formats: ["es"],
      fileName: "[name]"
    },
    outDir: path.resolve(import.meta.dirname, "./dist"),
    rollupOptions: {
      output: {
        preserveModules: true
      },
      external: externalDependencies
    }
  }
});
