import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { parseMDXFileContent } from "./docs.parseMDXFileContent";
import { parseMDXFileFrontmatter } from "./docs.parseMDXFileFrontmatter";
import { parseMDXFileName } from "./docs.parseMDXFilename";
import type { ButteryDocsGraphFrontmatter, FileObj } from "./docs.types";

export const parseMdxFile = async ({
  filename,
  fsPath,
  routePath,
}: FileObj) => {
  try {
    // parse the frontmatter away from the markdown content
    const rawMdxContent = await readFile(fsPath, { encoding: "utf8" });
    const { data, content: mdxContent } = matter(rawMdxContent);
    const frontmatter = data as ButteryDocsGraphFrontmatter;

    // parse the frontmatter
    const meta = await parseMDXFileFrontmatter({ frontmatter, filename });

    // parse the content
    const { toc } = parseMDXFileContent(mdxContent);

    // parse the name of the file
    const { segments, section } = parseMDXFileName(filename);

    return {
      fsPath,
      filename,
      ext: path.extname(fsPath),
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
