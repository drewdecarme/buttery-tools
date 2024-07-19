import path from "node:path";
import type { Plugin } from "vite";

interface MdxImportTransformOptions {
  rootPath: string;
}

export function mdxImportTransform(options: MdxImportTransformOptions): Plugin {
  return {
    name: "vite-plugin-mdx-import-transform",
    transform(code: string, id: string) {
      if (!id.endsWith(".mdx")) return;

      // Apply your transformation logic here
      const transformedCode = code.replace(
        /import\s+(\w+|\{[\w\s,]+\})\s+from\s+['"](~\/[^'"]+)['"]/g,
        (match, p1, p2) => {
          //   const absImportPath = path.resolve(options.rootPath);
          console.log({ match, p1, p2 });

          const pathSansTilde = p2.split("~")[1];
          const transformedPath = path.join(options.rootPath, pathSansTilde);
          return `import ${p1} from '${transformedPath}'`;
        }
      );

      return {
        code: transformedCode,
        map: null, // Provide source map if necessary
      };
    },
  };
}
