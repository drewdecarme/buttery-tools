import esbuild from "esbuild";

import { writeFile } from "node:fs/promises";
import path from "node:path";

import { LOG } from "../private/index.js";
import { hashString } from "../utils/node/util.node.hash-string.js";

/**
 * Provided a result from esbuild, this function will parse the buffer
 * of the contents of the output, read the contents into memory and create
 * a virtual module to then reconcile a compiled .buttery/config file.
 */
async function parseAndCacheEsbuildResult<T extends Record<string, unknown>>(
  esbuildResult: Awaited<ReturnType<typeof transpileConfig>>,
  configNamespace: string,
  storePath: string
): Promise<T> {
  if (!esbuildResult) {
    throw "The result of the build process is invalid.";
  }
  LOG.debug("Converting esbuild result into virtual module...");
  try {
    const outputFile = esbuildResult.outputFiles[0];
    const configContent = Buffer.from(outputFile.contents).toString("utf-8");

    // create a hash of the content
    const configContentHash = hashString(configContent);
    const configPath = path.resolve(
      storePath,
      `buttery-${configNamespace}-config-${configContentHash}.js`
    );
    await writeFile(configPath, configContent, { encoding: "utf8" });

    const configModule = await import(`file://${configPath}`);

    if (!configModule.default) {
      throw "Cannot parse the default export out of the '.buttery/config.' Check that your .buttery/config has the proper syntax and there aren't any errors.";
    }
    LOG.debug("Converting esbuild result into virtual module... done.");
    LOG.trace(JSON.stringify(configModule.default, null, 2));
    return configModule.default;
  } catch (error) {
    throw LOG.fatal(
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
async function transpileConfig(configFilePath: string, configFileName: string) {
  try {
    LOG.debug(`Transpiling the "${configFileName}" file...`);
    const result = await esbuild.build({
      entryPoints: [configFilePath],
      bundle: true,
      platform: "node",
      target: ["esnext"],
      format: "esm",
      packages: "external",
      minify: true,
      write: false,
      tsconfigRaw: JSON.stringify({
        extends: "@buttery/tsconfig/library",
      }),
    });
    LOG.debug(`Transpiling the "${configFileName}" file... done.`);
    return result;
  } catch (error) {
    new Error(
      `Fatal error when trying to transpile and build the "${configFileName}" file: ${error}`
    );
  }
}

/**
 * Provided some resolved paths, this function will build the '.buttery/config' file
 * into memory and return it.
 */
export async function parseButteryConfig<
  T extends Record<string, unknown>
>(options: {
  configFilePath: string;
  configNamespace: string;
  configFileName: string;
  storePath: string;
}): Promise<T> {
  const esbuildResult = await transpileConfig(
    options.configFilePath,
    options.configFileName
  );
  const config = await parseAndCacheEsbuildResult<T>(
    esbuildResult,
    options.configNamespace,
    options.storePath
  );
  return config;
}
