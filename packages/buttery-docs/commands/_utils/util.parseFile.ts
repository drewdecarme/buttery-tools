import { readFile } from "node:fs/promises";
import path from "node:path";
import { compile } from "@mdx-js/mdx";
import matter from "gray-matter";
import { VFile } from "vfile";
import { LOG_DOCS } from "./util.logger";

const fileSectionStartDelimiter = "[";
const fileSectionEndDelimiter = "]";

export const parseFileName = (
  fileName: string
): { section: string | undefined; segments: string[] } => {
  const startIndex =
    fileName.indexOf(fileSectionStartDelimiter) +
    fileSectionStartDelimiter.length;
  const endIndex = fileName.indexOf(fileSectionEndDelimiter);
  let section = undefined;
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    section = fileName.substring(startIndex, endIndex);
  }
  const segments = fileName
    .split(".")
    .filter((file) => !file.includes(fileSectionEndDelimiter));
  return {
    section,
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
): Promise<{ meta: { title: string }; content: string }> => {
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
    const compiledContent = await compile(content);
    return {
      meta: {
        title: data.title ?? getFilename(filepath)
      },
      content: compiledContent.toString()
    };
  } catch (error) {
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};

export const parseFile = async (filepath: string) => {
  try {
    const fileName = getFilename(filepath);
    if (!fileName) return undefined;

    const { section, segments } = parseFileName(fileName);
    const { meta, content } = await parseFileContent(filepath);

    return {
      path: filepath,
      content,
      meta,
      segments,
      section
    };
  } catch (error) {
    throw error as Error;
  }
};
