import { readFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

type VitePluginInteractivePreviewOptions = {
  componentRootDir: string;
  previewComponentPath: string;
};

/**
 * Inline's a component preview and it's code within a code comment block
 * in any MDX document file relative to the options.componentRootDir
 */
export function vitePluginInteractivePreview(
  options: VitePluginInteractivePreviewOptions
): Plugin {
  return {
    enforce: "pre",
    name: "buttery-tools-mdx-transform-code",
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
        const transformedPath = path.join(options.componentRootDir, p1);
        const codeBlock = readFileSync(transformedPath, { encoding: "utf8" });
        const newCode = `

import { default as InteractivePreviewComponent${matchNum} } from "${options.previewComponentPath}";
import { default as Component${matchNum} } from "${transformedPath}";

<InteractivePreviewComponent${matchNum}>
  <Component${matchNum} />
  \`\`\`tsx
  ${codeBlock}
  \`\`\`
</InteractivePreviewComponent${matchNum}>

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
          const transformedPath = path.join(options.componentRootDir, p1);
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
