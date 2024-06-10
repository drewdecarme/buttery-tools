import React from "react";
import { type FC, type ReactNode, useContext, useMemo } from "react";
import type { ButteryDocsGraph } from "../../commands/_utils/types";

type LayoutContextType = {
  graph: ButteryDocsGraph;
};
const LayoutContext = React.createContext<LayoutContextType | null>(null);
export type LayoutProviderProps = {
  children: ReactNode;
  graph: ButteryDocsGraph;
};
export const LayoutProvider: FC<LayoutProviderProps> = ({
  children,
  ...restProps
}) => {
  const value = useMemo(
    () => ({
      ...restProps,
    }),
    [restProps]
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
