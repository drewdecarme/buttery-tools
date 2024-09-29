import path from "node:path";
import react from "@vitejs/plugin-react";
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    open: true
  },
  //   build: {
  //     ssr: path.resolve(import.meta.dirname, "./src/entry-server.tsx"),
  //     rollupOptions: {
  //       input: [
  //         path.resolve(import.meta.dirname, "src/entry-client.tsx"),
  //         path.resolve(import.meta.dirname, "./src/entry-server.tsx")
  //       ],
  //       output: {
  //         dir: "dist",
  //         format: "esm"
  //       }
  //     }
  //   }
  build: {
    ssr: path.resolve(import.meta.dirname, "./src/entry-server.tsx"),
    rollupOptions: {
      input: [path.resolve(import.meta.dirname, "./src/entry-client.tsx")],
      output: {
        dir: "dist",
        format: "esm"
      }
    }
  }
});
