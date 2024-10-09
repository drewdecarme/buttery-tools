import { readdir } from "node:fs/promises";
import path from "node:path";
import { ButteryLogger, printAsBullets } from "@buttery/logger";
import esbuild from "esbuild";

const LOG = new ButteryLogger({
  id: "buttery-logger",
  prefix: "buttery:logger",
  prefixBgColor: "#f8d334",
  logLevel: "debug",
});

export async function build(
  entryPoints: "scripts" | string[],
  options?: {
    outDir?: string;
  }
) {
  // Reconcile options to variables
  const outDir = options?.outDir ?? path.resolve(process.cwd(), "./dist");
  const scriptsDir = path.resolve(process.cwd(), "./scripts");
  const scriptsEntryPointsDirents = await readdir(scriptsDir, {
    encoding: "utf8",
    withFileTypes: true,
  });
  const scriptsEntryPoints = scriptsEntryPointsDirents.reduce<string[]>(
    (accum, dirent) => {
      if (dirent.isFile() && dirent.name.startsWith("run.")) {
        const direntPath = path.resolve(dirent.parentPath, dirent.name);
        return accum.concat(direntPath);
      }
      return accum;
    },
    []
  );

  const reconciledEntryPoints =
    entryPoints === "scripts" ? scriptsEntryPoints : entryPoints;

  LOG.debug(
    `Building the following entryPoints to "${outDir}" ${printAsBullets(
      reconciledEntryPoints
    )}`
  );
  try {
    await esbuild.build({
      bundle: true,
      minify: false,
      entryPoints: reconciledEntryPoints,
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
