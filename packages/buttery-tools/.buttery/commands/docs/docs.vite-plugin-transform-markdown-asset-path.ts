import type { Plugin } from "vite";

/**
 * This plugin scans .md files and transforms the
 * asset paths from ./public/... to /... during the build process.
 */
export function transformMarkdownAssetPath(): Plugin {
  return {
    enforce: "pre",
    name: "markdown-image-path-transform",
    transform(code: string, id: string) {
      if (id.endsWith(".md")) {
        // Replace the ./public with /public URL
        const transformedCode = code.replace(
          /!\[([^\]]*)\]\(\.\/public\/([^)]*)\)/g,
          "![$1](/$2)"
        );
        return {
          code: transformedCode,
          map: null
        };
      }
      return {
        code,
        map: null
      };
    }
  };
}
