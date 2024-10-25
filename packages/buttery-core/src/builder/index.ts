import { readdir } from "node:fs/promises";
import path from "node:path";
import { ButteryLogger, printAsBullets } from "@buttery/logger";
import esbuild from "esbuild";
import { exhaustiveMatchGuard } from "../utils/isomorphic";

const LOG = new ButteryLogger({
  id: "buttery-logger",
  prefix: "buttery:core",
  prefixBgColor: "#f8d334",
  logLevel: "debug",
});

type BuildParams =
  | { mode: "cli-scripts" }
  | { mode: "loose"; entryPoints: string[] };

export async function build(
  params: BuildParams,
  options?: {
    outDir?: string;
  }
) {
  const outDirRoot = options?.outDir ?? path.resolve(process.cwd(), "./dist");
  let entryPoints: string[] = [];
  let outdir = outDirRoot;

  switch (params.mode) {
    case "cli-scripts": {
      const runnableScriptsDir = path.resolve(
        process.cwd(),
        "./src/cli-scripts"
      );
      // Reconcile options to variables
      const scriptsEntryPointsDirents = await readdir(runnableScriptsDir, {
        encoding: "utf8",
        withFileTypes: true,
      });
      entryPoints = scriptsEntryPointsDirents.reduce<string[]>(
        (accum, dirent) => {
          // ignore anything that isn't a file or any directory or file that
          // starts with an underscore
          if (!dirent.isFile() || dirent.name.startsWith("_")) return accum;

          const direntPath = path.resolve(dirent.parentPath, dirent.name);
          return accum.concat(direntPath);
        },
        []
      );
      outdir = path.resolve(outDirRoot, "./cli-scripts");
      break;
    }

    case "loose": {
      entryPoints = params.entryPoints;
      break;
    }

    default:
      exhaustiveMatchGuard(params);
  }

  LOG.debug(
    `Building ${
      params.mode === "cli-scripts" ? "CLI scripts" : "entry points"
    } to "${outdir}" ${printAsBullets(entryPoints)}`
  );
  try {
    await esbuild.build({
      bundle: true,
      minify: true,
      sourcemap: true,
      entryPoints,
      format: "esm",
      platform: "node",
      target: ["node22.9.0"],
      outdir,
      packages: "external",
    });
    LOG.success("Build complete!");
  } catch (error) {
    throw LOG.fatal(
      new Error(
        `Error when trying to build the scripts for consumption in the @buttery/tools CLI: ${error}`
      )
    );
  }
}
