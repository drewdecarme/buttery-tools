import { readFileSync } from "node:fs";
import { parse } from "@babel/parser";

/**
 * Parse the contents of a file into an AST.
 * @param filePath The path of the file to parse.
 * @returns The parsed AST of the file.
 */
export const parseFile = (filePath: string) => {
  const code = readFileSync(filePath, "utf-8");
  return parse(code, {
    sourceType: "module",
    plugins: [
      "typescript", // Enable TypeScript syntax parsing
      "jsx" // Enable JSX syntax parsing
    ]
  });
};
