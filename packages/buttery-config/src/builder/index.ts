import { readdir } from "node:fs/promises";
import path from "node:path";
import { ButteryLogger, printAsBullets } from "@buttery/logger";
import esbuild from "esbuild";
import { exhaustiveMatchGuard } from "../utils/isomorphic";

const LOG = new ButteryLogger({
  id: "buttery-logger",
  prefix: "buttery:logger",
  prefixBgColor: "#f8d334",
  logLevel: "debug",
});

type BuildParams =
  | { mode: "runnable-scripts" }
  | { mode: "loose"; entryPoints: string[] };

export async function build(
  params: BuildParams,
  options?: {
    outDir?: string;
  }
) {
  const outDir = options?.outDir ?? path.resolve(process.cwd(), "./dist");
  let entryPoints: string[] = [];

  switch (params.mode) {
    case "runnable-scripts": {
      const runnableScriptsDir = path.resolve(
        process.cwd(),
        "./scripts/runnable"
      );
      // Reconcile options to variables
      const scriptsEntryPointsDirents = await readdir(runnableScriptsDir, {
        encoding: "utf8",
        withFileTypes: true,
      });
      entryPoints = scriptsEntryPointsDirents.reduce<string[]>(
        (accum, dirent) => {
          if (!dirent.isFile()) return accum;

          const direntPath = path.resolve(dirent.parentPath, dirent.name);
          return accum.concat(direntPath);
        },
        []
      );
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
    `Building the following entryPoints to "${outDir}" ${printAsBullets(
      entryPoints
    )}`
  );
  try {
    await esbuild.build({
      bundle: true,
      minify: false,
      entryPoints,
      format: "esm",
      platform: "node",
      target: ["node22.9.0"],
      outdir: outDir,
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
