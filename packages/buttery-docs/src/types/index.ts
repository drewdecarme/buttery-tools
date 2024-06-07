export type ButteryDocsGraphTOC = {
  level: number;
  title: string;
  link: string;
  children: ButteryDocsGraphTOC[];
};

export type ButteryDocsGraphValue = {
  title: string;
  // content: string;
  routePath: string;
  filepath: string;
  // toc: ButteryDocsGraphTOC[];
  pages: ButteryDocsGraph;
};
export type ButteryDocsGraph = {
  [key: string]: ButteryDocsGraphValue;
};
