import React, { useState } from "react";
import { type FC, type ReactNode, useContext, useMemo } from "react";

type TabsContextType = {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};
const TabsContext = React.createContext<TabsContextType | null>(null);
export type TabsProviderProps = {
  children: ReactNode;
  btInitActiveTab: string;
};
export const TabsProvider: FC<TabsProviderProps> = ({
  children,
  btInitActiveTab,
}) => {
  const [activeTab, setActiveTab] = useState<string>(btInitActiveTab);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
    }),
    [activeTab]
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
