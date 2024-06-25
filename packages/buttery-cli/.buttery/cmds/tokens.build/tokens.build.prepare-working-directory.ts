import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ResolvedButteryConfig } from "@buttery/core";
import type { ButteryTokensDirectories } from "../tokens/tokens.getButteryTokensDirectories";
import { LOG_TOKENS } from "../tokens/tokens.logger";

export async function prepareWorkingDirectory(
  config: ResolvedButteryConfig<"tokens">,
  dirs: ButteryTokensDirectories,
  options?: { isLocal?: boolean }
) {
  const isLocal = options?.isLocal ?? false;

  // create a unique directory in the working directory
  // make a working dir we can always expect in any resolved tokens
  // directory. This working dir will enable us to build some files to
  // make imports work the way we want to.
  await mkdir(dirs.working.path, { recursive: true });

  if (isLocal) {
    LOG_TOKENS.info(
      "Build is being run locally. Skipping import file creation."
    );
    return;
  }

  // write the files needed to import from another library
  const importFileContent = `export * from "./${path.relative(dirs.package, dirs.working.path)}/index.js";\n`;
  const tsConfigFileContent = JSON.stringify(
    { extends: "@buttery/tsconfig/library" },
    null,
    2
  );
  await Promise.all([
    writeFile(dirs.templateTSConfig, tsConfigFileContent),
    ...[".js", ".d.ts"].map((extension) =>
      writeFile(
        path.resolve(dirs.package, dirs.working.name.concat(extension)),
        importFileContent
      )
    ),
  ]);
}
