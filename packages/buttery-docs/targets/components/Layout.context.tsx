import type { ButteryConfigDocs } from "@buttery/core";
import React from "react";
import { type FC, type ReactNode, useContext, useMemo } from "react";
import type { ButteryDocsGraph } from "../../commands/_utils/types";

type ButteryConfigDocsItems = {
  header: ButteryConfigDocs["header"] | null;
};

type LayoutContextType = ButteryConfigDocsItems & {
  graph: ButteryDocsGraph;
  NavLinkComponent?: JSX.ElementType;
};
const LayoutContext = React.createContext<LayoutContextType | null>(null);
export type LayoutProviderProps = ButteryConfigDocsItems & {
  children: ReactNode;
  graph: ButteryDocsGraph;
  NavLinkComponent?: JSX.ElementType;
};
export const LayoutProvider: FC<LayoutProviderProps> = ({
  children,
  NavLinkComponent,
  graph,
  header,
}) => {
  const value = useMemo<LayoutContextType>(
    () => ({
      graph,
      header,
      NavLinkComponent,
    }),
    [graph, header, NavLinkComponent]
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
