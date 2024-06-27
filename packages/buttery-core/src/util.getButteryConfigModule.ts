import { createHash } from "node:crypto";
import path from "node:path";
import type { BuildOptions } from "esbuild";
import esbuild from "esbuild";
import { LOG } from "./logger.js";
import type {
  ButteryConfig,
  GetButteryConfigOptions,
} from "./types.buttery-config";
import { getButteryConfigFile } from "./util.getButteryConfigFile.js";

const hashString = (input: string) => {
  return createHash("sha256").update(input).digest("hex");
};

// TODO: Add JSDoc
export async function getButteryConfigModule(
  directory: string | undefined,
  options?: GetButteryConfigOptions
): Promise<{ config: ButteryConfig; configPath: string; configDir: string }> {
  // Resolve the options
  const watch = options?.watch ?? false;
  const prompt = options?.prompt ?? false;
  const defaultConfig = options?.defaultConfig;

  try {
    // search for the config file starting with a directory or the current working directory
    const searchDirectory = directory ?? process.cwd();
    const butteryConfigFile = await getButteryConfigFile(searchDirectory, {
      prompt,
      defaultConfig,
    });

    // hash the file filename and create some paths
    const butteryConfigOutFilename = hashString(butteryConfigFile.path);
    const butteryConfigOutDir = path.resolve(import.meta.dirname, "./configs");
    const butteryConfigOutPath = path.resolve(
      butteryConfigOutDir,
      `./${butteryConfigOutFilename}.js`
    );

    try {
      const module = await import(`./configs/${butteryConfigOutFilename}.js`);
      return {
        config: module.default,
        configPath: butteryConfigFile.path,
        configDir: butteryConfigFile.directory,
      };
    } catch (error) {
      const esbuildOptions: BuildOptions = {
        entryPoints: [butteryConfigFile.path],
        bundle: true,
        platform: "node",
        target: ["node22.1.0"],
        format: "esm",
        outfile: butteryConfigOutPath,
        packages: "external",
        minify: !watch,
        tsconfigRaw: JSON.stringify(
          {
            extends: "@buttery/tsconfig/library",
          },
          null,
          2
        ),
      };

      if (watch) {
        LOG.watch("Listening to /.buttery/config for changes.");
        const context = await esbuild.context(esbuildOptions);
        await context.watch();
        const module = await import(`./configs/${butteryConfigOutFilename}.js`);
        const config = module.default as ButteryConfig;
        return {
          config,
          configPath: butteryConfigFile.path,
          configDir: butteryConfigFile.directory,
        };
      }

      LOG.debug(
        `Transpiling the /.buttery/config found in ${butteryConfigFile.path}...`
      );
      await esbuild.build(esbuildOptions);
      const module = await import(`./configs/${butteryConfigOutFilename}.js`);
      const config = module.default as ButteryConfig;

      return {
        config,
        configPath: butteryConfigFile.path,
        configDir: butteryConfigFile.directory,
      };
    }
  } catch (error) {
    throw LOG.fatal(new Error(error as string));
  }
}
