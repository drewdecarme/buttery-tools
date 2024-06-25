import { styled } from "@linaria/react";
import { localTokens } from "playground/src/tokens/tokens-local";
import type { FC, ReactElement } from "react";
import React from "react";
import type { TabProps } from "./Tab";
import { TabsProvider, type TabsProviderProps } from "./Tab.context";
import { TabLabel } from "./TabLabel";
import { TabLabelIndicator } from "./TabLabelIndicator";
import { TabPanel } from "./TabPanel";

const STabs = styled("div")`
  width: 100%;
  display: flex;
  gap: ${localTokens.makeRem(4)};
  padding: ${localTokens.makeRem(4)};
  border-radius: ${localTokens.makeRem(4)};
  background: ${localTokens.makeColor("neutral", { variant: "50" })};
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
