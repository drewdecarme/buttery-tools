import path from "node:path";
import type { ButteryConfigTokens } from "@buttery/core";
import { getLocalRootPath } from "./util.get-local-root-path";

export async function getResolvedVariables(configTokens: ButteryConfigTokens) {
  const tokensRootPath = await getLocalRootPath();

  const generatedTSFilesOutDir = path.resolve(
    tokensRootPath,
    configTokens?.importName
      ? `./.tokens/${configTokens.importName}/`
      : "./.tokens/"
  );

  const transpiledFilesOutDir = path.resolve(
    tokensRootPath,
    configTokens?.importName ? `./${configTokens.importName}/` : "./dist/"
  );

  const transpiledFilesOutFile = path.resolve(
    transpiledFilesOutDir,
    "./index.js"
  );

  const generatedTSFilesTSConfig = path.resolve(
    tokensRootPath,
    "./tsconfig.build.json"
  );

  return {
    tokensRootPath,
    generatedTSFilesOutDir,
    transpiledFilesOutDir,
    transpiledFilesOutFile,
    generatedTSFilesTSConfig
  };
}
