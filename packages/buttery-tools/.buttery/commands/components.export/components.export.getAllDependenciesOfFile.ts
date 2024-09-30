import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { traverse } from "@babel/core";
import { parse } from "@babel/parser";
import { printAsBullets } from "@buttery/logger";
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
        `Cannot get component path: Checked the following files:${printAsBullets(possiblePaths)}`
      );
      throw `Cannot get the "${componentName}" component path when building the dependency graph. This should not have happened. Please log a Github Issue`;
    }
    return componentPath;
  } catch (error) {
    throw LOG_CLI.fatal(new Error(error as string));
  }
};

/**
 * Based upon the directory name and file name, assemble a path and
 * recursively sort through all of the dependencies of each file that it comes
 * into contact with.
 */
export async function getAllDependenciesOfFile(
  dependencies: Set<string>,
  componentDir: string,
  componentName: string
) {
  const rootPath = path.join(componentDir, componentName);
  const pathsToCheck = [".tsx", ".ts"].map((ext) => rootPath.concat(ext));
  LOG_CLI.debug(`Checking paths:${printAsBullets(pathsToCheck)}`);
  const mainComponentPath = getComponentPath(pathsToCheck, componentName);

  LOG_CLI.debug(`Resolving dependencies for: ${componentName}`);

  const ast = parseFile(mainComponentPath);
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      const importPath = node.source.value;
      if (
        importPath.startsWith("../") &&
        !dependencies.has(importPath) &&
        !importPath.includes("../utils")
      ) {
        LOG_CLI.debug(
          `Resolving dependencies for: ${componentName}: ${importPath}`
        );
        const innerDependencyDir = path.resolve(componentDir, importPath);
        const innerDependencyFileName = importPath.split("../")[1];
        dependencies.add(innerDependencyFileName);
        getAllDependenciesOfFile(
          dependencies,
          innerDependencyDir,
          innerDependencyFileName
        );
      }
    }
  });
}
