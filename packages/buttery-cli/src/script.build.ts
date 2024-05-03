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

    // -- SRC --
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

    // -- PACKAGE.JSON --
    // In order to invoke the CLI we need to add a few properties
    // from the `buttery.config.(mjs|cjs|js)` file into the `package.json`
    // file. This will allow whoever consumes the CLI to instantiate it
    // from the command line without having to worry about manually adding
    // those properties to their `package.json`
    const packageJsonPath = path.resolve(config.root, "./package.json");
    const packageJsonBuffer = await readFile(packageJsonPath);
    const packageJsonString = packageJsonBuffer.toString();
    const packageJson = JSON.parse(packageJsonString);
    const packageJsonCLIProperties = {
      type: "module",
      types: "./dist/index.d.ts",
      bin: {
        [config.name]: "./bin/index.js",
      },
    };
    Object.entries(packageJsonCLIProperties).forEach(([key, value]) => {
      if (!(key in packageJson)) {
        console.log(`Adding '${key}' to package.json file.`);
        packageJson[key] = value;
      }
    });
    await writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf-8"
    );

    // -- COMMANDS --
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

    let rebuildNumber = 0;

    // A simple plugin that logs the output of the watch commands
    const watchPlugin: esbuild.Plugin = {
      name: "example",
      setup(build) {
        build.onEnd(() => {
          rebuildNumber++;
          if (rebuildNumber <= 2) return;
          const dateFormatter = new Intl.DateTimeFormat("en", {
            dateStyle: "short",
          });
          const now = dateFormatter.format(new Date());
          console.log(
            `${now} [${config.name}] commands changed. Rebuilding x${
              rebuildNumber - 2
            }`
          );
        });
      },
    };

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

    // Run in development mode if our watch command exists.
    if (parsedArgs.watch) {
      console.log("Running Buttery CLI Builder in DEV mode...");
      const context = await esbuild.context({
        ...esbuildArgs,
        plugins: [watchPlugin],
      });
      await context.watch();
    }
    await esbuild.build(esbuildArgs);
  } catch (error) {
    throw new Error(error as string);
  }
}
