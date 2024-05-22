import { readdir } from "node:fs/promises";
import type { ButteryDocsGraph } from "../lib/types";
import { parseFile } from "./util.parseFile";

export type CompileArgs = {
  docsDir: string;
};

export const compile = async (args: CompileArgs) => {
  const graph: ButteryDocsGraph = {};

  async function insertNode(file: string) {
    const parsedFile = await parseFile({ file, docsDir: args.docsDir });
    if (!parsedFile) return;
    const { meta, segments, content, section } = parsedFile;

    let currentGraph = graph;
    console.log({ currentGraph });

    for (const segmentIndex in segments) {
      const i = Number(segmentIndex);
      const segment = segments[i];
      console.log({ segmentIndex, segment });
      if (!currentGraph[segment]) {
        currentGraph[segment] = {
          title: "",
          content: "",
          pages: {}
        };
      }

      console.log({ currentGraph });
      if (i === segments.length - 1) {
        currentGraph[segment].title = meta.title;
        currentGraph[segment].content = content;
      } else {
        currentGraph = currentGraph[segment].pages;
      }
    }
  }

  // get the files in the docs directorry
  const files = await readdir(args.docsDir);

  // for each file find a place for it in the graph
  for (const fileIndex in files) {
    const file = files[fileIndex];

    console.group(file);
    await insertNode(file);
    console.groupEnd();
  }

  console.log(JSON.stringify(graph, null, 2));
};
