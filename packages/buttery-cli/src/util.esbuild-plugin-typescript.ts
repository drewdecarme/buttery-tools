import type { Plugin } from "esbuild";
import { execSync } from "node:child_process";

/**
 * This class helps create a plugin for esbuild that logs
 * the date, a generic name and then the number of times
 * that the build has re-built. It ignores a few repetitive
 * times that esbuild runs and then logs those details in a
 * string every time the files change in the build configurations.
 */
export class EsbuildPluginWatchLogger {
  private tsConfigPath: string;

  constructor({ tsConfigPath }: { tsConfigPath: string }) {
    this.tsConfigPath = tsConfigPath;
  }

  getPlugin(): Plugin {
    return {
      name: "typescript",
      setup(build) {
        build.onEnd((result) => {
          if (result.errors.length > 0) return;
          execSync("tsc");
        });
      },
    };
  }
}
