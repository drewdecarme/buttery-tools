import type { FC } from "react";
import { TabsProvider, type TabsProviderProps } from "./Tab.context";

export const Tabs: FC<TabsProviderProps> = ({ children, ...restProps }) => {
  return <TabsProvider {...restProps}>{children}</TabsProvider>;
};
