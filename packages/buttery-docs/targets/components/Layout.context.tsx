import type { ButteryConfigDocs } from "@buttery/core";
import React from "react";
import { type FC, type ReactNode, useContext, useMemo } from "react";
import type { ButteryDocsGraph } from "../../commands/_utils/types";

type ButteryConfigDocsItems = {
  header: ButteryConfigDocs["header"] | null;
};

type LayoutContextType = ButteryConfigDocsItems & {
  graph: ButteryDocsGraph;
  NavLink?: JSX.ElementType;
};
const LayoutContext = React.createContext<LayoutContextType | null>(null);
export type LayoutProviderProps = ButteryConfigDocsItems & {
  children: ReactNode;
  graph: ButteryDocsGraph;
  NavLink?: JSX.ElementType;
};
export const LayoutProvider: FC<LayoutProviderProps> = ({
  children,
  NavLink,
  ...restProps
}) => {
  const value = useMemo<LayoutContextType>(
    () => ({
      ...restProps,
      NavLink,
    }),
    [restProps, NavLink]
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
