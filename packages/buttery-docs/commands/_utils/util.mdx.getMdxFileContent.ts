import { readFile } from "node:fs/promises";
import matter from "gray-matter";

export async function getMdxFileContent(filepath: string) {
  const rawMdxContent = await readFile(filepath, { encoding: "utf8" });

  const { data: frontmatter, content: mdxContent } = matter(rawMdxContent);
  return {
    frontmatter,
    mdxContent,
  };
}
