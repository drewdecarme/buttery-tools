import { LOG_DOCS } from "./util.logger";

export async function getButteryDocsGraphValueMeta({
  frontmatter,
  filename,
}: {
  frontmatter: { [key: string]: string };
  filename: string;
}) {
  // get the file
  if (!frontmatter.title) {
    LOG_DOCS.warning(
      `"${filename}" is missing a frontmatter title. "${filename}" will be used temporarily. Please ensure you add the title property in the document's frontmatter.`
    );
  }

  return {
    title: frontmatter?.title ?? "",
  };
}
