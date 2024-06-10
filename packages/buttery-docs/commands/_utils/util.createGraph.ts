import type { ButteryConfigDocs } from "@buttery/core";
import type { ButteryDocsGraph } from "./types";
import { LOG_DOCS } from "./util.logger";
import { parseFile } from "./util.parseFile";
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
    const parsedFile = await parseFile(file);
    if (!parsedFile) return;
    const {
      meta: { title },
      section,
      segments,
      // content,
      routeAbs,
      toc,
    } = parsedFile;

    const sectionTitle =
      docsConfig?.order?.[section]?.display ?? section.replace(/-/g, " ");

    if (section && !graph[section]) {
      graph[section] = {
        title: sectionTitle,
        filepath: file.fsPath,
        // content: "",
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
          // content: "",
          routeAbs: "",
          routeRel: "",
          toc: [],
          pages: {},
        };
      }

      if (i === segments.length - 1) {
        currentGraph[segment].title = title;
        currentGraph[segment].filepath = file.fsPath;
        // currentGraph[segment].content = content;
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
