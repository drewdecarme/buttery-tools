import type { ResolvedButteryConfig } from "@buttery/core/config";
import { inlineTryCatch } from "@buttery/core/utils/isomorphic";
import type { BuildOptions } from "esbuild";
import type { ButteryCommandsBaseOptions } from "../options";
import type { ButteryCommandsDirectories } from "../utils/getButteryCommandsDirectories";
import {
  type ButteryCommand,
  LOG,
  defaultEsbuildOptions,
  getEntryPointsGlob,
} from "../utils/utils";
import { loadCommand } from "./command-load";
import { parseCommand } from "./command-parse";
import { buildManifest } from "./manifest-build";
import { validateManifest } from "./manifest-validate";
import { buildPkgJson } from "./pkgjson-enrich";

export async function getBuildConfig<T extends ButteryCommandsBaseOptions>(
  config: ResolvedButteryConfig<"commands">,
  dirs: ButteryCommandsDirectories,
  options: T & { isProd: boolean }
) {
  // Instantiate a new Manifest
  const ButteryManifest = new Map<string, ButteryCommand>();

  const build: BuildOptions = {
    ...defaultEsbuildOptions,
    logOverride: {
      "empty-glob": "silent",
    },
    entryPoints: getEntryPointsGlob(dirs),
    outdir: dirs.outDir,
    minify: options.isProd,
    plugins: [
      // Parse and validate the commands
      {
        name: "esbuild-plugin-buttery-commands-parse",
        setup(build) {
          build.onLoad({ filter: /.*/, namespace: "file" }, async (args) => {
            // load the command
            const cmdFilePath = loadCommand(args.path, dirs);
            if (!cmdFilePath) return;

            // parse the command
            const cmdResult = await inlineTryCatch(parseCommand)(cmdFilePath, {
              dirs,
            });
            if (cmdResult.hasError) {
              throw LOG.fatal(cmdResult.error);
            }

            // add the parsed command to the manifest set
            ButteryManifest.set(cmdResult.data.id, cmdResult.data);

            return null;
          });
        },
      },
      // Enrich the package.json to auto call the shebang
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
      // Validate and build the manifest
      {
        name: "esbuild-plugin-buttery-commands-manifest",
        setup(build) {
          build.onEnd(async () => {
            // validate the manifest
            const validationResults = await inlineTryCatch(validateManifest)(
              ButteryManifest,
              {
                config,
                dirs,
                options,
              }
            );
            if (validationResults.hasError) {
              throw LOG.fatal(validationResults.error);
            }

            // build and write the manifest to disk
            const buildResults = await inlineTryCatch(buildManifest)(
              ButteryManifest,
              {
                config,
                dirs,
                options,
              }
            );
            if (buildResults.hasError) {
              throw LOG.fatal(buildResults.error);
            }
          });
        },
      },
    ],
  };

  return build;
}
