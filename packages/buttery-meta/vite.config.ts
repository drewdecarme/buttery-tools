import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import packageJson from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: [
        path.resolve(import.meta.dirname, "./src/index.ts"),
        path.resolve(import.meta.dirname, "./src/react/index.ts"),
      ],
      fileName(_format, entryName) {
        return `${entryName}.js`;
      },
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        preserveModules: true,
      },
      external: Object.keys(packageJson.dependencies).concat([
        "react/jsx-runtime",
        "react-dom/server",
      ]),
    },
  },
  plugins: [react()],
});
