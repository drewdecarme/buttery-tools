import { cosmiconfig } from "cosmiconfig";
import path from "node:path";
// import { fileURLToPath } from "node:url";
import { CLIConfig } from "./types";
import { glob } from "glob";
import * as esbuild from "esbuild";
import { rimraf } from "rimraf";

// const __dirname = fileURLToPath(new URL(".", import.meta.url));

export async function buildCli() {
  try {
    const explorer = cosmiconfig("butter");

    const configResult = await explorer.search();
    if (!configResult) throw new Error("Cannot parse configuration result.");
    const config = configResult.config as CLIConfig;

    const commandFilesDir = path.resolve(config.root, "./commands");
    const commandFiles = glob.sync(path.resolve(commandFilesDir, "./*.ts"), {
      follow: false,
    });

    await rimraf(commandFilesDir.concat("/*.js"), { glob: true });

    await esbuild.build({
      entryPoints: commandFiles,
      bundle: true,
      minify: true,
      sourcemap: true,
      format: "esm",
      platform: "node",
      target: ["node20.11.1"],
      packages: "external",
      outdir: path.join(config.root, "./bin/commands"),
    });
  } catch (error) {
    throw new Error(error as string);
  }
}
