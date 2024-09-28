import { readFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

type MdxTransformCodeExamplesOptions = {
  rootPath: string;
};

export function mdxTransformCodeExamples(
  options: MdxTransformCodeExamplesOptions
): Plugin {
  return {
    enforce: "pre",
    name: "vite-plugin-mdx-transform-code",
    transform(code: string, id: string) {
      if (!id.endsWith(".mdx")) return;

      /**
       * Adjusted regex to capture everything after example: until example:end
       *
       * TODO: This needs to be fixed to fix any issues
       */
      let matchNum = 1;
      const regex = /\{\/\* example:"([^"]+)" \*\/\}/g;
      const transformedPreview = code.replace(regex, (_match, p1) => {
        const transformedPath = path.join(options.rootPath, p1);
        const previewBlockPath = path.join(
          options.rootPath,
          "/.buttery/docs-components/docs/PreviewBlock.tsx"
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

      // const transformedPreview = code;

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
        map: null // Provide source map if necessary
      };
    }
  };
}
