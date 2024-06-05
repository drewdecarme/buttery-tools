import React from "react";
import { type FC, type ReactNode, useContext, useMemo } from "react";

type TabsContextType = {
  active: string;
};
const TabsContext = React.createContext<TabsContextType | null>(null);
export type TabsProviderProps = {
  children: ReactNode;
};
export const TabsProvider: FC<TabsProviderProps> = ({ children }) => {
  const value = useMemo(
    () => ({
      active: "sample",
    }),
    []
  );

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
};

export const useTabsContext = (): TabsContextType => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(
      "'useTabsContext()' must be used within a <TabsProvider /> component"
    );
  }
  return context;
};
