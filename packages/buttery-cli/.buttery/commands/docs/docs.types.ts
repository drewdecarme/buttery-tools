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

export type ButteryDocsGraphValue = {
  title: string;
  // content: string;
  routeAbs: string;
  routeRel: string;
  filepath: string;
  filename: string;
  toc: ButteryDocsGraphTOC[];
  pages: ButteryDocsGraph;
};
export type ButteryDocsGraph = {
  [key: string]: ButteryDocsGraphValue;
};
