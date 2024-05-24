export type ButteryDocsGraph = {
  [key: string]: {
    title: string;
    isSection: boolean;
    sectionTitle?: string;
    content: string;
    routePath: string;
    pages: ButteryDocsGraph;
  };
};
