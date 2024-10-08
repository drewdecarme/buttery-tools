import { readdirSync } from "node:fs";
import path from "node:path";
import { build } from "esbuild";

// Grab all of the scripts that start with .run
const entryPoints = readdirSync(import.meta.dirname, {
  withFileTypes: true,
}).reduce<string[]>((accum, dirent) => {
  if (dirent.isFile() && dirent.name.startsWith("run.")) {
    return accum.concat(path.join(dirent.parentPath, dirent.name));
  }
  return accum;
}, []);

try {
  await build({
    entryPoints,
    outdir: path.resolve(import.meta.dirname, "../dist"),
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node22.9.0",
    sourcemap: true,
    minify: true,
    external: ["node:*", "@swc/*", "fsevents", "vite"],
  });
} catch (error) {}
