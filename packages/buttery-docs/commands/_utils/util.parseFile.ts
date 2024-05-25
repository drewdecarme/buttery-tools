import { readFile } from "node:fs/promises";
import { compile } from "@mdx-js/mdx";
import matter from "gray-matter";
import remarkTOC from "remark-toc";
import { LOG_DOCS } from "./util.logger";
import type { FileObj } from "./util.types";

export const parseFileSegmentsAndSection = (
  fileName: string
): { section: string; segments: string[] } => {
  const allSegments = fileName.split(".");
  const [section, ...segments] = allSegments;

  return {
    section,
    segments
  };
};

/**
 * Fetches the content inside of the file and parses the frontmatter
 * and content depending upon what type of file it is.
 */
const parseFileContent = async (
  filepath: string,
  filename: string
): Promise<{
  meta: { title: string };
  content: string;
}> => {
  try {
    const fileContent = await readFile(filepath, { encoding: "utf8" });
    const { data, content } = matter(fileContent);
    if (!data.title) {
      LOG_DOCS.warning(
        `"${filename}" is missing a frontmatter title. "${filename}" will be used temporarily. Please ensure you add the title property in the document's frontmatter.`
      );
    }
    // const vFile = new VFile({ value: content } );
    const compiledContent = await compile(content, {
      outputFormat: "function-body",
      remarkPlugins: [remarkTOC]
    });
    return {
      meta: {
        title: data.title ?? ""
      },
      content: compiledContent.toString()
    };
  } catch (error) {
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};

export const parseFile = async ({ filename, fsPath, routePath }: FileObj) => {
  try {
    const { segments, section } = parseFileSegmentsAndSection(filename);
    const { meta, content } = await parseFileContent(fsPath, filename);

    return {
      fsPath,
      filename,
      content,
      meta,
      section,
      routePath,
      segments
    };
  } catch (error) {
    throw error as Error;
  }
};
