import path from "node:path";
import type { BuildOptions } from "esbuild";
import type { ButteryCommandsDirectories } from "../getButteryCommandsDirectories";
import { defaultEsbuildOptions } from "../utils.js";

export function getBuildConfig(
  manifestModule: string,
  dirs: ButteryCommandsDirectories
): BuildOptions {
  return {
    ...defaultEsbuildOptions,
    minify: false,
    outfile: path.resolve(dirs.binDir, "./command-manifest.js"),
    stdin: {
      contents: manifestModule,
      loader: "ts",
    },
  };
}
