import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { externalizeDependencies } from "@machineq/build-tools";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  root: resolve(__dirname, "./demo"),
  publicDir: resolve(__dirname, "./demo/public"),
  server: {
    https: true
  },
  build: {
    lib: {
      entry: resolve(__dirname, "./lib/index.ts"),
      name: "scanner",
      formats: ["cjs", "es"],
      fileName: (format) => `index.${format}.js`
    },
    outDir: resolve(__dirname, "./dist"),
    emptyOutDir: true,
    rollupOptions: {
      external: externalizeDependencies(__dirname),
      output: {
        preserveModules: true
      }
    }
  }
});
