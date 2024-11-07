import type { ResolvedButteryConfig } from "@buttery/core/config";
import type { BuildOptions } from "esbuild";
import type { ButteryCommandsBaseOptions } from "../options";
import type { ButteryCommandsDirectories } from "../utils/getButteryCommandsDirectories";
import { getEntryPoints } from "../utils/getEntryPointsFromCommandFiles";
import { type CommandFile, LOG, defaultEsbuildOptions } from "../utils/utils";
import { buildManifest } from "./build-manifest";
import { buildPkgJson } from "./build-pkgjson";

export async function getBuildConfig<T extends ButteryCommandsBaseOptions>(
  config: ResolvedButteryConfig<"commands">,
  dirs: ButteryCommandsDirectories,
  commands: CommandFile[],
  options: T & { isProd: boolean }
) {
  const build: BuildOptions = {
    ...defaultEsbuildOptions,
    entryPoints: getEntryPoints(commands),
    outdir: dirs.binDir,
    minify: options.isProd,
    plugins: [
      {
        name: "esbuild-plugin-buttery-commands-enrich-pkgjson",
        setup(build) {
          build.onStart(async () => {
            try {
              await buildPkgJson(config, dirs);
            } catch (error) {
              LOG.error("Error when trying to enrich the package.json");
              throw LOG.fatal(new Error(String(error)));
            }
          });
        },
      },
      {
        name: "esbuild-plugin-buttery-commands-manifest",
        setup(build) {
          build.onStart(async () => {
            try {
              await buildManifest(config, dirs, options);
            } catch (error) {
              throw LOG.fatal(new Error(String(error)));
            }
          });
        },
      },
    ],
  };

  return build;
}
