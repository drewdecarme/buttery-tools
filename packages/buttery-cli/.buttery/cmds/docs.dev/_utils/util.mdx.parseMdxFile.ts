import type { FileObj } from "../../docs/shared.types";
import { getButteryDocsGraphValueMeta } from "./util.getButteryDocsGraphValueMeta";
import { getButteryDocsGraphValueSectionAndSegments } from "./util.getButteryDocsGraphValueSectionAndSegments";
import { getButteryDocsGraphValueTOC } from "./util.getButteryDocsGraphValueTOC";
import { getMdxFileContent } from "./util.mdx.getMdxFileContent";

export const parseMdxFile = async ({
  filename,
  fsPath,
  routePath,
}: FileObj) => {
  try {
    const { frontmatter, mdxContent } = await getMdxFileContent(fsPath);
    const meta = await getButteryDocsGraphValueMeta({ frontmatter, filename });
    const toc = getButteryDocsGraphValueTOC(mdxContent);
    const { segments, section } =
      getButteryDocsGraphValueSectionAndSegments(filename);

    return {
      fsPath,
      filename,
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
