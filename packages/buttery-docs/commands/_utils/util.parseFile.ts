import { readFile } from "node:fs/promises";
import path from "node:path";
import { compile } from "@mdx-js/mdx";
import matter from "gray-matter";
import remarkTOC from "remark-toc";
import { LOG_DOCS } from "./util.logger";

export const parseFileName = (fileName: string): { segments: string[] } => {
  const segments = fileName.split(".");

  return {
    segments
  };
};

const getFilename = (filename: string) => {
  if (filename.endsWith(".md")) return path.basename(filename, ".md");
  if (filename.endsWith("mdx")) return path.basename(filename, ".mdx");
  LOG_DOCS.warning(`"${filename}" is not a markdown or mdx file. Skipping.`);
  return undefined;
};

/**
 * Fetches the content inside of the file and parses the frontmatter
 * and content depending upon what type of file it is.
 */
const parseFileContent = async (
  filepath: string
): Promise<{
  meta: { title: string; section: string | undefined };
  content: string;
}> => {
  try {
    const fileContent = await readFile(filepath, { encoding: "utf8" });
    const { data, content } = matter(fileContent);
    if (!data.title) {
      LOG_DOCS.warning(
        `"${filepath}" is missing a frontmatter title. "${getFilename(
          filepath
        )}" will be used temporarily. Please ensure you add the title property in the document's frontmatter.`
      );
    }
    // const vFile = new VFile({ value: content } );
    const compiledContent = await compile(content, {
      outputFormat: "function-body",
      remarkPlugins: [remarkTOC]
    });
    return {
      meta: {
        title: data.title ?? getFilename(filepath),
        section: data.section
      },
      content: compiledContent.toString()
    };
  } catch (error) {
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};

export type ParseFileType = {
  absPath: string;
  relPath: string;
};
export const parseFile = async ({ absPath, relPath }: ParseFileType) => {
  try {
    const fileName = getFilename(relPath);
    if (!fileName) return undefined;

    const { segments } = parseFileName(fileName);
    const { meta, content } = await parseFileContent(absPath);

    return {
      absPath,
      relPath,
      content,
      meta,
      segments
    };
  } catch (error) {
    throw error as Error;
  }
};
