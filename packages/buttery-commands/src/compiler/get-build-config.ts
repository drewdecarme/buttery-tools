import path from "node:path";
import type { ResolvedButteryConfig } from "@buttery/core/config";
import type { BuildOptions } from "esbuild";
import type { ButteryCommandsBaseOptions } from "../options";
import type { ButteryCommandsDirectories } from "../utils/getButteryCommandsDirectories";
import { LOG, defaultEsbuildOptions } from "../utils/utils";
import { buildPkgJson } from "./build-pkgjson";

export async function getBuildConfig<T extends ButteryCommandsBaseOptions>(
  config: ResolvedButteryConfig<"commands">,
  dirs: ButteryCommandsDirectories,
  options: T & { isProd: boolean }
) {
  // We dynamically create our entry points up to 20 glob paths
  // If someone is creating more than 20 nested glob paths for their
  // command files then I feel like there are more serious problems
  // than being able to load them... :/
  //
  // The reason we try to evaluate on globs is that if we find that
  // a file is invalid or we want to add another file after the load
  // process starts, we can do that, esbuild will handle it, and then
  // we can create the manifest after we know all of the commands
  // are well formed
  const entryPoints = [...new Array(20)]
    .map((_, i) => {
      const numOfStars = i + 1;
      const levels = [...new Array(numOfStars)].map(() => "*").join(".");
      return `${dirs.commandsDir}/${levels}.ts`;
    })
    .concat(dirs.commandsDir.concat("/**/command.ts"));

  const build: BuildOptions = {
    ...defaultEsbuildOptions,
    logOverride: {
      "empty-glob": "silent",
    },
    entryPoints,
    outdir: dirs.binDir,
    minify: options.isProd,
    plugins: [
      {
        name: "esbuild-plugin-buttery-commands-resolve-command-files",
        setup(build) {
          build.onLoad({ filter: /.*/, namespace: "file" }, async (args) => {
            if (args.path.includes(dirs.commandsDir)) {
              const relPath = path.relative(dirs.commandsDir, args.path);
              console.log("command file", { relPath, args });
              const module = await import(args.path);
              console.log(module);
            }
            return null;
          });
        },
      },
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
        setup() {
          // we want to validate the commands when everything starts
          // so when the build ends, we know we have a well formed
          // commands structure to parse
          // build.onStart(async () => {
          //   try {
          //     await validateCommands(config, dirs);
          //   } catch (error) {
          //     LOG.error("Error when trying to enrich the package.json");
          //     throw LOG.fatal(new Error(String(error)));
          //   }
          // });
          // we want to build the manifest after we build the commands
          // so we can assemble the commands manifest with already transpiled
          // files.
          // build.onEnd(async () => {
          //   try {
          //     await buildManifest(config, dirs, options);
          //   } catch (error) {
          //     throw LOG.fatal(new Error(String(error)));
          //   }
          // });
        },
      },
    ],
  };

  return build;
}
