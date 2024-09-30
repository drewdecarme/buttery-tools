import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
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
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "@remix-run/router",
      "react-router",
      "react-router-dom",
      "scheduler"
    ]
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production")
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
        format: "esm"
      }
    }
  },
  ssr: {
    noExternal: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react-router-dom",
      "scheduler",
      "react-router",
      "@remix-run/router"
    ]
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime", "react-router-dom"]
  }
});
