import type { Plugin } from "esbuild";

/**
 * This class helps create a plugin for esbuild that logs
 * the date, a generic name and then the number of times
 * that the build has re-built. It ignores a few repetitive
 * times that esbuild runs and then logs those details in a
 * string every time the files change in the build configurations.
 */
export class EsbuildPluginWatchLogger {
  private cliName: string;
  private dirname: string;
  private date: Intl.DateTimeFormat;
  private rebuildNumber: number;

  constructor({ cliName, dirname }: { cliName: string; dirname: string }) {
    this.cliName = cliName;
    this.dirname = dirname;
    this.rebuildNumber = 0;
    this.date = new Intl.DateTimeFormat("en", {
      dateStyle: "short",
    });
  }

  getPlugin(): Plugin {
    return {
      name: "watch-logger",
      setup: (build) => {
        build.onEnd(() => {
          this.rebuildNumber++;
          if (this.rebuildNumber <= 2) return;

          const now = this.date.format(new Date());
          console.log(
            `${now} [${this.cliName}] '${
              this.dirname
            }' changed Transpiling and re-building... x${
              this.rebuildNumber - 2
            }`
          );
        });
      },
    };
  }
}
