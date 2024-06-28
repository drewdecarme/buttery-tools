import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { type ReactNode, forwardRef } from "react";
import {
  makeColor,
  makeFontFamily,
  makeFontWeight,
  makeRem,
  makeReset,
} from "#buttery/tokens/config-ui";
import { useTabsContext } from "./Tab.context";

export type TabLabelPropsNative = JSX.IntrinsicElements["button"];
export type TabLabelPropsCustom = {
  children: ReactNode;
  btId: string;
};
export type TabLabelProps = TabLabelPropsNative & TabLabelPropsCustom;

const SButton = styled("button")`
  ${makeReset("button")};
  flex: 1;
  display: grid;
  place-content: center;
  height: ${makeRem(32)};
  font-family: ${makeFontFamily("body")};
  font-size: ${makeRem(12)};
  color: ${makeColor("neutral", { variant: "200" })};
  z-index: 10;
  transition: color 0.25s;
  font-weight: ${makeFontWeight("medium")};

  &:hover {
    cursor: pointer;
  }

  &.active,
  &:hover {
    color: ${makeColor("neutral")};
  }
`;

export const TabLabel = forwardRef<HTMLButtonElement, TabLabelProps>(
  function TabLabel({ children, className, btId, ...restProps }, ref) {
    const { activeTab, setActiveTab } = useTabsContext();
    return (
      <SButton
        type="button"
        {...restProps}
        className={clsx(className, "tab-panel", {
          active: activeTab === btId,
        })}
        role="tab"
        id={btId.concat("-tab")}
        aria-selected={activeTab === btId}
        aria-controls={btId.concat("-tabpanel")}
        ref={ref}
        onClick={() => setActiveTab(btId)}
      >
        {children}
      </SButton>
    );
  }
);
