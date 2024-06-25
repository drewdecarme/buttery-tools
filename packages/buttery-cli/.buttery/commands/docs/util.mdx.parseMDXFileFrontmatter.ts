import { LOG_DOCS } from "./docs.logger";
import { parseFilename } from "./shared.util.parseFilename";

export async function parseMDXFileFrontmatter({
  frontmatter,
  filename,
}: {
  frontmatter: { [key: string]: string };
  filename: string;
}) {
  const { route } = parseFilename(filename);
  // get the file
  if (!frontmatter.title) {
    LOG_DOCS.warning(
      `"${filename}" is missing a frontmatter title. "${route}" will be used temporarily. Please ensure you add the title property in the document's frontmatter.`
    );
  }

  return {
    title: frontmatter?.title ?? route,
  };
}
