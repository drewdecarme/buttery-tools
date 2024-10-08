import { readdirSync } from "node:fs";
import path from "node:path";
import { type BuildOptions, build, context } from "esbuild";
import { LOG } from "../src/utils";

export async function buildButteryCommandsForDistribution(options?: {
  watch?: boolean;
}) {
  const watch = options?.watch ?? false;

  try {
    // Grab all of the scripts that start with .run
    const entryPoints = readdirSync(import.meta.dirname, {
      withFileTypes: true,
    }).reduce<string[]>((accum, dirent) => {
      if (dirent.isFile() && dirent.name.startsWith("run.")) {
        return accum.concat(path.join(dirent.parentPath, dirent.name));
      }
      return accum;
    }, []);

    const esbuildConfig: BuildOptions = {
      entryPoints,
      outdir: path.resolve(import.meta.dirname, "../dist"),
      bundle: true,
      format: "esm",
      platform: "node",
      target: "node22.9.0",
      sourcemap: true,
      minify: true,
      // external: ["node:*", "@swc/*", "fsevents", "vite"],
      packages: "external",
    };

    if (!watch) {
      return await build(esbuildConfig);
    }

    const buildContext = await context(esbuildConfig);
    await buildContext.watch();
  } catch (error) {
    throw LOG.fatal(
      new Error(
        `Fatal error when trying to build the @buttery/commands for distribution: ${error}`
      )
    );
  }
}
