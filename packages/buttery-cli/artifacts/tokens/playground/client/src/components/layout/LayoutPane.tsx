import { makeColor, makeRem } from "@buttery/tokens/playground";
import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";

export type LayoutPanePropsNative = JSX.IntrinsicElements["div"];
export type LayoutPaneProps = LayoutPanePropsNative;

const SDiv = styled("div")`
  padding: 0 ${makeRem(16)};
  border-right: ${makeRem(1)} solid ${makeColor("neutral", { variant: "50" })};
  padding-top: ${makeRem(16)};
  background: ${makeColor("neutral", { variant: "50", opacity: 0.2 })};
  p {
    font-size: ${makeRem(12)};
  }
`;

export const LayoutPane = forwardRef<HTMLDivElement, LayoutPaneProps>(
  function LayoutPane({ children, className, ...restProps }, ref) {
    return (
      <SDiv {...restProps} className={clsx(className)} ref={ref}>
        {children}
      </SDiv>
    );
  }
);
