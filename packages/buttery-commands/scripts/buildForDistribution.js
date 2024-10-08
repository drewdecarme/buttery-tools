import path from "node:path";
import wyw from "@wyw-in-js/esbuild";
import * as esbuild from "esbuild";

const prod = process.env.NODE_ENV === "production";

async function buildDistribution() {
  // const buildCommands = esbuild.build({
  //   entryPoints: [path.resolve(import.meta.dirname, "../lib/commands/**/*.ts")],
  //   outdir: path.resolve(import.meta.dirname, "../dist/commands"),
  //   minify: true,
  //   format: "esm",
  //   target: ["node22.1.0"],
  //   platform: "node",
  //   packages: "external",
  // });

  // const buildConfig = esbuild.build({
  //   entryPoints: [path.resolve(import.meta.dirname, "../lib/config/**/*.ts")],
  //   outdir: path.resolve(import.meta.dirname, "../dist/config"),
  //   minify: true,
  //   format: "esm",
  //   target: ["node22.1.0"],
  //   platform: "node",
  //   packages: "external",
  // });

  const buildComponents = esbuild.build({
    entryPoints: [
      path.resolve(import.meta.dirname, "../lib/components/**/*.ts"),
      path.resolve(import.meta.dirname, "../lib/components/**/*.tsx"),
    ],
    outdir: path.resolve(import.meta.dirname, "../dist/components"),
    minify: true,
    format: "esm",
    target: ["esnext"],
    platform: "browser",
    packages: "external",
    jsx: "automatic",
    plugins: [
      wyw({
        filter: /\.(|ts|tsx)$/,
        babelOptions: {
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
        sourceMap: prod,
      }),
    ],
  });

  const buildDocs = esbuild.build({
    entryPoints: [
      path.resolve(import.meta.dirname, "../lib/docs/**/*.ts"),
      path.resolve(import.meta.dirname, "../lib/docs/**/*.tsx"),
    ],
    outdir: path.resolve(import.meta.dirname, "../dist/docs"),
    minify: true,
    format: "esm",
    target: ["esnext"],
    platform: "browser",
    packages: "external",
    jsx: "automatic",
    plugins: [
      wyw({
        filter: /\.(|ts|tsx)$/,
        babelOptions: {
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
        sourceMap: prod,
      }),
    ],
  });

  try {
    const results = await Promise.allSettled([buildDocs, buildComponents]);
    console.log(results);
  } catch (error) {}
}

buildDistribution();
