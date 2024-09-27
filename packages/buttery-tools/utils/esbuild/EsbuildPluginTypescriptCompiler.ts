import { execSync } from "node:child_process";
import type { Plugin } from "esbuild";
import butteryLibraryConfig from "../../tsconfig.library.build.json" with {
  type: "json"
};

/**
 * An esbuild plugin that runs the typescript compiler
 * given the path of a tsconfig.json. This is intended to
 * programmatically invoke the TypeScript compiler using
 * node and not the CLI. This can be used for esbuild
 * processes and CLI actions to build a distribution
 * directory AND it's types. Note that this will slow
 * down he build process, but is necessary if you need to create
 * any declaration files.
 */
export class EsbuildPluginTypescriptCompiler {
  private tsConfigPath: string;

  constructor({ tsConfigPath }: { tsConfigPath: string }) {
    this.tsConfigPath = tsConfigPath;
  }

  getPlugin(options?: {
    filePathToTranspile?: string;
    extraArgs?: string[];
  }): Plugin {
    const tsconfigPath = this.tsConfigPath;
    return {
      name: "typescript",
      setup(build) {
        build.onEnd((result) => {
          if (result.errors.length > 0) return;

          const extraArgs = (options?.extraArgs ?? []).join(" ");

          if (options?.filePathToTranspile) {
            const compilerOptions = Object.entries(
              butteryLibraryConfig.compilerOptions
            ).reduce(
              (accum, [key, value]) => accum.concat(`--${key} ${value} `),
              ""
            );
            try {
              execSync(
                `tsc ${options.filePathToTranspile} ${compilerOptions} ${extraArgs}`
              );
            } catch (error) {
              throw new Error(error as string);
            }

            return;
          }

          try {
            execSync(`tsc --project ${tsconfigPath} `);
          } catch (error) {
            throw new Error(error as string);
          }
        });
      }
    };
  }
}
