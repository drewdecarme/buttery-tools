import { createHash } from "node:crypto";
import path from "node:path";
import { build } from "esbuild";

const contentHash = (input: string) => {
  return createHash("sha256").update(input).digest("hex");
};

/**
 * Creates a hash of the raw buttery config code and then attempts to import a temporary
 * file named after that hash. If that temp file doesn't exist, we bundle the
 * file using esbuild and then import the module.
 */
export async function butteryConfigGetModule(butteryConfigFile: {
  path: string;
  content: string;
}) {
  // create a hash of the file string
  const outFileName = contentHash(butteryConfigFile.content);
  const outDir = path.resolve(import.meta.dirname, "./temp");
  const outFilePath = path.resolve(outDir, `./${outFileName}.js`);
  // TODO: Change this so ESBuild doesn't have to run every time
  // export something like 'saveConfigFile' and have it save to the temp

  await build({
    entryPoints: [butteryConfigFile.path],
    bundle: true,
    platform: "node",
    target: ["node22.1.0"],
    format: "esm",
    outfile: outFilePath,
    packages: "external",
    tsconfigRaw: JSON.stringify(
      {
        extends: "@buttery/tsconfig/library",
      },
      null,
      2
    ),
  });
  const module = await import(`./temp/${outFileName}.js`); // done this way for static vite dynamic importing
  return module.default;

  // try {
  //   const module = await import(`./temp/${outFileName}.js`); // done this way for static vite dynamic importing
  //   return module.default;
  // } catch (error) {
  //   console.log("STUFF");
  //   LOG.debug("Config file has changed... re-compiling config file...");
  //   await build({
  //     entryPoints: [butteryConfigFile.path],
  //     bundle: true,
  //     platform: "node",
  //     target: ["node22.1.0"],
  //     format: "esm",
  //     outfile: outFilePath,
  //     packages: "external",
  //     tsconfigRaw: `{
  //       "extends": "@buttery/tsconfig/library"
  //     }`,
  //   });
  //   LOG.debug("Config file has changed... re-compiling config file... done.");
  //   const module = await import(`./temp/${outFileName}.js`); // done this way for static vite dynamic importing
  //   return module.default;
  // }
}
