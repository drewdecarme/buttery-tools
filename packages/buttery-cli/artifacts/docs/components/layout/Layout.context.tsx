import type { ButteryConfigDocs } from "@buttery/core";
import React from "react";
import { type FC, type ReactNode, useMemo } from "react";
import type { ButteryDocsGraph } from "../../../../.buttery/commands/docs/docs.types";

type ButteryConfigDocsItems = {
  header?: ButteryConfigDocs["header"] | null;
};

export type LayoutContextType = ButteryConfigDocsItems & {
  graph: ButteryDocsGraph;
};
export const LayoutContext = React.createContext<LayoutContextType | null>(
  null
);
export type LayoutProviderProps = ButteryConfigDocsItems & {
  children: ReactNode;
  graph: ButteryDocsGraph;
};
export const LayoutProvider: FC<LayoutProviderProps> = ({
  children,
  graph,
  header,
}) => {
  const value = useMemo<LayoutContextType>(
    () => ({ graph, header }),
    [graph, header]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};
