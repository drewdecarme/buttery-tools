import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ButteryConfigDocs } from "@buttery/core";
import type { ButteryDocsGraph } from "./types";
import type { ButteryDocsConfig } from "./util.getButteryDocsConfig";
import { getButteryDocsDirectories } from "./util.getButteryDocsDirectories";
import { getRoutePath } from "./util.getRoutePath";
import { LOG_DOCS } from "./util.logger";
import { orderFiles } from "./util.mdx.orderMdxFiles";
import { parseMdxFile } from "./util.mex.parseMdxFile";
import type { FileObj } from "./util.types";
/**
 * This function fetches all of the files in the user
 * defined docs directory, iterates over them and
 * recursively creates a graph / tree representation
 * of the docs that are needed for the components
 * to properly display.
 *
 * TODO: need to write a test for this
 */
export const createGraph = async ({
  files,
  docsConfig,
}: {
  files: FileObj[];
  docsConfig: ButteryConfigDocs;
}): Promise<ButteryDocsGraph> => {
  LOG_DOCS.debug("Generating graph representation of docs...");
  const graph: ButteryDocsGraph = {};

  async function insertNode(file: FileObj) {
    const parsedFile = await parseMdxFile(file);
    if (!parsedFile) return;
    const {
      meta: { title },
      section,
      segments,
      // content,
      routeAbs,
      filename,
      toc,
    } = parsedFile;

    const sectionTitle =
      docsConfig?.order?.[section]?.display ?? section.replace(/-/g, " ");

    if (section && !graph[section]) {
      graph[section] = {
        title: sectionTitle,
        filepath: file.fsPath,
        filename,
        routeAbs: `/${section === "_index" ? "" : section}`,
        routeRel: section === "_index" ? "/" : section,
        toc: [],
        pages: {},
      };
    }

    // set the graph to the current graph.
    // js works with references to the graph is just
    // now a reference to current graph which we recursively
    // update if need it
    let currentGraph = section ? graph[section].pages : graph;

    for (const segmentIndex in segments) {
      const i = Number(segmentIndex);
      const segment = segments[i];
      if (!currentGraph[segment]) {
        currentGraph[segment] = {
          title: "",
          filepath: "",
          filename: "",
          routeAbs: "",
          routeRel: "",
          toc: [],
          pages: {},
        };
      }

      if (i === segments.length - 1) {
        currentGraph[segment].title = title;
        currentGraph[segment].filepath = file.fsPath;
        currentGraph[segment].filename = file.filename;
        currentGraph[segment].routeAbs = routeAbs;
        currentGraph[segment].routeRel = segment;
        currentGraph[segment].toc = toc;
      } else {
        currentGraph = currentGraph[segment].pages;
      }
    }
  }

  // for each file find a place for it in the graph
  for (const fileIndex in files) {
    const file = files[fileIndex];
    await insertNode(file);
  }

  LOG_DOCS.debug("Generating graph representation of docs... done.");
  return graph;
};

/**
 * Creates a graph/object representation of the the files
 * contained inside of the docs directory that is referenced
 * in the `buttery.config.ts` file. This graph is a recursive representation
 * of the files and can then be recursed through to build routes, navigational
 * items, etc... Think of it like an AST but only for the docs that are defined
 * in the folder that the user specified in their `buttery.config.ts`.
 */
export async function getButteryDocsGraph(config: ButteryDocsConfig) {
  const docsDirectories = await getButteryDocsDirectories(config);

  // get the files inside of the docs directory
  // and enrich them with some of the data
  const docsDirContents = await readdir(docsDirectories.docs, {
    recursive: false,
    withFileTypes: true,
  });
  const docsDirFiles = docsDirContents.reduce<
    {
      fsPath: string;
      filename: string;
      routePath: string;
    }[]
  >((accum, dirent) => {
    const isFile = dirent.isFile();
    if (!isFile) return accum;
    const fsPath = dirent.parentPath.concat("/").concat(dirent.name);
    const filename = path.parse(dirent.name).name;
    const routePath = getRoutePath(filename);

    return accum.concat({
      fsPath,
      filename,
      routePath,
    });
  }, []);

  // order the files
  const files = orderFiles({
    docsConfig: config.docs,
    files: docsDirFiles,
  });

  // create the graph
  const docsGraph = await createGraph({
    docsConfig: config.docs,
    files,
  });
  return docsGraph;
}
