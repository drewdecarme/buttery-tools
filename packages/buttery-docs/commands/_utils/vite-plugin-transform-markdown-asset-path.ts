/**
 * This plugin scans .md files and transforms the
 * asset paths from ./public/... to /... during the build process.
 */
export function transformMarkdownAssetPath() {
  return {
    name: "markdown-image-path-transform",
    transform(code: string, id: string) {
      if (id.endsWith(".md")) {
        // Replace the image URL
        const transformedCode = code.replace(
          /!\[([^\]]*)\]\(\.\/public\/([^)]*)\)/g,
          "![$1](/$2)"
        );
        return {
          code: transformedCode,
          map: null,
        };
      }
    },
  };
}
