import { readFileSync, statSync } from "node:fs";
import { glob } from "node:fs/promises";
import path from "node:path";
import { traverse } from "@babel/core";
import { parse } from "@babel/parser";
import { LOG_CLI } from "../../../lib/logger/loggers";

/**
 * Parse the contents of a file into an AST.
 * @param filePath The path of the file to parse.
 * @returns The parsed AST of the file.
 */
const parseFile = (filePath: string) => {
  const code = readFileSync(filePath, "utf-8");
  return parse(code, {
    sourceType: "module",
    plugins: [
      "typescript", // Enable TypeScript syntax parsing
      "jsx" // Enable JSX syntax parsing
    ]
  });
};

const logBullets = (strArr: string[]) =>
  `${strArr.map((path) => `\n\t- ${path}`)}`;

const getComponentPath = (possiblePaths: string[], componentName: string) => {
  try {
    const componentPath = possiblePaths.reduce<string | undefined>(
      (accum, possiblePath) => {
        if (statSync(possiblePath, { throwIfNoEntry: false })) {
          return possiblePath;
        }
        return accum;
      },
      undefined
    );

    if (!componentPath) {
      LOG_CLI.error(
        `Cannot get component path: Checked the following files:${logBullets(possiblePaths)}`
      );
      throw `Cannot get the "${componentName}" component path when building the dependency graph. This should not have happened. Please log a Github Issue`;
    }
    return componentPath;
  } catch (error) {
    throw LOG_CLI.fatal(new Error(error as string));
  }
};

export async function getAllDependenciesOfFile(
  componentDir: string,
  componentName: string
) {
  const rootPath = path.join(componentDir, componentName);
  const pathsToCheck = [".tsx", ".ts"].map((ext) => rootPath.concat(ext));
  LOG_CLI.debug(`Checking paths:${logBullets(pathsToCheck)}`);
  const mainComponentPath = getComponentPath(pathsToCheck, componentName);

  LOG_CLI.debug(`Resolving dependencies for: ${componentName}`);

  const dependencies = new Set();
  const ast = parseFile(mainComponentPath);
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      const importPath = node.source.value;
      if (importPath.startsWith("../") && !dependencies.has(importPath)) {
        LOG_CLI.debug(
          `Resolving dependencies for: ${componentName}: ${importPath}`
        );
        const innerDependencyDir = path.resolve(componentDir, importPath);
        const innerDependencyFileName = importPath.split("../")[1];
        dependencies.add(importPath);
        getAllDependenciesOfFile(innerDependencyDir, innerDependencyFileName);
      }
    }
  });
  console.log({ dependencies: dependencies.values() });
}
