import { readdir } from "node:fs/promises";
import type { ButteryDocsGraph } from "../../lib/types";
import { LOG_DOCS } from "./util.logger";
import { parseFile } from "./util.parseFile";
import type { CompileArgs } from "./util.types.ts";

/**
 * This function fetches all of the files in the user
 * defined docs directory, iterates over them and
 * recursively creates a graph / tree representation
 * of the docs that are needed for the components
 * to properly display.
 *
 * TODO: need to write a test for this
 */
export const createGraph = async (
  args: CompileArgs
): Promise<ButteryDocsGraph> => {
  LOG_DOCS.debug("Generating graph representation of docs...");
  const graph: ButteryDocsGraph = {};

  console.log({ cwd: process.cwd() });

  async function insertNode(file: string) {
    const parsedFile = await parseFile({ file, docsDir: args.docsDir });
    if (!parsedFile) return;
    const { meta, segments, content, section } = parsedFile;

    if (section && !graph[section]) {
      graph[section] = {
        title: section.replace(/-/g, " "),
        content: "",
        pages: {}
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
          content: "",
          pages: {}
        };
      }

      if (i === segments.length - 1) {
        currentGraph[segment].title = meta.title;
        currentGraph[segment].content = content;
      } else {
        currentGraph = currentGraph[segment].pages;
      }
    }
  }

  // get the files in the docs directory
  const files = await readdir(args.docsDir);

  // for each file find a place for it in the graph
  for (const fileIndex in files) {
    const file = files[fileIndex];
    await insertNode(file);
  }

  LOG_DOCS.debug("Generating graph representation of docs... done.");
  return graph;
};
