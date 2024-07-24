import { readFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

type MdxImportTransformOptions = {
  rootPath: string;
};

export function mdxImportTransform(options: MdxImportTransformOptions): Plugin {
  return {
    enforce: "pre",
    name: "vite-plugin-mdx-import-transform",
    transform(code: string, id: string) {
      if (!id.endsWith(".mdx")) return;

      let matchNum = 1;

      // Adjusted regex to capture everything after example: until example:end
      const regex = /\{\/\* example:"([^"]+)" \*\/\}/g;
      const transformedPreview = code.replace(regex, (_match, p1) => {
        const transformedPath = path.join(options.rootPath, p1);
        const previewBlockPath = path.join(
          options.rootPath,
          "/src/docs/PreviewBlock.tsx"
        );
        const codeBlock = readFileSync(transformedPath, { encoding: "utf8" });
        const newCode = `

import { default as PreviewBlock${matchNum} } from "${previewBlockPath}";
import { default as Component${matchNum} } from "${transformedPath}";

<PreviewBlock${matchNum}>
  <Component${matchNum} />
  \`\`\`tsx
  ${codeBlock}
  \`\`\`
</PreviewBlock${matchNum}>

`;
        matchNum++;
        return newCode;
      });

      // Apply your transformation logic here
      // const transformedImports = code.replace(
      //   /import\s+(\w+|\{[\w\s,]+\})\s+from\s+['"](~\/[^'"]+)['"]/g,
      //   (_match, p1, p2) => {
      //     return `import ${p1} from '${transformedPath}'`;
      //   }
      // );

      // // Transform strings with paths starting with tilde (~)
      // const transformedStrings = transformedImports.replace(
      //   /['"](~\/[^'"]+)['"]/g,
      //   (match, p1) => {
      //     const transformedPath = getTransformedPath(p1, options);
      //     return `'${transformedPath}'`;
      //   }
      // );

      // Adjusted regex to capture everything after example: until example:end
      const fenceRegex = /\{\/\* fence:"([^"]+)" \*\/\}/g;
      const transformedFence = transformedPreview.replace(
        fenceRegex,
        (_match, p1) => {
          const transformedPath = path.join(options.rootPath, p1);
          const codeBlock = readFileSync(transformedPath, { encoding: "utf8" });
          return `
\`\`\`tsx
  ${codeBlock}
  \`\`\`
`;
        }
      );

      return {
        code: transformedFence,
        map: null, // Provide source map if necessary
      };
    },
  };
}