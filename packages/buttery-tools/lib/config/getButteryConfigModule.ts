import esbuild from "esbuild";

import { Script, createContext } from "node:vm";
import { LOG_CLI } from "../logger";
import type { ButteryConfig } from "./buttery-config.types";

/**
 * Provided a result from esbuild, this function will parse the buffer
 * of the contents of the output, read the contents into memory and create
 * a virtual module to then reconcile a compiled .buttery/config file.
 */
async function convertEsbuildResultIntoConfig(
  esbuildResult: Awaited<ReturnType<typeof transpileConfig>>
): Promise<ButteryConfig> {
  if (!esbuildResult) {
    throw "The result of the build process is invalid.";
  }
  try {
    const outputFile = esbuildResult.outputFiles[0];
    const moduleContent = Buffer.from(outputFile.contents).toString("utf-8");

    // Create a sandbox environment to execute the module
    const sandbox = {
      exports: {}, // To capture the exports from the module
      module: {
        exports: {
          default: {}
        }
      }
    };

    // Create a script from the module content
    const script = new Script(moduleContent);

    // Run the script in the sandbox environment
    const scriptContent = createContext(sandbox);
    script.runInContext(scriptContent);

    if (!sandbox.module.exports.default) {
      throw "Cannot parse the default export off of the .buttery/config. Check that your .buttery/config has the property syntax and there aren't any errors.";
    }
    console.log(JSON.stringify(sandbox.module.exports.default, null, 2));
    return sandbox.module.exports.default;
  } catch (error) {
    throw LOG_CLI.fatal(
      new Error(
        `Fatal error when trying to parse the built '.buttery/config' file: ${error}`
      )
    );
  }
}

/**
 * Provided a configuration file path, this function will transpile
 * the esbuild path and bundle it together so if there are dependencies
 * that need to be added to create a full build, they can be imported
 * into the .buttery/config with ease and without concern.
 */
async function transpileConfig(configFilePath: string) {
  try {
    LOG_CLI.debug("Transpiling the '.buttery/config' file...");
    // use the rebuild API since a file watcher will be implemented
    // to re-call this function when things change in the app
    const context = await esbuild.context({
      entryPoints: [configFilePath],
      bundle: true,
      platform: "node",
      target: ["esnext"],
      format: "cjs",
      packages: "external",
      minify: true,
      write: false,
      tsconfigRaw: JSON.stringify({
        extends: "@buttery/tsconfig/library"
      })
    });
    const result = await context.rebuild();
    LOG_CLI.debug("Transpiling the '.buttery/config' file... done.");
    return result;
  } catch (error) {
    new Error(
      `Fatal error when trying to transpile and build the '.buttery/config' file: ${error}`
    );
  }
}

/**
 * Provided some resolved paths, this function will build the '.buttery/config' file
 * into memory and return it.
 */
export async function getButteryConfigModule(options: {
  butteryConfigFilePath: string;
  butteryStoreDirectoryPath: string;
  watch?: boolean;
}): Promise<ButteryConfig> {
  const esbuildResult = await transpileConfig(options.butteryConfigFilePath);
  const config = await convertEsbuildResultIntoConfig(esbuildResult);
  return config;
}
