import { tryHandle } from "@buttery/utils/isomorphic";
import type { BuildOptions } from "esbuild";

import { getEntryPointsGlob } from "./build.utils.js";
import { loadCommand } from "./command-load.js";
import { parseCommand } from "./command-parse.js";
import { buildManifest } from "./manifest-build.js";
import { validateManifest } from "./manifest-validate.js";
import { buildPkgJson } from "./pkgjson-enrich.js";

import { LOG } from "../utils/LOG.js";
import type { ButteryCommand } from "../utils/LOG.js";
import type { ButteryCommandsBaseOptions } from "../cli-scripts/_cli-scripts.utils.js";
import { defaultEsbuildOptions } from "../../dist/utils/utils.js";
import type { ResolvedButteryCommandsConfig } from "../config/getButteryCommandsConfig.js";

export async function getBuildConfig<T extends ButteryCommandsBaseOptions>(
  rConfig: ResolvedButteryCommandsConfig,
  options: T & { isProd: boolean }
) {
  // Instantiate a new Manifest
  const ButteryManifest = new Map<string, ButteryCommand>();

  const build: BuildOptions = {
    ...defaultEsbuildOptions,
    logOverride: {
      "empty-glob": "silent",
    },
    entryPoints: getEntryPointsGlob(rConfig.dirs),
    outdir: rConfig.dirs.outDir,
    minify: options.isProd,
    plugins: [
      // Parse and validate the commands
      {
        name: "esbuild-plugin-buttery-commands-parse",
        setup(build) {
          build.onLoad({ filter: /.*/, namespace: "file" }, async (args) => {
            // load the command
            const cmdFilePath = loadCommand(args.path, rConfig.dirs);
            if (!cmdFilePath) return;

            // parse the command
            const cmdResult = await tryHandle(parseCommand)(cmdFilePath, {
              dirs: rConfig.dirs,
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
              await buildPkgJson(rConfig);
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
            const validationResults = await tryHandle(validateManifest)(
              ButteryManifest,
              {
                rConfig,
                options,
              }
            );
            if (validationResults.hasError) {
              throw LOG.fatal(validationResults.error);
            }

            // build and write the manifest to disk
            const buildResults = await tryHandle(buildManifest)(
              ButteryManifest,
              {
                rConfig,
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
