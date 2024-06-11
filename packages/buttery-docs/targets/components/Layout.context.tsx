import type { ButteryConfigDocs } from "@buttery/core";
import React from "react";
import { type FC, type ReactNode, useContext, useMemo } from "react";
import type {
  ButteryDocsGraph,
  ButteryDocsGraphTOC,
} from "../../commands/_utils/types";
import { NativeAnchor } from "./native";

type ButteryConfigDocsItems = {
  header?: ButteryConfigDocs["header"] | null;
};

type LayoutContextType = ButteryConfigDocsItems & {
  graph: ButteryDocsGraph;
  NavLinkComponent: JSX.ElementType;
  tableOfContents: ButteryDocsGraphTOC[];
};
const LayoutContext = React.createContext<LayoutContextType | null>(null);
export type LayoutProviderProps = ButteryConfigDocsItems & {
  children: ReactNode;
  graph: ButteryDocsGraph;
  NavLinkComponent?: JSX.ElementType;
  tableOfContents?: ButteryDocsGraphTOC[];
};
export const LayoutProvider: FC<LayoutProviderProps> = ({
  children,
  graph,
  tableOfContents = [],
  NavLinkComponent = NativeAnchor,
  header,
}) => {
  const value = useMemo<LayoutContextType>(
    () => ({ graph, tableOfContents, NavLinkComponent, header }),
    [graph, tableOfContents, NavLinkComponent, header]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export const useLayoutContext = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      "'useLayoutContext()' must be used within a <LayoutProvider /> component"
    );
  }
  return context;
};
