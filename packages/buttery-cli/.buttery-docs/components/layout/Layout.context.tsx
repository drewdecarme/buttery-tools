import type { ButteryConfigDocs } from "@buttery/core";
import React from "react";
import { type FC, type ReactNode, useMemo } from "react";
import type { ButteryDocsGraph } from "../../../.buttery/cmds/docs/shared.types";
import { NativeAnchor } from "../native";

type ButteryConfigDocsItems = {
  header?: ButteryConfigDocs["header"] | null;
};

export type LayoutContextType = ButteryConfigDocsItems & {
  graph: ButteryDocsGraph;
  NavLinkComponent: JSX.ElementType;
};
export const LayoutContext = React.createContext<LayoutContextType | null>(
  null
);
export type LayoutProviderProps = ButteryConfigDocsItems & {
  children: ReactNode;
  graph: ButteryDocsGraph;
  NavLinkComponent?: JSX.ElementType;
};
export const LayoutProvider: FC<LayoutProviderProps> = ({
  children,
  graph,
  NavLinkComponent = NativeAnchor,
  header,
}) => {
  const value = useMemo<LayoutContextType>(
    () => ({ graph, NavLinkComponent, header }),
    [graph, NavLinkComponent, header]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};
