export type ButteryDocsGraph = {
  [key: string]: {
    title: string;
    content: string;
    routePath: string;
    pages: ButteryDocsGraph;
  };
};
