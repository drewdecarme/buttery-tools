import { readFile } from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";

const rootDir = path.resolve("./");
const docsDir = path.resolve(rootDir, "./.buttery/docs");
const mdxFilesGlob = path.resolve(docsDir, "./**/*.*.mdx");

try {
  const mdxFiles = await glob(mdxFilesGlob);
  console.log({ mdxFilesGlob, mdxFiles });
  for await (const mdxFilePath of mdxFiles) {
    const mdxFileContent = await readFile(mdxFilePath, { encoding: "utf8" });
    console.log(mdxFileContent);
    mdxFileContent.replace(/^\/\/code:(.*)$/gm, (match, p1) => {
      const pathToCode = path.resolve(rootDir, p1);
      const replacementCode = await read;

      console.log({ match, p1, pathToCode });
      // Return the replacement string, here it's just an example replacement
      return match;
    });
  }
} catch (error) {}
