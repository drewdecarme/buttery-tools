import { LOG_CLI } from "../logger/loggers";
import { parseFilename } from "./docs.parseFilename";
import type { ButteryDocsGraphFrontmatter } from "./docs.types";

export async function parseMDXFileFrontmatter({
  frontmatter,
  filename
}: {
  frontmatter: ButteryDocsGraphFrontmatter;
  filename: string;
}): Promise<ButteryDocsGraphFrontmatter> {
  const { route } = parseFilename(filename);

  // get the file
  if (!frontmatter.title) {
    LOG_CLI.warning(
      `"${filename}" is missing a frontmatter "title". "${route}" will be used temporarily. Please ensure you add the title property in the document's frontmatter.`
    );
  }

  if (!frontmatter.meta) {
    LOG_CLI.warning(
      `"${filename}" is missing a frontmatter "meta". The route will not contain any page meta information which will impact SEO. Please add meta content.`
    );
  }

  return {
    title: frontmatter?.title ?? route,
    meta: frontmatter.meta ?? []
  };
}
