import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic"
    }),
    nodePolyfills({
      //   globals: { process: true }, // Polyfill process globally
      include: ["stream"]
    })
  ],
  publicDir: path.resolve(import.meta.dirname, "./public"),
  server: {
    open: true
  },
  resolve: {
    preserveSymlinks: true, // Preserve symbolic links when resolving modules
    dedupe: ["react", "react-dom"], // Prevent multiple React instances,
    alias: {
      //   "react-dom/client": path.resolve("../../node_modules/react-dom/client"),
      //   "react-dom/server": path.resolve("../../node_modules/react-dom/server"),
      "react/jsx-runtime": path.resolve("../../node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(
        "../../node_modules/react/jsx-dev-runtime"
      )
    }
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production") // Define only NODE_ENV
  },
  build: {
    ssr: true,
    rollupOptions: {
      input: {
        client: path.resolve(import.meta.dirname, "./src/entry-client.tsx"),
        server: path.resolve(import.meta.dirname, "./src/entry-server.tsx")
      },
      output: {
        dir: "dist",
        format: "esm",
        manualChunks: {
          react: ["react", "react-dom", "react/jsx-runtime"] // Group common chunks
        }
      }
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime"],
    exclude: ["util", "stream", "path"] // Exclude Node.js-specific modules
  },
  ssr: {
    target: "webworker",
    noExternal: ["react", "react-dom", "react/jsx-runtime", "react-router-dom"]
  }
});
