import { readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

export const butteryConfigParseFile = async (
  configFilePath: string
): Promise<string> => {
  const file = await readFile(configFilePath, "utf-8");
  const isFileEmpty = file.length === 0;

  if (isFileEmpty) {
    throw new Error(
      `Found "config.ts" file at: '${configFilePath}'. However, this file is empty. Please add your config.`
    );
  }

  const isTsFile = path.extname(configFilePath) === ".ts";

  if (isTsFile) {
    const transpiledContent = ts.transpileModule(file, {
      compilerOptions: {
        module: ts.ModuleKind.ES2022,
        target: ts.ScriptTarget.ES2022,
      },
    });
    return transpiledContent.outputText;
  }

  return file;
};
