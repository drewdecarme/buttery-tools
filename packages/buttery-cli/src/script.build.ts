// TODO: Work on removing some easily replicated packages
// to reduce dependency size
import { cosmiconfig } from "cosmiconfig";
import path from "node:path";
import { CLIConfig } from "../types";
import { glob } from "glob";
import * as esbuild from "esbuild";
import { rimraf } from "rimraf";
import type { BuildArgs } from "../scripts/util.parse-build-args";
import handlebars from "handlebars";
import { writeFile, readFile, rm } from "node:fs/promises";

const __dirname = import.meta.dirname;

/**
 * This is the main build command that is used to build the
 * the consumer CLI.
 *
 * This has been abstracted out into it's own central function in
 * order to properly dog-food the build process while building
 * the CLI that runs this process. In essence, this command
 * builds the CLI that the consumer is creating AND also
 * builds this CLI that creates the CLI that the consumer
 * is creating. A little CLI inception... if you will ;)
 */
export async function build(parsedArgs: BuildArgs) {
  try {
    // get the buttery configuration file
    const explorer = cosmiconfig("buttery");
    const configResult = await explorer.search();
    if (!configResult) throw new Error("Cannot parse configuration result.");
    const config = configResult.config as CLIConfig;

    /**
     * Process
     * 1 - Build the /src
     * 1.0 - Delete the src/index.ts file
     * 1.1 - Process the template with the config
     * 1.2 - Build the src into the bin folder
     * 2 - Build the /commands
     */

    // force remove the index.ts file

    // delete the existing index.ts file, compile the index template and write it
    // to the src directory so it can be built again.
    await rm(path.resolve(__dirname, "./index.ts"), {
      force: true,
    });
    const entryTemplateFile = await readFile(
      path.resolve(__dirname, "./template.index.hbs")
    );
    const template = handlebars.compile<{ cli_name: string }>(
      entryTemplateFile.toString()
    )({
      cli_name: config.name,
    });
    await writeFile(path.resolve(__dirname, "./index.ts"), template, "utf-8");

    // Glob the selected files from src and build
    // this is done first so this CLI can be instantiated from here and when installed elsewhere
    const srcFiles = [path.resolve(__dirname, "./index.ts")];
    const srcFilesGlob = glob.sync(srcFiles, { follow: false });
    const srcFilesOutDir = path.resolve(__dirname, "../bin");
    await esbuild.build({
      entryPoints: srcFilesGlob,
      bundle: true,
      minify: true,
      format: "esm",
      platform: "node",
      target: ["node20.11.1"],
      packages: "external",
      outdir: srcFilesOutDir,
    });

    // Gather the commands via glob, delete the old ones and build
    // the new ones to the bin. This makes sure that any commands from
    // a previous development instance are completely wiped out and
    // refreshed.
    const commandFilesDir = path.resolve(config.root, "./commands");
    const commandFiles = glob.sync(path.resolve(commandFilesDir, "./*.ts"), {
      follow: false,
    });
    const outDir = path.join(config.root, "./bin/commands");
    const commandOutputFiles = glob.sync(path.resolve(outDir, "./*.js"), {
      follow: false,
    });
    await rimraf(commandOutputFiles);

    // Copy the files in the entry template
    // and replace some of the strings with the values
    // from the buttery config. Namely the CLI name so someone
    // can configure & instantiate the CLI that their building with the name
    // that they want.

    // TODO: Write all of the files to a temporary directory or something like that
    // so ESBuild can transpile everything after the template has been created.
    // First, ensure the temp directory exists, create it and then fully replace
    // the file contents with the stringified buffer
    // Supply those temp files to the build command so they can be transpiled
    // and built into the bin directory

    // Create the build options
    const esbuildArgs: esbuild.BuildOptions = {
      entryPoints: [...commandFiles],
      bundle: true,
      minify: true,
      format: "esm",
      platform: "node",
      target: ["node20.11.1"],
      packages: "external",
      outdir: outDir,
    };

    if (parsedArgs.watch) {
      console.log("Running Buttery CLI Builder in DEV mode...");
      const context = await esbuild.context(esbuildArgs);
      await context.watch();
    }
    await esbuild.build(esbuildArgs);
  } catch (error) {
    throw new Error(error as string);
  }
}
