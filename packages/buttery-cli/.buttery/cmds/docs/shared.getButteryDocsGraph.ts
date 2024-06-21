import type { ButteryConfigDocs } from "@buttery/core";
import type { ButteryDocsGraph } from "../docs.dev/_utils/types";
import type { ButteryDocsConfig } from "./shared.getButteryDocsConfig";

import { LOG_DOCS } from "../docs.dev/_utils/util.logger";
import { parseMdxFile } from "../docs.dev/_utils/util.mdx.parseMdxFile";
import type { FileObj } from "./shared.types";

/**
 * Creates a graph/object representation of the the files
 * contained inside of the docs directory that is referenced
 * in the `buttery.config.ts` file. This graph is a recursive representation
 * of the files and can then be recursed through to build routes, navigational
 * items, etc... Think of it like an AST but only for the docs that are defined
 * in the folder that the user specified in their `buttery.config.ts`.
 */
export async function getButteryDocsGraph(
  config: ButteryDocsConfig,
  orderedFiles: FileObj[]
): Promise<ButteryDocsGraph> {
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
      config.docs?.order?.[section]?.display ?? section.replace(/-/g, " ");

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
  for (const fileIndex in orderedFiles) {
    const file = orderedFiles[fileIndex];
    await insertNode(file);
  }

  LOG_DOCS.debug("Generating graph representation of docs... done.");
  return graph;
}
