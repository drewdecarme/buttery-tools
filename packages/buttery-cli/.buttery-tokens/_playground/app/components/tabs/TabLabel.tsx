import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { localTokens } from "playground/src/tokens/tokens-local";
import { type ReactNode, forwardRef } from "react";
import { useTabsContext } from "./Tab.context";

export type TabLabelPropsNative = JSX.IntrinsicElements["button"];
export type TabLabelPropsCustom = {
  children: ReactNode;
  btId: string;
};
export type TabLabelProps = TabLabelPropsNative & TabLabelPropsCustom;

const SButton = styled("button")`
  ${localTokens.makeReset("button")};
  flex: 1;
  display: grid;
  place-content: center;
  height: ${localTokens.makeRem(32)};
  font-family: ${localTokens.makeFontFamily("body")};
  font-size: ${localTokens.makeRem(12)};
  color: ${localTokens.makeColor("neutral", { variant: "200" })};
  z-index: 10;
  transition: color 0.25s;
  font-weight: ${localTokens.makeFontWeight("medium")};

  &:hover {
    cursor: pointer;
  }

  &.active,
  &:hover {
    color: ${localTokens.makeColor("neutral")};
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
