import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { LOG } from "../_logger";
import type { ButteryTokensDirectories } from "./tokens.getButteryTokensDirectories";

/**
 * Enrich the output directory with files for proper imports
 * and types
 */
export async function buildMakeUtilsCreateTypes(
  dirs: ButteryTokensDirectories
) {
  LOG.debug(
    `Enriching the utils output directory with TS assets: ${dirs.output.path}`
  );

  // write the files needed to import from another library
  const importFileContent = `export * from "../${path.relative(dirs.root.path, dirs.output.path)}/index.js";\n`;
  const tsConfigFileContent = JSON.stringify(
    { extends: path.resolve("../../../tsconfig.build-lib.json") },
    null,
    2
  );
  await mkdir(dirs.output.path, { recursive: true }); // since it's a dir we need to make sure it's there.
  await Promise.all([
    writeFile(dirs.root.tsConfigPath, tsConfigFileContent),
    ...[".js", ".d.ts"].map((extension) =>
      writeFile(
        path.resolve(dirs.output.path, "index".concat(extension)),
        importFileContent
      )
    )
  ]);
}
