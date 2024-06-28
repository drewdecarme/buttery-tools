import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { type ReactElement, forwardRef } from "react";
import React from "react";
import type { TabProps } from "./Tab";
import { useTabsContext } from "./Tab.context";

export type TabPanelPropsNative = JSX.IntrinsicElements["div"];
export type TabPanelPropsCustom = {
  children: ReactElement<TabProps>[];
};
export type TabPanelProps = TabPanelPropsNative & TabPanelPropsCustom;

const SDiv = styled("div")``;

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  function TabPanel({ children, className, ...restProps }, ref) {
    const { activeTab } = useTabsContext();

    return React.Children.map(children ?? [], (child) => {
      if (child.props.btId !== activeTab) return null;

      return (
        <SDiv
          {...restProps}
          className={clsx(className)}
          ref={ref}
          role="tabpanel"
          id={child.props.btId.concat("-tabpanel")}
          key={`tab-panel-${child.props.btId}`}
          aria-labelledby={child.props.btId.concat("-tab")}
        >
          {child.props.children}
        </SDiv>
      );
    });
  }
);
