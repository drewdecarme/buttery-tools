import { readFile } from "node:fs/promises";
import matter from "gray-matter";
import type { FileObj } from "./shared.types";
import { parseMDXFileContent } from "./util.mdx.parseMDXFileContent";
import { parseMDXFileName } from "./util.mdx.parseMDXFilename";
import { parseMDXFileFrontmatter } from "./util.mdx.parseMdxFileFrontmatter";

export const parseMdxFile = async ({
  filename,
  fsPath,
  routePath,
}: FileObj) => {
  try {
    // parse the frontmatter away from the markdown content
    const rawMdxContent = await readFile(fsPath, { encoding: "utf8" });
    const { data: frontmatter, content: mdxContent } = matter(rawMdxContent);

    // parse the frontmatter
    const meta = await parseMDXFileFrontmatter({ frontmatter, filename });

    // parse the content
    const { toc } = parseMDXFileContent(mdxContent);

    // parse the name of the file
    const { segments, section } = parseMDXFileName(filename);

    return {
      fsPath,
      filename,
      toc,
      meta,
      section,
      routeAbs: routePath,
      segments,
    };
  } catch (error) {
    throw error as Error;
  }
};
