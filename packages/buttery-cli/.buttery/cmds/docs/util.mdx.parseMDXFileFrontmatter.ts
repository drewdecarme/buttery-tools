import { LOG } from "../_utils/util.logger";

function parseFilename(filename: string) {
  const filenameArr = filename.split(".");
  const section = filenameArr[0];
  const route = filenameArr.splice(1).join(".");
  return {
    section,
    route: route === "" ? section : route,
  };
}

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
    LOG.warning(
      `"${filename}" is missing a frontmatter title. "${route}" will be used temporarily. Please ensure you add the title property in the document's frontmatter.`
    );
  }

  return {
    title: frontmatter?.title ?? route,
  };
}
