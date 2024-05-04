import type { Plugin } from "esbuild";

// TODO: Fix this doc
// A simple plugin that logs the output of the watch commands
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
