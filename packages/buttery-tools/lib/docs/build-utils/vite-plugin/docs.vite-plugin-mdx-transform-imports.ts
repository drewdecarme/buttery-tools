import path from "node:path";
import type { Plugin } from "vite";
import { LOG_CLI } from "../../../logger/loggers";

type MdxTransformImportsOptions = {
  rootPath: string;
};

/**
 * A Vite plugin that searches for imports that being with the ~ and
 * then transforms them
 */
export function mdxTransformImports(
  options: MdxTransformImportsOptions
): Plugin {
  return {
    enforce: "pre",
    name: "vite-plugin-mdx-transform-imports",
    transform(code: string, id: string) {
      if (!id.endsWith(".mdx")) return;
      // // Transform strings with paths starting with tilde (~)
      const transformedStrings = code.replace(
        /['"](~\/[^'"]+)['"]/g,
        (_match, p1) => {
          const relPath = p1.split("~")[1];
          const transformedPath = path.join(options.rootPath, relPath);
          LOG_CLI.debug("Transforming mdx import path", {
            originalPath: p1,
            transformedPath
          });
          return `'${transformedPath}'`;
        }
      );

      return {
        code: transformedStrings,
        map: null // Provide source map if necessary
      };
    }
  };
}
