import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  cacheDir: path.resolve(import.meta.dirname, "./node_modules/.vite"),
  root: import.meta.dirname,
  plugins: [
    react({
      jsxRuntime: "automatic"
    })
  ],
  publicDir: path.resolve(import.meta.dirname, "./public"),
  server: {
    open: true
  },
  resolve: {
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
    preserveSymlinks: true,
    alias: {
      react: path.resolve("../../node_modules/react"),
      //   "react-dom": path.resolve("../../node_modules/react-dom"),
      "react/jsx-runtime": path.resolve("../../node_modules/react/jsx-runtime")
    }
  },
  build: {
    ssr: true,
    rollupOptions: {
      input: {
        client: path.resolve(import.meta.dirname, "./src/entry-client.tsx"),
        server: path.resolve(import.meta.dirname, "./src/entry-server.tsx")
      },
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        dir: "dist",
        format: "esm"
      }
    }
  },
  ssr: {
    noExternal: ["react-router-dom"] // Do not include `react` or `react/jsx-runtime`
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime"],
    exclude: ["util", "stream", "path"] // Exclude problematic Node.js modules
  }
});
