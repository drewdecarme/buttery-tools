export type ButteryDocsGraphTOC = {
  level: number;
  title: string;
  link: string;
  children: ButteryDocsGraphTOC[];
};

export type ButteryDocsGraph = {
  [key: string]: {
    title: string;
    content: string;
    routePath: string;
    toc: ButteryDocsGraphTOC[];
    pages: ButteryDocsGraph;
  };
};
