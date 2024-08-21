import path from "node:path";
import type { Plugin } from "vite";

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
  console.log({ options });
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
          return `'${transformedPath}'`;
        }
      );

      return {
        code: transformedStrings,
        map: null, // Provide source map if necessary
      };
    },
  };
}
