export type ButteryDocsGraph = {
  [key: string]: {
    title: string;
    content: string;
    pages: ButteryDocsGraph;
  };
};
