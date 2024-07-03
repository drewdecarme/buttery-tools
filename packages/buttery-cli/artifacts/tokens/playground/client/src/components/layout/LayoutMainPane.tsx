import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import { makeRem } from "#buttery/tokens/playground";

export type LayoutMainPanePropsNative = JSX.IntrinsicElements["div"];
export type LayoutMainPaneProps = LayoutMainPanePropsNative;

const SDiv = styled("div")`
  padding: 0 ${makeRem(16)};
`;

export const LayoutMainPane = forwardRef<HTMLDivElement, LayoutMainPaneProps>(
  function LayoutMainPane({ children, className, ...restProps }, ref) {
    return (
      <SDiv {...restProps} className={clsx(className)} ref={ref}>
        {children}
      </SDiv>
    );
  }
);
