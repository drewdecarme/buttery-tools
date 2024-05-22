export type ButteryDocsGraph = {
  [key: string]: {
    title: string | null;
    content: string | null;
    pages: ButteryDocsGraph;
  };
};
