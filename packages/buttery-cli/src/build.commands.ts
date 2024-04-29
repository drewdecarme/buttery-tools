import { cosmiconfig } from "cosmiconfig";
import path from "node:path";
import { CLIConfig } from "./types";
import { glob } from "glob";
import * as esbuild from "esbuild";
import { rimraf } from "rimraf";
import { processBuildArgs } from "./util.parse-build-args";

export async function buildCommands(args: typeof process.argv) {
  const developmentArgs = processBuildArgs(args);

  console.log(developmentArgs);

  try {
    const explorer = cosmiconfig("buttery");

    const configResult = await explorer.search();
    if (!configResult) throw new Error("Cannot parse configuration result.");
    const config = configResult.config as CLIConfig;

    const commandFilesDir = path.resolve(config.root, "./commands");
    const commandFiles = glob.sync(path.resolve(commandFilesDir, "./*.ts"), {
      follow: false,
    });
    const outDir = path.join(config.root, "./bin/commands");
    const commandOutputFiles = glob.sync(path.resolve(outDir, "./*.js"), {
      follow: false,
    });

    await rimraf(commandOutputFiles);

    await esbuild.build({
      entryPoints: commandFiles,
      bundle: true,
      minify: true,
      format: "esm",
      platform: "node",
      target: ["node20.11.1"],
      packages: "external",
      outdir: outDir,
    });
  } catch (error) {
    throw new Error(error as string);
  }
}
