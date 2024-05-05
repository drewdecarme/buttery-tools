import type { Plugin } from "esbuild";
import { execSync } from "node:child_process";

/**
 * TODO: Fix comment
 */
export class EsbuildPluginTypescriptCompiler {
  private tsConfigPath: string;

  constructor({ tsConfigPath }: { tsConfigPath: string }) {
    this.tsConfigPath = tsConfigPath;
  }

  getPlugin(): Plugin {
    const tsconfigPath = this.tsConfigPath;
    return {
      name: "typescript",
      setup(build) {
        build.onEnd((result) => {
          if (result.errors.length > 0) return;
          execSync(`tsc --project ${tsconfigPath}`);
        });
      },
    };
  }
}
