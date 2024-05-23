export type ButteryDocsGraphValue = {
  title: string | null;
  content: string | null;
  pages: ButteryDocsGraph;
};
export type ButteryDocsGraph = {
  [key: string]: ButteryDocsGraphValue;
};
