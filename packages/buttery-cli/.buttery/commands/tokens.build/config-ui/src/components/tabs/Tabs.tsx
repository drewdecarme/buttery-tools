import { styled } from "@linaria/react";
import type { FC, ReactElement } from "react";
import React from "react";
import { makeColor, makeRem } from "#buttery/tokens/playground";
import type { TabProps } from "./Tab";
import { TabsProvider, type TabsProviderProps } from "./Tab.context";
import { TabLabel } from "./TabLabel";
import { TabLabelIndicator } from "./TabLabelIndicator";
import { TabPanel } from "./TabPanel";

const STabs = styled("div")`
  width: 100%;
  display: flex;
  gap: ${makeRem(4)};
  padding: ${makeRem(4)};
  border-radius: ${makeRem(4)};
  background: ${makeColor("neutral", { variant: "50" })};
  position: relative;
`;

export const Tabs: FC<
  TabsProviderProps & { children: ReactElement<TabProps>[] }
> = ({ children, ...restProps }) => {
  return (
    <TabsProvider {...restProps}>
      <STabs className="tabs" role="tablist">
        <TabLabelIndicator />
        {React.Children.map(children ?? [], (child, index) => {
          return (
            <TabLabel key={`tab-${index.toString()}`} {...child.props}>
              {child.props.btLabel}
            </TabLabel>
          );
        })}
      </STabs>
      <div className="content">
        <TabPanel>{children}</TabPanel>
      </div>
    </TabsProvider>
  );
};
