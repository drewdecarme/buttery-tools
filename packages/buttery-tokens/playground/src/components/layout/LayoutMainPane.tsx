import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { localTokens } from "playground/src/tokens-local";
import { forwardRef } from "react";

export type LayoutMainPanePropsNative = JSX.IntrinsicElements["div"];
export type LayoutMainPaneProps = LayoutMainPanePropsNative;

const SDiv = styled("div")`
  padding: 0 ${localTokens.makeRem(16)};
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
