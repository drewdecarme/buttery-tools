import { styled } from "@linaria/react";
import { clsx } from "clsx";
import { forwardRef } from "react";
import { makeColor } from "#buttery/tokens/playground";

export type LayoutMainContentPropsNative = JSX.IntrinsicElements["div"];
export type LayoutMainContentProps = LayoutMainContentPropsNative;

const SDiv = styled("div")`
  background: ${makeColor("neutral", { variant: "50", opacity: 0.25 })};
`;

export const LayoutMainContent = forwardRef<
  HTMLDivElement,
  LayoutMainContentProps
>(function LayoutMainContent({ children, className, ...restProps }, ref) {
  return (
    <SDiv {...restProps} className={clsx(className)} ref={ref}>
      {children}
    </SDiv>
  );
});
