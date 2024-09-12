export type CompileArgs = {
  docsDir: string;
};

export type FileObj = {
  fsPath: string;
  filename: string;
  routePath: string;
};

export type ButteryDocsGraphTOC = {
  level: number;
  title: string;
  link: string;
  children: ButteryDocsGraphTOC[];
};

export type ButteryDocsGraphFrontmatter = {
  title?: string;
  meta: ({ title: string } | { name: string; content: string })[];
};

export type ButteryDocsGraphValue = {
  // content: string;
  routeAbs: string;
  routeRel: string;
  routeTitle: ButteryDocsGraphFrontmatter["title"];
  routeMeta: ButteryDocsGraphFrontmatter["meta"];
  filepath: string;
  filename: string;
  fileExtension: string;
  toc: ButteryDocsGraphTOC[];
  pages: ButteryDocsGraph;
};
export type ButteryDocsGraph = {
  [key: string]: ButteryDocsGraphValue;
};
