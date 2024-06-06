import type { FC, ReactElement } from "react";
import React from "react";
import type { TabProps } from "./Tab";
import { TabsProvider, type TabsProviderProps } from "./Tab.context";
import { TabLabel } from "./TabLabel";
import { TabLabelIndicator } from "./TabLabelIndicator";
import { TabPanel } from "./TabPanel";

export const Tabs: FC<
  TabsProviderProps & { children: ReactElement<TabProps>[] }
> = ({ children, ...restProps }) => {
  return (
    <TabsProvider {...restProps}>
      <div className="tabs" role="tablist">
        <TabLabelIndicator />
        {React.Children.map(children ?? [], (child, index) => {
          return (
            <TabLabel key={`tab-${index.toString()}`} {...child.props}>
              {child.props.btLabel}
            </TabLabel>
          );
        })}
      </div>
      <div className="content">
        <TabPanel>{children}</TabPanel>
      </div>
    </TabsProvider>
  );
};
