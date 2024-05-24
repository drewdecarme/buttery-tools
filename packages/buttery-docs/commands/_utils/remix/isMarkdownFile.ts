export function isMarkdownFile(filepath: string) {
  return filepath.endsWith(".md") || filepath.endsWith(".mdx");
}
