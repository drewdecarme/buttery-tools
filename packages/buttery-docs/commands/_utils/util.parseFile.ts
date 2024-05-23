import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
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
  filePath: string,
  file: string
): Promise<{ meta: { title: string }; content: string }> => {
  try {
    const fileContent = await readFile(filePath, { encoding: "utf8" });
    const { data, content } = matter(fileContent);
    if (!data.title) {
      LOG_DOCS.warning(
        `"${file}" is missing a frontmatter title. "${getFilename(
          file
        )}" will be used temporarily. Please ensure you add the title property in the document's frontmatter.`
      );
    }
    return {
      meta: {
        title: data.title ?? getFilename(file)
      },
      content
    };
  } catch (error) {
    throw LOG_DOCS.fatal(new Error(error as string));
  }
};

export const parseFile = async ({
  file,
  docsDir
}: { file: string; docsDir: string }) => {
  try {
    const fileName = getFilename(file);
    if (!fileName) return undefined;

    const filePath = path.resolve(docsDir, "./".concat(file));

    const { section, segments } = parseFileName(fileName);
    const { meta, content } = await parseFileContent(filePath, file);

    return {
      path: filePath,
      content,
      meta,
      segments,
      section
    };
  } catch (error) {
    throw error as Error;
  }
};
